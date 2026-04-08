import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.get('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getUser() for secure server-side session verification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Guest Protection: Redirect guests trying to access any dashboard path
  const isDashboardPath = pathname.startsWith('/Dashboard') || pathname.startsWith('/dashboard');
  
  if (isDashboardPath && !user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Authenticated Session Logic
  if (user) {
    // Fetch profile to verify role (Admin / User)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'user';

    // 2a. Admin Dashboard Protection: Only admins can access /Dashboard (Capital D)
    if (pathname.startsWith('/Dashboard') && role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard'; 
      return NextResponse.redirect(url);
    }

    // 2b. Smart Auth Redirection: If already logged in, redirect away from login/signup to their dashboard
    const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/signup');
    if (isAuthPath) {
      const url = req.nextUrl.clone();
      url.pathname = role === 'admin' ? '/Dashboard' : '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
