import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/entrepreneur-vip'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Si l'utilisateur non connecté tente d'accéder à une route strictement protégée
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est déjà connecté et va sur /auth, on l'oriente intelligemment
  if (user && pathname === '/auth') {
    const url = request.nextUrl.clone();
    const userLevel = user.user_metadata?.level;
    if (userLevel === 'MSP2') {
      url.pathname = '/msp2';
    } else {
      url.pathname = '/msp1';
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|documents|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
