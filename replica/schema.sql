-- ============================================================
-- Rent a Car LLC CRM Clone — Database Schema
-- Stack: PostgreSQL on Supabase, Drizzle ORM
-- Auth: Supabase Auth (auth.users); users table links to it
-- Multi-tenancy: company_id on every tenant-owned table + RLS
-- Soft delete: deleted_at timestamptz NULL on deletable tables
-- Times: all timestamptz, stored UTC
-- Money: integer cents + currency text column where applicable
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('admin', 'staff');

create type reservation_status as enum (
  'pending', 'confirmed', 'active', 'returned', 'cancelled'
);

create type rental_type as enum ('daily', 'weekly', 'monthly');

create type payment_method as enum ('cash', 'card', 'check', 'other');

create type payment_type as enum ('offline', 'online', 'request');

create type vehicle_status as enum (
  'available', 'dirty', 'returned', 'out_of_service', 'on_sale', 'sold',
  'complementary', 'new', 'reserved', 'stolen', 'recovered', 'totaled',
  'repossessed'
);

create type contact_category as enum ('customer', 'company');

create type quote_status as enum ('draft', 'sent', 'expired', 'accepted');

create type charge_status as enum ('paid', 'unpaid');

create type repair_status as enum ('pending', 'in_progress', 'done');

create type maintenance_status as enum ('pending', 'done');

create type extension_source as enum ('manual', 'auto_renewal');

-- ============================================================
-- 1. COMPANIES
-- ============================================================
create table companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  address       text,
  phone         text,
  email         text,
  logo_url      text,
  timezone      text not null default 'America/Chicago',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 2. USERS
