import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

/**
 * Reads and validates the public env vars.
 * Called when a Supabase client is created (not at import time), so the app
 * still starts without .env.local and fails with a clear message when needed.
 * Each variable is referenced literally so Next.js can inline it in the browser.
 */
export function getPublicEnv() {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => i.message).join("; ");
    throw new Error(
      `Missing or invalid Supabase settings in frontend/.env.local: ${problems}`,
    );
  }

  return parsed.data;
}
