import { describe, expect, it } from "vitest";
import { calculateTotalMonthlyBurn, normalizeToMonthly } from "./costUniformityEngine";

describe("normalizeToMonthly", () => {
  it("passes MONTHLY cost through unchanged", () => {
    expect(normalizeToMonthly(15.99, "MONTHLY")).toBe(15.99);
  });

  it("divides YEARLY cost by 12", () => {
    expect(normalizeToMonthly(120, "YEARLY")).toBe(10);
  });

  it("rounds to 2 decimal places", () => {
    expect(normalizeToMonthly(100, "YEARLY")).toBe(8.33);
  });
});

describe("calculateTotalMonthlyBurn", () => {
  it("sums normalized monthly cost of active subscriptions only", () => {
    const total = calculateTotalMonthlyBurn([
      { cost: 15.99, billingCycle: "MONTHLY", isActive: true },
      { cost: 120, billingCycle: "YEARLY", isActive: true },
    ]);
    expect(total).toBe(25.99);
  });

  it("excludes paused subscriptions from the total", () => {
    const total = calculateTotalMonthlyBurn([
      { cost: 15.99, billingCycle: "MONTHLY", isActive: true },
      { cost: 120, billingCycle: "YEARLY", isActive: false },
    ]);
    expect(total).toBe(15.99);
  });

  it("returns 0 when all subscriptions are paused", () => {
    const total = calculateTotalMonthlyBurn([
      { cost: 15.99, billingCycle: "MONTHLY", isActive: false },
      { cost: 120, billingCycle: "YEARLY", isActive: false },
    ]);
    expect(total).toBe(0);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateTotalMonthlyBurn([])).toBe(0);
  });
});
