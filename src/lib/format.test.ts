import { describe, expect, it } from "vitest";
import { formatPrice, formatDate, initials, pluralize } from "./format";

describe("format", () => {
  it("formats USD price", () => { expect(formatPrice(6.5)).toBe("$6.50"); });
  it("formats whole price", () => { expect(formatPrice(12)).toBe("$12.00"); });
  it("formats a date", () => { expect(formatDate("2026-06-23T10:00:00.000Z")).toMatch(/2026/); });
  it("derives initials", () => { expect(initials("Marco Rossi")).toBe("MR"); });
  it("pluralizes", () => {
    expect(pluralize(1, "table")).toBe("1 table");
    expect(pluralize(2, "table")).toBe("2 tables");
  });
  it("handles a single name", () => { expect(initials("Marco")).toBe("M"); });
});
