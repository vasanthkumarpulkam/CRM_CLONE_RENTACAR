/**
 * Database type definitions for the Rent a Car LLC CRM.
 * Generated from schema.sql — keep in sync with migrations.
 *
 * Run `supabase gen types typescript --local > src/lib/supabase/types.ts`
 * after applying migrations to regenerate automatically.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "staff";
export type ReservationStatus = "pending" | "confirmed" | "active" | "returned" | "cancelled";
export type RentalType = "daily" | "weekly" | "monthly";
export type PaymentMethod = "cash" | "card" | "check" | "other";
export type PaymentType = "offline" | "online" | "request";
export type VehicleStatus =
  | "available" | "dirty" | "returned" | "out_of_service" | "on_sale" | "sold"
  | "complementary" | "new" | "reserved" | "stolen" | "recovered" | "totaled"
  | "repossessed";
export type ContactCategory = "customer" | "company";
export type QuoteStatus = "draft" | "sent" | "expired" | "accepted";
export type ChargeStatus = "paid" | "unpaid";
export type RepairStatus = "pending" | "in_progress" | "done";
export type MaintenanceStatus = "pending" | "done";
export type ExtensionSource = "manual" | "auto_renewal";

// ─── Table Row Types ──────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  company_id: string;
  name: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleClass {
  id: string;
  company_id: string;
  name: string;
  calendar_order: number | null;
  order_index: number | null;
  daily_rate_cents: number | null;
  weekly_rate_cents: number | null;
  monthly_rate_cents: number | null;
  transmission_type: string;
  seats: number | null;
  bags: number | null;
  doors: number | null;
  air_conditioning: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  vehicle_key: string | null;
  label: string | null;
  vehicle_model_id: string | null;
  vehicle_class_id: string | null;
  vehicle_type_id: string | null;
  fuel_type_id: string | null;
  year: number | null;
  color: string | null;
  vin: string | null;
  plate: string | null;
  odometer: number | null;
  status: VehicleStatus;
  fuel_level: number | null;
  current_location_id: string | null;
  toll_tag_id: string | null;
  available: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  category: ContactCategory;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  dl_number: string | null;
  dl_state: string | null;
  dl_expiration_date: string | null;
  notes: string | null;
  blacklisted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  company_id: string;
  ra_number: string;
  contact_id: string | null;
  vehicle_id: string | null;
  vehicle_class_id: string | null;
  pickup_location_id: string | null;
  return_location_id: string | null;
  pickup_date: string | null;
  return_date: string | null;
  actual_pickup_date: string | null;
  actual_return_date: string | null;
  status: ReservationStatus;
  rental_type: RentalType;
  is_quote: boolean;
  base_rate_cents: number | null;
  monthly_rate_cents: number | null;
  extras_total_cents: number;
  discounts_total_cents: number;
  tax_cents: number;
  security_deposit_cents: number;
  total_cents: number | null;
  balance_due_cents: number | null;
  purpose: string | null;
  notes: string | null;
  odometer_at_pickup: number | null;
  fuel_at_pickup: number | null;
  odometer_at_return: number | null;
  fuel_at_return: number | null;
  charge_fuel: boolean;
  confirm_signature_url: string | null;
  pickup_signature_url: string | null;
  return_signature_url: string | null;
  disable_renewal: boolean;
  quote_status: QuoteStatus | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  reservation_id: string;
  company_id: string;
  amount_cents: number;
  method: PaymentMethod;
  type: PaymentType;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  recorded_at: string;
  created_by: string | null;
  created_at: string;
}

export interface ExternalCharge {
  id: string;
  company_id: string;
  vehicle_id: string | null;
  reservation_id: string | null;
  label: string;
  amount_cents: number;
  charge_date: string | null;
  status: ChargeStatus;
  vehicle_plate: string | null;
  toll_tag_number: string | null;
  toll_agency: string | null;
  notes: string | null;
  created_at: string;
}

export interface Fine {
  id: string;
  company_id: string;
  fine_number: string | null;
  fine_type: string | null;
  vehicle_plate: string | null;
  date_of_fine: string | null;
  notes: string | null;
  created_at: string;
}

export interface TollTag {
  id: string;
  company_id: string;
  tag_number: string;
  created_at: string;
}

export interface RepairOrder {
  id: string;
  company_id: string;
  vehicle_id: string;
  maintenance_type: string | null;
  date_out: string | null;
  date_due: string | null;
  date_in: string | null;
  parts_total_cents: number;
  labor_total_cents: number;
  taxes_total_cents: number;
  total_amount_cents: number;
  notes: string | null;
  status: RepairStatus;
  mechanic_name: string | null;
  workshop_name: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  company_id: string;
  vehicle_id: string;
  maintenance_type: string;
  interval_type: string | null;
  interval_value: number | null;
  planned_start_date: string | null;
  planned_end_date: string | null;
  status: MaintenanceStatus;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  company_id: string;
  user_id: string | null;
  method: string | null;
  path: string | null;
  source: string;
  created_at: string;
}

// ─── Database generic type (used by Supabase client) ─────────────────────────

export interface Database {
  public: {
    Tables: {
      companies:            { Row: Company;           Insert: Partial<Company>;           Update: Partial<Company> };
      users:                { Row: User;              Insert: Partial<User>;              Update: Partial<User> };
      locations:            { Row: Location;          Insert: Partial<Location>;          Update: Partial<Location> };
      vehicle_classes:      { Row: VehicleClass;      Insert: Partial<VehicleClass>;      Update: Partial<VehicleClass> };
      vehicles:             { Row: Vehicle;           Insert: Partial<Vehicle>;           Update: Partial<Vehicle> };
      contacts:             { Row: Contact;           Insert: Partial<Contact>;           Update: Partial<Contact> };
      reservations:         { Row: Reservation;       Insert: Partial<Reservation>;       Update: Partial<Reservation> };
      payments:             { Row: Payment;           Insert: Partial<Payment>;           Update: Partial<Payment> };
      external_charges:     { Row: ExternalCharge;    Insert: Partial<ExternalCharge>;    Update: Partial<ExternalCharge> };
      fines:                { Row: Fine;              Insert: Partial<Fine>;              Update: Partial<Fine> };
      toll_tags:            { Row: TollTag;           Insert: Partial<TollTag>;           Update: Partial<TollTag> };
      repair_orders:        { Row: RepairOrder;       Insert: Partial<RepairOrder>;       Update: Partial<RepairOrder> };
      maintenance_records:  { Row: MaintenanceRecord; Insert: Partial<MaintenanceRecord>; Update: Partial<MaintenanceRecord> };
      audit_logs:           { Row: AuditLog;          Insert: Partial<AuditLog>;          Update: Partial<AuditLog> };
    };
    Functions: {
      next_ra_number: { Args: { p_company_id: string }; Returns: string };
      auth_company_id: { Args: Record<string, never>; Returns: string };
    };
  };
}
