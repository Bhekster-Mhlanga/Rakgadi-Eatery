import { z } from "zod";
import {
  looksLikeEmail,
  normalizePhone,
} from "@/features/auth/lib/phone";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email or phone number")
    .refine(
      (value) =>
        looksLikeEmail(value)
          ? z.email().safeParse(value).success
          : normalizePhone(value) !== null,
      "Enter a valid email or phone number",
    ),
  password: z.string().min(1, "Enter your password"),
});

export type LoginValues = z.infer<typeof loginSchema>;
