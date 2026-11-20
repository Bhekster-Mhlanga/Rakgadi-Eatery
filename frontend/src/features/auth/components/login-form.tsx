"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/auth/actions/login";
import {
  loginSchema,
  type LoginMethod,
  type LoginValues,
} from "@/features/auth/schemas/login-schema";

const pillInput = "h-11 rounded-full px-4";

const METHOD_LABELS: Record<LoginMethod, string> = {
  email: "Email",
  phone: "Phone number",
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    searchParams.get("error") === "oauth"
      ? "Google sign-in didn't work. Please try again."
      : null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { method: "email", email: "", phone: "", password: "" },
  });

  function chooseMethod(next: LoginMethod) {
    setMethod(next);
    setValue("method", next);
    clearErrors();
    setServerError(null);
  }

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      // On success the server redirects, so we only get a result back for errors.
      const result = await login(values, searchParams.get("next"));
      if (result?.field) {
        setError(result.field, { message: result.error });
      } else if (result?.error) {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div
        role="group"
        aria-label="Log in with"
        className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1"
      >
        {(Object.keys(METHOD_LABELS) as LoginMethod[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => chooseMethod(option)}
            aria-pressed={method === option}
            className={`h-9 rounded-full text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
              method === option
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {METHOD_LABELS[option]}
          </button>
        ))}
      </div>

      {method === "email" ? (
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={pillInput}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="082 123 4567"
            className={pillInput}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-sm text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`${pillInput} pr-12`}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-3 my-auto size-8 rounded-full p-1.5 text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-full text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-bronze-dark underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
