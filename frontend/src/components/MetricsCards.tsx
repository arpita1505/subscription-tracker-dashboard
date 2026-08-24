import type { Metrics } from "../types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface MetricsCardsProps {
  metrics: Metrics | null;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Total Monthly Burn Rate</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 transition-all duration-300">
          {metrics ? currencyFormatter.format(metrics.totalMonthlyBurn) : "—"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Upcoming Renewals Alert</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
          {metrics ? metrics.upcomingRenewalsCount : "—"}
        </p>
      </div>
    </div>
  );
}
