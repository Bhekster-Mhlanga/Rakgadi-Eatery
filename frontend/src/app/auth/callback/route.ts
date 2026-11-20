import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/features/auth/lib/safe-redirect";

/** Relative redirect: the browser resolves it against the address it used,
 *  so it also works behind Codespaces / proxies without trusting a host header. */
function redirectTo(path: string) {
  return new Response(null, { status: 303, headers: { Location: path } });
}

/** Google (and other providers) send people back here with a one-time code. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectTo(next);
  }

  return redirectTo("/login?error=oauth");
}
