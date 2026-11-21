"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/features/auth/lib/phone";
import { getSafeRedirectPath } from "@/features/auth/lib/safe-redirect";
import { loginSchema } from "@/features/auth/schemas/login-schema";

export type LoginResult =
  | { error: string; field?: "phone" }
  | { redirectTo: string };

const GOOGLE_HINT = "If you signed up with Google, use “Continue with Google”.";

/** Step 1 for phone login: does an account with this number exist? */
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
  if (!parsed.success) {
    return { error: "Please check your details and try again." };
  }

  const values = parsed.data;
  let email: string;

  if (values.method === "email") {
    email = values.email.toLowerCase();
  } else {
    if (!createAdminClient()) {
      return {
        error: "Phone number login isn't available yet. Please use your email.",
      };
    }

    const phone = normalizePhone(values.phone);
    const found = phone ? await findEmailByPhone(phone) : null;
    if (!found) {
      return {
        field: "phone",
        error: "We couldn't find an account with that phone number.",
      };
    }
    email = found;
  }

  // Step 2: Supabase checks the password and starts the session.
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: values.password,
  });

  if (error) {
    if (error.code === "over_request_rate_limit") {
      return { error: "Too many attempts. Please wait a minute and try again." };
    }
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email first. Check your inbox." };
    }
    return {
      error:
        values.method === "phone"
          ? `Incorrect password. ${GOOGLE_HINT}`
          : `Incorrect email or password. ${GOOGLE_HINT}`,
    };
  }

  // The browser does the navigation (a redirect thrown from here would reach the
  // form as an error). The path is checked so it can only stay inside this site.
  return { redirectTo: getSafeRedirectPath(next) };
}
