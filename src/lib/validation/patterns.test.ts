import { describe, expect, it } from "vitest";
import { PATTERNS, digitCount, expiryNotPast, formatCardNumber, formatExpiry, formatName, formatPhone, luhnValid, nameSchema, emailSchema, phoneSchema, zipSchema } from "./patterns";

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

  it("formats card number and expiry as you type", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatCardNumber("4242-4242 42ab")).toBe("4242 4242 42");
    expect(formatCardNumber("1".repeat(25))).toBe("1111 1111 1111 1111 111");
    expect(formatExpiry("0827")).toBe("08/27");
    expect(formatExpiry("08")).toBe("08");
    expect(formatExpiry("08/2")).toBe("08/2");
    expect(formatExpiry("9")).toBe("09");
    expect(formatExpiry("13")).toBe("1");
    expect(formatExpiry("00")).toBe("0");
    expect(formatExpiry("12")).toBe("12");
    expect(formatExpiry("1327")).toBe("1");
  });

  it("formats phone as digits only and capitalises names", () => {
    expect(formatPhone("+1 (503) 555-0142abc")).toBe("15035550142");
    expect(formatPhone("1".repeat(20))).toBe("1".repeat(15));
    expect(formatName("marco rossi")).toBe("Marco Rossi");
    expect(formatName("jean-luc o'brien")).toBe("Jean-Luc O'Brien");
    expect(formatName("McDonald")).toBe("McDonald");
    expect(formatName("maría josé")).toBe("María José");
  });

  it("checks luhn and expiry date", () => {
    expect(luhnValid("4242 4242 4242 4242")).toBe(true);
    expect(luhnValid("4242 4242 4242 4241")).toBe(false);
    expect(luhnValid("")).toBe(false);
    const now = new Date(2026, 8, 21);
    expect(expiryNotPast("09/26", now)).toBe(true);
    expect(expiryNotPast("08/26", now)).toBe(false);
    expect(expiryNotPast("01/27", now)).toBe(true);
  });
});
