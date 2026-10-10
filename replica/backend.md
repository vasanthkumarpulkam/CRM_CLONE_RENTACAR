# Backend Checklist

> `/replica-backend` — wires auth, database, and data layer to all 19 screens.

## Auth

- [x] Email + password sign-in via `supabase.auth.signInWithPassword`
- [x] Session via http-only secure cookies managed by `@supabase/ssr`
- [x] Middleware protects all routes: unauthenticated → `/login`, authenticated + `/login` → `/`
- [x] Sign-out clears session and redirects to `/login`
- [x] `getSessionUser()` resolves auth UID → CRM user row (with role, company_id)
- [ ] Password reset (email link) — not yet implemented

## Database

- [x] Schema: `schema.sql` committed at `replica/schema.sql` (27 tables, enums, indexes, RLS)
- [x] RLS enabled on all tables; `auth_company_id()` helper enforces multi-tenant isolation
- [x] `next_ra_number(p_company_id)` Postgres function generates sequential RA numbers
- [x] Seed script: `app/supabase/seed.sql` — company, locations, vehicle classes, vehicles (8), contacts (6), reservations (4), toll tags

## Data Layer

- [x] `src/lib/supabase/server.ts` — server client (cookie-based) + service client
- [x] `src/lib/supabase/client.ts` — browser client (for future client components)
- [x] `src/lib/supabase/types.ts` — TypeScript types matching schema
- [x] `src/lib/db.ts` — real Supabase queries replacing `data.ts` fake layer
  - [x] `getDashboardStats(today?)` — KPIs, fleet counts, utilization by class
  - [x] `getReservations(status?)` — with contact, vehicle, class, location joins
  - [x] `getReservation(id)` — single reservation
  - [x] `getVehicles(status?)` — with model, class, location joins
  - [x] `getVehicle(id)` — single vehicle
  - [x] `getContacts(category?)` — with reservation count
  - [x] `getContact(id)` — single contact
  - [x] `getVehicleClasses()` — ordered by order_index
  - [x] `getLocations()` — active only
  - [x] `createReservation(input)` — RPC ra_number, insert
  - [x] `updateReservationStatus(id, status)`
  - [x] `updateVehicleStatus(id, status)`
  - [x] `recordPickup(id, {odometer, fuel_level})`
  - [x] `recordReturn(id, {odometer, fuel_level, charge_fuel})`
  - [x] `recordPayment(data)` — insert + recalculate balance_due_cents
  - [x] `createContact(data)` — insert with company_id
- [x] All 14 pages updated from `@/lib/data` → `@/lib/db`
- [x] `new/page.tsx` refactored from client array import → server component passing props to client form

## Security Checklist

- [x] Secrets only in env vars (`.env.local`), `.env*` in `.gitignore`, nothing in client bundles
- [x] `.env.example` committed with all variable names and no values
- [x] Multi-tenant isolation: RLS on every table, `auth_company_id()` scopes all queries
- [x] Auth checked via middleware on every route
- [ ] Input validation with zod on server actions — pending
- [ ] Rate limits on auth endpoints — pending (use Supabase Auth rate limiting settings)
- [ ] `npm audit` clean — minor vulnerabilities from transitive deps (not in app code)

## Environment Variables

See `.env.example`. Required:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

## Setup Instructions

1. Create a Supabase project
2. Apply `replica/schema.sql` in the SQL editor
3. Create an admin user in Auth → Users
4. Edit `app/supabase/seed.sql` — replace the placeholder UUID with the admin user's UID
5. Run the seed SQL
6. Copy `.env.example` to `.env.local` and fill in values from the Supabase project settings

## Next Step

`/replica-test` — verify every screen against the Supabase backend, confirm RLS, and smoke test all mutations.
