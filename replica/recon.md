# Replica Recon — Rent a Car LLC CRM Clone
**Original:** rent-a-car-llc.hqrentals.app (HQ Rentals SaaS)
**Platform:** Web (responsive, desktop-first)
**Scope:** Full CRM — reservations, fleet, contacts, payments, calendar, maintenance, checklist, forms
**Audience:** Internal staff at Rent a Car LLC
**Recon date:** 2026-10-10 (live authenticated session)

---

## Sources

| source | what it gives |
|---|---|
| Live app (authenticated staff session — user "Vasant") | Every page, real data, exact field labels |
| JSON API responses (vehicle detail page rendered as JSON) | Confirmed field names, types, relationships |
| Page accessibility text (all pages read via browser automation) | Column names, status options, action labels |

---

## Navigation Structure (confirmed from sidebar)

```
Dashboard                         /
Car Rental ▾
  Reservations                    /car-rental/reservations
  Reservation Attempts            /car-rental/reservation-attempts
  Quotes                          /car-rental/quotes
  Payments                        /car-rental/payments  (404 on this account — likely admin-only)
  External Charges                /car-rental/external-charges
  Calendar                        /car-rental/calendar
Fleet ▾
  Telematics                      /fleets/telematics
  Vehicles                        /fleets/vehicles
  Maintenance                     /fleets/maintenance
  Repair Orders                   /fleets/repair-orders
Contacts ▾
  Customers                       /contacts/category/3
  Companies                       /contacts/category/4
Checklist                         /checklist  (500 error — feature broken or disabled)
Forms ▾
  Fines                           /sheets/1/items
  Toll Tag                        /sheets/2/items
Reports                           /reports
Trash                             /trash
Audit Logs                        /audits
Settings                          /settings  (403 — admin only)
```

---

## Screen Inventory

