import prisma from "../prisma/client";
import { calculateTotalMonthlyBurn } from "./costUniformityEngine";
import { daysUntilRenewal, isRenewingSoon, systemCurrentDate } from "./dateIntersectCalculator";

export async function getMetrics() {
  const subscriptions = await prisma.subscription.findMany();

  const totalMonthlyBurn = calculateTotalMonthlyBurn(
    subscriptions.map((sub) => ({
      cost: sub.cost,
      billingCycle: sub.billingCycle as "MONTHLY" | "YEARLY",
      isActive: sub.isActive,
    }))
  );

  const now = systemCurrentDate();
  const upcomingRenewalsCount = subscriptions.filter((sub) => {
    if (!sub.isActive) return false;
    const days = daysUntilRenewal(sub.nextRenewalDate, now);
    return isRenewingSoon(days);
  }).length;

  return { totalMonthlyBurn, upcomingRenewalsCount };
}
