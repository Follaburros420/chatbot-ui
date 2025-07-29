"use client"

import { useContext, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeSwitcher } from "@/components/utility/theme-switcher"
import { useSubscription } from "@/lib/hooks/use-subscription"
import { IconUser, IconSettings, IconCreditCard, IconLogout, IconBell, IconChevronDown } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export const DashboardHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { profile } = useContext(ChatbotUIContext)
  const subscription = useSubscription()
  const [notifications] = useState(0) // Placeholder for notifications

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getPlanBadgeColor = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case "básico":
        return "bg-blue-100 text-blue-800"
      case "profesional":
        return "bg-legal-gold/20 text-legal-gold"
      case "empresarial":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Brand */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Brand size="sm" />
          </Link>
          
          {/* Subscription Status */}
          {subscription.hasActiveSubscription && (
            <Badge className={getPlanBadgeColor(subscription.planName)}>
              {subscription.planName}
              {subscription.isOnTrial && " (Prueba)"}
            </Badge>
          )}
        </div>

        {/* Center - Welcome Message */}
        <div className="hidden md:block text-center">
          <h1 className="text-lg font-semibold text-foreground">
            Bienvenido, {profile?.display_name || profile?.username || "Usuario"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {subscription.hasActiveSubscription 
              ? `Plan ${subscription.planName} activo`
              : "Comienza tu prueba gratuita"
            }
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Usage Warning */}
          {subscription.shouldShowUpgradePrompt && (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="text-legal-gold border-legal-gold hover:bg-legal-gold hover:text-white">
                Actualizar Plan
              </Button>
            </Link>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <IconBell size={20} />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.image_url || ""} />
                  <AvatarFallback className="bg-legal-blue text-white text-sm">
                    {profile?.display_name 
                      ? getInitials(profile.display_name)
                      : profile?.username?.charAt(0).toUpperCase() || "U"
                    }
                  </AvatarFallback>
                </Avatar>
                <IconChevronDown size={16} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">
                  {profile?.display_name || profile?.username || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.bio || "Profesional del Derecho"}
                </p>
              </div>
              
              <DropdownMenuSeparator />
              
              <Link href="/account">
                <DropdownMenuItem className="cursor-pointer">
                  <IconUser className="mr-2 h-4 w-4" />
                  Mi Cuenta
                </DropdownMenuItem>
              </Link>
              
              <Link href="/account?tab=subscription">
                <DropdownMenuItem className="cursor-pointer">
                  <IconCreditCard className="mr-2 h-4 w-4" />
                  Suscripción
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuItem className="cursor-pointer">
                <IconSettings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleSignOut}
              >
                <IconLogout className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Usage Stats Bar (for mobile) */}
      {subscription.hasActiveSubscription && (
        <div className="md:hidden px-6 py-2 border-t bg-muted/30">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Consultas: {subscription.consultationsUsed}
              {subscription.consultationsLimit ? `/${subscription.consultationsLimit}` : " (∞)"}
            </span>
            <span>
              Documentos: {subscription.documentsAnalyzed}
              {subscription.documentsLimit ? `/${subscription.documentsLimit}` : " (∞)"}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

// Usage Stats Component for Sidebar
export const UsageStatsWidget = () => {
  const subscription = useSubscription()
  const { t } = useTranslation()

  if (!subscription.hasActiveSubscription) {
    return (
      <div className="p-4 m-4 rounded-lg bg-legal-blue/10 border border-legal-blue/20">
        <h3 className="font-semibold text-sm mb-2">Comienza tu prueba</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Accede a todas las funciones de ALI
        </p>
        <Link href="/pricing">
          <Button size="sm" className="w-full ali-button-primary">
            Ver Planes
          </Button>
        </Link>
      </div>
    )
  }

  const consultationsPercentage = subscription.consultationsLimit 
    ? (subscription.consultationsUsed / subscription.consultationsLimit) * 100 
    : 0

  const documentsPercentage = subscription.documentsLimit 
    ? (subscription.documentsAnalyzed / subscription.documentsLimit) * 100 
    : 0

  return (
    <div className="p-4 m-4 rounded-lg bg-card border">
      <h3 className="font-semibold text-sm mb-3">Uso del Plan</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Consultas</span>
            <span>
              {subscription.consultationsUsed}
              {subscription.consultationsLimit ? `/${subscription.consultationsLimit}` : " (∞)"}
            </span>
          </div>
          {subscription.consultationsLimit && (
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-legal-blue h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(consultationsPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Documentos</span>
            <span>
              {subscription.documentsAnalyzed}
              {subscription.documentsLimit ? `/${subscription.documentsLimit}` : " (∞)"}
            </span>
          </div>
          {subscription.documentsLimit && (
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-legal-gold h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(documentsPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {subscription.shouldShowUpgradePrompt && (
        <Link href="/pricing">
          <Button size="sm" variant="outline" className="w-full mt-3 text-legal-gold border-legal-gold hover:bg-legal-gold hover:text-white">
            Actualizar Plan
          </Button>
        </Link>
      )}
    </div>
  )
}
