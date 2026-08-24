import prisma from "../src/prisma/client";

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.subscription.deleteMany();

  await prisma.subscription.createMany({
    data: [
      {
        serviceName: "Netflix",
        cost: 15.49,
        billingCycle: "MONTHLY",
        nextRenewalDate: daysFromNow(3),
      },
      {
        serviceName: "Spotify",
        cost: 11.99,
        billingCycle: "MONTHLY",
        nextRenewalDate: daysFromNow(21),
      },
      {
        serviceName: "AWS",
        cost: 480,
        billingCycle: "YEARLY",
        nextRenewalDate: daysFromNow(6),
      },
      {
        serviceName: "Figma",
        cost: 144,
        billingCycle: "YEARLY",
        nextRenewalDate: daysFromNow(45),
      },
      {
        serviceName: "Notion",
        cost: 10,
        billingCycle: "MONTHLY",
        nextRenewalDate: daysFromNow(1),
      },
      {
        serviceName: "GitHub Copilot",
        cost: 10,
        billingCycle: "MONTHLY",
        nextRenewalDate: daysFromNow(15),
        isActive: false,
      },
      {
        serviceName: "Adobe Creative Cloud",
        cost: 599.88,
        billingCycle: "YEARLY",
        nextRenewalDate: daysFromNow(60),
      },
      {
        serviceName: "1Password",
        cost: 35.88,
        billingCycle: "YEARLY",
        nextRenewalDate: daysFromNow(90),
      },
    ],
  });

  console.log("Seeded 8 subscriptions.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
