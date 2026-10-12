# Finance Manager

Personal finance tracker: bank accounts, credit-card invoices, category budgets, and investments.

Live: **[finance-manager-two-eta.vercel.app](https://finance-manager-two-eta.vercel.app/)**

Started with a small team at [FellasDevs](https://github.com/FellasDevs/Finance-Manager); continued solo. Auth is email/password or Google via Supabase. UI copy is Portuguese; code and database are English.

---

## Table of Contents

- [How it works](#how-it-works)
- [Stack](#stack)
- [Setup](#setup)
- [Commands](#commands)
- [Structure](#structure)
- [Deploy](#deploy)

---

## How it works

**Dashboard** — accounts and investments for the signed-in user.

**Bank account** (`/accounts/[id]`)

- Balance and a ledger of transactions (value, category, time).
- Credit-card **invoices** with due date, limit, paid flag, and the purchases on that bill.
- **Budgets** per invoice × purchase category.
- Charts for invoices, purchases, and transactions (ApexCharts).

**Investments** (`/investments/[id]`) — named positions with a time series of values (`investment_history`).

Purchase categories are per user and reused on transactions and invoice purchases.

## Stack

Next.js 14 (App Router) · TypeScript · tRPC · Drizzle ORM · Supabase (Postgres + Auth) · Tailwind · shadcn/ui · ApexCharts · Vercel.

## Setup

Needs Node 20+ and Yarn.

```bash
yarn
cp .env.example .env        # fill in (see below)
yarn dev                    # http://localhost:3000
```

Database: a Supabase project, or local Postgres via `./start-database.sh` (Docker). Apply the schema with `yarn db:push`.

On Supabase: enable email auth and the Google provider if you want OAuth.

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection (Drizzle) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public anon key (auth) |

## Commands

```bash
yarn dev          # dev server (turbo)
yarn build        # production build
yarn start        # run the build
yarn lint         # next lint

yarn db:push      # push schema (dev)
yarn db:studio    # Drizzle Studio
```

## Structure

```
src/
├── app/
│   ├── (auth)/           login, signup, Google OAuth callback
│   ├── (main)/           dashboard, accounts, investments
│   └── api/trpc/         tRPC HTTP handler
├── server/
│   ├── api/routers/      accounts, invoices, purchases, budgets,
│   │                     transactions, investments, categories, users
│   └── db/               Drizzle schema
└── trpc/                 client + server helpers
```

## Deploy

Vercel. Set the same env vars on the project. Point `DATABASE_URL` at production Postgres and run `yarn db:push` (or migrate) before the first deploy.
