import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP"),
});

export const paymentSchema = z.object({
  cardName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, "Enter a 16-digit card"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "3–4 digits"),
});
export type ContactForm = z.infer<typeof contactSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type PaymentForm = z.infer<typeof paymentSchema>;
