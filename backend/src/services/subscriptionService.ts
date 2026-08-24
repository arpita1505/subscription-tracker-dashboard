import prisma from "../prisma/client";
import { BillingCycle } from "../types";
import { normalizeToMonthly } from "./costUniformityEngine";
import { daysUntilRenewal, isRenewingSoon, systemCurrentDate } from "./dateIntersectCalculator";
import { SubscriptionInput } from "./subscriptionValidation";

export function enrichSubscription(subscription: {
  id: number;
  serviceName: string;
  cost: number;
  billingCycle: string;
  nextRenewalDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const billingCycle = subscription.billingCycle as BillingCycle;
  const days = daysUntilRenewal(subscription.nextRenewalDate, systemCurrentDate());

  return {
    ...subscription,
    monthlyCost: normalizeToMonthly(subscription.cost, billingCycle),
    daysUntilRenewal: days,
    isRenewingSoon: isRenewingSoon(days),
  };
}

export async function getAllSubscriptions() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { nextRenewalDate: "asc" },
  });
  return subscriptions.map(enrichSubscription);
}

export async function createSubscription(input: SubscriptionInput) {
  const created = await prisma.subscription.create({
    data: {
      serviceName: input.serviceName,
      cost: input.cost,
      billingCycle: input.billingCycle,
      nextRenewalDate: input.nextRenewalDate,
    },
  });
  return enrichSubscription(created);
}

export async function toggleSubscriptionActive(id: number) {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const updated = await prisma.subscription.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return enrichSubscription(updated);
}

export async function deleteSubscription(id: number) {
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  await prisma.subscription.delete({ where: { id } });
  return existing;
}
