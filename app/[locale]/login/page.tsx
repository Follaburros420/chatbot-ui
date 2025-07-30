"use client"

import { useState } from "react"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft, IconEye, IconEyeOff, IconSparkles } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Aquí iría la lógica de autenticación con Supabase
      console.log(isLogin ? "Logging in..." : "Signing up...", formData)
      
      // Simulación de autenticación exitosa
      setTimeout(() => {
        setLoading(false)
        router.push("/es") // Redirigir al dashboard o página principal
      }, 1500)
      
    } catch (error) {
      console.error("Authentication error:", error)
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOAuthLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Aquí iría la lógica de OAuth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-blue/5 via-background to-legal-gold/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <Brand size="lg" showTagline={true} />
            <h1 className="text-4xl lg:text-5xl font-bold mt-8 mb-6 leading-tight">
              {isLogin ? "Bienvenido de vuelta a" : "Únete al futuro de la"}
              <span className="ali-text-gradient block">Práctica Legal</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {isLogin 
                ? "Accede a tu asistente legal inteligente y continúa revolucionando tu trabajo."
                : "Únete a más de 10,000 abogados que ya están revolucionando su trabajo con IA."
              }
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-legal-blue rounded-full mr-4"></div>
                <span>Investigación jurídica en segundos</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-legal-gold rounded-full mr-4"></div>
                <span>Redacción de documentos asistida por IA</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-legal-blue rounded-full mr-4"></div>
                <span>Análisis de casos y precedentes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="ali-card shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="lg:hidden mb-6">
                <Brand variant="compact" />
              </div>
              
              <Badge className="mb-4 bg-legal-blue/10 text-legal-blue border-legal-blue/20 mx-auto">
                <IconSparkles className="w-4 h-4 mr-2" />
                Potenciado por IA
              </Badge>
              
              <CardTitle className="text-2xl lg:text-3xl font-bold">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isLogin 
                  ? "Accede a tu asistente legal inteligente"
                  : "Comienza tu prueba gratuita de 14 días"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 py-3 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>

                <Button 
                  onClick={() => handleOAuthLogin('facebook')}
                  className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] flex items-center justify-center gap-3 py-3 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuar con Facebook
                </Button>

                <Button 
                  onClick={() => handleOAuthLogin('linkedin')}
                  className="w-full bg-[#0A66C2] text-white hover:bg-[#004182] flex items-center justify-center gap-3 py-3 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continuar con LinkedIn
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">o continúa con email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-2 h-12"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Apellido
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-2 h-12"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-2 h-12"
                      required={!isLogin}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm text-legal-blue hover:underline font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full ali-button-primary h-12 text-lg font-semibold shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading 
                    ? (isLogin ? "Iniciando sesión..." : "Creando cuenta...") 
                    : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")
                  }
                </Button>
              </form>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-legal-blue hover:underline font-semibold"
                  >
                    {isLogin ? "Crear cuenta gratis" : "Iniciar sesión"}
                  </button>
                </p>
              </div>

              {/* Benefits */}
              <div className="pt-6 border-t border-border/40">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">14</div>
                    <div className="text-xs text-muted-foreground">días gratis</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legal-gold">10K+</div>
                    <div className="text-xs text-muted-foreground">abogados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-legal-blue">24/7</div>
                    <div className="text-xs text-muted-foreground">soporte</div>
                  </div>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Al continuar, aceptas nuestros{" "}
                  <a href="/terminos" className="text-legal-blue hover:underline">
                    Términos de Servicio
                  </a>{" "}
                  y{" "}
                  <a href="/privacidad" className="text-legal-blue hover:underline">
                    Política de Privacidad
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/es" className="inline-flex items-center text-sm text-muted-foreground hover:text-legal-blue transition-colors">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
