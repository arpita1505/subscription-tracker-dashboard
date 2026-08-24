import { Subscription } from "../types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface SubscriptionGridProps {
  subscriptions: Subscription[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  togglingIds: Set<number>;
}

export function SubscriptionGrid({
  subscriptions,
  onToggle,
  onDelete,
  togglingIds,
}: SubscriptionGridProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["Service", "Cost", "Billing Cycle", "Next Renewal", "Days Left", "Status", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subscriptions.map((sub) => (
            <tr
              key={sub.id}
              className={`transition-all duration-300 ${
                sub.isRenewingSoon && sub.isActive ? "bg-amber-50" : ""
              } ${!sub.isActive ? "opacity-50" : "opacity-100"}`}
            >
              <td className={`px-4 py-3 font-medium ${!sub.isActive ? "text-slate-400" : "text-slate-900"}`}>
                {sub.serviceName}
              </td>
              <td className={`px-4 py-3 ${!sub.isActive ? "text-slate-400" : "text-slate-700"}`}>
                {currencyFormatter.format(sub.cost)}
              </td>
              <td className={`px-4 py-3 ${!sub.isActive ? "text-slate-400" : "text-slate-700"}`}>
                {sub.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
              </td>
              <td className={`px-4 py-3 ${!sub.isActive ? "text-slate-400" : "text-slate-700"}`}>
                {dateFormatter.format(new Date(sub.nextRenewalDate))}
              </td>
              <td className={`px-4 py-3 ${!sub.isActive ? "text-slate-400" : "text-slate-700"}`}>
                {sub.daysUntilRenewal}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sub.isActive}
                    disabled={togglingIds.has(sub.id)}
                    onClick={() => onToggle(sub.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                      sub.isActive ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                        sub.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={sub.isActive ? "text-slate-700" : "text-slate-400"}>
                    {sub.isActive ? "Active" : "Paused"}
                  </span>
                  {sub.isRenewingSoon && sub.isActive && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Renewing Soon
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(sub.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
