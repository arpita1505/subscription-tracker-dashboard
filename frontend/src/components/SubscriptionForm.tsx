import { FormEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { BillingCycle } from "../types";

interface SubscriptionFormProps {
  onSubmit: (input: {
    serviceName: string;
    cost: number;
    billingCycle: BillingCycle;
    nextRenewalDate: string;
  }) => Promise<void>;
}

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
  const [serviceName, setServiceName] = useState("");
  const [cost, setCost] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [nextRenewalDate, setNextRenewalDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nextRenewalDate) {
      setError("Please choose a next renewal date.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        serviceName,
        cost: Number(cost),
        billingCycle,
        nextRenewalDate: nextRenewalDate.toISOString(),
      });
      setServiceName("");
      setCost("");
      setBillingCycle("MONTHLY");
      setNextRenewalDate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add subscription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="serviceName" className="text-sm font-medium text-slate-600">
          Service Name
        </label>
        <input
          id="serviceName"
          type="text"
          required
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Netflix"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cost" className="text-sm font-medium text-slate-600">
          Cost
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            $
          </span>
          <input
            id="cost"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="15.99"
            className="w-full rounded-lg border border-slate-300 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="billingCycle" className="text-sm font-medium text-slate-600">
          Billing Cycle
        </label>
        <select
          id="billingCycle"
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="nextRenewalDate" className="text-sm font-medium text-slate-600">
          Next Renewal Date
        </label>
        <DatePicker
          id="nextRenewalDate"
          selected={nextRenewalDate}
          onChange={(date) => setNextRenewalDate(date)}
          placeholderText="Select a date"
          dateFormat="MMM d, yyyy"
          minDate={new Date()}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add Subscription"}
        </button>
      </div>

      {error && (
        <p className="col-span-full text-sm font-medium text-red-600">{error}</p>
      )}
    </form>
  );
}
