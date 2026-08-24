# Subscription Tracker & Renewal Dashboard

A full-stack dashboard for tracking recurring subscriptions, normalizing
their cost to a monthly burn rate, and flagging renewals coming up soon.

## Architecture

A monorepo with a strict frontend/backend split:

```
/backend   Node.js + Express + TypeScript + Prisma + SQLite
/frontend  React + TypeScript + Vite + Tailwind CSS
```

**All business logic lives on the server.** The frontend never computes the
burn rate, never computes days-until-renewal, and never decides what counts
as "renewing soon" — it only renders values the API already computed and
sends back. Every subscription returned by `GET /api/subscriptions` is
enriched server-side with `monthlyCost`, `daysUntilRenewal`, and
`isRenewingSoon` before it reaches the client.

Backend request flow: **routes → controllers → services → Prisma client.**
Route handlers only wire HTTP to controllers; controllers translate
HTTP ↔ domain objects; services hold all calculation and validation logic
and are the only layer that talks to Prisma.

```
backend/src/
  routes/          Express routers (HTTP wiring only)
  controllers/      request/response handling
  services/          business logic + Prisma access
    costUniformityEngine.ts
    dateIntersectCalculator.ts
    subscriptionService.ts
    subscriptionValidation.ts
    metricsService.ts
  prisma/client.ts   shared PrismaClient instance
  middleware/
  index.ts           Express app entry point

frontend/src/
  api/client.ts       fetch wrappers for the backend API
  components/         SubscriptionForm, MetricsCards, SubscriptionGrid
  types.ts
  App.tsx             top-level state + data flow
```

The Vite dev server proxies `/api/*` to the backend (`http://localhost:4000`)
so the frontend never has to deal with CORS in development
(see `frontend/vite.config.ts`).

## The two engine modules

### `costUniformityEngine.ts`

Normalizes subscriptions of different billing cycles onto a common monthly
basis so they can be summed meaningfully.

- `normalizeToMonthly(cost, billingCycle)` — `YEARLY` costs are divided by
  12, `MONTHLY` costs pass through unchanged. Result is rounded to 2
  decimal places.
- `calculateTotalMonthlyBurn(subscriptions)` — sums the normalized monthly
  cost of **active** subscriptions only. Paused subscriptions are excluded
  from the total but are never deleted from the database — toggling a
  subscription back to active restores it to the total immediately.

### `dateIntersectCalculator.ts`

Determines how many days remain until a subscription renews, and whether
that renewal counts as "soon."

- `daysUntilRenewal(nextRenewalDate, currentDate)` — exact whole days
  remaining. Both dates are stripped down to date-only (time component
  discarded) before comparison, so a renewal later today doesn't get
  rounded down to a false "0 days ago."
- `isRenewingSoon(days)` — `true` when `0 <= days <= 7`.
- Both functions accept the "current date" as an explicit parameter rather
  than reading `Date.now()`/`new Date()` internally (`systemCurrentDate` is
  the default source used at the call site in production code). This keeps
  the logic pure and trivially testable against a fixed date.

## API

All endpoints are mounted under `/api`.

| Method | Path                             | Description |
|--------|-----------------------------------|--------------|
| GET    | `/api/subscriptions`              | List every subscription, enriched with `monthlyCost`, `daysUntilRenewal`, `isRenewingSoon` |
| POST   | `/api/subscriptions`              | Create a subscription (server-side validated) |
| PATCH  | `/api/subscriptions/:id/toggle`   | Flip `isActive`; returns the updated row |
| DELETE | `/api/subscriptions/:id`          | Delete a subscription |
| GET    | `/api/metrics`                    | `{ totalMonthlyBurn, upcomingRenewalsCount }` |

### `POST /api/subscriptions` body

```json
{
  "serviceName": "Netflix",
  "cost": 15.49,
  "billingCycle": "MONTHLY",
  "nextRenewalDate": "2026-09-01"
}
```

Validation (400 with a descriptive `message` on failure):
- `serviceName` — required, non-empty string
- `cost` — required, positive number
- `billingCycle` — required, must be `MONTHLY` or `YEARLY`
- `nextRenewalDate` — required, must parse to a valid date

> SQLite has no native enum type in Prisma, so `billingCycle` is stored as
> a `String` column and constrained to `MONTHLY | YEARLY` entirely by this
> server-side validation — the frontend never invents or checks this rule
> itself.

## Setup

Requires Node.js 18+.

```bash
# One-time setup
cd backend && npm install && npm run prisma:migrate && npm run seed && cd ..
cd frontend && npm install && cd ..
npm install    # installs `concurrently` at the repo root

# Run both servers together
npm run dev    # backend on http://localhost:4000, frontend on http://localhost:5173 (or next free port)
```

`npm run dev` at the repo root uses `concurrently` to run the backend and
frontend dev servers in one terminal, labeled `[backend]`/`[frontend]`. To
run them separately instead (e.g. in two terminals), use `npm run dev`
inside `backend/` and `frontend/` respectively.

Open the frontend URL — the Vite dev server proxies API calls to the
backend automatically.

### Tests

```bash
npm test    # from the repo root — runs the backend vitest suite
```

### Other useful commands

```bash
# Backend
npm run build      # compile TypeScript to dist/
npm start           # run the compiled server
npm run prisma:generate

# Frontend
npm run build       # production build
npm run preview      # preview the production build
```

## Seed data

`backend/prisma/seed.ts` seeds 8 realistic subscriptions (Netflix, Spotify,
AWS, Figma, Notion, GitHub Copilot, Adobe Creative Cloud, 1Password) with a
mix of `MONTHLY`/`YEARLY` billing cycles. Three of them (Netflix, AWS,
Notion) are dated within the next 7 days so the "Renewing Soon" badge is
visible immediately on load. GitHub Copilot is seeded paused (`isActive:
false`) to demonstrate the burn-rate exclusion. Re-run `npm run seed` at
any time to reset the data (it clears the table first).
