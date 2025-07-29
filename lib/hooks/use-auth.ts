"use client"

import { useContext, useEffect, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const useAuth = () => {
  const { profile, setProfile } = useContext(ChatbotUIContext)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN') {
          toast.success("¡Bienvenido a ALI!")
          router.push("/")
        } else if (event === 'SIGNED_OUT') {
          toast.info("Sesión cerrada correctamente")
          setProfile(null)
          router.push("/")
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, setProfile])

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        toast.error(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      toast.error("Error al iniciar sesión")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        return { success: false, error: error.message }
      }

      if (data.user && !data.session) {
        toast.success("¡Cuenta creada! Revisa tu email para confirmar tu cuenta.")
      }

      return { success: true, data }
    } catch (error: any) {
      toast.error("Error al crear cuenta")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'facebook' | 'linkedin_oidc') => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(`Error al conectar con ${provider}`)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      toast.error("Error de autenticación")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error("Error al cerrar sesión")
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      toast.error("Error al cerrar sesión")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(error.message)
        return { success: false, error: error.message }
      }

      toast.success("Revisa tu email para restablecer tu contraseña")
      return { success: true }
    } catch (error: any) {
      toast.error("Error al enviar email de recuperación")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        toast.error("Error al actualizar perfil")
        return { success: false, error: error.message }
      }

      toast.success("Perfil actualizado correctamente")
      return { success: true, data }
    } catch (error: any) {
      toast.error("Error al actualizar perfil")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  }
}

// Helper functions for OAuth providers
export const getOAuthProviderName = (provider: string) => {
  const names = {
    google: "Google",
    facebook: "Facebook", 
    linkedin_oidc: "LinkedIn"
  }
  return names[provider as keyof typeof names] || provider
}

export const getOAuthProviderColor = (provider: string) => {
  const colors = {
    google: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    facebook: "bg-[#1877F2] text-white hover:bg-[#166FE5]",
    linkedin_oidc: "bg-[#0A66C2] text-white hover:bg-[#004182]"
  }
  return colors[provider as keyof typeof colors] || "bg-gray-500 text-white"
}
