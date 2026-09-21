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
  cardNumber: /^\d{4}( ?\d{4}){2}( ?\d{1,7})?$/,
  expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvc: /^\d{3,4}$/,
} as const;

/** Number of actual digits in a string, ignoring separators. */
export function digitCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

/** Digits only, max 15 (E.164 length). */
export function formatPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

/** Uppercases the first letter of each word; leaves the rest as typed ("mc donald" → "Mc Donald"). */
export function formatName(value: string): string {
  return value.replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** "4242424242424242" → "4242 4242 4242 4242"; strips non-digits, max 19 digits. */
export function formatCardNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "0827" → "08/27"; strips non-digits, max 4 digits, month clamped to 01–12 ("9" → "09", "13" → "1"). */
export function formatExpiry(value: string): string {
  let d = value.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 1 && Number(d[0]) > 1) d = `0${d}`.slice(0, 4);
  if (d.length >= 2 && (Number(d.slice(0, 2)) > 12 || d.slice(0, 2) === "00")) d = d[0];
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** Luhn checksum over the digits of a card number. */
export function luhnValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** MM/YY is this month or later. */
export function expiryNotPast(value: string, now = new Date()): boolean {
  const [mm, yy] = value.split("/").map(Number);
  return yy * 100 + mm >= (now.getFullYear() % 100) * 100 + now.getMonth() + 1;
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
