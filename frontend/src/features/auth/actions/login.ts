"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { looksLikeEmail, normalizePhone } from "@/features/auth/lib/phone";
import { getSafeRedirectPath } from "@/features/auth/lib/safe-redirect";
import { loginSchema } from "@/features/auth/schemas/login-schema";

export type LoginResult = { error: string };

/** Same message whether the account is missing or the password is wrong. */
const WRONG_DETAILS =
  "Incorrect email, phone number or password. Please try again.";

async function findEmailByPhone(phone: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("profiles")
    .select("email")
    .eq("phone", phone)
    .maybeSingle();

  return data?.email ?? null;
}

export async function login(
  input: unknown,
  next?: string | null,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: WRONG_DETAILS };

  const { identifier, password } = parsed.data;

  let email: string | null;
  if (looksLikeEmail(identifier)) {
    email = identifier.toLowerCase();
  } else {
    if (!createAdminClient()) {
      return {
        error: "Phone number login isn't available yet. Please use your email.",
      };
    }
    const phone = normalizePhone(identifier);
    email = phone ? await findEmailByPhone(phone) : null;
  }

  if (!email) return { error: WRONG_DETAILS };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "over_request_rate_limit") {
      return { error: "Too many attempts. Please wait a minute and try again." };
    }
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email first. Check your inbox." };
    }
    return { error: WRONG_DETAILS };
  }

  redirect(getSafeRedirectPath(next));
}
