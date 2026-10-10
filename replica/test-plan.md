# Test Plan — Rent a Car LLC CRM Clone

Generated: 2026-10-10
Flows from: `replica/recon.md`
Test env: `http://localhost:3000` (Next.js dev server + Supabase backend)
Seed data: `app/supabase/seed.sql` — company, 3 locations, 8 vehicle classes, 8 vehicles, 6 contacts, 4 reservations

---

## Legend

- **H** = Happy path
- **E** = Edge case
- **N** = Negative / error case
- Severity (bugs): S1 data-loss/security, S2 feature broken, S3 broken with workaround, S4 cosmetic

---

## F01 – New Reservation (9-Step Wizard)

**Happy path F01-H1:** Sign in → click "New Reservation" from the dashboard or reservations list → complete all 9 steps → reservation is confirmed with RA number, customer attached, vehicle class selected.

Steps:
1. Step 1 (Dates): pick pickup date tomorrow, return date +30 days, same location for both → Next
2. Step 2 (Vehicles): select Mid-Size class → Next
3. Step 3 (Features): leave extras empty → Next
4. Step 4 (Customer): pick "Maria Gonzalez" from autocomplete → Next
5. Step 5 (Confirm): review displayed data, click "Confirm Reservation"
6. Steps 6-9: skip for happy path (reservation visible in list with status "confirmed")

Expected: Reservation row appears in `/car-rental/reservations` with RA-XXXXX, customer name, date range, status "confirmed".

### Edge Cases

| ID | Scenario |
|---|---|
| F01-E1 | Empty date fields — clicking Next on Step 1 with no dates shows inline validation |
| F01-E2 | Return date before pickup date — validation error |
| F01-E3 | Very long customer name (60+ chars) — truncates gracefully in step 5 summary and reservation list |
| F01-E4 | Emoji in Comments field (e.g. "Test 🚗 note") — saves and re-displays correctly |
| F01-E5 | No vehicles available in selected class — Step 2 shows "0 available" but still allows selection |
| F01-E6 | Double-click "Confirm Reservation" — does not create duplicate |
| F01-E7 | Back button mid-wizard (Step 4 → Step 3) — preserves entered data |
| F01-E8 | Refresh on Step 3 — returns to step or shows consistent state |
| F01-E9 | Mobile width (390px) — all wizard steps readable, inputs accessible |
| F01-E10 | Keyboard-only navigation through entire wizard |

### Negative Cases

| ID | Scenario |
|---|---|
| F01-N1 | Attempt to access `/car-rental/reservations/new` unauthenticated — redirected to `/login` |
| F01-N2 | Step 5 with no customer selected — cannot confirm, error shown |

---

## F02 – Quick Pickup from Dashboard

**Happy path F02-H1:** Dashboard → Quick Pickup search → type RA number or customer name → matching reservation appears → click "Pickup" → Step 7 form → fill odometer and fuel level → click "Update pick up information" → vehicle status changes to "on_rent", reservation status to "active".

### Edge Cases

| ID | Scenario |
|---|---|
| F02-E1 | Search with partial name match — results filter in real time |
| F02-E2 | Search with RA number (e.g. "RA-00001") |
| F02-E3 | Odometer input of 0 |
| F02-E4 | Odometer value lower than current vehicle odometer — warning or error shown |
| F02-E5 | Mobile width — pickup form usable |

### Negative Cases

| ID | Scenario |
|---|---|
| F02-N1 | Try to pick up a reservation with status "pending" — requires confirmation first |
| F02-N2 | Try to pick up an already picked-up reservation |

---

## F03 – Daily Manifest

**Happy path F03-H1:** Dashboard → "Daily Manifest" tab → today's pickups and returns listed with customer name, RA, vehicle, time. Clicking a row navigates to the reservation.

### Edge Cases

| ID | Scenario |
|---|---|
| F03-E1 | Day with no pickups or returns — shows empty state message |
| F03-E2 | Mobile — table is scrollable or cards shown |
| F03-E3 | Overdue returns listed in red or distinct indicator |

---

## F04 – View Fleet / Vehicle Status

**Happy path F04-H1:** `/fleets/vehicles` → all 8 seeded vehicles shown as cards → filter tab "Available" → only available vehicles shown → click vehicle → vehicle detail/edit screen loads.

### Edge Cases

| ID | Scenario |
|---|---|
| F04-E1 | Filter: "Dirty" tab — shows only dirty vehicles |
| F04-E2 | Filter: "On Rent" — shows only on_rent vehicles |
| F04-E3 | 0 vehicles match filter — empty state shown |
| F04-E4 | Vehicle with very long label (60 chars) — truncates in card |
| F04-E5 | Mobile — grid stacks to single column |

### Negative Cases

| ID | Scenario |
|---|---|
| F04-N1 | Access `/fleets/vehicles` unauthenticated → redirect to `/login` |

---

## F05 – Contact Lookup / Add

**Happy path F05-H1:** `/contacts/category/3` → list of 5 seeded customers → search "Maria" → only Maria Gonzalez shown → click row → detail view shows DL, email, phone.

**Happy path F05-H2 (Add):** Click "New Contact" → fill first name, last name, email, phone → Save → appears in list.

### Edge Cases

| ID | Scenario |
|---|---|
| F05-E1 | Search for non-existent customer — empty state |
| F05-E2 | Create contact with missing required fields — inline validation |
| F05-E3 | Duplicate email address — system accepts or shows conflict |
| F05-E4 | Very long name (60 chars) — saved and displayed |
| F05-E5 | Mobile — table scrolls horizontally or stacks |

### Negative Cases

| ID | Scenario |
|---|---|
| F05-N1 | Access contacts unauthenticated → redirect to login |

---

## F06 – Record Payment

