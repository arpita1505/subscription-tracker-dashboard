import { describe, expect, it } from "vitest";
import { validateSubscriptionInput } from "./subscriptionValidation";

const validBody = {
  serviceName: "Netflix",
  cost: 15.99,
  billingCycle: "MONTHLY",
  nextRenewalDate: "2026-09-01",
};

describe("validateSubscriptionInput", () => {
  it("accepts a fully valid body", () => {
    const result = validateSubscriptionInput(validBody);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.data).toBeDefined();
  });

  it("rejects an empty serviceName", () => {
    const result = validateSubscriptionInput({ ...validBody, serviceName: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/serviceName/);
  });

  it("rejects a zero cost", () => {
    const result = validateSubscriptionInput({ ...validBody, cost: 0 });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cost/);
  });

  it("rejects a negative cost", () => {
    const result = validateSubscriptionInput({ ...validBody, cost: -5 });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/cost/);
  });

  it("rejects an invalid billingCycle", () => {
    const result = validateSubscriptionInput({ ...validBody, billingCycle: "WEEKLY" });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/billingCycle/);
  });

  it("rejects a malformed nextRenewalDate", () => {
    const result = validateSubscriptionInput({ ...validBody, nextRenewalDate: "not-a-date" });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/nextRenewalDate/);
  });
});
