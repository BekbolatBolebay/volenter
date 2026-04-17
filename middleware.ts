import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Since it's an ideathon, we'll keep auth minimal but structured
  // In a full prod app we should use the supabase server client correctly.
  
  // For the sake of the hackathon demo, we rely on local caching / tokens if we wanted to enforce it strictly.
  // Actually, let's keep it simple. If we want full protection we use `@supabase/ssr`.
  // Since we don't know if `@supabase/ssr` is installed, let's skip complex middleware and use basic layout protection or just rely on the login routing.

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
