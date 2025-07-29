"use client"

import { useState, useContext } from "react"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SubscriptionPlans, UsageStats } from "@/components/subscription/subscription-plans"
import { useSubscription } from "@/lib/hooks/use-subscription"
import { ChatbotUIContext } from "@/context/context"
import { IconArrowLeft, IconCreditCard, IconUser, IconSettings, IconBarChart } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export default function AccountPage() {
  const { t } = useTranslation()
  const { profile } = useContext(ChatbotUIContext)
  const subscription = useSubscription()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 ali-animate-fade-in">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" className="text-legal-blue">
              <IconArrowLeft className="mr-2" size={20} />
              Volver al inicio
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <Brand size="sm" showTagline={false} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
              <p className="text-muted-foreground">
                Gestiona tu suscripción y configuración
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <IconCreditCard size={16} />
              Suscripción
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <IconBarChart size={16} />
              Uso
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <IconUser size={16} />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <IconSettings size={16} />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="ali-card">
                  <CardHeader>
                    <CardTitle>Plan Actual</CardTitle>
                    <CardDescription>
                      Información sobre tu suscripción actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subscription.hasActiveSubscription ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{subscription.planName}</h3>
                            <p className="text-muted-foreground">
                              {subscription.isOnTrial ? "Período de prueba" : "Suscripción activa"}
                            </p>
                          </div>
                          <Badge 
                            className={subscription.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {subscription.isActive ? "Activo" : "Prueba"}
                          </Badge>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Estado</p>
                              <p className="font-medium">{subscription.subscription?.status}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Días restantes</p>
                              <p className="font-medium">{subscription.daysUntilExpiry} días</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Próxima renovación</p>
                              <p className="font-medium">
                                {subscription.subscription?.current_period_end 
                                  ? new Date(subscription.subscription.current_period_end).toLocaleDateString('es-ES')
                                  : "N/A"
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ciclo de facturación</p>
                              <p className="font-medium">{subscription.subscription?.billing_cycle}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button variant="outline" className="mr-2">
                            Cambiar Plan
                          </Button>
                          <Button variant="destructive">
                            Cancelar Suscripción
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          No tienes una suscripción activa
                        </p>
                        <Link href="/pricing">
                          <Button className="ali-button-primary">
                            Ver Planes
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <UsageStats subscription={subscription.subscription} />
              </div>
            </div>

            {/* Available Plans */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Planes Disponibles</h2>
              <SubscriptionPlans 
                userId={profile?.user_id}
                currentSubscription={subscription.subscription}
              />
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="ali-card">
                <CardHeader>
                  <CardTitle>Consultas</CardTitle>
                  <CardDescription>
                    Uso de consultas en el período actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-legal-blue mb-2">
                    {subscription.consultationsUsed}
                  </div>
                  <p className="text-muted-foreground">
                    {subscription.consultationsLimit 
                      ? `de ${subscription.consultationsLimit} consultas`
                      : "consultas ilimitadas"
                    }
                  </p>
                  {subscription.consultationsLimit && (
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-legal-blue h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((subscription.consultationsUsed / subscription.consultationsLimit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="ali-card">
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Análisis de documentos en el período actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-legal-gold mb-2">
                    {subscription.documentsAnalyzed}
                  </div>
                  <p className="text-muted-foreground">
                    {subscription.documentsLimit 
                      ? `de ${subscription.documentsLimit} documentos`
                      : "documentos ilimitados"
                    }
                  </p>
                  {subscription.documentsLimit && (
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-legal-gold h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((subscription.documentsAnalyzed / subscription.documentsLimit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {subscription.shouldShowUpgradePrompt && (
              <Card className="ali-card border-legal-gold">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      ¿Necesitas más capacidad?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Estás cerca de alcanzar los límites de tu plan actual
                    </p>
                    <Link href="/pricing">
                      <Button className="ali-button-gold">
                        Actualizar Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="ali-card">
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de usuario</label>
                    <p className="text-muted-foreground">{profile?.username || "No configurado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nombre completo</label>
                    <p className="text-muted-foreground">{profile?.display_name || "No configurado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Biografía</label>
                    <p className="text-muted-foreground">{profile?.bio || "No configurado"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="ali-card">
              <CardHeader>
                <CardTitle>Configuración de la Cuenta</CardTitle>
                <CardDescription>
                  Ajusta las preferencias de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuración en desarrollo...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
