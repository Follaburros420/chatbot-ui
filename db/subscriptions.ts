import { createClient } from "@supabase/supabase-js"
import { Tables, TablesInsert, TablesUpdate, Database } from "@/supabase/types"

// Create a supabase client that works in both browser and server environments
const getSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type SubscriptionPlan = Tables<"subscription_plans">
export type UserSubscription = Tables<"user_subscriptions">
export type PaymentHistory = Tables<"payment_history">
export type UsageTracking = Tables<"usage_tracking">

// Subscription Plans
export const getSubscriptionPlans = async () => {
  const supabase = getSupabaseClient()
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("active", true)
    .order("price_monthly", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return plans
}

export const getSubscriptionPlanById = async (planId: string) => {
  const supabase = getSupabaseClient()
  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .eq("active", true)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return plan
}

// User Subscriptions
export const getUserSubscription = async (userId: string) => {
  const supabase = getSupabaseClient()
  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select(`
      *,
      subscription_plans (*)
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message)
  }

  return subscription
}

export const createUserSubscription = async (
  subscription: TablesInsert<"user_subscriptions">
) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("user_subscriptions")
    .insert(subscription)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const updateUserSubscription = async (
  subscriptionId: string,
  updates: TablesUpdate<"user_subscriptions">
) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("user_subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const cancelUserSubscription = async (subscriptionId: string) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("user_subscriptions")
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq("id", subscriptionId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Usage Tracking
export const checkUsageLimit = async (userId: string, actionType: string) => {
  const supabase = getSupabaseClient()
  const { data, error } = await (supabase as any).rpc("check_usage_limit", {
    p_user_id: userId,
    p_action_type: actionType
  })

  if (error) {
    throw new Error(error.message)
  }

  return data as boolean
}

export const incrementUsage = async (userId: string, actionType: string) => {
  const supabase = getSupabaseClient()
  const { error } = await (supabase as any).rpc("increment_usage", {
    p_user_id: userId,
    p_action_type: actionType
  })

  if (error) {
    throw new Error(error.message)
  }
}

export const getUserUsageStats = async (userId: string) => {
  const supabase = getSupabaseClient()
  const { data: subscription, error } = await supabase
    .from("user_subscriptions")
    .select(`
      consultations_used,
      documents_analyzed,
      last_reset_date,
      subscription_plans (
        max_consultations,
        max_documents
      )
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message)
  }

  return subscription
}

// Payment History
export const getUserPaymentHistory = async (userId: string) => {
  const supabase = getSupabaseClient()
  const { data: payments, error } = await supabase
    .from("payment_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return payments
}

export const createPaymentRecord = async (
  payment: TablesInsert<"payment_history">
) => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("payment_history")
    .insert(payment)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Usage Analytics
export const getUserUsageHistory = async (
  userId: string,
  startDate?: string,
  endDate?: string
) => {
  const supabase = getSupabaseClient()
  let query = supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (startDate) {
    query = query.gte("created_at", startDate)
  }

  if (endDate) {
    query = query.lte("created_at", endDate)
  }

  const { data: usage, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return usage
}

export const getUsageStatsByActionType = async (
  userId: string,
  actionType: string,
  startDate?: string,
  endDate?: string
) => {
  const supabase = getSupabaseClient()
  let query = supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .eq("action_type", actionType)

  if (startDate) {
    query = query.gte("created_at", startDate)
  }

  if (endDate) {
    query = query.lte("created_at", endDate)
  }

  const { data: usage, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return usage
}

// Subscription Status Helpers
export const isSubscriptionActive = (subscription: UserSubscription | null) => {
  if (!subscription) return false
  return subscription.status === "active" && new Date(subscription.current_period_end) > new Date()
}

export const isTrialActive = (subscription: UserSubscription | null) => {
  if (!subscription) return false
  return subscription.status === "trialing" && 
         subscription.trial_end && 
         new Date(subscription.trial_end) > new Date()
}

export const getDaysUntilExpiry = (subscription: UserSubscription | null) => {
  if (!subscription) return 0
  
  const expiryDate = subscription.trial_end 
    ? new Date(subscription.trial_end)
    : new Date(subscription.current_period_end)
  
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}
