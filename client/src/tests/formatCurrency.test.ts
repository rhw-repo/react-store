import { describe, expect, it } from "vitest";
import { formatCurrency } from "../utilities/formatCurrency";

describe("formatCurrency", () => {
  it("shows the euro symbol", () => {
    expect(formatCurrency(10)).toContain("€");
  });

  it("formats a whole number with two decimals", () => {
    expect(formatCurrency(10)).toBe("€10.00");
  });

  it("adds a thousands separator and pads the decimals", () => {
    expect(formatCurrency(1234.5)).toBe("€1,234.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("€0.00");
  });
});
