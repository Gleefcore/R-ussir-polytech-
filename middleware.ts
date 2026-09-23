import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];

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
  const userLevel = user?.user_metadata?.level;

  // Redirection d'un utilisateur non connecté essayant d'accéder aux routes protégées
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isMsp1 = pathname.startsWith('/msp1');
  const isMsp2 = pathname.startsWith('/msp2');
  const isVip = pathname.startsWith('/entrepreneur-vip');

  const requiresAuth = isProtected || isMsp1 || isMsp2 || isVip;

  if (requiresAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

  // Vérification stricte des niveaux
  if (user) {
    if (isMsp1 && userLevel !== 'MSP1' && userLevel !== 'ALUMNI') {
      const url = request.nextUrl.clone();
      url.pathname = userLevel === 'MSP2' ? '/msp2' : '/auth';
      return NextResponse.redirect(url);
    }
    if (isMsp2 && userLevel !== 'MSP2' && userLevel !== 'ALUMNI') {
      const url = request.nextUrl.clone();
      url.pathname = userLevel === 'MSP1' ? '/msp1' : '/auth';
      return NextResponse.redirect(url);
    }
    // Si VIP, on pourrait restreindre, mais on laisse ouvert aux ALUMNI ou VIP si nécessaire. Pour l'instant, on exige au moins d'être connecté.
  }

  // Si l'utilisateur est déjà connecté et va sur /auth, on l'oriente intelligemment
  if (user && pathname === '/auth') {
    const url = request.nextUrl.clone();
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
