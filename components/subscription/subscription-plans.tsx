"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconStar, IconLoader2 } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { getSubscriptionPlans, getUserSubscription, type SubscriptionPlan, type UserSubscription } from "@/db/subscriptions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SubscriptionPlansProps {
  userId?: string
  currentSubscription?: UserSubscription | null
  onPlanSelect?: (plan: SubscriptionPlan) => void
}

export const SubscriptionPlans = ({ 
  userId, 
  currentSubscription,
  onPlanSelect 
}: SubscriptionPlansProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const subscriptionPlans = await getSubscriptionPlans()
      setPlans(subscriptionPlans)
    } catch (error) {
      console.error("Error loading subscription plans:", error)
      toast.error("Error al cargar los planes de suscripción")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!userId) {
      router.push("/login")
      return
    }

    setSubscribing(plan.id)
    
    try {
      if (onPlanSelect) {
        onPlanSelect(plan)
      } else {
        // Default behavior - redirect to checkout or payment flow
        toast.info("Redirigiendo al proceso de pago...")
        // Here you would integrate with Stripe or your payment processor
        // For now, we'll just show a message
        setTimeout(() => {
          toast.success("¡Suscripción activada exitosamente!")
          setSubscribing(null)
        }, 2000)
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error)
      toast.error("Error al procesar la suscripción")
      setSubscribing(null)
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_id === planId
  }

  const getPlanFeatures = (features: any) => {
    if (Array.isArray(features)) {
      return features
    }
    if (typeof features === 'string') {
      try {
        return JSON.parse(features)
      } catch {
        return [features]
      }
    }
    return []
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <IconLoader2 className="w-8 h-8 animate-spin text-legal-blue" />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => {
        const features = getPlanFeatures(plan.features)
        const isPopular = index === 1 // Middle plan is popular
        const isCurrent = isCurrentPlan(plan.id)
        const isLoading = subscribing === plan.id

        return (
          <Card 
            key={plan.id} 
            className={`ali-card relative ${isPopular ? 'border-legal-blue shadow-lg scale-105' : ''} ${isCurrent ? 'border-legal-gold' : ''}`}
          >
            {isPopular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-legal-gold text-legal-navy">
                <IconStar className="w-4 h-4 mr-1" />
                Más Popular
              </Badge>
            )}
            
            {isCurrent && (
              <Badge className="absolute -top-3 right-4 bg-legal-blue text-white">
                Plan Actual
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-legal-blue">
                  ${plan.price_monthly}
                </span>
                <span className="text-muted-foreground">/mes</span>
                {plan.price_yearly && (
                  <div className="text-sm text-muted-foreground mt-1">
                    o ${plan.price_yearly}/año (ahorra 20%)
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    <IconCheck className="w-5 h-5 text-legal-blue mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className={`w-full ${isPopular ? 'ali-button-primary' : 'ali-button-gold'}`}
                size="lg"
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrent || isLoading}
              >
                {isLoading && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isCurrent 
                  ? "Plan Actual" 
                  : isLoading 
                    ? "Procesando..." 
                    : plan.name === "Empresarial" 
                      ? "Contactar Ventas" 
                      : t("Subscribe")
                }
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

// Usage Stats Component
interface UsageStatsProps {
  subscription: UserSubscription | null
}

export const UsageStats = ({ subscription }: UsageStatsProps) => {
  const { t } = useTranslation()

  if (!subscription) {
    return (
      <div className="ali-card p-6 text-center">
        <p className="text-muted-foreground">No tienes una suscripción activa</p>
      </div>
    )
  }

  const plan = subscription.subscription_plans as any
  const consultationsLimit = plan?.max_consultations
  const documentsLimit = plan?.max_documents

  const consultationsPercentage = consultationsLimit 
    ? (subscription.consultations_used / consultationsLimit) * 100 
    : 0

  const documentsPercentage = documentsLimit 
    ? (subscription.documents_analyzed / documentsLimit) * 100 
    : 0

  return (
    <div className="ali-card p-6">
      <h3 className="text-lg font-semibold mb-4">Uso del Plan</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Consultas</span>
            <span>
              {subscription.consultations_used}
              {consultationsLimit ? ` / ${consultationsLimit}` : ' (ilimitadas)'}
            </span>
          </div>
          {consultationsLimit && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-legal-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(consultationsPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Documentos Analizados</span>
            <span>
              {subscription.documents_analyzed}
              {documentsLimit ? ` / ${documentsLimit}` : ' (ilimitados)'}
            </span>
          </div>
          {documentsLimit && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-legal-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(documentsPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>Plan: <span className="font-medium text-foreground">{plan?.name}</span></p>
          <p>Estado: <span className="font-medium text-legal-blue">{subscription.status}</span></p>
          <p>Próxima renovación: <span className="font-medium text-foreground">
            {new Date(subscription.current_period_end).toLocaleDateString('es-ES')}
          </span></p>
        </div>
      </div>
    </div>
  )
}
