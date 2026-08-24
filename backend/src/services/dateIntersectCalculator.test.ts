import { describe, expect, it } from "vitest";
import { daysUntilRenewal, isRenewingSoon } from "./dateIntersectCalculator";

describe("isRenewingSoon", () => {
  it("is true at the lower bound (0 days)", () => {
    expect(isRenewingSoon(0)).toBe(true);
  });

  it("is true at the upper bound (7 days)", () => {
    expect(isRenewingSoon(7)).toBe(true);
  });

  it("is false just below the lower bound (-1 days)", () => {
    expect(isRenewingSoon(-1)).toBe(false);
  });

  it("is false just above the upper bound (8 days)", () => {
    expect(isRenewingSoon(8)).toBe(false);
  });
});

describe("daysUntilRenewal", () => {
  const fixedNow = new Date(2026, 0, 15); // Jan 15, 2026

  it("returns 0 for a renewal on the fixed current date", () => {
    expect(daysUntilRenewal(new Date(2026, 0, 15), fixedNow)).toBe(0);
  });

  it("returns 7 for a renewal exactly 7 days out", () => {
    expect(daysUntilRenewal(new Date(2026, 0, 22), fixedNow)).toBe(7);
  });

  it("counts correctly across a month boundary", () => {
    const now = new Date(2026, 0, 30); // Jan 30, 2026
    const renewal = new Date(2026, 1, 2); // Feb 2, 2026
    expect(daysUntilRenewal(renewal, now)).toBe(3);
  });

  it("counts correctly across Feb 29 in a leap year", () => {
    const now = new Date(2024, 1, 27); // Feb 27, 2024 (2024 is a leap year)
    const renewal = new Date(2024, 2, 1); // Mar 1, 2024
    expect(daysUntilRenewal(renewal, now)).toBe(3);
  });

  it("ignores time-of-day when comparing dates", () => {
    const now = new Date(2026, 0, 15, 23, 59, 59);
    const renewal = new Date(2026, 0, 16, 0, 0, 1);
    expect(daysUntilRenewal(renewal, now)).toBe(1);
  });
});