**Happy path F06-H1:** Open an active reservation (RA-00002) → Step 6 (Payments) → "Add Offline Payment" → enter amount, method, date → Save → balance due updates, payment appears in list.

### Edge Cases

| ID | Scenario |
|---|---|
| F06-E1 | Amount = 0 — validation error |
| F06-E2 | Amount > balance due — allowed (overpayment) or error |
| F06-E3 | Double-click Save — does not record duplicate payment |

### Negative Cases

| ID | Scenario |
|---|---|
| F06-N1 | Record payment on returned reservation — error or disabled |

---

## F07 – Process Return

**Happy path F07-H1:** Open active reservation (RA-00002) → Step 9 (Return) → fill Fuel at Return, Odometer at Return, Return Date → "Confirm Return" → reservation status → "returned", vehicle status → dirty (or available).

### Edge Cases

| ID | Scenario |
|---|---|
| F07-E1 | Odometer at return less than odometer at pickup — warning |
| F07-E2 | Return date before pickup date — validation error |
| F07-E3 | Charge fuel toggle → fuel charge appears in totals |
| F07-E4 | Early return with "Recalculate charges" toggle on |

### Negative Cases

| ID | Scenario |
|---|---|
| F07-N1 | Attempt return on already-returned reservation |

---

## F08 – Calendar View

**Happy path F08-H1:** `/car-rental/calendar` → default view (month) → seeded reservations appear as blocks on correct dates → switch to Week view → same reservations visible.

### Edge Cases

| ID | Scenario |
|---|---|
| F08-E1 | Navigate to next month — blocks shift appropriately |
| F08-E2 | Month with no reservations — empty but calendar renders |
| F08-E3 | Mobile — calendar is readable/scrollable |

---

## F09 – Quotes

**Happy path F09-H1:** `/car-rental/quotes` → list loads (may be empty with seed data) → page title and table headers visible → "New Quote" or similar action available.

### Edge Cases

| ID | Scenario |
|---|---|
| F09-E1 | Empty quotes list — shows empty state |

---

## F10 – Reservation Attempts

**Happy path F10-H1:** `/car-rental/reservation-attempts` → table visible with headers (Email, Phone, Locations, Dates, Contact, Type, Branch, Available Vehicles, Class, Last Step) → may be empty with seed data.

### Edge Cases

| ID | Scenario |
|---|---|
| F10-E1 | Empty list — empty state shown |

---

## F11 – Maintenance List

**Happy path F11-H1:** `/fleets/maintenance` → table loads with headers (Vehicle, Type, Interval, Planned Start/End, Odometer Due, Current Odometer, Status, Vehicle Status) → may be empty with seed data.

### Edge Cases

| ID | Scenario |
|---|---|
| F11-E1 | Empty list — empty state shown |

---

## F12 – Repair Orders

**Happy path F12-H1:** `/fleets/repair-orders` → table loads with headers and status tabs (All / Due This Week) → may be empty with seed data.

---

## F13 – Fines (External Sheet 1)

**Happy path F13-H1:** `/sheets/1/items` → Fines table loads with headers (Fine Number, Fine Type, Vehicle Plate, Date of Fine, Date & Time of Offense, Paid to Authority) → empty state shown with seed data.

---

## F14 – Toll Tags (External Sheet 2)

**Happy path F14-H1:** `/sheets/2/items` → Toll Tags table loads → 3 seeded tags (SUN-4821001, SUN-4821002, SUN-4821003) visible.

### Edge Cases

| ID | Scenario |
|---|---|
| F14-E1 | Add new toll tag — row appears |

---

## F15 – Reports

**Happy path F15-H1:** `/reports` → report catalog lists available report types → clicking a report type navigates or shows the report.

---

## F16 – Audit Logs

**Happy path F16-H1:** `/audits` → table loads with user, method, event count, path, date columns → at minimum shows login events from testing session.

---

## F17 – Trash / Restore

**Happy path F17-H1:** `/trash` → table loads with Item Type, Deleted At, Deleted By columns → may be empty.

---

## F18 – Auth (Login / Logout)

**Happy path F18-H1:** Navigate to `/login` → enter `admin@rentacarllc.example` / `Admin1234!` → redirect to `/` (dashboard) → sidebar visible.

**Happy path F18-H2 (Logout):** Click logout → redirected to `/login` → sidebar not visible → direct navigation to `/` redirects to `/login`.

### Edge Cases

| ID | Scenario |
|---|---|
| F18-E1 | Already-authenticated user navigates to `/login` — redirected to `/` |
| F18-E2 | Session expired mid-session — next action redirects to `/login` |

### Negative Cases

| ID | Scenario |
|---|---|
| F18-N1 | Wrong password — error shown, not redirected |
| F18-N2 | Empty email field — validation error |
| F18-N3 | Access dashboard without auth — redirect to `/login` |

---

## Manual-Only Checklist

These cannot be automated (require email delivery, visual inspection, PDF rendering, or end-to-end Stripe):

- [ ] Agreement PDF generates and opens (Step 5 header action)
- [ ] Receipt PDF generates and opens
- [ ] Signature capture pad works (Step 5, Step 7, Step 8)
- [ ] Image upload on pickup/return steps (Step 7, Step 9)
- [ ] Dark mode / theming renders correctly
- [ ] Calendar blocks have correct colors by vehicle class
- [ ] Mobile layout at 390px for all 19 screens (visual check)
- [ ] Print stylesheet (if any)

---

## Test Environment Setup

```bash
cd app
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# apply schema.sql to Supabase project
# create admin user in Supabase Auth → Users (admin@rentacarllc.example / Admin1234!)
# copy UUID → paste into seed.sql → run seed.sql
npm run dev          # start dev server on :3000
npx playwright test  # run all specs
```
