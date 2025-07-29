--------------- SUBSCRIPTION PLANS ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS subscription_plans (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    -- REQUIRED
    name TEXT NOT NULL CHECK (char_length(name) <= 100),
    description TEXT CHECK (char_length(description) <= 500),
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    features JSONB NOT NULL DEFAULT '[]',
    max_consultations INTEGER,
    max_documents INTEGER,
    priority_support BOOLEAN NOT NULL DEFAULT FALSE,
    team_collaboration BOOLEAN NOT NULL DEFAULT FALSE,
    custom_integrations BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- STRIPE INTEGRATION
    stripe_price_id_monthly TEXT,
    stripe_price_id_yearly TEXT,
    stripe_product_id TEXT
);

-- INDEXES --

CREATE INDEX subscription_plans_active_idx ON subscription_plans(active);
CREATE INDEX subscription_plans_price_monthly_idx ON subscription_plans(price_monthly);

-- RLS --

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active subscription plans"
    ON subscription_plans FOR SELECT
    USING (active = true);

--------------- USER SUBSCRIPTIONS ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS user_subscriptions (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    -- SUBSCRIPTION DETAILS
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')) DEFAULT 'trialing',
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 month'),
    trial_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- USAGE TRACKING
    consultations_used INTEGER NOT NULL DEFAULT 0,
    documents_analyzed INTEGER NOT NULL DEFAULT 0,
    last_reset_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- STRIPE INTEGRATION
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    
    -- CONSTRAINTS
    UNIQUE(user_id, status) -- Only one active subscription per user
);

-- INDEXES --

CREATE INDEX user_subscriptions_user_id_idx ON user_subscriptions(user_id);
CREATE INDEX user_subscriptions_status_idx ON user_subscriptions(status);
CREATE INDEX user_subscriptions_stripe_subscription_id_idx ON user_subscriptions(stripe_subscription_id);
CREATE INDEX user_subscriptions_current_period_end_idx ON user_subscriptions(current_period_end);

-- RLS --

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON user_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

--------------- PAYMENT HISTORY ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS payment_history (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- PAYMENT DETAILS
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'canceled')),
    payment_method TEXT,
    
    -- STRIPE INTEGRATION
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_invoice_id TEXT,
    
    -- ADDITIONAL INFO
    description TEXT,
    metadata JSONB DEFAULT '{}'
);

-- INDEXES --

CREATE INDEX payment_history_user_id_idx ON payment_history(user_id);
CREATE INDEX payment_history_subscription_id_idx ON payment_history(subscription_id);
CREATE INDEX payment_history_status_idx ON payment_history(status);
CREATE INDEX payment_history_created_at_idx ON payment_history(created_at);

-- RLS --

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment history"
    ON payment_history FOR SELECT
    USING (auth.uid() = user_id);

--------------- USAGE TRACKING ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS usage_tracking (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- USAGE DETAILS
    action_type TEXT NOT NULL CHECK (action_type IN ('consultation', 'document_analysis', 'contract_review', 'case_analysis')),
    tokens_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    
    -- ADDITIONAL INFO
    metadata JSONB DEFAULT '{}'
);

-- INDEXES --

CREATE INDEX usage_tracking_user_id_idx ON usage_tracking(user_id);
CREATE INDEX usage_tracking_subscription_id_idx ON usage_tracking(subscription_id);
CREATE INDEX usage_tracking_action_type_idx ON usage_tracking(action_type);
CREATE INDEX usage_tracking_created_at_idx ON usage_tracking(created_at);

-- RLS --

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage tracking"
    ON usage_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage tracking"
    ON usage_tracking FOR INSERT
    WITH CHECK (true);

--------------- FUNCTIONS ---------------

-- Function to reset monthly usage counters
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_subscriptions 
    SET 
        consultations_used = 0,
        documents_analyzed = 0,
        last_reset_date = CURRENT_TIMESTAMP
    WHERE 
        billing_cycle = 'monthly' 
        AND last_reset_date < (CURRENT_TIMESTAMP - INTERVAL '1 month');
        
    UPDATE user_subscriptions 
    SET 
        consultations_used = 0,
        documents_analyzed = 0,
        last_reset_date = CURRENT_TIMESTAMP
    WHERE 
        billing_cycle = 'yearly' 
        AND last_reset_date < (CURRENT_TIMESTAMP - INTERVAL '1 year');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has reached usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id UUID,
    p_action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_subscription user_subscriptions%ROWTYPE;
    v_plan subscription_plans%ROWTYPE;
    v_current_usage INTEGER;
BEGIN
    -- Get current subscription
    SELECT * INTO v_subscription
    FROM user_subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE; -- No active subscription
    END IF;
    
    -- Get plan details
    SELECT * INTO v_plan
    FROM subscription_plans
    WHERE id = v_subscription.plan_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check specific limits based on action type
    IF p_action_type = 'consultation' THEN
        IF v_plan.max_consultations IS NULL THEN
            RETURN TRUE; -- Unlimited
        END IF;
        RETURN v_subscription.consultations_used < v_plan.max_consultations;
    ELSIF p_action_type = 'document_analysis' THEN
        IF v_plan.max_documents IS NULL THEN
            RETURN TRUE; -- Unlimited
        END IF;
        RETURN v_subscription.documents_analyzed < v_plan.max_documents;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID,
    p_action_type TEXT
)
RETURNS void AS $$
BEGIN
    IF p_action_type = 'consultation' THEN
        UPDATE user_subscriptions
        SET consultations_used = consultations_used + 1
        WHERE user_id = p_user_id AND status = 'active';
    ELSIF p_action_type = 'document_analysis' THEN
        UPDATE user_subscriptions
        SET documents_analyzed = documents_analyzed + 1
        WHERE user_id = p_user_id AND status = 'active';
    END IF;
    
    -- Insert usage tracking record
    INSERT INTO usage_tracking (user_id, subscription_id, action_type)
    SELECT 
        p_user_id,
        id,
        p_action_type
    FROM user_subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--------------- INITIAL DATA ---------------

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, max_consultations, max_documents, priority_support, team_collaboration, custom_integrations) VALUES
('Básico', 'Perfecto para abogados independientes', 2.00, 19.20, '["50 consultas mensuales", "Análisis básico de documentos", "Búsqueda de jurisprudencia", "Soporte por email", "Plantillas legales básicas"]', 50, 10, false, false, false),
('Profesional', 'Ideal para estudios jurídicos pequeños', 8.00, 76.80, '["Consultas ilimitadas", "Análisis de documentos", "Redacción asistida de contratos", "Análisis de casos complejos", "Soporte prioritario", "Integraciones con herramientas legales", "Reportes y estadísticas"]', null, null, true, false, false),
('Empresarial', 'Para grandes firmas y corporaciones', 25.00, 240.00, '["Todo lo del plan Profesional", "Colaboración en equipo", "Integraciones personalizadas", "API personalizada", "Soporte 24/7", "Capacitación personalizada", "Cumplimiento normativo avanzado", "Análisis predictivo"]', null, null, true, true, true);
