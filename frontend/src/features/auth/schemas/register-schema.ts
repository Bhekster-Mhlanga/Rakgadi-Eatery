import { z } from "zod";
import { normalizePhone } from "@/features/auth/lib/phone";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name")
      .max(80, "Name is too long"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Enter a valid email address")),
    // Optional. Blank is fine; if filled in it must be a real phone number.
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || normalizePhone(value) !== null,
        "Enter a valid phone number, for example 082 123 4567",
      ),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