-- ============================================================
create table users (
  id            uuid primary key references auth.users(id) on delete cascade,
  company_id    uuid not null references companies(id) on delete cascade,
  email         text not null,
  full_name     text not null,
  role          user_role not null default 'staff',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index users_company_id_idx on users(company_id);

-- ============================================================
-- 3. LOCATIONS
-- ============================================================
create table locations (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies(id) on delete cascade,
  name          text not null,
  address       text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index locations_company_id_idx on locations(company_id);

-- ============================================================
-- 4. VEHICLE_MODELS (Make + Model reference)
-- ============================================================
create table vehicle_models (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies(id) on delete cascade,
  make          text not null,   -- Ford, Toyota
  model         text not null,   -- Fusion, Prius
  created_at    timestamptz not null default now()
);

create index vehicle_models_company_id_idx on vehicle_models(company_id);

-- ============================================================
-- 5. VEHICLE_TYPES (Car, SUV, Truck etc.)
-- ============================================================
create table vehicle_types (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies(id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now()
);

create index vehicle_types_company_id_idx on vehicle_types(company_id);

-- ============================================================
-- 6. FUEL_TYPES
-- ============================================================
create table fuel_types (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies(id) on delete cascade,
  name          text not null,  -- Gas, Hybrid, Electric
  created_at    timestamptz not null default now()
);

create index fuel_types_company_id_idx on fuel_types(company_id);

-- ============================================================
-- 7. VEHICLE_CLASSES (+Hybrid, +Basic, +Regular, +VIP)
-- ============================================================
create table vehicle_classes (
  id                                uuid primary key default gen_random_uuid(),
  company_id                        uuid not null references companies(id) on delete cascade,
  name                              text not null,       -- '+Hybrid', '+Basic', '+Regular', '+VIP'
  calendar_order                    int,
  order_index                       int,

  -- Rates (stored as integer cents)
  daily_rate_cents                  int,
  weekly_rate_cents                 int,
  monthly_rate_cents                int,                 -- 42500, 45000, 52500, 75000

  -- Distance limits
  distance_limit_per_day            int,
  distance_limit_per_week           int,
  distance_limit_per_month          int,

  -- Booking rules
  available_on_website              boolean not null default false,
  lease_class                       boolean not null default false,
  minimum_rental_age                int,
  maximum_rental_age                int,
  allowed_overbooking_quantity      int not null default 0,
  commission_percentage             numeric(5,2),
  fixed_commission_amount_cents     int,
  days_to_pay_online                int,
  driver_license_experience         int,               -- years required

  -- Vehicle specs
  seats                             int,
  bags                              int,
  doors                             int,
  air_conditioning                  boolean not null default true,
  transmission_type                 text not null default 'Automatic',
  engine_type                       text,

  -- Website display (multi-lang JSON: {"en": "...", "es": "..."})
  label_for_website                 jsonb,
  short_description_for_website     jsonb,
  description_for_website           jsonb,
  public_image_link                 text,
  sipp_code                         text,

  -- Availability
  spare_quantity                    int not null default 0,
  limited_availability              boolean not null default false,
  percentage_for_limited_availability numeric(5,2),
  disable_fuel_level_and_odometer_tracking boolean not null default false,

  created_at                        timestamptz not null default now(),
  updated_at                        timestamptz not null default now()
);

create index vehicle_classes_company_id_idx on vehicle_classes(company_id);

-- ============================================================
-- 8. TOLL_TAGS (NTTA numbers)
-- ============================================================
create table toll_tags (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies(id) on delete cascade,
  tag_number    text not null,   -- e.g. NTTA00437481
  created_at    timestamptz not null default now()
);

create index toll_tags_company_id_idx on toll_tags(company_id);
create unique index toll_tags_company_tag_uniq on toll_tags(company_id, tag_number);

-- ============================================================
-- 9. VEHICLES
-- ============================================================
create table vehicles (
  id                                    uuid primary key default gen_random_uuid(),
  company_id                            uuid not null references companies(id) on delete cascade,
  vehicle_key                           text,
  label                                 text,
  vehicle_model_id                      uuid references vehicle_models(id) on delete set null,
  vehicle_class_id                      uuid references vehicle_classes(id) on delete set null,
  vehicle_type_id                       uuid references vehicle_types(id) on delete set null,
  fuel_type_id                          uuid references fuel_types(id) on delete set null,
  year                                  int,
  color                                 text,
  vin                                   text,
  plate                                 text,
  plate_expiration_date                 date,
  odometer                              int,
  status                                vehicle_status not null default 'available',
  status_since                          timestamptz,
  available_date                        date,
  available_until                       date,
  fuel_level                            smallint check (fuel_level between 0 and 8),
  tank_size                             int,
  registration_expiration_date          date,
  inspection_expiration_date            date,
  force_availability_due_to_registration_date boolean not null default false,
  force_availability_due_to_inspection_date   boolean not null default false,
  available                             boolean not null default true,
  current_location_id                   uuid references locations(id) on delete set null,
  toll_tag_id                           uuid references toll_tags(id) on delete set null,
  hardware_id                           text,
  hardware_provider                     text,

  -- Telematics (read-only; populated by 3rd-party feed)
  latitude                              numeric(10,7),
  longitude                             numeric(10,7),
  engine_on                             boolean,
  doors_locked                          boolean,
  doors_open                            boolean,
  immobilizer                           boolean,
  keys_in_holder                        boolean,
  speed                                 int,
  outside_geofence                      boolean,
  last_location_update_at               timestamptz,
  last_hardware_update_at               timestamptz,
  private_mode_start_date               timestamptz,
  private_mode_end_date                 timestamptz,

  -- Sharebox (locker system — future)
  sharebox_cabinet_id                   text,
  sharebox_reservation_id               text,
  sharebox_row                          int,
  sharebox_column                       int,
  sharebox_locker_number                text,
  sharebox_keys_in_locker               boolean,

  -- Entry / exit dates
  vehicle_entry_date                    date,
  vehicle_exit_date                     date,

  -- Depreciation
  purchase_price_cents                  int,
  expected_rest_value_cents             int,
  odometer_at_purchase                  int,
  purchase_date                         date,
  depreciation_time_months              int,

  -- Maintenance tracking
  rented_days_without_maintenance       int not null default 0,

  -- Alarm thresholds
  alarm_odometer_threshold              int,
  alarm_days_threshold                  int,

  -- Accounting
  accounting_list_id                    text,
  accounting_edit_sequence              text,
  accounting_reference_type_id          text,

  created_by                            uuid references users(id) on delete set null,
  updated_by                            uuid references users(id) on delete set null,
  deleted_at                            timestamptz,
  created_at                            timestamptz not null default now(),
  updated_at                            timestamptz not null default now()
);

create index vehicles_company_id_idx on vehicles(company_id);
create index vehicles_status_idx on vehicles(company_id, status);
create index vehicles_class_idx on vehicles(vehicle_class_id);
create index vehicles_location_idx on vehicles(current_location_id);
create index vehicles_available_idx on vehicles(company_id, available, status) where deleted_at is null;

-- ============================================================
-- 10. CONTACTS (Customers category=customer, Companies category=company)
-- ============================================================
create table contacts (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null references companies(id) on delete cascade,
  category              contact_category not null default 'customer',
  first_name            text,
  last_name             text,
  company_name          text,           -- for category=company
  website               text,           -- for category=company
  email                 text,
  phone                 text,
  street                text,
  street_2              text,
  city                  text,
  state                 text,           -- default 'Texas'
  zip                   text,
  country               text not null default 'United States',
  birthday              date,
  dl_number             text,
  dl_state              text,
  dl_expiration_date    date,
  dl_file_url           text,           -- Supabase Storage path
  notes                 text,
  blacklisted           boolean not null default false,

  -- Search
  search_vector         tsvector generated always as (
    to_tsvector('english',
      coalesce(first_name, '') || ' ' ||
      coalesce(last_name, '') || ' ' ||
      coalesce(company_name, '') || ' ' ||
      coalesce(email, '') || ' ' ||
      coalesce(phone, '')
    )
  ) stored,

  deleted_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index contacts_company_id_idx on contacts(company_id);
create index contacts_category_idx on contacts(company_id, category);
create index contacts_email_idx on contacts(company_id, email);
create index contacts_search_idx on contacts using gin(search_vector);

-- ============================================================
-- 11. INSURANCE_INFO
-- ============================================================
create table insurance_info (
  id                        uuid primary key default gen_random_uuid(),
  company_id                uuid not null references companies(id) on delete cascade,
  contact_id                uuid references contacts(id) on delete cascade,
  reservation_id            uuid,          -- FK added after reservations table
  insurance_company_name    text,
  insurance_company_number  text,
  agent_name                text,
  agent_number              text,
  insured_name              text,
  insured_address           text,
  insured_phone             text,
  policy_number             text,
  claim_number              text,
  policy_effective_date     date,
  policy_expiration_date    date,
  policy_process_date       date,
  deductible_cents          int,
  coverage_per_person_cents int,
  coverage_per_claim_cents  int,
  loss_payee                text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index insurance_info_contact_idx on insurance_info(contact_id);
create index insurance_info_reservation_idx on insurance_info(reservation_id);

-- ============================================================
-- 12. RESERVATIONS (core rental record)
-- ============================================================
create table reservations (
  id                            uuid primary key default gen_random_uuid(),
  company_id                    uuid not null references companies(id) on delete cascade,
  ra_number                     text not null,    -- e.g. 'RA-0086'; generated on creation
  contact_id                    uuid references contacts(id) on delete set null,
  vehicle_id                    uuid references vehicles(id) on delete set null,
  vehicle_class_id              uuid references vehicle_classes(id) on delete set null,
  pickup_location_id            uuid references locations(id) on delete set null,
  return_location_id            uuid references locations(id) on delete set null,

  -- Dates (all timestamptz)
  pickup_date                   timestamptz,
  return_date                   timestamptz,
  actual_pickup_date            timestamptz,
  actual_return_date            timestamptz,

  -- Status / type
  status                        reservation_status not null default 'pending',
  rental_type                   rental_type not null default 'monthly',
  is_quote                      boolean not null default false,

  -- Pricing (integer cents)
  base_rate_cents               int,
  monthly_rate_cents            int,
  extras_total_cents            int not null default 0,
  discounts_total_cents         int not null default 0,
  coupon_code                   text,
  manual_discount_cents         int,
  manual_discount_is_percentage boolean not null default false,
  tax_cents                     int not null default 0,
  security_deposit_cents        int not null default 0,
  total_cents                   int,
  balance_due_cents             int,
  included_distance             int,       -- miles

  -- Purpose / notes
  purpose                       text,
  notes                         text,

  -- Pickup info
  odometer_at_pickup            int,
  fuel_at_pickup                smallint check (fuel_at_pickup between 0 and 8),
  recalculate_on_late_pickup    boolean not null default false,
  pickup_signature_url          text,

  -- Return info
  odometer_at_return            int,
  fuel_at_return                smallint check (fuel_at_return between 0 and 8),
  charge_fuel                   boolean not null default false,
  recalculate_on_early_return   boolean not null default false,
  return_signature_url          text,

  -- Contract
  confirm_signature_url         text,
  disable_renewal               boolean not null default false,

  -- Quote-specific
  quote_status                  quote_status,
  rack_price_cents              int,
  commission_partner            text,
  client_pays_at_commission_partner boolean,

  created_by                    uuid references users(id) on delete set null,
  updated_by                    uuid references users(id) on delete set null,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

create index reservations_company_id_idx on reservations(company_id);
create index reservations_contact_idx on reservations(contact_id);
create index reservations_vehicle_idx on reservations(vehicle_id);
create index reservations_status_idx on reservations(company_id, status);
create index reservations_dates_idx on reservations(company_id, pickup_date, return_date);
create index reservations_ra_number_idx on reservations(company_id, ra_number);
create index reservations_quote_idx on reservations(company_id, is_quote);
create unique index reservations_ra_number_uniq on reservations(company_id, ra_number);

-- Back-fill FK on insurance_info
alter table insurance_info
  add constraint insurance_info_reservation_fk
  foreign key (reservation_id) references reservations(id) on delete cascade;

-- ============================================================
-- 13. RESERVATION_COMMENTS
-- ============================================================
create table reservation_comments (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references reservations(id) on delete cascade,
  company_id      uuid not null references companies(id) on delete cascade,
  step            int,             -- 1-9 or null for general
  body            text not null,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index reservation_comments_reservation_idx on reservation_comments(reservation_id);

-- ============================================================
-- 14. RESERVATION_DRIVERS
-- ============================================================
create table reservation_drivers (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references reservations(id) on delete cascade,
  company_id      uuid not null references companies(id) on delete cascade,
  contact_id      uuid references contacts(id) on delete set null,
  name            text not null,
  dl_number       text,
  dl_expiry       date,
  age             int,
  is_primary      boolean not null default false,
  created_at      timestamptz not null default now()
);

create index reservation_drivers_reservation_idx on reservation_drivers(reservation_id);

-- ============================================================
-- 15. RESERVATION_EXTRAS (Equipment & Services)
-- ============================================================
create table reservation_extras (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references reservations(id) on delete cascade,
  company_id      uuid not null references companies(id) on delete cascade,
  name            text not null,
  price_cents     int not null default 0,
  quantity        int not null default 1,
  created_at      timestamptz not null default now()
);

create index reservation_extras_reservation_idx on reservation_extras(reservation_id);

-- ============================================================
-- 16. CONTRACT_EXTENSIONS
-- ============================================================
create table contract_extensions (
  id                uuid primary key default gen_random_uuid(),
  reservation_id    uuid not null references reservations(id) on delete cascade,
  company_id        uuid not null references companies(id) on delete cascade,
  new_return_date   timestamptz not null,
  days_extended     int not null,
  comments          text,
  distance_driven   int,
  is_pending        boolean not null default false,
  source            extension_source not null default 'manual',
  created_by        uuid references users(id) on delete set null,  -- null = System Background
  created_at        timestamptz not null default now()
);

create index contract_extensions_reservation_idx on contract_extensions(reservation_id);
-- Idempotency: same reservation + same new_return_date = duplicate auto-renewal
create unique index contract_extensions_auto_renewal_uniq
  on contract_extensions(reservation_id, new_return_date)
  where source = 'auto_renewal';

-- ============================================================
-- 17. PAYMENTS
-- ============================================================
create table payments (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references reservations(id) on delete cascade,
  company_id      uuid not null references companies(id) on delete cascade,
  amount_cents    int not null,
  method          payment_method not null default 'cash',
  type            payment_type not null default 'offline',
  stripe_payment_intent_id text,
  notes           text,
  recorded_at     timestamptz not null default now(),
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index payments_reservation_idx on payments(reservation_id);
create index payments_company_id_idx on payments(company_id);

-- ============================================================
-- 18. REFUNDS
-- ============================================================
create table refunds (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references reservations(id) on delete cascade,
  company_id      uuid not null references companies(id) on delete cascade,
  amount_cents    int not null,
  reason          text,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index refunds_reservation_idx on refunds(reservation_id);

-- ============================================================
-- 19. RESERVATION_ATTEMPTS (abandoned bookings)
-- ============================================================
create table reservation_attempts (
  id                       uuid primary key default gen_random_uuid(),
  company_id               uuid not null references companies(id) on delete cascade,
  email                    text,
  phone                    text,
  pickup_location_id       uuid references locations(id) on delete set null,
  return_location_id       uuid references locations(id) on delete set null,
  pickup_date              timestamptz,
  return_date              timestamptz,
  contact_id               uuid references contacts(id) on delete set null,
  reservation_type         rental_type,
  branch_id                uuid references locations(id) on delete set null,
  total_available_vehicles int,
  vehicle_class_id         uuid references vehicle_classes(id) on delete set null,
  last_step                int,
  created_at               timestamptz not null default now()
);

create index reservation_attempts_company_id_idx on reservation_attempts(company_id);

-- ============================================================
-- 20. EXTERNAL_CHARGES (Tolls, Tickets)
-- ============================================================
create table external_charges (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  vehicle_id      uuid references vehicles(id) on delete set null,
  reservation_id  uuid references reservations(id) on delete set null,
  label           text not null,          -- 'Toll' or 'Ticket'
  amount_cents    int not null,
  charge_date     date,
  status          charge_status not null default 'unpaid',
  vehicle_plate   text,
  toll_tag_number text,
  toll_agency     text,
  notes           text,
  created_at      timestamptz not null default now()
);

create index external_charges_company_id_idx on external_charges(company_id);
create index external_charges_vehicle_idx on external_charges(vehicle_id);
create index external_charges_reservation_idx on external_charges(reservation_id);

-- ============================================================
-- 21. REPAIR_ORDERS
-- ============================================================
create table repair_orders (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  vehicle_id      uuid not null references vehicles(id) on delete cascade,
  maintenance_type text,                  -- 'Oil Change', 'Other', etc.
  date_out        date,
  date_due        date,
  date_in         date,
  parts_total_cents  int not null default 0,
  labor_total_cents  int not null default 0,
  taxes_total_cents  int not null default 0,
  total_amount_cents int not null default 0,
  fuel_level_out  smallint check (fuel_level_out between 0 and 8),
  fuel_level_in   smallint check (fuel_level_in between 0 and 8),
  odometer_out    int,
  odometer_in     int,
  notes           text,
  comments        text,
  status          repair_status not null default 'pending',
  mechanic_name   text,
  workshop_name   text,
  phone_number    text,
  address         text,
  created_by      uuid references users(id) on delete set null,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index repair_orders_company_id_idx on repair_orders(company_id);
create index repair_orders_vehicle_idx on repair_orders(vehicle_id) where deleted_at is null;
create index repair_orders_date_due_idx on repair_orders(company_id, date_due) where deleted_at is null;

-- ============================================================
-- 22. MAINTENANCE_RECORDS (scheduled maintenance per vehicle)
-- ============================================================
create table maintenance_records (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null references companies(id) on delete cascade,
  vehicle_id            uuid not null references vehicles(id) on delete cascade,
  maintenance_type      text not null,      -- 'Oil Change', 'Tire Change', etc.
  interval_type         text,               -- 'miles' or 'days'
  interval_value        int,
  planned_start_date    date,
  planned_end_date      date,
  odometer_at_due       int,
  current_odometer      int,
  status                maintenance_status not null default 'pending',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index maintenance_records_company_id_idx on maintenance_records(company_id);
create index maintenance_records_vehicle_idx on maintenance_records(vehicle_id);
create index maintenance_records_status_idx on maintenance_records(company_id, status);

-- ============================================================
-- 23. FINES (custom sheet #1)
-- ============================================================
create table fines (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null references companies(id) on delete cascade,
  fine_number           text,
  fine_type             text,
  vehicle_plate         text,
  date_of_fine          date,
  date_time_of_offense  timestamptz,
  paid_to_authority     text,
  notes                 text,
  created_at            timestamptz not null default now()
);

create index fines_company_id_idx on fines(company_id);

-- ============================================================
-- 24. AUDIT_LOGS
-- ============================================================
create table audit_logs (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,
  method          text,                    -- GET, POST, PATCH, DELETE
  event_count     int,
  path            text,
  source          text not null default 'Internal',
  created_at      timestamptz not null default now()
);

create index audit_logs_company_id_idx on audit_logs(company_id);
create index audit_logs_user_idx on audit_logs(user_id);
create index audit_logs_created_at_idx on audit_logs(company_id, created_at desc);

-- ============================================================
-- 25. FILES (uploaded files with soft delete)
-- ============================================================
create table files (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  storage_path    text not null,          -- Supabase Storage path
  file_name       text not null,
  file_size_bytes int,
  mime_type       text,
  related_type    text,                   -- 'vehicle', 'contact', 'reservation', 'repair_order'
  related_id      uuid,
  deleted_at      timestamptz,
  deleted_by      uuid references users(id) on delete set null,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index files_company_id_idx on files(company_id);
create index files_related_idx on files(related_type, related_id) where deleted_at is null;

-- ============================================================
-- 26. VEHICLE_IMAGES (damage + pickup/return photos)
-- ============================================================
create table vehicle_images (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  reservation_id  uuid references reservations(id) on delete cascade,
  vehicle_id      uuid references vehicles(id) on delete cascade,
  file_id         uuid references files(id) on delete cascade,
  image_type      text not null,          -- 'pickup', 'return', 'damage', 'vehicle'
  created_at      timestamptz not null default now()
);

create index vehicle_images_reservation_idx on vehicle_images(reservation_id);
create index vehicle_images_vehicle_idx on vehicle_images(vehicle_id);

-- ============================================================
-- 27. DAMAGE_REPORTS
-- ============================================================
create table damage_reports (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references companies(id) on delete cascade,
  reservation_id  uuid references reservations(id) on delete cascade,
  vehicle_id      uuid references vehicles(id) on delete cascade,
  description     text,
  report_type     text not null default 'pickup',   -- 'pickup', 'return'
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index damage_reports_reservation_idx on damage_reports(reservation_id);
create index damage_reports_vehicle_idx on damage_reports(vehicle_id);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tenant tables
alter table companies enable row level security;
alter table users enable row level security;
alter table locations enable row level security;
alter table vehicle_models enable row level security;
alter table vehicle_types enable row level security;
alter table fuel_types enable row level security;
alter table vehicle_classes enable row level security;
alter table toll_tags enable row level security;
alter table vehicles enable row level security;
alter table contacts enable row level security;
alter table insurance_info enable row level security;
alter table reservations enable row level security;
alter table reservation_comments enable row level security;
alter table reservation_drivers enable row level security;
alter table reservation_extras enable row level security;
alter table contract_extensions enable row level security;
alter table payments enable row level security;
alter table refunds enable row level security;
alter table reservation_attempts enable row level security;
alter table external_charges enable row level security;
alter table repair_orders enable row level security;
alter table maintenance_records enable row level security;
alter table fines enable row level security;
alter table audit_logs enable row level security;
alter table files enable row level security;
alter table vehicle_images enable row level security;
alter table damage_reports enable row level security;

-- Helper function: get the company_id for the current auth user
create or replace function auth_company_id()
returns uuid language sql stable as $$
  select company_id from users where id = auth.uid()
$$;

-- Generic company isolation policy (apply to every table with company_id)
-- Pattern: users can only see rows from their company
-- (Applied individually per table so names are unique)

create policy "users see own company" on users
  for all using (company_id = auth_company_id());

create policy "locations own company" on locations
  for all using (company_id = auth_company_id());

create policy "vehicle_models own company" on vehicle_models
  for all using (company_id = auth_company_id());

create policy "vehicle_types own company" on vehicle_types
  for all using (company_id = auth_company_id());

create policy "fuel_types own company" on fuel_types
  for all using (company_id = auth_company_id());

create policy "vehicle_classes own company" on vehicle_classes
  for all using (company_id = auth_company_id());

create policy "toll_tags own company" on toll_tags
  for all using (company_id = auth_company_id());

create policy "vehicles own company" on vehicles
  for all using (company_id = auth_company_id());

create policy "contacts own company" on contacts
  for all using (company_id = auth_company_id());

create policy "insurance_info own company" on insurance_info
  for all using (company_id = auth_company_id());

create policy "reservations own company" on reservations
  for all using (company_id = auth_company_id());

create policy "reservation_comments own company" on reservation_comments
  for all using (company_id = auth_company_id());

create policy "reservation_drivers own company" on reservation_drivers
  for all using (company_id = auth_company_id());

create policy "reservation_extras own company" on reservation_extras
  for all using (company_id = auth_company_id());

create policy "contract_extensions own company" on contract_extensions
  for all using (company_id = auth_company_id());

create policy "payments own company" on payments
  for all using (company_id = auth_company_id());

create policy "refunds own company" on refunds
  for all using (company_id = auth_company_id());

create policy "reservation_attempts own company" on reservation_attempts
  for all using (company_id = auth_company_id());

create policy "external_charges own company" on external_charges
  for all using (company_id = auth_company_id());

create policy "repair_orders own company" on repair_orders
  for all using (company_id = auth_company_id());

create policy "maintenance_records own company" on maintenance_records
  for all using (company_id = auth_company_id());

create policy "fines own company" on fines
  for all using (company_id = auth_company_id());

create policy "audit_logs own company" on audit_logs
  for all using (company_id = auth_company_id());

create policy "files own company" on files
  for all using (company_id = auth_company_id());

create policy "vehicle_images own company" on vehicle_images
  for all using (company_id = auth_company_id());

create policy "damage_reports own company" on damage_reports
  for all using (company_id = auth_company_id());

-- ============================================================
-- SEED: RA number sequence function
-- ============================================================
create or replace function next_ra_number(p_company_id uuid)
returns text language plpgsql as $$
declare
  v_next int;
begin
  select coalesce(
    max(cast(regexp_replace(ra_number, '[^0-9]', '', 'g') as int)), 0
  ) + 1
  into v_next
  from reservations
  where company_id = p_company_id;

  return 'RA-' || lpad(v_next::text, 4, '0');
end;
$$;

-- ============================================================
-- SEED: Default company + vehicle classes for Rent a Car LLC
-- ============================================================
-- Run after Supabase project is set up; replace UUIDs as needed

-- insert into companies (id, name, address, phone, email, timezone)
-- values (
--   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--   'Rent a Car LLC',
--   '6537 Lyndon B Johnson Fwy Dallas, TX 75240',
--   NULL, NULL,
--   'America/Chicago'
-- );

-- insert into vehicle_classes (company_id, name, monthly_rate_cents, transmission_type, order_index)
-- values
--   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '+Hybrid',  42500, 'Automatic', 1),
--   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '+Basic',   45000, 'Automatic', 2),
--   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '+Regular', 52500, 'Automatic', 3),
--   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '+VIP',     75000, 'Automatic', 4);
