"use client"

import { useState, useEffect, useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import { 
  getUserSubscription, 
  checkUsageLimit, 
  incrementUsage,
  getUserUsageStats,
  isSubscriptionActive,
  isTrialActive,
  getDaysUntilExpiry,
  type UserSubscription,
  type SubscriptionPlan
} from "@/db/subscriptions"
import { toast } from "sonner"

export const useSubscription = () => {
  const { profile } = useContext(ChatbotUIContext)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [usageStats, setUsageStats] = useState<any>(null)

  useEffect(() => {
    if (profile?.user_id) {
      loadSubscription()
      loadUsageStats()
    }
  }, [profile?.user_id])

  const loadSubscription = async () => {
    if (!profile?.user_id) return

    try {
      const userSubscription = await getUserSubscription(profile.user_id)
      setSubscription(userSubscription)
    } catch (error) {
      console.error("Error loading subscription:", error)
      // Don't show error toast for missing subscription (user might not have one)
    } finally {
      setLoading(false)
    }
  }

  const loadUsageStats = async () => {
    if (!profile?.user_id) return

    try {
      const stats = await getUserUsageStats(profile.user_id)
      setUsageStats(stats)
    } catch (error) {
      console.error("Error loading usage stats:", error)
    }
  }

  const checkCanPerformAction = async (actionType: string): Promise<boolean> => {
    if (!profile?.user_id) {
      toast.error("Debes iniciar sesión para realizar esta acción")
      return false
    }

    try {
      const canPerform = await checkUsageLimit(profile.user_id, actionType)
      
      if (!canPerform) {
        const actionNames = {
          consultation: "consultas",
          document_analysis: "análisis de documentos",
          contract_review: "revisiones de contratos",
          case_analysis: "análisis de casos"
        }
        
        const actionName = actionNames[actionType as keyof typeof actionNames] || actionType
        toast.error(`Has alcanzado el límite de ${actionName} para tu plan actual`)
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking usage limit:", error)
      toast.error("Error al verificar los límites de uso")
      return false
    }
  }

  const recordUsage = async (actionType: string) => {
    if (!profile?.user_id) return

    try {
      await incrementUsage(profile.user_id, actionType)
      // Reload usage stats after recording usage
      await loadUsageStats()
    } catch (error) {
      console.error("Error recording usage:", error)
    }
  }

  const performActionWithUsageCheck = async (
    actionType: string,
    action: () => Promise<any>
  ) => {
    const canPerform = await checkCanPerformAction(actionType)
    if (!canPerform) return null

    try {
      const result = await action()
      await recordUsage(actionType)
      return result
    } catch (error) {
      console.error(`Error performing ${actionType}:`, error)
      throw error
    }
  }

  const refreshSubscription = async () => {
    await loadSubscription()
    await loadUsageStats()
  }

  // Computed properties
  const isActive = isSubscriptionActive(subscription)
  const isOnTrial = isTrialActive(subscription)
  const daysUntilExpiry = getDaysUntilExpiry(subscription)
  const hasActiveSubscription = isActive || isOnTrial

  // Plan information
  const currentPlan = subscription?.subscription_plans as SubscriptionPlan | undefined
  const planName = currentPlan?.name || "Sin plan"
  const isBasicPlan = currentPlan?.name === "Básico"
  const isProfessionalPlan = currentPlan?.name === "Profesional"
  const isEnterprisePlan = currentPlan?.name === "Empresarial"

  // Usage information
  const consultationsUsed = subscription?.consultations_used || 0
  const documentsAnalyzed = subscription?.documents_analyzed || 0
  const consultationsLimit = currentPlan?.max_consultations
  const documentsLimit = currentPlan?.max_documents

  const consultationsRemaining = consultationsLimit 
    ? Math.max(0, consultationsLimit - consultationsUsed)
    : null // null means unlimited

  const documentsRemaining = documentsLimit 
    ? Math.max(0, documentsLimit - documentsAnalyzed)
    : null // null means unlimited

  // Warning thresholds
  const isNearConsultationLimit = consultationsLimit 
    ? (consultationsUsed / consultationsLimit) >= 0.8
    : false

  const isNearDocumentLimit = documentsLimit 
    ? (documentsAnalyzed / documentsLimit) >= 0.8
    : false

  const shouldShowUpgradePrompt = !hasActiveSubscription || 
    (isBasicPlan && (isNearConsultationLimit || isNearDocumentLimit))

  return {
    // State
    subscription,
    loading,
    usageStats,

    // Actions
    loadSubscription,
    loadUsageStats,
    checkCanPerformAction,
    recordUsage,
    performActionWithUsageCheck,
    refreshSubscription,

    // Computed properties
    isActive,
    isOnTrial,
    daysUntilExpiry,
    hasActiveSubscription,

    // Plan information
    currentPlan,
    planName,
    isBasicPlan,
    isProfessionalPlan,
    isEnterprisePlan,

    // Usage information
    consultationsUsed,
    documentsAnalyzed,
    consultationsLimit,
    documentsLimit,
    consultationsRemaining,
    documentsRemaining,

    // Warnings
    isNearConsultationLimit,
    isNearDocumentLimit,
    shouldShowUpgradePrompt
  }
}

// Helper hook for specific actions
export const useConsultationLimit = () => {
  const subscription = useSubscription()

  const performConsultation = async (consultationFn: () => Promise<any>) => {
    return subscription.performActionWithUsageCheck("consultation", consultationFn)
  }

  return {
    ...subscription,
    performConsultation
  }
}

export const useDocumentAnalysisLimit = () => {
  const subscription = useSubscription()

  const performDocumentAnalysis = async (analysisFn: () => Promise<any>) => {
    return subscription.performActionWithUsageCheck("document_analysis", analysisFn)
  }

  return {
    ...subscription,
    performDocumentAnalysis
  }
}
