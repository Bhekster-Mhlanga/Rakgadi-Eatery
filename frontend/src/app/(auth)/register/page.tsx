import type { Metadata } from "next";
import { Suspense } from "react";
import { SocialLogin } from "@/features/auth/components/social-login";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create account | Rakgadi Eatery",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Account"
      imageSrc="/images/auth-register.jpg"
      imageAlt="Loaded kotas fresh off the grill"
    >
      <Suspense>
        <RegisterForm />
        <SocialLogin />
      </Suspense>
    </AuthShell>
  );
}
