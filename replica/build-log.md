# Build Log

| ID | Screen | Date | Status | Notes |
|----|--------|------|--------|-------|
| S00 | Shell (layout, sidebar, header, auth, stubs) | 2026-10-10 | done | All routes stubbed, layout wired, tokens live |
| S01 | Dashboard | 2026-10-10 | done | KPI cards, fleet status grid, utilization bars, recent reservations |
| S02 | Reservations list | 2026-10-10 | done | Status filter tabs, table with RA#/dates/status/total |
| S03 | Reservation detail | 2026-10-10 | done | Summary cards, fuel/odo, 9-step wizard component, notes |
| S04 | New reservation wizard | 2026-10-10 | done | All 9 steps client-side; steps 5-7 placeholder content |
| S05 | Vehicles grid | 2026-10-10 | done | Status filter tabs, vehicle cards with FuelLevelSelector |
| S06 | Customers list | 2026-10-10 | done | Table with DL expiry warning |
| S07 | Customer detail | 2026-10-10 | done | Profile card + reservation history table |
| S08 | Companies list | 2026-10-10 | done | Table; no company seed data so empty state shown |
| S09 | Calendar | 2026-10-10 | done | Month calendar grid + upcoming pickups/returns list |
| S10 | Maintenance | 2026-10-10 | done | Work orders table with status + summary cards |
| S11 | Repair orders | 2026-10-10 | done | Table with priority badge + cost |
| S12 | External charges | 2026-10-10 | done | Summary totals + charges table |
| S13 | Quotes | 2026-10-10 | done | Quotes table with status badges |
| S14 | Reservation attempts | 2026-10-10 | done | Failed/abandoned bookings table |
| S15 | Fines | 2026-10-10 | done | Fines table + open/total summary cards |
| S16 | Toll tags | 2026-10-10 | done | Tag list with balance + color-coded low/empty balance |
| S17 | Reports | 2026-10-10 | done | KPI cards + fleet breakdown bars + quick report list |
| S18 | Audit logs | 2026-10-10 | done | Activity trail with action color coding |
| S19 | Settings | 2026-10-10 | done | Company/location/account sections with form inputs |

## What was harder than expected
- **Next.js 16 + `cacheComponents: true`**: `export const dynamic = "force-dynamic"` is incompatible. Had to use `export const instant = false` + `await connection()` pattern on every dynamic server component.
- **`new Date()` prerender error**: Moving date calls out of data layer functions (accepting `today` param) and behind `await connection()` in pages was required.
- **9-step wizard**: Two instances needed — a creation wizard (client, multi-step form) and a view/edit wizard (client, displays existing reservation data per step).

## Missing / partial
- Steps 5-7 in new reservation wizard (Rates/Details/Extras) show placeholder — requires backend to compute pricing
- No real auth — any credentials accepted; role-based access not implemented
- No PDF generation, digital signatures, or email templates
- No real-time availability checking (double-booking prevention)
- Payments section stub only (no records)
- Trash stub only
- Vehicle detail page not built (clicking vehicle shows grid only)
- Checklist workflow (pickup/return conditions) not built
- Search is header input only — no live filtering

## Next steps
- `/replica-backend` — wire Supabase: auth, real data layer, mutations (create reservation, update vehicle status, etc.)
