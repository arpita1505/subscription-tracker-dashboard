export type BillingCycle = "MONTHLY" | "YEARLY";

export interface Subscription {
  id: number;
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  monthlyCost: number;
  daysUntilRenewal: number;
  isRenewingSoon: boolean;
}

export interface Metrics {
  totalMonthlyBurn: number;
  upcomingRenewalsCount: number;
}

export interface NewSubscriptionInput {
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
}
