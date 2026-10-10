# Architecture — Rent a Car LLC CRM Clone

**Stack summary:** Next.js 14 App Router + Supabase (Postgres + Auth + Storage) + Drizzle ORM + Vercel  
**Tables:** 27  **Routes/Actions:** 68  **Riskiest parts:** calendar availability race conditions, 9-step wizard state persistence, PDF generation  

---

## Step 1: Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Web app | Next.js 14 (App Router) + TypeScript | Server actions reduce API boilerplate; familiar DX; Vercel native |
| Styling | Tailwind CSS + shadcn/ui | shadcn gives accessible components (tables, dialogs, date pickers) that match HQ's patterns |
| Database | PostgreSQL on Supabase | Managed Postgres, built-in auth, storage, realtime — one platform for everything |
| ORM | Drizzle ORM | Type-safe, migration-first, excellent with Supabase Postgres |
| Auth | Supabase Auth | Native to the DB; RLS ties auth users to company rows |
| Payments | Stripe Checkout | Standard offline payments in-app; Stripe for online collection (future) |
| Email | Resend | Agreement PDFs and receipts sent as attachments; great Next.js integration |
| PDF generation | @react-pdf/renderer | Render Agreement + Receipt PDFs server-side in Next.js route handlers |
| Jobs / Cron | Vercel Cron + Supabase Edge Functions | Auto-renewal extension creation on 30-day cycles; daily manifest emails |
| File storage | Supabase Storage | Vehicle images, DL scans, repair order files — single bucket per company |
| Hosting | Vercel | Zero-config Next.js; Edge for calendar queries |
| Search | Postgres full-text search (tsvector) | Simple enough; no need for Algolia at this scale |

**Single database. No microservices. Multi-tenant via `company_id` column + Postgres RLS.**

---

## Step 2: Database Schema

Access pattern: **Row Level Security** on every table. Every query is scoped to the user's `company_id` automatically via an RLS policy: `auth.jwt() ->> 'company_id' = company_id`. Staff role cannot delete records except via soft-delete. Admin role has full access. System Background is a service-role key (bypasses RLS) used for cron jobs only.

See `schema.sql` for the full DDL.

### Table list

