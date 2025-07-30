-- Crear tabla para mapeo de tokens PII
CREATE TABLE IF NOT EXISTS pii_mapping (
    token TEXT PRIMARY KEY,
    original TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por token
CREATE INDEX IF NOT EXISTS idx_pii_mapping_token ON pii_mapping(token);

-- Crear índice para consultas por fecha de creación
CREATE INDEX IF NOT EXISTS idx_pii_mapping_created_at ON pii_mapping(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en cada UPDATE
CREATE TRIGGER update_pii_mapping_updated_at 
    BEFORE UPDATE ON pii_mapping 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Política de seguridad RLS (Row Level Security)
ALTER TABLE pii_mapping ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT/SELECT con service role
CREATE POLICY "Service role can manage PII mappings" ON pii_mapping
    FOR ALL USING (auth.role() = 'service_role');

-- Política para prevenir acceso directo de usuarios autenticados
CREATE POLICY "Authenticated users cannot access PII mappings" ON pii_mapping
    FOR ALL USING (false);

-- Comentarios para documentación
COMMENT ON TABLE pii_mapping IS 'Almacena el mapeo entre tokens PII anonimizados y sus valores originales';
COMMENT ON COLUMN pii_mapping.token IS 'Token anonimizado generado con HMAC-SHA256 (formato: <PII_TYPE_hash>)';
COMMENT ON COLUMN pii_mapping.original IS 'Valor original de la información personal identificable';
COMMENT ON COLUMN pii_mapping.created_at IS 'Timestamp de cuando se creó el mapeo';
COMMENT ON COLUMN pii_mapping.updated_at IS 'Timestamp de la última actualización del mapeo';

-- Función para limpiar tokens antiguos (opcional, para mantenimiento)
CREATE OR REPLACE FUNCTION cleanup_old_pii_mappings(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM pii_mapping 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario para la función de limpieza
COMMENT ON FUNCTION cleanup_old_pii_mappings IS 'Elimina tokens PII más antiguos que el número especificado de días';

-- Función para obtener estadísticas de uso PII
CREATE OR REPLACE FUNCTION get_pii_stats()
RETURNS TABLE(
    total_tokens BIGINT,
    tokens_today BIGINT,
    tokens_this_week BIGINT,
    tokens_this_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tokens,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as tokens_today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as tokens_this_week,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as tokens_this_month
    FROM pii_mapping;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario para la función de estadísticas
COMMENT ON FUNCTION get_pii_stats IS 'Obtiene estadísticas de uso de tokens PII';

-- Insertar algunos datos de ejemplo para testing (solo en desarrollo)
-- NOTA: Estos datos se eliminarán en producción
DO $$
BEGIN
    IF current_setting('app.environment', true) = 'development' THEN
        INSERT INTO pii_mapping (token, original) VALUES 
            ('<PII_EMAIL_12345678>', 'test@example.com'),
            ('<PII_PHONE_87654321>', '+57 300 123 4567')
        ON CONFLICT (token) DO NOTHING;
    END IF;
END $$;
