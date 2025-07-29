import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    const errorUrl = new URL("/es/auth/auth-code-error", requestUrl.origin)
    errorUrl.searchParams.set("error", error)
    if (errorDescription) {
      errorUrl.searchParams.set("error_description", errorDescription)
    }
    return NextResponse.redirect(errorUrl.toString())
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      const errorUrl = new URL("/es/auth/auth-code-error", requestUrl.origin)
      errorUrl.searchParams.set("error", "server_error")
      errorUrl.searchParams.set("error_description", exchangeError.message)
      return NextResponse.redirect(errorUrl.toString())
    }
  }

  // Successful authentication - redirect to intended destination or home
  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin + "/es")
  }
}