| # | Table | Notes |
|---|---|---|
| 1 | `companies` | Tenant root; one row per rental company |
| 2 | `users` | Staff + admin; linked to `auth.users` |
| 3 | `locations` | Pickup/return locations per company |
| 4 | `vehicle_classes` | +Hybrid, +Basic, +Regular, +VIP; rate + config |
| 5 | `vehicle_models` | Make/model reference (Ford Fusion, Toyota Prius etc.) |
| 6 | `vehicle_types` | Car, SUV, Truck etc. |
| 7 | `fuel_types` | Gas, Hybrid, Electric |
| 8 | `vehicles` | Full vehicle record with ~50 fields |
| 9 | `toll_tags` | NTTA tag inventory |
| 10 | `contacts` | Customers + Companies (category_id 3 or 4) |
| 11 | `insurance_info` | Insurance details attached to contact or reservation |
| 12 | `reservations` | Core rental record; 9 wizard steps populate this row |
| 13 | `reservation_drivers` | Additional drivers on a reservation |
| 14 | `reservation_extras` | Equipment & services (Additional Driver etc.) |
| 15 | `contract_extensions` | Manual + auto-renewal extensions |
| 16 | `payments` | Offline + online payments per reservation |
| 17 | `refunds` | Refunds per reservation |
| 18 | `quotes` | Same as reservation but is_quote=true; linked status |
| 19 | `reservation_attempts` | Incomplete bookings (abandon tracking) |
| 20 | `external_charges` | Tolls, tickets linked to vehicle/reservation |
| 21 | `repair_orders` | Workshop service tickets per vehicle |
| 22 | `maintenance_records` | Scheduled maintenance per vehicle |
| 23 | `fines` | Traffic fine tracker (custom sheet #1) |
| 24 | `toll_tag_assignments` | NTTA inventory rows (custom sheet #2, linked to vehicles) |
| 25 | `audit_logs` | All API calls + user actions |
| 26 | `files` | Uploaded files with soft-delete (vehicle images, DL scans) |
| 27 | `reservation_comments` | Per-step comments on reservations |

---

## Step 3: API Routes and Server Actions

### Auth
| Method / Route | What | Who | Input | Output |
|---|---|---|---|---|
| POST /api/auth/login | Supabase sign in | Public | email, password | session token |
| POST /api/auth/logout | Sign out | Any | — | — |

### Dashboard
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/dashboard/manifest | Today's pickups + returns + overdues | Staff+ | date?, location_id? | grouped reservation list | F03 |
| GET /api/dashboard/utilization | Vehicle utilization % by class | Staff+ | date | class utilization data | S01 |
| GET /api/dashboard/search | Quick search by RA# or customer name | Staff+ | q | reservation list | F02 |

### Reservations
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/reservations | List all reservations | Staff+ | filters, page | paginated list | S02 |
| POST /api/reservations | Create new (step 1 init) | Staff+ | pickup_date, return_date, location_ids | {id, ra_number} | F01 |
| GET /api/reservations/:id | Get full reservation | Staff+ | — | full reservation object | S03-S12 |
| PATCH /api/reservations/:id/step1 | Update dates/locations | Staff+ | dates, locations, comments | updated reservation | S03 |
| PATCH /api/reservations/:id/step2 | Select vehicle class | Staff+ | vehicle_class_id | updated | S04 |
| PATCH /api/reservations/:id/step3 | Add extras/discounts | Staff+ | extras[], coupon, discount | updated | S05 |
| PATCH /api/reservations/:id/step4 | Attach customer | Staff+ | contact_id or contact form data | updated | S06 |
| PATCH /api/reservations/:id/step5 | Confirm + signature | Staff+ | signature_data_url, status | updated | S07 |
| PATCH /api/reservations/:id/step7 | Pickup info | Staff+ | odometer, fuel, pickup_at, drivers[], damage_report | updated | S09 |
| PATCH /api/reservations/:id/step8/extend | Add extension | Staff+ | new_return_date, days, comments | extension record | F15 |
| PATCH /api/reservations/:id/step8/replace | Replace vehicle | Staff+ | new_vehicle_id | updated | S10 |
| PATCH /api/reservations/:id/step9 | Return info | Staff+ | odometer, fuel, return_at, charge_fuel | updated | F07 |
| POST /api/reservations/:id/clone | Clone reservation | Staff+ | — | new reservation id | F16 |
| DELETE /api/reservations/:id | Cancel (soft delete) | Staff+ | — | — | — |
| GET /api/reservations/:id/agreement | Generate Agreement PDF | Staff+ | — | PDF blob | S10 |
| GET /api/reservations/:id/receipt | Generate Receipt PDF | Staff+ | — | PDF blob | S11 |
| POST /api/reservations/:id/email | Email Agreement or Receipt | Staff+ | template_type | — | — |

### Availability
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/availability | Check vehicle class availability | Staff+/Public | pickup_date, return_date, location_id | class availability map | F17, S04 |

### Quotes
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/quotes | List quotes | Staff+ | filters | paginated | S14 |
| POST /api/quotes | Create quote | Staff+ | same as reservation | quote object | F08 |
| POST /api/quotes/:id/convert | Convert to reservation | Staff+ | — | reservation id | F08 |
| PATCH /api/quotes/:id | Update quote | Staff+ | fields | updated | — |

### Payments
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| POST /api/payments | Record offline payment | Staff+ | reservation_id, amount, method, notes | payment record | F06 |
| POST /api/payments/refund | Record refund | Staff+ | reservation_id, amount, reason | refund record | S08 |
| POST /api/payments/request | Send payment request email | Staff+ | reservation_id, amount | — | S08 |
| POST /api/payments/stripe/checkout | Create Stripe checkout session | Staff+ | reservation_id, amount | checkout url | S08 |
| POST /api/webhooks/stripe | Stripe payment events | Public (HMAC) | Stripe event | — | Background |

### Fleet
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/vehicles | List vehicles | Staff+ | filters, page | paginated | S17 |
| POST /api/vehicles | Add vehicle | Admin | vehicle fields | vehicle | F04 |
| GET /api/vehicles/:id | Vehicle detail | Staff+ | — | vehicle + relations | S18 |
| PATCH /api/vehicles/:id | Update vehicle | Staff+ | changed fields | updated | S18 |
| DELETE /api/vehicles/:id | Soft delete | Admin | — | — | — |
| GET /api/vehicle-classes | List vehicle classes | Staff+ | — | class list | S04 |
| POST /api/vehicle-classes | Create class | Admin | class fields | class | Settings |
| GET /api/repair-orders | List repair orders | Staff+ | filters | paginated | S20 |
| POST /api/repair-orders | Create repair order | Staff+ | vehicle_id, fields | repair order | F11 |
| PATCH /api/repair-orders/:id | Update repair order | Staff+ | fields | updated | — |
| DELETE /api/repair-orders/:id | Soft delete | Staff+ | — | — | S27 |
| GET /api/maintenance | List maintenance records | Staff+ | filters | paginated | S19 |
| POST /api/maintenance | Create maintenance record | Staff+ | vehicle_id, fields | record | F10 |

### Contacts
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/contacts | List contacts | Staff+ | category_id, filters | paginated | S21/S22 |
| POST /api/contacts | Create contact | Staff+ | contact fields | contact | F05 |
| GET /api/contacts/:id | Contact detail + reservation history | Staff+ | — | contact + reservations | F05 |
| PATCH /api/contacts/:id | Update contact | Staff+ | changed fields | updated | F05 |
| DELETE /api/contacts/:id | Soft delete | Admin | — | — | — |
| POST /api/contacts/merge | Merge two contacts | Staff+ | source_id, target_id | merged contact | S21 |

### Calendar
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/calendar | Calendar data (reservations + repair orders) | Staff+ | start_date, end_date, location_id | vehicle rows with date blocks | F09 |

### External Charges & Sheets
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/external-charges | List external charges | Staff+ | filters | paginated | S15 |
| POST /api/external-charges | Create charge | Staff+ | vehicle_id, label, amount, date | charge | F12 |
| GET /api/fines | List fines | Staff+ | filters | paginated | S23 |
| POST /api/fines | Create fine | Staff+ | fields | fine | F12 |
| GET /api/toll-tags | List toll tags | Staff+ | — | list | F13 |
| POST /api/toll-tags | Add toll tag | Admin | tag_number | tag | F13 |

### Reports
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/reports/revenue-returns | Revenue by return date | Admin+ | date_range | aggregated data | F14 |
| GET /api/reports/revenue-overview | Revenue by payment method | Admin+ | date_range | aggregated data | F14 |
| GET /api/reports/monthly-overview | Monthly totals | Admin+ | year | month rows | F14 |
| GET /api/reports/location-performance | Reservations by location | Admin+ | date_range | location rows | F14 |
| GET /api/reports/daily-manifest | EOD manifest | Staff+ | date | manifest object | F14 |
| GET /api/reports/sales-tax | Tax report | Admin+ | date_range | tax totals | F14 |
| GET /api/reports/extensions | Extensions overview | Admin+ | date_range | extension list | F14 |

### Settings
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/settings/company | Get company info | Admin | — | company object | S30 |
| PATCH /api/settings/company | Update company info | Admin | fields | updated | S30 |
| GET /api/settings/users | List users | Admin | — | user list | S30 |
| POST /api/settings/users | Invite user | Admin | email, role | — | S30 |
| PATCH /api/settings/users/:id | Update user role | Admin | role | — | S30 |
| GET /api/settings/locations | List locations | Admin | — | location list | S30 |
| POST /api/settings/locations | Add location | Admin | name, address | location | S30 |

### Trash / Audit
| Method / Route | What | Who | Input | Output | Flow |
|---|---|---|---|---|---|
| GET /api/trash | List soft-deleted records | Admin | — | trash list | S27 |
| POST /api/trash/:id/restore | Restore record | Admin | item_type, item_id | — | F18 |
| DELETE /api/trash/:id | Hard delete | Admin | — | — | S27 |
| GET /api/audit-logs | List audit logs | Admin | filters | paginated | S26 |

### Background Jobs (Vercel Cron)
| Schedule | Job | What |
|---|---|---|
| Every day at 00:01 UTC | auto-renewal | For all active reservations past return_date, create ContractExtension (+30 days), set new return_date. Uses service role (System Background user). |
| Every day at 06:00 local | daily-manifest-email | Email the day's manifest to the configured email address |
| Every hour | maintenance-alerts | Flag vehicles due for maintenance (odometer thresholds) |

---

## Step 4: The Parts That Bite

**Race condition on availability**: two staff can select the same vehicle class at the same second in step 2. Fix: optimistic lock on `reservations.vehicle_class_id` update; recheck availability count inside a Postgres transaction; return 409 if class is now full.

**Auto-renewal idempotency**: Cron fires once per day but if a server restart duplicates the job, extensions get created twice. Fix: unique constraint on `(reservation_id, new_return_date)` in `contract_extensions`; cron is idempotent.

**PDF generation memory**: @react-pdf/renderer is heavy; generating 100 PDFs in a loop will OOM a Vercel serverless function. Fix: generate on demand per request in a streaming route handler, never in batch.

**Time zones**: All times stored as `timestamptz` (UTC). Display in company's local timezone (stored on `companies.timezone`). Pickup/return overrides in the wizard use the company timezone. Auto-renewal cron uses UTC midnight to avoid DST drift.

**Multi-tenancy isolation**: Every table has `company_id`. RLS policies ensure a user from Company A can never read Company B's data. Drizzle queries always include `where(eq(table.companyId, user.companyId))` as an extra defense-in-depth check.

**File uploads**: DL images, vehicle damage photos, and repair order attachments go to Supabase Storage in a `company-{id}/` prefix bucket. Max file size 10MB per file. Soft-delete files go to trash and are purged after 30 days.

**Search**: Postgres `tsvector` index on `contacts(first_name, last_name, email, phone)` and `reservations(ra_number)` for quick autocomplete. For complex filters, use `ilike` with indexed columns.

**Email deliverability**: Resend + custom domain sending (rent-a-car-llc.com). SPF/DKIM records required at setup. Agreement PDFs attached as inline base64 in API calls under 10MB; larger files get a signed URL link instead.

---

## Step 5: Build Order

### Milestone 1 — Vertical Slice (1 week)
Prove the stack end-to-end: company can log in, create a reservation through all 9 steps, and see it on the dashboard.

**Screens:** S29 (Login), S01 (Dashboard), S03-S12 (Reservation wizard)  
**Tables:** companies, users, locations, vehicle_classes, vehicles, contacts, reservations, payments  
**Routes:** auth endpoints, POST /api/reservations, PATCH /api/reservations/:id/step1-9, GET /api/dashboard/manifest  

### Milestone 2 — Must-Haves (weeks 2-3)
All `must` priority features from features.csv.

**Fleet management:** S17 (vehicles list), S18 (vehicle edit/add)  
**Contacts:** S21 (customers), S22 (companies), contact CRUD  
**Calendar:** S16 — vehicle availability grid  
**PDF generation:** Agreement + Receipt PDFs  
**Tables:** repair_orders, maintenance_records, toll_tags, files, reservation_drivers, reservation_extras, contract_extensions, refunds, external_charges  
**Routes:** All fleet, contact, calendar, PDF routes  

### Milestone 3 — Should-Haves (week 4)
`should` priority features from features.csv.

**Quotes:** S14 — Quote wizard + convert to reservation  
**Reservation Attempts:** S13 — abandon tracking  
**Reports:** S25 — all 12 report types  
**Trash:** S27 — soft delete + restore  
**Audit logs:** S26  
**Auto-renewal cron:** Vercel Cron job  
**Email templates:** Resend integration  

### Milestone 4 — Could-Haves + Polish (weeks 5-6)
`could` priority features + testing + deployment.

**External charges full CRUD**, Stripe online payment, fine sheet, toll tag sheet  
**Mobile responsive** layout pass  
**Availability check standalone** (S28)  
**Settings page** (S30) — company info, user management, locations, pricing  
**Search** across all records  
**Deployment** to Vercel + Supabase production  

---

## Next Step

Run `/replica-design` to create the UI component system and screen layouts.
