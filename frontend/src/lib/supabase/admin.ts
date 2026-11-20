import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, getServiceRoleKey } from "@/lib/env";

/**
 * Supabase client with full database access (ignores Row Level Security).
 * Server-only: importing this file from a Client Component fails the build.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createAdminClient() {
  const serviceKey = getServiceRoleKey();
  if (!serviceKey) return null;

  const env = getPublicEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
