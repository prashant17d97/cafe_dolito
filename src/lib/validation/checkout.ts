import { z } from "zod";
import { PATTERNS, nameSchema, emailSchema, phoneSchema, zipSchema } from "./patterns";

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
  cardNumber: z.string().regex(PATTERNS.cardNumber, "Enter a 16-digit card number"),
  expiry: z.string().regex(PATTERNS.expiry, "Use MM/YY"),
  cvc: z.string().regex(PATTERNS.cvc, "Enter 3–4 digits"),
});
export type ContactForm = z.infer<typeof contactSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
