import { z } from "zod";
import { normalizePhone } from "@/features/auth/lib/phone";

export const LOGIN_METHODS = ["email", "phone"] as const;
export type LoginMethod = (typeof LOGIN_METHODS)[number];

/**
 * The customer picks how to log in. Only the chosen field is checked,
 * the other one is ignored.
 */
export const loginSchema = z
  .object({
    method: z.enum(LOGIN_METHODS),
    email: z.string().trim(),
    phone: z.string().trim(),
    password: z.string().min(1, "Enter your password"),
  })
  .superRefine((values, ctx) => {
    if (values.method === "email") {
      if (!z.email().safeParse(values.email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email address",
        });
      }
    } else if (normalizePhone(values.phone) === null) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number, for example 082 123 4567",
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
