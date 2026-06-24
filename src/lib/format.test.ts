import { describe, expect, it } from "vitest";
import { formatPrice, formatDate, formatTime, formatLongDate, initials, pluralize } from "./format";

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
  it("formats a 24h time to 12h", () => {
    expect(formatTime("07:00")).toBe("7:00 AM");
    expect(formatTime("12:30")).toBe("12:30 PM");
    expect(formatTime("19:30")).toBe("7:30 PM");
    expect(formatTime("00:00")).toBe("12:00 AM");
  });
  it("formats a long date in local time", () => {
    expect(formatLongDate("2026-06-24")).toMatch(/June 24, 2026/);
  });
});
