import { BillingCycle } from "../types";

/**
 * Normalizes a subscription cost to its monthly equivalent.
 * YEARLY costs are divided by 12; MONTHLY costs pass through unchanged.
 * Result is rounded to 2 decimal places.
 */
export function normalizeToMonthly(cost: number, billingCycle: BillingCycle): number {
  const monthly = billingCycle === "YEARLY" ? cost / 12 : cost;
  return Math.round(monthly * 100) / 100;
}

interface BurnableSubscription {
  cost: number;
  billingCycle: BillingCycle;
  isActive: boolean;
}

/**
 * Sums the normalized monthly cost of active subscriptions only.
 * Paused (isActive === false) subscriptions are excluded from the total
 * but are not otherwise modified or removed.
 */
export function calculateTotalMonthlyBurn(subscriptions: BurnableSubscription[]): number {
  const total = subscriptions
    .filter((sub) => sub.isActive)
    .reduce((sum, sub) => sum + normalizeToMonthly(sub.cost, sub.billingCycle), 0);

  return Math.round(total * 100) / 100;
}
