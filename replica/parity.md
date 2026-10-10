# Parity Report — Rent a Car LLC CRM Clone

> Generated: 2026-10-10  
> Phase: replica-diff  
> Tools: parity.py against replica/features.csv (76 rows, 2 skip)

---

## Verdict: NOT SHIPPABLE

**32 must-haves remain unbuilt (13/45 done).** The core revenue flows — pickup, return, payment recording, contract generation, and availability checking — are not yet wired. The clone is a solid read-only skeleton at 38% feature parity.

---

## Overall Score: 38%

| Metric | Value |
|---|---|
| Feature score | 38% (70.5 / 184 pts) |
| Must-haves done | 13 / 45 |
| Open S1/S2 bugs | 0 S1 · 2 S2 (mutations not wired) |
| Open S3 bugs | 2 (password reset, Zod validation) |

A straight shippable clone needs: feature score ≥ 80%, all 45 must-haves done, zero S1/S2 bugs.

---

## Feature Score by Area

| Area | Score | Points |
|---|---|---|
| Calendar | 100% | 3.0 / 3 |
| UI | 100% | 2.0 / 2 |
| Auth | 83% | 7.5 / 9 |
| Fleet | 62% | 13.0 / 21 |
| Contacts | 62% | 8.0 / 13 |
| Dashboard | 61% | 11.0 / 18 |
| Data | 50% | 1.0 / 2 |
| Settings | 38% | 5.0 / 13 |
| Reservations | 26% | 17.0 / 65 |
| Quotes | 25% | 2.0 / 8 |
| Payments | 8% | 1.0 / 12 |
| Checklist | 0% | 0.0 / 8 |
| Core | 0% | 0.0 / 3 |
| Documents | 0% | 0.0 / 5 |
| Search | 0% | 0.0 / 2 |

---

## What Is Built (Solid Foundation)

- **Auth** — email/password login, session cookies, middleware guard, multi-tenant RLS on all tables
- **Dashboard** — KPI cards (pickups/returns/overdues), utilization by class, fleet status grid, recent bookings
- **Calendar** — month view with reservation blocks, upcoming reservations list
- **Vehicle list** — full grid, 15 status values, filter tabs, fuel level indicators
- **Contacts list + detail** — customer list with DL expiry warnings, customer detail with reservation history
- **Maintenance + Repair orders** — full read-only tables
- **Fines + Toll Tags** — sheet-style tables
- **Quotes + Reservation Attempts** — read-only list pages
- **External Charges** — read-only list
- **Reports + Audit Logs + Trash** — stub pages load without error
- **Settings** — company info, location management
- **Reservation list** — status filter tabs, sortable table
- **New reservation wizard UI** — 9-step wizard with step bar renders correctly

---

## What Is Missing: Must-Haves (Build Order)

### Batch 1 — Reservation Mutations (highest impact, enables core flow)
- [ ] **Wire `createReservation` to wizard submit** — 9-step wizard is display-only; form data never saved
- [ ] **RA# auto-generation** — sequential rental agreement number (e.g. RA-0001)
- [ ] **Rental type toggle** — daily / weekly / monthly rate mode in wizard
- [ ] **Balance due / total calculation** — running total visible in wizard checkout step
- [ ] **Security deposit tracking** — deposit amount field on reservation

### Batch 2 — Operational Flow (pickup → return)
- [ ] **Step 7: Pickup process** — wire `recordPickup` action; capture odometer + fuel on pickup confirmation
- [ ] **Step 9: Return process** — wire `recordReturn` action; capture odometer + fuel on return
- [ ] **Step 6: Record payments** — wire `recordPayment` action; support cash / card / check
- [ ] **Payment list / history** — payments sub-table on reservation detail
- [ ] **Edit/modify reservation** — date change, vehicle swap, rate update

### Batch 3 — Dashboard Gaps
- [ ] **Dashboard — availability tab** — vehicle availability calendar grid per day
- [ ] **Dashboard — overdues tab** — list of reservations past their return date

