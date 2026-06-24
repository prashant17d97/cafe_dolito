import { z } from "zod";

/**
 * Reusable field-level regex patterns. Each input is validated against the
 * format it is meant to accept — a phone field only accepts phone numbers, an
 * email field only a valid email, and so on.
 */
export const PATTERNS = {
  // Optional leading +, then digits with common separators (space, dash, dot, parens).
  phone: /^\+?[0-9][0-9\s().-]{5,18}[0-9]$/,
  // Letters (any script), spaces, apostrophes, hyphens and periods — no digits.
  name: /^\p{L}[\p{L}\s'.-]{0,59}$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  zip: /^\d{5}(-\d{4})?$/,
  cardNumber: /^\d{4} ?\d{4} ?\d{4} ?\d{4}$/,
  expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvc: /^\d{3,4}$/,
} as const;

/** Number of actual digits in a string, ignoring separators. */
export function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

export const nameSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .regex(PATTERNS.name, "Use letters only (no numbers)");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .regex(PATTERNS.email, "Enter a valid email address");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(PATTERNS.phone, "Enter a valid phone number")
  .refine((v) => digitCount(v) >= 7 && digitCount(v) <= 15, "Enter a valid phone number");

export const zipSchema = z
  .string()
  .trim()
  .regex(PATTERNS.zip, "Enter a valid ZIP code");
