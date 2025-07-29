"use client"

import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscription } from "@/lib/hooks/use-subscription"
import { 
  IconScale, 
  IconFileText, 
  IconGavel, 
  IconSearch, 
  IconBrain,
  IconArrowRight,
  IconSparkles
} from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"

interface LegalWelcomeProps {
  onQuickAction?: (action: string, prompt: string) => void
}

export const LegalWelcome = ({ onQuickAction }: LegalWelcomeProps) => {
  const { t } = useTranslation()
  const { profile } = useContext(ChatbotUIContext)
  const subscription = useSubscription()

  const quickActions = [
    {
      id: "contract_review",
      title: "Revisión de Contratos",
      description: "Analiza y revisa contratos legales",
      icon: IconFileText,
      prompt: "Necesito ayuda para revisar un contrato. Por favor, analiza los términos y condiciones principales, identifica posibles riesgos y sugiere mejoras.",
      color: "text-legal-blue"
    },
    {
      id: "legal_research",
      title: "Investigación Jurídica",
      description: "Busca jurisprudencia y normativa",
      icon: IconSearch,
      prompt: "Quiero realizar una investigación jurídica sobre un tema específico. Ayúdame a encontrar jurisprudencia relevante, normativa aplicable y precedentes importantes.",
      color: "text-legal-gold"
    },
    {
      id: "case_analysis",
      title: "Análisis de Casos",
      description: "Evalúa estrategias legales",
      icon: IconGavel,
      prompt: "Necesito analizar un caso legal. Ayúdame a evaluar las fortalezas y debilidades, identificar precedentes relevantes y desarrollar una estrategia legal.",
      color: "text-legal-blue"
    },
    {
      id: "document_drafting",
      title: "Redacción de Documentos",
      description: "Crea documentos legales",
      icon: IconBrain,
      prompt: "Quiero redactar un documento legal. Ayúdame a crear un documento profesional con el formato y contenido apropiado según las mejores prácticas legales.",
      color: "text-legal-gold"
    }
  ]

  const handleQuickAction = (action: any) => {
    if (onQuickAction) {
      onQuickAction(action.id, action.prompt)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8 ali-animate-fade-in">
        <Brand size="md" showTagline={false} />
        
        <h1 className="text-3xl font-bold mt-6 mb-2">
          {getGreeting()}, {profile?.display_name || profile?.username || "Colega"}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-4">
          ¿En qué puedo asistirte hoy con tu práctica legal?
        </p>

        {/* Subscription Status */}
        {subscription.hasActiveSubscription ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-legal-blue/10 text-legal-blue text-sm">
            <IconSparkles size={16} />
            Plan {subscription.planName} activo
            {subscription.consultationsRemaining !== null && (
              <span className="text-muted-foreground">
                • {subscription.consultationsRemaining} consultas restantes
              </span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-legal-gold/10 text-legal-gold text-sm">
            <IconSparkles size={16} />
            Prueba gratuita activa
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 w-full mb-8 ali-animate-slide-up">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <Card 
              key={action.id}
              className="ali-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleQuickAction(action)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Comenzar consulta
                  </span>
                  <IconArrowRight size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Usage Stats or Upgrade Prompt */}
      {subscription.hasActiveSubscription ? (
        <div className="w-full max-w-2xl ali-animate-scale-in">
          <Card className="ali-card">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg">Uso del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-legal-blue mb-1">
                    {subscription.consultationsUsed}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {subscription.consultationsLimit 
                      ? `de ${subscription.consultationsLimit} consultas`
                      : "consultas ilimitadas"
                    }
                  </div>
                  {subscription.consultationsLimit && (
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-legal-blue h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((subscription.consultationsUsed / subscription.consultationsLimit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-legal-gold mb-1">
                    {subscription.documentsAnalyzed}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {subscription.documentsLimit 
                      ? `de ${subscription.documentsLimit} documentos`
                      : "documentos ilimitados"
                    }
                  </div>
                  {subscription.documentsLimit && (
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-legal-gold h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((subscription.documentsAnalyzed / subscription.documentsLimit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full max-w-2xl ali-animate-scale-in">
          <Card className="ali-card border-legal-gold">
            <CardContent className="text-center py-6">
              <IconSparkles className="w-12 h-12 text-legal-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Desbloquea todo el potencial de ALI
              </h3>
              <p className="text-muted-foreground mb-4">
                Accede a consultas ilimitadas, análisis avanzado y soporte prioritario
              </p>
              <Link href="/pricing">
                <Button className="ali-button-gold">
                  Ver Planes desde $2/mes
                  <IconArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center max-w-2xl">
        <p className="text-xs text-muted-foreground">
          <strong>Aviso Legal:</strong> ALI proporciona información legal general y no constituye asesoramiento legal profesional. 
          Siempre consulta con un abogado calificado para asuntos legales específicos.
        </p>
      </div>
    </div>
  )
}

// Suggested Prompts Component
export const LegalPromptSuggestions = ({ onPromptSelect }: { onPromptSelect?: (prompt: string) => void }) => {
  const suggestions = [
    "Explícame los elementos esenciales de un contrato válido",
    "¿Cuáles son las diferencias entre responsabilidad civil y penal?",
    "Ayúdame a entender el proceso de constitución de una sociedad",
    "¿Qué debo considerar al redactar un contrato de trabajo?",
    "Explícame los derechos del consumidor en mi jurisdicción"
  ]

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs hover:bg-legal-blue hover:text-white transition-colors"
          onClick={() => onPromptSelect?.(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