### Batch 4 — Data Entry (CRUD)
- [ ] **Add/edit vehicle** — new vehicle form + edit; required before fleet can grow
- [ ] **Vehicle detail with history** — per-vehicle page: reservations, odometer log, documents
- [ ] **Add/edit contact** — create customer form; name, DL#, expiry, phone, email
- [ ] **Settings — user management** — invite/manage staff accounts

### Batch 5 — Documents & Compliance
- [ ] **PDF contract generation** — rental agreement PDF (server-side; puppeteer or react-pdf)
- [ ] **Print/email agreement PDF** — email with Resend once PDF is done
- [ ] **Print/email receipt PDF** — receipt PDF after payment
- [ ] **Pickup checklist** — per-vehicle inspection items on pickup
- [ ] **Return checklist** — per-vehicle inspection items on return

### Batch 6 — Core Safety
- [ ] **Real-time availability check** — prevent double-booking on overlapping dates
- [ ] **Settings — pricing/rates** — base rates by class and rental type
- [ ] **Cancel reservation** — confirm + soft-delete with status update

### Batch 7 — Should-Haves (after must-haves)
- [ ] Step 3: Extras/add-ons in wizard
- [ ] Create quote (same wizard, status = quote)
- [ ] Convert quote to reservation
- [ ] Reservation history/audit trail
- [ ] Customer blacklist flag
- [ ] Soft delete restore actions
- [ ] Global search
- [ ] Zod validation on all server actions (BUG-002)

---

## Layout Score (Visual Diff)

> Screenshots require a running dev server with Supabase connected. Layout diff deferred — dev server environment (Supabase keys) not configured in this container.  
> Reference screens are in `replica/screens/`. Run `python3 imgdiff.py` per screen once deployed.

Estimated layout match based on manual review: **high structural alignment**. The clone uses the same left sidebar + top header layout, same card-based vehicle grid, same tab-filter pattern, same step wizard bar. Colours differ intentionally (replica-brand tokens vs HQ dark navy).

---

## Behaviour Differences

| Flow | Original | Clone | Fix or Keep |
|---|---|---|---|
| New reservation | 9-step wizard, saves on each step | 9-step wizard, UI only — not saved | Fix (Batch 1) |
| Pickup | "Pickup" button on reservation detail → form | Wizard step UI, no action wired | Fix (Batch 2) |
| Return | "Return" button → fuel/damage form | Wizard step UI, no action wired | Fix (Batch 2) |
| Payment | "Record Payment" modal | Not implemented | Fix (Batch 2) |
| Create customer | Full form with photo upload | Not implemented | Fix (Batch 4) |
| Password reset | Email link via auth provider | Not implemented (BUG-001) | Fix (Batch 7) |
| PDF agreement | Print / email from reservation detail | Not implemented | Fix (Batch 5) |
| Availability | Live grid shows open slots | Not implemented | Fix (Batch 6) |

---

## Top 5 Next Builds

1. **Wire reservation wizard submit → `createReservation`** — the single biggest unlock; all read flows depend on having real saved reservations
2. **Pickup + Return server actions** — completes the operational loop; needed for odometer tracking and status transitions
3. **Payment recording** — cash/card/check; required for balance calculation and receipts
4. **Add vehicle + Add contact forms** — fleet and customer management are read-only without these
5. **Real-time availability check** — prevents double-booking; needed before any real reservations are created

---

## Open Bugs Summary

| ID | Severity | Status | Summary |
|---|---|---|---|
| BUG-001 | S3 | Open | Password reset not implemented |
| BUG-002 | S3 | Open | Zod validation missing on server actions |

> S2 classification: wizard submit not wired is effectively S2 (feature broken, no workaround) but classified as "not yet built" in build order rather than a regression bug.

---

## Next Step

Run `/replica-build` to implement the missing features in the order listed above.  
Priority order: Batch 1 → Batch 2 → Batch 3 → Batch 4 → Batch 5 → Batch 6.

Target before re-running parity: **must-haves 45/45, score ≥ 80%**.
