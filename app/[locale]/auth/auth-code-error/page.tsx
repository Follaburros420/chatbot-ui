"use client"

import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconAlertTriangle, IconArrowLeft, IconRefresh } from "@tabler/icons-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")
  const errorDescription = searchParams?.get("error_description")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "access_denied":
        return "Acceso denegado. Has cancelado el proceso de autenticación."
      case "invalid_request":
        return "Solicitud inválida. Hubo un problema con la configuración de autenticación."
      case "unauthorized_client":
        return "Cliente no autorizado. La aplicación no tiene permisos para este tipo de autenticación."
      case "unsupported_response_type":
        return "Tipo de respuesta no soportado."
      case "invalid_scope":
        return "Alcance inválido en la solicitud de autenticación."
      case "server_error":
        return "Error del servidor. Inténtalo nuevamente en unos minutos."
      case "temporarily_unavailable":
        return "Servicio temporalmente no disponible. Inténtalo más tarde."
      default:
        return "Ocurrió un error durante el proceso de autenticación."
    }
  }

  const getSuggestion = (error: string | null) => {
    switch (error) {
      case "access_denied":
        return "Si cambiaste de opinión, puedes intentar iniciar sesión nuevamente."
      case "server_error":
      case "temporarily_unavailable":
        return "Este problema suele ser temporal. Espera unos minutos e inténtalo de nuevo."
      default:
        return "Puedes intentar con un método de autenticación diferente o contactar soporte si el problema persiste."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="ali-card shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mb-4">
              <Brand size="md" showTagline={false} />
            </div>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              Error de Autenticación
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              No pudimos completar el proceso de inicio de sesión
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <h3 className="font-semibold text-sm text-destructive mb-2">
                Detalles del Error:
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {getErrorMessage(error ?? null)}
              </p>
              {errorDescription && (
                <p className="text-xs text-muted-foreground italic">
                  {errorDescription}
                </p>
              )}
            </div>

            {/* Suggestion */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">
                ¿Qué puedes hacer?
              </h3>
              <p className="text-sm text-muted-foreground">
                {getSuggestion(error ?? null)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full ali-button-primary">
                  <IconRefresh className="w-4 h-4 mr-2" />
                  Intentar Nuevamente
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <IconArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                ¿Necesitas ayuda?
              </p>
              <a 
                href="mailto:soporte@ali-legal.com" 
                className="text-sm text-legal-blue hover:underline"
              >
                Contactar Soporte Técnico
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
