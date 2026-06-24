import { describe, expect, it } from "vitest";
import { PATTERNS, digitCount, nameSchema, emailSchema, phoneSchema, zipSchema } from "./patterns";

describe("validation patterns", () => {
  it("accepts valid phone numbers", () => {
    for (const v of ["+1 (503) 555-0142", "503-555-0142", "5035550142", "+44 20 7946 0958"]) {
      expect(phoneSchema.safeParse(v).success, v).toBe(true);
    }
  });
  it("rejects invalid phone numbers", () => {
    for (const v of ["", "abc", "12345", "phone: 555", "+", "555-CALL"]) {
      expect(phoneSchema.safeParse(v).success, v).toBe(false);
    }
  });

  it("accepts valid emails", () => {
    for (const v of ["a@b.co", "marco.rossi@cafe.com", "x+tag@sub.domain.io"]) {
      expect(emailSchema.safeParse(v).success, v).toBe(true);
    }
  });
  it("rejects invalid emails", () => {
    for (const v of ["", "no-at", "a@b", "a@@b.com", "a b@c.com"]) {
      expect(emailSchema.safeParse(v).success, v).toBe(false);
    }
  });

  it("accepts names with letters/accents/marks", () => {
    for (const v of ["Marco", "María José", "O'Brien", "Jean-Luc", "Дарья"]) {
      expect(nameSchema.safeParse(v).success, v).toBe(true);
    }
  });
  it("rejects names with digits or symbols", () => {
    for (const v of ["", "John3", "a@b", "123"]) {
      expect(nameSchema.safeParse(v).success, v).toBe(false);
    }
  });

  it("validates ZIP codes", () => {
    expect(zipSchema.safeParse("97204").success).toBe(true);
    expect(zipSchema.safeParse("97204-1234").success).toBe(true);
    expect(zipSchema.safeParse("9720").success).toBe(false);
  });

  it("counts digits ignoring separators", () => {
    expect(digitCount("+1 (503) 555-0142")).toBe(11);
    expect(digitCount("no digits")).toBe(0);
  });

  it("matches card patterns", () => {
    expect(PATTERNS.cardNumber.test("4242 4242 4242 4242")).toBe(true);
    expect(PATTERNS.cardNumber.test("4242424242424242")).toBe(true);
    expect(PATTERNS.expiry.test("08/27")).toBe(true);
    expect(PATTERNS.expiry.test("13/27")).toBe(false);
    expect(PATTERNS.cvc.test("123")).toBe(true);
    expect(PATTERNS.cvc.test("12")).toBe(false);
  });
});
