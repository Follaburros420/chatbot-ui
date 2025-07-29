import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import initTranslations from "@/lib/i18n"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
  params: { locale },
  searchParams
}: {
  params: { locale: string }
  searchParams: { message: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  if (session) {
    const { data: homeWorkspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(error.message)
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  const { t } = await initTranslations(locale, ["translation"])

  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(
        homeWorkspaceError?.message || "An unexpected error occurred"
      )
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }

    return process.env[name]
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    // If there are whitelist patterns, check if the email is allowed to sign up
    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      console.error(error)
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/setup")

    // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
    // return redirect("/login?message=Check email to continue sign in process")
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/login?message=Check email to reset password")
  }

  const signInWithGoogle = async () => {
    "use server"

    const origin = headers().get("origin")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect(data.url)
  }

  const signInWithFacebook = async () => {
    "use server"

    const origin = headers().get("origin")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect(data.url)
  }

  const signInWithLinkedIn = async () => {
    "use server"

    const origin = headers().get("origin")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect(data.url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-legal-blue/5 via-background to-legal-gold/5 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <Brand size="lg" showTagline={true} />
            <h1 className="text-4xl lg:text-5xl font-bold mt-8 mb-6 leading-tight">
              Bienvenido al Futuro de la
              <span className="ali-text-gradient block">Práctica Legal</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Únete a más de 10,000 abogados que ya están revolucionando su trabajo
              con inteligencia artificial especializada.
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

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="ali-card p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <Brand size="md" showTagline={false} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Iniciar Sesión</h2>
              <p className="text-muted-foreground">
                Accede a tu asistente legal inteligente
              </p>
            </div>

            {searchParams?.message && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm text-center">
                  {searchParams.message}
                </p>
              </div>
            )}

            {/* OAuth Providers */}
            <div className="space-y-3 mb-6">
              {/* Google Sign In */}
              <form action={signInWithGoogle}>
                <SubmitButton className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 py-3 font-medium rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </SubmitButton>
              </form>

              {/* Facebook Sign In */}
              <form action={signInWithFacebook}>
                <SubmitButton className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] flex items-center justify-center gap-3 py-3 font-medium rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuar con Facebook
                </SubmitButton>
              </form>

              {/* LinkedIn Sign In */}
              <form action={signInWithLinkedIn}>
                <SubmitButton className="w-full bg-[#0A66C2] text-white hover:bg-[#004182] flex items-center justify-center gap-3 py-3 font-medium rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continuar con LinkedIn
                </SubmitButton>
              </form>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">o continúa con email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form action={signIn} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  formAction={handleResetPassword}
                  className="text-sm text-legal-blue hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <SubmitButton className="w-full ali-button-primary h-12 text-lg font-semibold">
                Iniciar Sesión
              </SubmitButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <form action={signUp} className="inline">
                  <SubmitButton className="text-legal-blue hover:underline font-semibold bg-transparent p-0 h-auto">
                    Crear cuenta gratis
                  </SubmitButton>
                </form>
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-8 pt-6 border-t">
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
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Al continuar, aceptas nuestros{" "}
                <a href="/terms" className="text-legal-blue hover:underline">
                  Términos de Servicio
                </a>{" "}
                y{" "}
                <a href="/privacy" className="text-legal-blue hover:underline">
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
