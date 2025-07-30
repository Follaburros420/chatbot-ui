import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  const { pathname } = request.nextUrl

  // Allow access to demo chat without authentication
  if (pathname.includes('/chat-demo')) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }

  // Allow access to public pages
  const publicPaths = [
    '/',
    '/es',
    '/en',
    '/login',
    '/pricing',
    '/auth/callback',
    '/auth/auth-code-error',
    '/auth/reset-password'
  ]

  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }

  try {
    const { supabase, response } = createClient(request)

    const session = await supabase.auth.getSession()

    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message)
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
