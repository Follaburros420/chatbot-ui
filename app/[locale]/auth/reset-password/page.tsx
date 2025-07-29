"use client"

import { useState } from "react"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconKey, IconArrowLeft, IconCheck } from "@tabler/icons-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { updateProfile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const accessToken = searchParams?.get("access_token")
  const refreshToken = searchParams?.get("refresh_token")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    
    try {
      // Update password using the tokens from the URL
      const { success } = await updateProfile({ password })
      
      if (success) {
        setSuccess(true)
        toast.success("Contraseña actualizada correctamente")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (!accessToken || !refreshToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
        <Card className="ali-card shadow-2xl max-w-md w-full">
          <CardHeader className="text-center">
            <Brand size="md" showTagline={false} />
            <CardTitle className="text-2xl font-bold text-destructive mt-4">
              Enlace Inválido
            </CardTitle>
            <CardDescription>
              Este enlace de restablecimiento de contraseña no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full ali-button-primary">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Volver al Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
        <Card className="ali-card shadow-2xl max-w-md w-full">
          <CardHeader className="text-center">
            <Brand size="md" showTagline={false} />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto my-4">
              <IconCheck className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              ¡Contraseña Actualizada!
            </CardTitle>
            <CardDescription>
              Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos segundos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full ali-button-primary">
                Ir al Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <Card className="ali-card shadow-2xl max-w-md w-full">
        <CardHeader className="text-center">
          <Brand size="md" showTagline={false} />
          <div className="w-16 h-16 bg-legal-blue/10 rounded-full flex items-center justify-center mx-auto my-4">
            <IconKey className="w-8 h-8 text-legal-blue" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Nueva Contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para tu cuenta de ALI
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Nueva Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="mt-2 h-12"
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="mt-2 h-12"
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full ali-button-primary h-12"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-legal-blue hover:underline">
              ← Volver al login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
