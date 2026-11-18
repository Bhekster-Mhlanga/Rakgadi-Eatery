import type { Metadata } from "next";
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
      <RegisterForm />
    </AuthShell>
  );
}
