import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in | Rakgadi Eatery",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Login"
      imageSrc="/images/auth-login.jpg"
      imageAlt="A loaded kota wrapped and ready to eat"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
