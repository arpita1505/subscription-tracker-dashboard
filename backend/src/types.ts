export const BILLING_CYCLES = ["MONTHLY", "YEARLY"] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];
