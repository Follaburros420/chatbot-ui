"use client"

import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { IconArrowLeft } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"
import Link from "next/link"

export default function PricingPage() {
  const { t } = useTranslation()
  const { profile } = useContext(ChatbotUIContext)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 ali-animate-fade-in">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" className="text-legal-blue">
              <IconArrowLeft className="mr-2" size={20} />
              Volver al inicio
            </Button>
          </Link>
          
          <Brand size="md" showTagline={false} />
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-8 mb-4">
            {t("Pricing")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para tu práctica legal. Todos los planes incluyen acceso completo a ALI.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="ali-animate-slide-up">
          <SubscriptionPlans userId={profile?.user_id} />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto ali-animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="ali-card p-6">
              <h3 className="font-semibold text-lg mb-3">¿Puedo cambiar de plan en cualquier momento?</h3>
              <p className="text-muted-foreground">
                Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se reflejarán en tu próximo ciclo de facturación.
              </p>
            </div>
            
            <div className="ali-card p-6">
              <h3 className="font-semibold text-lg mb-3">¿Hay descuentos por pago anual?</h3>
              <p className="text-muted-foreground">
                Sí, ofrecemos un 20% de descuento en todos los planes cuando pagas anualmente.
              </p>
            </div>
            
            <div className="ali-card p-6">
              <h3 className="font-semibold text-lg mb-3">¿ALI cumple con las regulaciones de privacidad?</h3>
              <p className="text-muted-foreground">
                Absolutamente. ALI cumple con GDPR, CCPA y otras regulaciones de privacidad. Tus datos están completamente seguros.
              </p>
            </div>
            
            <div className="ali-card p-6">
              <h3 className="font-semibold text-lg mb-3">¿Ofrecen soporte en español?</h3>
              <p className="text-muted-foreground">
                Sí, nuestro equipo de soporte habla español y está especializado en el sistema legal latinoamericano.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 ali-animate-slide-up">
          <h2 className="text-3xl font-bold mb-4">¿Listo para potenciar tu práctica legal?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de abogados que ya confían en ALI
          </p>
          <Link href="/login">
            <Button className="ali-button-primary px-8 py-3 text-lg">
              Comenzar Prueba Gratuita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
