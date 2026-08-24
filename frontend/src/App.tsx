import { useCallback, useEffect, useState } from "react";
import {
  createSubscription,
  deleteSubscription,
  fetchMetrics,
  fetchSubscriptions,
  toggleSubscription,
} from "./api/client";
import { MetricsCards } from "./components/MetricsCards";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionGrid } from "./components/SubscriptionGrid";
import type { Metrics, Subscription } from "./types";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [subs, m] = await Promise.all([fetchSubscriptions(), fetchMetrics()]);
      setSubscriptions(subs);
      setMetrics(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (input: Parameters<typeof createSubscription>[0]) => {
    await createSubscription(input);
    await loadData();
  };

  const handleToggle = async (id: number) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    setError(null);
    try {
      // Update just this row and re-pull metrics, rather than reloading the
      // whole list, so the row's grey-out and the burn rate card both move
      // as soon as the server confirms — no full-table re-render flicker.
      const updated = await toggleSubscription(id);
      setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? updated : sub)));
      setMetrics(await fetchMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle subscription.");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      setMetrics(await fetchMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete subscription.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Subscription Tracker & Renewal Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track recurring costs and see what's renewing soon.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 pb-16">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <MetricsCards metrics={metrics} />

        <SubscriptionForm onSubmit={handleCreate} />

        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && subscriptions.length === 0 && (
          <p className="text-sm text-slate-500">No subscriptions yet — add one above.</p>
        )}
        {!loading && subscriptions.length > 0 && (
          <SubscriptionGrid
            subscriptions={subscriptions}
            onToggle={handleToggle}
            onDelete={handleDelete}
            togglingIds={togglingIds}
          />
        )}
      </main>
    </div>
  );
}

export default App;
