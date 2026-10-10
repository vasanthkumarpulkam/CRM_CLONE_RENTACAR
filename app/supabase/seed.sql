-- =============================================================================
-- Seed data for Rent a Car LLC CRM replica
-- Run AFTER applying schema.sql and creating the first auth user manually.
--
-- Usage (Supabase MCP / psql):
--   psql $DATABASE_URL -f supabase/seed.sql
--
-- NOTE: Replace the auth_user_id placeholder below with the UUID of the admin
-- user you created in the Supabase Dashboard → Authentication → Users.
-- =============================================================================

-- ─── Company ─────────────────────────────────────────────────────────────────
INSERT INTO companies (id, name, address, phone, email, timezone)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Rent a Car LLC',
  '4321 Fleet Ave, Miami, FL 33101',
  '(305) 555-0100',
  'ops@rentacarllc.example',
  'America/New_York'
) ON CONFLICT (id) DO NOTHING;

-- ─── Auth user → CRM user (replace with your Supabase auth UID) ─────────────
-- Step 1: Create a user in Supabase Dashboard → Auth → Users with:
--           Email: admin@rentacarllc.example   Password: Admin1234!
-- Step 2: Copy the UUID and paste it here:
DO $$
DECLARE
  v_auth_uid uuid := '00000000-0000-0000-0000-000000000000'; -- ← REPLACE ME
  v_company  uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
BEGIN
  INSERT INTO users (id, company_id, email, full_name, role)
  VALUES (v_auth_uid, v_company, 'admin@rentacarllc.example', 'Admin User', 'admin')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ─── Locations ───────────────────────────────────────────────────────────────
