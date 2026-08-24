import { BILLING_CYCLES, BillingCycle } from "../types";

export interface SubscriptionInput {
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: Date;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: SubscriptionInput;
}

export function validateSubscriptionInput(body: any): ValidationResult {
  const errors: string[] = [];

  const serviceName = typeof body?.serviceName === "string" ? body.serviceName.trim() : "";
  if (!serviceName) {
    errors.push("serviceName is required and must be a non-empty string.");
  }

  const cost = typeof body?.cost === "number" ? body.cost : Number(body?.cost);
  if (typeof body?.cost === "undefined" || Number.isNaN(cost) || cost <= 0) {
    errors.push("cost is required and must be a positive number.");
  }

  const billingCycle = typeof body?.billingCycle === "string" ? body.billingCycle.toUpperCase() : "";
  if (!BILLING_CYCLES.includes(billingCycle as BillingCycle)) {
    errors.push(`billingCycle is required and must be one of: ${BILLING_CYCLES.join(", ")}.`);
  }

  const nextRenewalDate = new Date(body?.nextRenewalDate);
  if (!body?.nextRenewalDate || Number.isNaN(nextRenewalDate.getTime())) {
    errors.push("nextRenewalDate is required and must be a valid date.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      serviceName,
      cost,
      billingCycle: billingCycle as BillingCycle,
      nextRenewalDate,
    },
  };
}
