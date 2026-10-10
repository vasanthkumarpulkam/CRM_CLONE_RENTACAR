# Bug Report — Rent a Car LLC CRM Clone

> Format: ID · Severity · Status · Summary
> Severity: S1 data-loss/security | S2 feature broken | S3 broken with workaround | S4 cosmetic

---

## Open Bugs

### BUG-001 · S3 · Open — Password reset not implemented

**Flow:** Auth  
**Steps:**
1. Navigate to `/login`
2. Click "Forgot password" (if link present)

**Expected:** Email reset link sent  
**Actual:** Feature not wired; email integration not set up (Resend keys not configured in this environment)  
**Evidence:** `replica/backend.md` — `[ ] Password reset (email link) — not yet implemented`  
**Fix:** Implement Supabase Auth `resetPasswordForEmail` flow and add a `/reset-password` page.

---

### BUG-002 · S3 · Open — Zod input validation not on server actions

**Flow:** All forms (New Reservation, New Contact, Record Payment)  
**Steps:**
1. Submit a form with unexpected input (e.g. negative amount, SQL injection attempt)

**Expected:** Server-side validation error returned cleanly  
**Actual:** Input reaches Supabase queries without server-side validation; Supabase constraint errors bubble as raw exceptions  
**Evidence:** `replica/backend.md` — `[ ] Input validation with zod on server actions — pending`  
**Fix:** Add Zod schemas to all server actions; parse before calling db functions.

---

### BUG-003 · S4 · Fixed — Vehicle card label uses `v.make` and `v.model` but seed data stores label in `label` field

**Flow:** F04 — Fleet Vehicles  
**Steps:**
1. Navigate to `/fleets/vehicles`
2. Vehicle card shows `{year} {make} {model}` (e.g. "2022 undefined undefined")

**Expected:** "2022 Toyota Corolla"  
**Actual:** `make` and `model` are not direct columns on the vehicles table — they come from a join on `vehicle_models`. The `getVehicles()` query returns `label` (e.g. "2022 Toyota Corolla") but the page template uses `v.year v.make v.model`.  
**Evidence:** `app/src/app/(app)/fleets/vehicles/page.tsx` line 101: `{v.year} {v.make} {v.model}` vs `db.ts` `getVehicles()` returning `label` and `key`.  
**Fix:** Update vehicle card to use `v.label` instead of `{v.year} {v.make} {v.model}`, or add make/model join to `getVehicles()` query.

---

## To Check (Not Yet Reproduced)

- Signature pad (canvas) works on touch devices
- PDF generation (Agreement / Receipt) — feature not yet implemented, needs library (e.g. react-pdf or server-side puppeteer)
- Calendar blocks may overflow on narrow viewports — needs visual test
- Reservation step progress indicator active state on mobile

---

## Fixed Bugs (from backend phase)

| ID | Severity | Fix commit | Summary |
|---|---|---|---|
| FIX-001 | S2 | backend phase | `createServiceClient` used `require()` instead of ES import — TypeScript error |
| FIX-002 | S2 | backend phase | Supabase `createClient<Database>()` generic produced `never` types; wrapped with `any` cast |
| FIX-003 | S2 | backend phase | `STATUS_LABELS` and `STATUS_BADGE` in vehicles page missing 10 of 15 `VehicleStatus` enum values — TypeScript error |
| FIX-004 | S2 | backend phase | `new/page.tsx` imported non-existent array exports from `db.ts` — refactored to server component + client form |
| FIX-005 | S4 | test phase | Vehicle card used `v.make`/`v.model` (undefined for seed data); now uses `v.label` column with make/model fallback |
