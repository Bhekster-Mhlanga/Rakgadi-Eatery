import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Pages that need a logged-in customer. Admin role is checked later, inside the admin pages. */
const PROTECTED_PREFIXES = ["/account", "/orders", "/checkout", "/admin"];
/** Pages a logged-in customer has no reason to see. */
const AUTH_PAGES = ["/login", "/register"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase settings yet: let everything through instead of breaking the site.
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Checks the session and refreshes it when it is about to expire.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  function redirectTo(path: string, params?: Record<string, string>) {
    const target = request.nextUrl.clone();
    target.pathname = path;
    target.search = "";
    Object.entries(params ?? {}).forEach(([k, v]) => target.searchParams.set(k, v));
    const redirect = NextResponse.redirect(target);
    // Keep any refreshed session cookies on the redirect too.
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  if (!isLoggedIn && matchesPrefix(pathname, PROTECTED_PREFIXES)) {
    return redirectTo("/login", { next: `${pathname}${search}` });
  }

  if (isLoggedIn && matchesPrefix(pathname, AUTH_PAGES)) {
    return redirectTo("/");
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files (images, icons, fonts).
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
