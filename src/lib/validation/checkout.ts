import { z } from "zod";
import { PATTERNS, digitCount, expiryNotPast, luhnValid, nameSchema, emailSchema, phoneSchema, zipSchema } from "./patterns";

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const addressSchema = z.object({
  line1: z.string().trim().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  zip: zipSchema,
});

export const paymentSchema = z.object({
  cardName: nameSchema,
  cardNumber: z
    .string()
    .trim()
    .min(1, "Card number is required")
    .regex(PATTERNS.cardNumber, "Enter a valid card number")
    .refine((v) => digitCount(v) >= 13 && luhnValid(v), "Enter a valid card number"),
  expiry: z
    .string()
    .min(1, "Expiry is required")
    .regex(PATTERNS.expiry, "Use MM/YY")
    .refine((v) => expiryNotPast(v), "Card has expired"),
  cvc: z.string().min(1, "CVC is required").regex(PATTERNS.cvc, "Enter 3–4 digits"),
});
export type ContactForm = z.infer<typeof contactSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
