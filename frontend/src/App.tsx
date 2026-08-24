import { useCallback, useEffect, useState } from "react";
import { createSubscription, fetchMetrics, fetchSubscriptions } from "./api/client";
import { MetricsCards } from "./components/MetricsCards";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { Metrics, Subscription } from "./types";

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      </main>
    </div>
  );
}

export default App;
