"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizePhone } from "@/features/auth/lib/phone";
import { registerSchema } from "@/features/auth/schemas/register-schema";

export type RegisterResult =
  | { status: "error"; message: string; field?: "phone" | "email" }
  | { status: "check-email" };

function friendlyError(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Try logging in instead.";
    case "weak_password":
      return "That password is too easy to guess. Try a longer one.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a minute and try again.";
    case "email_address_invalid":
      return "That email address isn't accepted. Please check it.";
    case "signup_disabled":
      return "Sign-ups are turned off right now.";
    default:
      return "We couldn't create your account. Please try again.";
  }
}

async function isPhoneTaken(phone: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  return Boolean(data);
}

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Please check your details and try again." };
  }

  const values = parsed.data;
  const phone = values.phone ? normalizePhone(values.phone) : null;

  if (phone && (await isPhoneTaken(phone))) {
    return {
      status: "error",
      field: "phone",
      message: "That phone number is already linked to an account.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        ...(phone ? { contact_phone: phone } : {}),
      },
    },
  });

  if (error) {
    return {
      status: "error",
      field: error.code === "user_already_exists" ? "email" : undefined,
      message: friendlyError(error.code),
    };
  }

  // Email confirmation is on in Supabase: no session until they confirm.
  if (!data.session) return { status: "check-email" };

  redirect("/");
}