INSERT INTO locations (id, company_id, name, address, is_active)
VALUES
  ('bbbbbbbb-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Main Office',     '4321 Fleet Ave, Miami, FL',         true),
  ('bbbbbbbb-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Airport Depot',   '2100 NW 42nd Ave, Miami, FL 33122', true),
  ('bbbbbbbb-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'South Branch',    '900 Brickell Ave, Miami, FL 33131', true)
ON CONFLICT (id) DO NOTHING;

-- ─── Vehicle Classes ─────────────────────────────────────────────────────────
INSERT INTO vehicle_classes (id, company_id, name, order_index, daily_rate_cents, weekly_rate_cents, monthly_rate_cents, transmission_type, seats, bags, doors, air_conditioning)
VALUES
  ('cccccccc-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Economy',       1, 4500,  28000,  89500,  'Automatic', 5, 2, 4, true),
  ('cccccccc-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Compact',       2, 5500,  34000, 109500,  'Automatic', 5, 3, 4, true),
  ('cccccccc-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Mid-Size',      3, 6500,  42000, 139500,  'Automatic', 5, 3, 4, true),
  ('cccccccc-0004-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Full-Size',     4, 7500,  49500, 159500,  'Automatic', 5, 4, 4, true),
  ('cccccccc-0005-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'SUV',           5, 9500,  62000, 199500,  'Automatic', 7, 4, 4, true),
  ('cccccccc-0006-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Luxury',        6,14500,  95000, 299500,  'Automatic', 5, 3, 4, true),
  ('cccccccc-0007-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Cargo Van',     7,10500,  68000, 219500,  'Automatic', 3, 0, 2, true),
  ('cccccccc-0008-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Pickup Truck',  8, 9000,  58500, 185000,  'Automatic', 5, 0, 4, true)
ON CONFLICT (id) DO NOTHING;

-- ─── Vehicles ────────────────────────────────────────────────────────────────
INSERT INTO vehicles (id, company_id, vehicle_key, label, vehicle_class_id, year, color, plate, odometer, status, fuel_level, current_location_id, available)
VALUES
  ('dddddddd-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'ECO-01', '2022 Toyota Corolla',          'cccccccc-0001-0000-0000-000000000001', 2022, 'White',    'ABC-1234', 34200, 'available', 8, 'bbbbbbbb-0001-0000-0000-000000000001', true),
  ('dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'ECO-02', '2023 Nissan Versa',            'cccccccc-0001-0000-0000-000000000001', 2023, 'Silver',   'ABC-2345', 12800, 'available', 7, 'bbbbbbbb-0001-0000-0000-000000000001', true),
  ('dddddddd-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'COM-01', '2022 Honda Civic',             'cccccccc-0002-0000-0000-000000000001', 2022, 'Blue',     'DEF-3456', 28500, 'available', 6, 'bbbbbbbb-0002-0000-0000-000000000001', true),
  ('dddddddd-0004-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'MID-01', '2023 Toyota Camry',            'cccccccc-0003-0000-0000-000000000001', 2023, 'Black',    'GHI-4567',  8200, 'reserved',  8, 'bbbbbbbb-0001-0000-0000-000000000001', false),
  ('dddddddd-0005-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'FUL-01', '2022 Chevrolet Malibu',        'cccccccc-0004-0000-0000-000000000001', 2022, 'Red',      'JKL-5678', 41600, 'dirty',     5, 'bbbbbbbb-0001-0000-0000-000000000001', false),
  ('dddddddd-0006-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'SUV-01', '2023 Ford Explorer',           'cccccccc-0005-0000-0000-000000000001', 2023, 'Gray',     'MNO-6789', 15300, 'available', 8, 'bbbbbbbb-0002-0000-0000-000000000001', true),
  ('dddddddd-0007-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'LUX-01', '2023 BMW 5 Series',            'cccccccc-0006-0000-0000-000000000001', 2023, 'Midnight', 'PQR-7890',  4100, 'available', 8, 'bbbbbbbb-0003-0000-0000-000000000001', true),
  ('dddddddd-0008-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'VAN-01', '2022 Ford Transit Connect',    'cccccccc-0007-0000-0000-000000000001', 2022, 'White',    'STU-8901', 62400, 'out_of_service', 4, 'bbbbbbbb-0001-0000-0000-000000000001', false)
ON CONFLICT (id) DO NOTHING;

-- ─── Contacts (Customers) ────────────────────────────────────────────────────
INSERT INTO contacts (id, company_id, category, first_name, last_name, email, phone, city, state, zip, country, dl_number, dl_state, blacklisted)
VALUES
  ('eeeeeeee-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'customer', 'Maria',   'Gonzalez', 'maria.g@example.com',   '(305) 555-1001', 'Miami',     'FL', '33101', 'US', 'G123456789', 'FL', false),
  ('eeeeeeee-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'customer', 'James',   'Williams', 'jwilliams@example.com', '(305) 555-1002', 'Hialeah',   'FL', '33010', 'US', 'W987654321', 'FL', false),
  ('eeeeeeee-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'customer', 'Ashley',  'Turner',   'ashley.t@example.com',  '(786) 555-1003', 'Coral Gables','FL','33134','US', 'T456789012', 'FL', false),
  ('eeeeeeee-0004-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'customer', 'Robert',  'Chen',     'rob.chen@example.com',  '(954) 555-1004', 'Doral',     'FL', '33166', 'US', 'C234567890', 'FL', false),
  ('eeeeeeee-0005-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'customer', 'Priya',   'Patel',    'priya.p@example.com',   '(305) 555-1005', 'Aventura',  'FL', '33180', 'US', 'P678901234', 'FL', false),
  ('eeeeeeee-0006-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'company',  null,       null,      'fleet@blueway.example', '(305) 555-2001', 'Miami',     'FL', '33132', 'US', null, null, false)
ON CONFLICT (id) DO NOTHING;
-- Update company name for corporate contact
UPDATE contacts SET company_name = 'Blueway Logistics Inc.' WHERE id = 'eeeeeeee-0006-0000-0000-000000000001';

-- ─── Sample Reservations ─────────────────────────────────────────────────────
INSERT INTO reservations (
  id, company_id, ra_number, contact_id, vehicle_id, vehicle_class_id,
  pickup_location_id, return_location_id,
  pickup_date, return_date,
  status, rental_type, is_quote,
  base_rate_cents, extras_total_cents, discounts_total_cents, tax_cents,
  security_deposit_cents, total_cents, balance_due_cents
)
VALUES
  (
    'ffffffff-0001-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'RA-00001',
    'eeeeeeee-0004-0000-0000-000000000001',
    'dddddddd-0004-0000-0000-000000000001',
    'cccccccc-0003-0000-0000-000000000001',
    'bbbbbbbb-0001-0000-0000-000000000001',
    'bbbbbbbb-0001-0000-0000-000000000001',
    (CURRENT_DATE + INTERVAL '1 day')::text,
    (CURRENT_DATE + INTERVAL '31 days')::text,
    'confirmed', 'monthly', false,
    139500, 0, 0, 9765, 50000, 149265, 149265
  ),
  (
    'ffffffff-0002-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'RA-00002',
    'eeeeeeee-0001-0000-0000-000000000001',
    'dddddddd-0006-0000-0000-000000000001',
    'cccccccc-0005-0000-0000-000000000001',
    'bbbbbbbb-0002-0000-0000-000000000001',
    'bbbbbbbb-0001-0000-0000-000000000001',
    (CURRENT_DATE - INTERVAL '5 days')::text,
    (CURRENT_DATE + INTERVAL '25 days')::text,
    'active', 'monthly', false,
    199500, 5000, 0, 14315, 75000, 218815, 143815
  ),
  (
    'ffffffff-0003-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'RA-00003',
    'eeeeeeee-0002-0000-0000-000000000001',
    'dddddddd-0001-0000-0000-000000000001',
    'cccccccc-0001-0000-0000-000000000001',
    'bbbbbbbb-0001-0000-0000-000000000001',
    'bbbbbbbb-0001-0000-0000-000000000001',
    (CURRENT_DATE - INTERVAL '35 days')::text,
    (CURRENT_DATE - INTERVAL '5 days')::text,
    'returned', 'monthly', false,
    89500, 0, 4475, 5953, 30000, 91000, 0
  ),
  (
    'ffffffff-0004-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'RA-00004',
    'eeeeeeee-0003-0000-0000-000000000001',
    null,
    'cccccccc-0006-0000-0000-000000000001',
    'bbbbbbbb-0003-0000-0000-000000000001',
    'bbbbbbbb-0003-0000-0000-000000000001',
    (CURRENT_DATE + INTERVAL '3 days')::text,
    (CURRENT_DATE + INTERVAL '33 days')::text,
    'pending', 'monthly', false,
    299500, 0, 0, 20965, 100000, 320465, 320465
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Toll Tags ────────────────────────────────────────────────────────────────
INSERT INTO toll_tags (id, company_id, tag_number)
VALUES
  ('11111111-0001-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'SUN-4821001'),
  ('11111111-0002-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'SUN-4821002'),
  ('11111111-0003-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'SUN-4821003')
ON CONFLICT (id) DO NOTHING;
