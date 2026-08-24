import type { Metrics, NewSubscriptionInput, Subscription } from "../types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export function fetchSubscriptions(): Promise<Subscription[]> {
  return fetch("/api/subscriptions").then((res) => handleResponse<Subscription[]>(res));
}

export function createSubscription(input: NewSubscriptionInput): Promise<Subscription> {
  return fetch("/api/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then((res) => handleResponse<Subscription>(res));
}

export function toggleSubscription(id: number): Promise<Subscription> {
  return fetch(`/api/subscriptions/${id}/toggle`, { method: "PATCH" }).then((res) =>
    handleResponse<Subscription>(res)
  );
}

export function deleteSubscription(id: number): Promise<void> {
  return fetch(`/api/subscriptions/${id}`, { method: "DELETE" }).then((res) =>
    handleResponse<void>(res)
  );
}

export function fetchMetrics(): Promise<Metrics> {
  return fetch("/api/metrics").then((res) => handleResponse<Metrics>(res));
}
