import { z } from "zod";
import { PATTERNS, emailSchema } from "./patterns";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").regex(PATTERNS.name, "Use letters only (no numbers)"),
    lastName: z.string().trim().min(1, "Last name is required").regex(PATTERNS.name, "Use letters only (no numbers)"),
    email: emailSchema,
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
export type RegisterForm = z.infer<typeof registerSchema>;