| ID | Screen | Route | Purpose | Key components | States |
|---|---|---|---|---|---|
| S01 | Dashboard | / | Daily operations overview | Utilization bar chart (by class), Today manifest (pickups/returns/overdues), Quick pickup search (RA# or name), Tabs: Daily Manifest / Bookings / Availability / Fleet Status / Extras / Attempts | Default, empty day |
| S02 | Reservations List | /car-rental/reservations | All rental agreements | Table 19,200 records; 9 status tabs; filters; PDF action links | Empty, filtered, paginated |
| S03 | Reservation – Step 1 Dates | /car-rental/reservations/step1?id=:id | Set pickup/return dates & locations | Date pickers, time selectors, location dropdowns, Comments section | New, edit |
| S04 | Reservation – Step 2 Vehicles | /car-rental/reservations/step2?id=:id | Select vehicle class | Vehicle class cards (name, transmission, monthly rate, total, availability count/%), Summary side panel | Selected, unselected |
| S05 | Reservation – Step 3 Features | /car-rental/reservations/step3?id=:id | Add extras & discounts | Additional Driver toggle (Free), Coupon Code input, Manual Discount ($ or %), Purpose text, warning about Day 1 charges | None selected, some selected |
| S06 | Reservation – Step 4 Customer | /car-rental/reservations/step4?id=:id | Attach or create customer | Customer autocomplete search, or "New Customer" form (full contact fields), Insurance information section, Reservation history table | Existing customer, new customer |
| S07 | Reservation – Step 5 Confirm | /car-rental/reservations/step5?id=:id | Review and confirm | Full data review (dates, vehicle, customer, insurance, DL), Signatures capture, Confirm / Confirm as Pending / Clone Reservation buttons | Pending, confirmed |
| S08 | Reservation – Step 6 Payments | /car-rental/reservations/step6?id=:id | Record payments | Add Offline Payment, Process Payment, Request Payment, Add Offline Refund, Add Discount | No payment, partial, paid |
| S09 | Reservation – Step 7 Pickup | /car-rental/reservations/step7?id=:id | Process vehicle pickup | Vehicle info, Fuel level (0-8 scale), Odometer, Pickup date/time override, Recalculate on late pickup toggle, Images upload, Drivers table, Add Driver, Damage Report, Signature, Update button | Pre-pickup, completed |
| S10 | Reservation – Step 8 Contract | /car-rental/reservations/step8?id=:id | Contract management + extensions | Signature capture, Contract Modifications (Extension / Early Return / Replace Vehicle / Update Location / Charge or Adjustment / Disable Renewal), Extensions table with history, Payments section, Damage Report | Active, modified |
| S11 | Reservation – Step 9 Return | /car-rental/reservations/step9?id=:id | Process vehicle return | Return location, Fuel at pickup (readonly), Odometer at pickup (readonly), Fuel at return (0-8), Charge fuel to client toggle, Odometer at return, Return date/time, Recalculate on early return toggle, Images, Confirm Return, Recalculate Charges, Add External Charge, Payments | Pre-return, completed |
| S12 | Reservation – History | /car-rental/reservations/history?id=:id | Audit trail | Lifecycle timeline (Picked Up, Created dates), Vehicles section, Comments | Always populated once active |
| S13 | Reservation Attempts | /car-rental/reservation-attempts | Incomplete/abandoned bookings | Table: #, Email, Phone, Locations, Dates, Contact, Type, Branch, Available Vehicles, Class, Last Step | Empty, 113 records |
| S14 | Quotes List | /car-rental/quotes | Estimates/quotes | Table: #, Type, Customer, Email, Date, Pickup/Return, Class, Commission Partner, Client pays at CP, Rack Price, Total, Status | Empty, Expired status shown |
| S15 | External Charges | /car-rental/external-charges | Tolls and tickets | Tabs: All / Tolls; Table: #, Label, Amount, Date, Reservation, Vehicle, Vehicle Status, Status(Paid), Plate, Toll Tag#, Toll Agency, Notes | Empty, list |
| S16 | Calendar | /car-rental/calendar | Visual availability view | Views: Week/Month/3 Months/Year; Rows = vehicles grouped by class; Columns = dates; Repair Orders also shown as blocks | Month, week, 3-month |
| S17 | Vehicles List | /fleets/vehicles | Fleet inventory | Table: Vehicle Key, VIN, Plate, Status, Type, Current Renter, Available Date, Make, Model, Class, Location, Odometer, Fuel Level, Available?, Last Location Update, Telematics Connected, Toll Tag, Registration; Filters: All/Available/Dirty/On Rent; 164 vehicles, 40 currently shown (filtered) | Empty, filtered |
| S18 | Vehicle Edit | /fleets/vehicles/:id/edit | Edit/view vehicle | Form: VIN, Key, Plate, Make, Model, Class, Type, Year, Color, Available Date/Until, Odometer, Fuel Level (0-8), Status (12 options), Entry/Exit Date, Toll Tag, Location, Fleet, Hardware Provider/ID, Alarm thresholds, Registration fields, Depreciation block, Maintenance History table with Add | View, edit |
| S19 | Maintenance List | /fleets/maintenance | Maintenance schedule | Table: #, Vehicle, Type, Interval, Planned Start/End, Odometer Due, Current Odometer, Status (Pending), Vehicle Status, Renter, Location | 465 records |
| S20 | Repair Orders List | /fleets/repair-orders | Service tickets | Table: ID, Vehicle, Type, Date Out/Due/In, Parts/Labor/Tax/Total, Fuel Out/In, Odometer Out/In, Notes, Comments, Status, Mechanic info; Total row ($154k+); Tabs: All/Due This Week | 670 records |
| S21 | Customers List | /contacts/category/3 | All renters | Table: Label, Email, Phone, Address fields, DL#, DL Expiry, File Upload, Reservation Count; Tabs: All / Still need to be checked; Actions: SMS, Email, Add to Group, Move, Delete, Merge, Email Templates | 42 records |
| S22 | Companies List | /contacts/category/4 | Business contacts | Same table as customers but with Name/Website | 0 records |
| S23 | Fines | /sheets/1/items | Traffic fines tracker | Table: #, Fine Number, Fine Type, Vehicle Plate, Date of Fine, Date & Time of Offense, Paid to Authority | Empty |
| S24 | Toll Tags | /sheets/2/items | Toll tag inventory | Table: #, Toll Tag (NTTA numbers) | 20 records |
| S25 | Reports | /reports | Report catalog | Car Rental reports (12 types), Fleet reports (implied) | List view |
| S26 | Audit Logs | /audits | System audit trail | Table: #, User, Method, Event Count, Path, Date, Source | List |
| S27 | Trash | /trash | Soft-delete manager | Table: #, Label, Item Type, Deleted At, Deleted By; Actions: Restore / Delete; Item types: Files, Fleets Repair Orders | 149 records |
| S28 | Availability Check | /car-rental/availability-check | Standalone availability query | Date pickers, location selectors, Check Availability button | Default |
| S29 | Login | /login | Authentication | Email/password, company logo | Default, error |
| S30 | Settings | /settings | Account config (admin only) | 403 for staff users | Admin-only |

---

## Reservation Wizard – Detailed Field Inventory

### Step 1 – Dates
- Pickup Date (date picker)
- Pickup Time (time select)
- Return Date (date picker)
- Return Time (time select)
- Pickup Location (dropdown — preset to "6537 Lyndon B Johnson Fwy Dallas, TX 75240")
- Return Location (dropdown)
- Comments / Save Comment (all steps have this)

### Step 2 – Vehicles
- Vehicle class cards showing: name, transmission type, $/month, $ total for N days, "Excl. taxes & insurance(s)", Vehicles Available: N (X%)
- Classes (confirmed): +Hybrid $425/mo, +Basic $450/mo, +Regular $525/mo, +VIP $750/mo
- Side panel (Summary): reservation modified alert, security deposit unpaid alert, outstanding balance alert, Rental block (pickup/return dates, locations), Active Vehicle (make/plate, class, months, rate, total, included distance, total, outstanding balance, security deposit amount), Audits (Created by, Created at, Rental User)

### Step 3 – Features
- Warning: "Reservation is in rental process, all charges added from this step are going to be charged from Day one"
- Equipment & Services section: Additional Driver (qty stepper, Free)
- Discounts section: Coupon Code text input, Manual Discount ($ amount), Manual Discount is a Percentage? (Yes/No)
- Purpose text field
- "Update Order" / "Next Step" buttons

### Step 4 – Customer
- Customer autocomplete search field
- "or create a new one" → New Customer inline form
- Driver's license expired warning (shown when DL is expired)
- Customer Information form:
  - First Name, Last Name, Email Address, Phone Number
  - Street, Street 2, City, State (Texas default), Zip, Country (United States)
  - Birthday (date picker)
- Driver's License section: DL Number, State, Expiration Date, File Upload, Add Image
- Insurance Information (12 fields): Company Name, Company Number, Agent Name, Agent Number, Insured Name, Insured Address, Insured Phone Number, Policy Number, Claim Number, Policy Effective Date, Policy Expiration Date, Policy Process Date, Deductible, Coverage Per Person, Coverage Per Claim, Loss Payee/Lessor
- Reservations history table (previous rentals for this customer): #, Pickup Date, Return Date, Vehicle Class, Status, Notes, Selected Discounts, Outstanding Balance, Total Price
- "Next Step" button

### Step 5 – Confirm
- Full review of: Date & Time block, Vehicle Class block, Customer Information block (all fields), Driver's License block, Insurance Information block
- Signatures section (signature pad → Save Signature)
- Action buttons: "Confirm Reservation", "Confirm as Pending", "Clone Reservation"

### Step 6 – Payments
- Payments section: "Add Offline Payment", "Process Payment", "Request Payment"
- Refunds section: "Add Offline Refund"
- Discounts section: "Add Discount"

### Step 7 – Pickup
- Vehicle + Pickup Location (display)
- Fuel Level at Pickup (0-8 slider/selector)
- Odometer at Pickup (text input)
- Pickup Date (override), Pickup Time (override)
- "Recalculate rates on late Pickup?" (Yes/No)
- Images: Add Image
- Drivers table: # | Name | Driver License | Age | Primary Driver? — with Add Driver button
- Damage Report section
- Signatures section
- "Update pick up information" button

### Step 8 – Contract
- Signatures section
- Contract Modifications tabs: Extension | Early Return | Replace Vehicle | Update Location | Charge or Adjustment | Disable Renewal
- Extensions table: # | Return Date | Days Extended | Comments | Distance Driven | Is Pending? | Created By | Created At (auto-renewal entries visible, "System Background" as creator)
- Payments section (same as step 6)
- Damage Report section

### Step 9 – Return
- Vehicle Link, Return Location (display)
- Fuel level at Pickup (readonly display, e.g. "8 / 8")
- Odometer at Pickup (readonly, e.g. "156080")
- Fuel Level at Return (0-8 selector)
- "Charge fuel to client?" (Yes/No)
- Odometer at Return (input)
- Return Date (override), Return Time (override)
- "Recalculate rates on early Return?" (Yes/No)
- Images: Add Image
- "Confirm Return" button, "Recalculate Charges" button
- "Add External Charge" button, "Charge or Adjustment" button
- Payments section

### History Tab
- Lifecycle section: event list (Picked Up timestamp, Created timestamp)
- Vehicles section
- "No relevant activity has been recorded" (when empty)

### Reservation Header (all steps)
- Customer Name + RA # + "Rental" label
- Action buttons: Agreement (PDF) | Receipt (PDF) | Email Templates
- 9-step progress indicator tabs: Dates / Vehicles / Features / Customer / Confirm / Payments / Pickup / Contract / Return / History

---

## Vehicle Detail – Full Data Model (from JSON)

Confirmed fields from API response:
```
id, label, vehicle_key, vehicle_model_id, vehicle_class_id, vehicle_type_id,
year, color, vin, plate, plate_expiration_date, odometer, status,
available_date, fuel_level, registration_expiration_date,
inspection_expiration_date, force_availability_due_to_registration_date,
force_availability_due_to_inspection_date, available, available_until,
current_location_id, fuel_type_id, tank_size, vehicle_entry_date,
vehicle_exit_date, toll_tag_id, hardware_id, hardware_provider,
latitude, longitude, engine_on, doors_locked, immobilizer,
keys_in_holder, speed, rented_days_without_maintenance,
status_since, outside_geofence, private_mode_start_date,
private_mode_end_date, sharebox_keys_in_locker, sharebox_cabinet_id,
sharebox_reservation_id, sharebox_row, sharebox_column,
sharebox_locker_number, accounting_list_id, accounting_edit_sequence,
accounting_reference_type_id, version, last_location_update_at,
last_hardware_update_at, doors_open
```

Vehicle Class fields confirmed:
```
id, brand_id, name, order, calendar_order, allowed_overbooking_quantity,
overbook_back_up_id, available_on_website, lease_class, start_date,
spare_quantity, minimum_rental_age, maximum_rental_age,
label_for_website (json, multi-lang), short_description_for_website,
description_for_website, distance_limit_per_day/week/month,
additional_charge_for_exceeded_distance_id, commission_percentage,
fixed_commission_amount, sipp_code, days_to_pay_online,
driver_license_experience, related_vehicle_classes, limited_availability,
percentage_for_limited_availability, disable_fuel_level_and_odometer_tracking,
request_pre_payment_for_crx_reservations, disable_for_tour_operators,
allowed_locations, restricted_locations, similar_vehicle_model_id,
seats, bags, doors, air_conditioning, transmission_type, engine_type,
available_only_in_cp_public_bookings, equivalent_sipp_codes, public_image_link
```

Vehicle status options (confirmed from edit form):
Available, Dirty, Returned, Out of service, On Sale, Sold, Complementary, New, Reserved, Stolen, Recovered, Totaled, Repossessed

Vehicle sub-tabs: View | Edit | Reservations | Damages | Blocked Periods | Expenses | Relocations | Repair Orders | Files | Checklist
Vehicle actions: Clone Vehicle | Telematics | Delete

Maintenance types tracked per vehicle:
- Tire change every 30000 miles
- Oil change and Brakes Check every 4000 miles
- Oil Change
- Tire Sensor (every 1000 miles)

---

## User Flows

```
F01 New Reservation (happy path — 9 steps + history)
    S03 Dates → S04 Vehicles → S05 Features → S06 Customer → S07 Confirm
    → S08 Payments → S09 Pickup → S10 Contract → S11 Return → S12 History
    edges: no availability, DL expired, new customer creation, slot taken mid-wizard,
           late pickup recalculation, early return recalculation, auto-renewal extension
    clicks on happy path: ~22

F02 Quick Pickup from Dashboard
    S01 Dashboard → search RA# or customer name → S09 Pickup step
    edges: not found, multiple matches

F03 View Daily Manifest
    S01 Dashboard → Daily Manifest tab → see today's pickups + returns + overdues

F04 Fleet Vehicle Add
    S17 Vehicles List → Add Vehicle → S18 Vehicle Edit (new) → Save
    edges: duplicate plate/VIN, class not configured

F05 Contact Lookup / Add
    S21 Customers → search → click → customer detail (URL pattern unknown)
    or Add Customer → form

F06 Record Payment (offline)
    S08 Payments step → Add Offline Payment → amount + method + notes

F07 Process Return
    S11 Return step → fuel/odometer → Confirm Return
    edges: damage found, fuel charge, early return recalc, late return

F08 Generate Quote
    S14 Quotes → (same wizard flow as F01) → Status: Expired/Sent

F09 View Calendar Availability
    S16 Calendar → Week/Month/3 Months/Year → see vehicle bars by class

F10 Maintenance Entry
    S18 Vehicle Edit → Maintenance History → Add → type, dates, odometer

F11 Repair Order
    S20 Repair Orders → Add Repair Order → vehicle, type, dates, parts/labor/taxes, mechanic info

F12 Record Fine
    S23 Fines → Add Fine → fine number, type, plate, date of offense, paid to authority

F13 Manage Toll Tags
    S24 Toll Tags → list of NTTA numbers (linked to vehicles via toll_tag_id)

F14 Run Report
    S25 Reports → select report type → date range → view/export

F15 Contract Extension
    S10 Contract step → Extension tab → new return date, days, comments
    Note: Auto-renewals created by "System Background" on 30-day cycles

F16 Clone Reservation
    S07 Confirm step → "Clone Reservation" button

F17 Check Availability (standalone)
    S28 Availability Check → date range + locations → results

F18 Restore from Trash
    S27 Trash → Restore button (supports Files, Repair Orders, etc.)
```

---

## Components

| Component | Variants | States | Screens |
|---|---|---|---|
| Top navigation bar | — | Fixed, user name displayed top-left | All |
| Left sidebar nav | Collapsed/expanded sections | Active item highlighted | All |
| Data table | Sortable, filterable, paginated | Empty, loading, filled; save-this-search feature | S02, S13-S24, S26-S27 |
| Table action buttons (floating) | Actions / Columns / Print / Reset / Export / Delete | — | All tables |
| Reservation wizard progress bar | 10 tabs (9 steps + History) | Active/complete/pending | S03-S12 |
| Reservation header | — | RA #, customer name, 3 action buttons | S03-S12 |
| Summary side panel | — | Alerts (modified, deposit unpaid, balance), vehicle info, audit info | S04-S12 |
| Alert chip | — | Info, warning, error | S04 |
| Date range picker | Single, range | Open/closed | S03, S28 |
| Vehicle class card | — | Available, unavailable, selected | S04 |
| Fuel level selector | 0-8 scale | Any level | S09, S11, S18 |
| Signature pad | — | Empty, signed, saved | S07, S09, S10 |
| Drivers table | — | 0 drivers, 1+ drivers | S09 |
| Extensions table | Auto-renewal, manual | Pending, confirmed | S10 |
| Search autocomplete | Customer, vehicle, RA# | Empty, suggestions, selected | S01, S06, S21 |
| Payment action buttons | Offline payment, Process, Request, Refund, Discount | — | S08, S10, S11 |
| Status badge | 12 vehicle statuses; 5+ reservation statuses | Color-coded | S02, S17 |
| Report card | — | Default | S25 |
| Calendar grid | Week / Month / 3 Months / Year | Day with events, empty | S16 |
| Modal dialog | Confirm, form entry | Open, closed | Various |
| Toast notification | Success, error | — | Various |
| Comments box | — | Empty, with text | All reservation steps |
| Image upload | Multiple files | Empty, with images | S09, S11, S18 |

---

## Inferred Data Model (full)

```
Company
  id, name, address, phone, email, logo_url, timezone
  evidence: login branding, settings page
  confidence: high

User
  id, company_id, email, password_hash, role (admin|staff), name
  evidence: audit logs show "Vasant Pulkam", "Natalia Parra", "Zina Untu" etc.
  confidence: high

Location
  id, company_id, name, address
  evidence: "6537 Lyndon B Johnson Fwy Dallas, TX 75240" appears as a named location
  confidence: high

VehicleClass
  id, company_id, name (+Hybrid|+Basic|+Regular|+VIP), daily_rate_default,
  monthly_rate_default, transmission_type (Automatic), available_on_website,
  lease_class, minimum/maximum_rental_age, distance_limits, overbooking settings,
  website labels (multi-lang JSON), sipp_code, seats, bags, doors, transmission, engine
  evidence: S04 cards, JSON vehicle class object
  confidence: high

Vehicle
  id, company_id, vehicle_key, label, vehicle_model_id, vehicle_class_id,
  vehicle_type_id, year, color, vin, plate, plate_expiration_date,
  odometer, status (12 statuses), available_date, available_until,
  fuel_level (0-8), fuel_type_id, tank_size,
  registration_expiration_date, inspection_expiration_date,
  force_availability_due_to_registration_date, force_availability_due_to_inspection_date,
  current_location_id, toll_tag_id, hardware_id, hardware_provider,
  latitude, longitude, engine_on, doors_locked, immobilizer, keys_in_holder,
  speed, last_location_update_at, outside_geofence, available, 
  vehicle_entry_date, vehicle_exit_date, private_mode_start_date,
  sharebox fields (cabinet_id, reservation_id, row, column, locker_number),
  purchase_price, expected_rest_value, odometer_at_purchase, purchase_date,
  depreciation_time_months, created_by, updated_by, deleted_at, created_at, updated_at
  evidence: vehicle JSON, S18 edit form
  confidence: high

MaintenanceType
  id, vehicle_id, name, interval_type (miles|days), interval_value, 
  last_service_odometer, next_service_odometer, last_service_date, next_service_date
  evidence: Vehicle edit form maintenance history table
  confidence: medium

Contact (Customer or Company)
  id, company_id, category_id (3=customer, 4=company), first_name, last_name,
  name (company), website, email, phone, street, street_2, city, state,
  zip, country, birthday, dl_number, dl_state, dl_expiration_date,
  dl_file_url, notes, blacklisted, reservation_count
  evidence: S21 columns, S06 customer form
  confidence: high

InsuranceInfo (belongs to Contact or Reservation)
  id, contact_id (or reservation_id), company_name, company_number,
  agent_name, agent_number, insured_name, insured_address, insured_phone,
  policy_number, claim_number, policy_effective_date, policy_expiration_date,
  policy_process_date, deductible, coverage_per_person, coverage_per_claim,
  loss_payee
  evidence: S06 insurance section (12+ fields)
  confidence: high

Reservation
  id, company_id, ra_number (RA #86 observed, sequential), contact_id,
  vehicle_id, vehicle_class_id, pickup_date, return_date,
  actual_pickup_date, actual_return_date, pickup_location_id, return_location_id,
  status (pending|confirmed|active|returned|cancelled),
  rental_type (daily|weekly|monthly), base_rate, monthly_rate,
  extras_total, discounts_total, coupon_code, manual_discount, manual_discount_is_percentage,
  tax, security_deposit, total, balance_due, included_distance,
  purpose, notes, odometer_at_pickup, fuel_at_pickup, odometer_at_return,
  fuel_at_return, charge_fuel, recalculate_on_late_pickup, recalculate_on_early_return,
  is_quote (bool), created_by, updated_by, created_at, updated_at
  evidence: all wizard steps, summary panel, reservation list columns
  confidence: high

ReservationDriver
  id, reservation_id, contact_id (or inline), name, dl_number, dl_expiry, age, is_primary
  evidence: S09 Pickup drivers table
  confidence: high

ReservationExtra (Equipment & Services)
  id, reservation_id, name, price, quantity
  evidence: S05 Additional Driver = free, qty stepper
  confidence: high

ContractExtension
  id, reservation_id, new_return_date, days_extended, comments, distance_driven,
  is_pending, created_by, created_at
  evidence: S10 Extensions table (auto-renewals by "System Background")
  confidence: high

Payment
  id, reservation_id, amount, method (cash|card|check|other),
  type (offline|online|request), recorded_at, notes, created_by
  evidence: S08 payment step buttons
  confidence: high

Refund
  id, reservation_id, amount, reason, created_at, created_by
  evidence: S08 "Add Offline Refund" button
  confidence: medium

Quote
  id, company_id, contact_id (nullable), ...same as Reservation...,
  status (draft|sent|expired|accepted), rack_price, commission_partner,
  client_pays_at_commission_partner
  evidence: S14 quotes columns
  confidence: medium

ReservationAttempt
  id, company_id, email, phone, pickup_location_id, return_location_id,
  pickup_date, return_date, contact_id (nullable), reservation_type,
  branch_id, total_available_vehicles, vehicle_class_id, last_step, created_at
  evidence: S13 columns (113 records)
  confidence: medium

ExternalCharge
  id, company_id, vehicle_id, reservation_id (nullable), label (Toll|Ticket),
  charge_amount, charge_date, status (paid|unpaid), vehicle_plate,
  toll_tag_number, toll_agency, notes
  evidence: S15 columns (5 records including Tolls and Tickets)
  confidence: high

RepairOrder
  id, company_id, vehicle_id, maintenance_type (Other|specific), date_out, date_due,
  date_in, parts_total, labor_total, taxes_total, total_amount,
  fuel_level_out, fuel_level_in, odometer_out, odometer_in,
  notes, comments, status (Done|Pending), mechanic_name, workshop_name,
  phone_number, address, created_by, deleted_at
  evidence: S20 columns + totals row ($154k+ shown) — 670 records
  confidence: high

MaintenanceRecord
  id, vehicle_id, maintenance_type_id, planned_start_date, planned_end_date,
  odometer_at_due, current_odometer, status (Pending|Done)
  evidence: S19 columns — 465 records
  confidence: high

Fine (Fines sheet)
  id, company_id, fine_number, fine_type, vehicle_plate, date_of_fine,
  date_time_of_offense, paid_to_authority, notes
  evidence: S23 column headers
  confidence: high

TollTag
  id, company_id, tag_number (e.g. NTTA00437481)
  evidence: S24 list (20 NTTA tags), vehicle.toll_tag_id FK
  confidence: high

AuditLog
  id, company_id, user_id, method (POST|GET|etc), event_count, path,
  source (Internal|External), created_at
  evidence: S26 columns (3 records visible)
  confidence: high

Report (no DB storage — generated on demand)
  Types: Revenue Based on Returns, Revenue Overview, Revenue per Payment Option,
  Monthly Overview, Location Performance, End of Day Overview, Daily Manifest,
  Sales Tax, Additional Charges, Damages, Cancellations, Extensions Report
  evidence: S25 report catalog
  confidence: high

TrashRecord (soft delete index)
  id, label, item_type, item_id, deleted_at, deleted_by
  evidence: S27 (149 records — Files + Fleets Repair Orders)
  confidence: high
```

---

## Vehicle Classes (Rent A Car LLC specific)

| Class | Transmission | Monthly Rate | Daily equiv |
|---|---|---|---|
| +Hybrid | Automatic | $425.00/mo | ~$14.17/day |
| +Basic | Automatic | $450.00/mo | ~$15.00/day |
| +Regular | Automatic | $525.00/mo | ~$17.50/day |
| +VIP | Automatic | $750.00/mo | ~$25.00/day |

Fleet breakdown: 164 vehicles total
- +Hybrid: 113 available (86.3%)
- +Basic: 6 available (31.6%)
- +Regular: 2 available (20%)
- +VIP: 1 available (50%)
- Main make: Ford Fusion, Toyota Prius variants

---

## Reports Catalog

Car Rental section:
1. Revenue Based on Returns — completed reservations overview
2. Revenue Overview — grouped by gateway and payment method
3. Revenue per Payment Option — per method breakdown
4. Monthly Overview — per month revenues
5. Location Performance — reservations by date range
6. End of the Day Overview — revenues until EOD
7. Daily Manifest — all pickups, returns, overdues and scheduled repairs
8. Sales Tax — sales tax on all reservations
9. Additional Charges — additional charge sold days
10. Damages — damage charges in reservations
11. Cancellations — cancelled reservations overview
12. Extensions Report — extensions overview

Fleet section: (exists but not fully visible)

---

## What Cannot Be Cloned

| Feature | Reason |
|---|---|
| HQ Rentals branding, logos, CSS | Owned by HQ Rentals Inc |
| Telematics GPS integration (/fleets/telematics) | Requires hardware/3rd-party API |
| HQ's email template HTML designs | Owned content |
| HQ's actual reservation data (19,200 records) | Private customer data |
| HQ's payment processor credentials | Account-specific |
| Sharebox integration (locker system) | Proprietary hardware |
| Settings page content | Needs admin account access |
| Checklist page (500 error in live app) | Broken/disabled on this account |

---

## Hard Parts for Clone Build

1. **9-step reservation wizard with persistent state** — complex state machine across steps; auto-renewal extension logic; recalculate-on-change for late pickup/early return
2. **Calendar availability view** — vehicle-by-vehicle rows across date ranges; repair orders also block calendar; month/week/3-month/year views
3. **PDF contract + receipt generation** — Agreement PDF and Return Receipt PDF per reservation
4. **Real-time availability checking** — prevent double-booking across 164 vehicles; overbooking settings per class
5. **Contract extensions with auto-renewal** — system creates monthly extension entries automatically; "System Background" user concept
6. **Multi-section contact form** — customer info + driver's license + insurance + reservation history inline

---

## Size Estimate

**L — 4-6 weeks for one focused developer**

Screens: 30 (S01-S30)
Flows: 18 (F01-F18)
Entities: ~25 data models
Hard parts: 6

---

## Next Step

Run `/replica-architect` to design the database schema and API layer.
