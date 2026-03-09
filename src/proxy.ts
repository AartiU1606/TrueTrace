import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard']
const PUBLIC_API_ROUTES = ['/api/fraud-map', '/api/city-risk', '/api/verified-products', '/api/verified-sellers', '/api/init']

async function proxyHandler(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApiRoute = pathname.startsWith('/api/')

  // Allow public API routes without auth
  if (isApiRoute && PUBLIC_API_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Only protect /dashboard and authenticated /api routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p)) || isApiRoute
  if (!isProtected) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return response
}

// Next.js 16 proxy format: export as both `proxy` (named) and default
export { proxyHandler as proxy }
export default proxyHandler
