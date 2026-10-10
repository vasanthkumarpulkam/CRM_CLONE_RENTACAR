/**
 * Fake data layer — same function signatures as the real DB layer.
 * Swap this file for src/lib/db.ts when replica-backend runs.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReservationStatus =
  | "pending" | "confirmed" | "active" | "returned" | "cancelled";

export type VehicleStatus =
  | "available" | "on_rent" | "dirty" | "maintenance" | "repair";

export type ContactCategory = "customer" | "company";

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface VehicleClass {
  id: string;
  name: string;
  transmission: string;
  monthly_rate_cents: number;
}

export interface Vehicle {
  id: string;
  key: string;
  vin: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  class_id: string;
  class_name: string;
  status: VehicleStatus;
  fuel_level: number; // 0-8
  odometer: number;
  location_id: string;
  location_name: string;
  available_date: string | null;
  current_renter: string | null;
}

export interface Contact {
  id: string;
  category: ContactCategory;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  dl_number: string;
  dl_expiry: string;
  reservation_count: number;
}

export interface Reservation {
  id: string;
  ra_number: string;
  status: ReservationStatus;
  customer_id: string | null;
  customer_name: string | null;
  vehicle_id: string | null;
  vehicle_plate: string | null;
  vehicle_class: string | null;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_cents: number;
  outstanding_cents: number;
  fuel_level_out: number | null;
  fuel_level_in: number | null;
  odometer_out: number | null;
  odometer_in: number | null;
  notes: string | null;
  current_step: number; // 1-9
}

export interface DashboardStats {
  pickups_today: number;
  returns_today: number;
  overdues: number;
  fleet_on_rent: number;
  fleet_available: number;
  fleet_dirty: number;
  fleet_maintenance: number;
  utilization_by_class: { class_name: string; pct: number }[];
}

// ─── Seed data ────────────────────────────────────────────────────────────────

export const LOCATIONS: Location[] = [
  { id: "loc1", name: "Dallas – LBJ", address: "6537 Lyndon B Johnson Fwy, Dallas, TX 75240" },
  { id: "loc2", name: "Dallas – Stemmons", address: "2121 Stemmons Fwy, Dallas, TX 75207" },
];

export const VEHICLE_CLASSES: VehicleClass[] = [
  { id: "vc1", name: "+Hybrid",  transmission: "Automatic", monthly_rate_cents: 42500 },
  { id: "vc2", name: "+Basic",   transmission: "Automatic", monthly_rate_cents: 45000 },
  { id: "vc3", name: "+Regular", transmission: "Automatic", monthly_rate_cents: 52500 },
  { id: "vc4", name: "+VIP",     transmission: "Automatic", monthly_rate_cents: 75000 },
];

export const VEHICLES: Vehicle[] = [
  { id: "v1",  key: "K001", vin: "1HGCM82633A123456", plate: "TX-ABC123", make: "Toyota", model: "Camry Hybrid",   year: 2023, color: "White",  class_id: "vc1", class_name: "+Hybrid",  status: "available",   fuel_level: 8, odometer: 34210, location_id: "loc1", location_name: "Dallas – LBJ",      available_date: null,         current_renter: null },
  { id: "v2",  key: "K002", vin: "1HGCM82633A234567", plate: "TX-DEF456", make: "Honda",  model: "Accord",         year: 2022, color: "Silver", class_id: "vc2", class_name: "+Basic",   status: "on_rent",     fuel_level: 6, odometer: 51000, location_id: "loc1", location_name: "Dallas – LBJ",      available_date: "2026-10-14", current_renter: "Maria R." },
  { id: "v3",  key: "K003", vin: "1HGCM82633A345678", plate: "TX-GHI789", make: "Toyota", model: "Corolla",        year: 2023, color: "Black",  class_id: "vc2", class_name: "+Basic",   status: "dirty",       fuel_level: 3, odometer: 28900, location_id: "loc1", location_name: "Dallas – LBJ",      available_date: null,         current_renter: null },
  { id: "v4",  key: "K004", vin: "1HGCM82633A456789", plate: "TX-JKL012", make: "BMW",    model: "5 Series",       year: 2023, color: "Black",  class_id: "vc4", class_name: "+VIP",     status: "available",   fuel_level: 8, odometer: 12300, location_id: "loc1", location_name: "Dallas – LBJ",      available_date: null,         current_renter: null },
  { id: "v5",  key: "K005", vin: "1HGCM82633A567890", plate: "TX-MNO345", make: "Toyota", model: "Camry",          year: 2022, color: "Blue",   class_id: "vc3", class_name: "+Regular", status: "on_rent",     fuel_level: 5, odometer: 62100, location_id: "loc2", location_name: "Dallas – Stemmons", available_date: "2026-10-12", current_renter: "James T." },
  { id: "v6",  key: "K006", vin: "1HGCM82633A678901", plate: "TX-PQR678", make: "Nissan", model: "Altima",         year: 2023, color: "White",  class_id: "vc3", class_name: "+Regular", status: "maintenance", fuel_level: 4, odometer: 18750, location_id: "loc1", location_name: "Dallas – LBJ",      available_date: "2026-10-18", current_renter: null },
  { id: "v7",  key: "K007", vin: "1HGCM82633A789012", plate: "TX-STU901", make: "Honda",  model: "Civic Hybrid",   year: 2024, color: "Gray",   class_id: "vc1", class_name: "+Hybrid",  status: "available",   fuel_level: 8, odometer: 8200,  location_id: "loc1", location_name: "Dallas – LBJ",      available_date: null,         current_renter: null },
  { id: "v8",  key: "K008", vin: "1HGCM82633A890123", plate: "TX-VWX234", make: "Mercedes", model: "E-Class",     year: 2023, color: "Silver", class_id: "vc4", class_name: "+VIP",     status: "on_rent",     fuel_level: 7, odometer: 22400, location_id: "loc2", location_name: "Dallas – Stemmons", available_date: "2026-10-20", current_renter: "Sarah K." },
];

export const CONTACTS: Contact[] = [
  { id: "c1", category: "customer", first_name: "Maria",  last_name: "Rodriguez", email: "maria.r@email.com",  phone: "214-555-0101", street: "123 Oak St",      city: "Dallas",      state: "TX", zip: "75201", dl_number: "TX1234567",  dl_expiry: "2027-06-15", reservation_count: 3 },
  { id: "c2", category: "customer", first_name: "James",  last_name: "Thompson",  email: "jthompson@email.com", phone: "214-555-0202", street: "456 Elm Ave",     city: "Irving",      state: "TX", zip: "75039", dl_number: "TX2345678",  dl_expiry: "2025-03-20", reservation_count: 7 },
  { id: "c3", category: "customer", first_name: "Sarah",  last_name: "Kim",       email: "sarah.kim@email.com", phone: "469-555-0303", street: "789 Pine Rd",     city: "Plano",       state: "TX", zip: "75024", dl_number: "TX3456789",  dl_expiry: "2028-11-30", reservation_count: 1 },
  { id: "c4", category: "customer", first_name: "David",  last_name: "Martinez",  email: "dmartinez@email.com", phone: "972-555-0404", street: "321 Maple Dr",    city: "Garland",     state: "TX", zip: "75040", dl_number: "TX4567890",  dl_expiry: "2026-08-05", reservation_count: 2 },
  { id: "c5", category: "customer", first_name: "Linda",  last_name: "Johnson",   email: "ljohnson@email.com",  phone: "817-555-0505", street: "654 Cedar Blvd",  city: "Fort Worth",  state: "TX", zip: "76102", dl_number: "TX5678901",  dl_expiry: "2027-01-22", reservation_count: 4 },
];

export const RESERVATIONS: Reservation[] = [
  { id: "r1",  ra_number: "RA-2026-001", status: "active",     customer_id: "c1", customer_name: "Maria Rodriguez", vehicle_id: "v2", vehicle_plate: "TX-DEF456", vehicle_class: "+Basic",   pickup_date: "2026-10-05", return_date: "2026-11-05", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 45000, outstanding_cents: 0,     fuel_level_out: 8, fuel_level_in: null, odometer_out: 50800, odometer_in: null, notes: null,            current_step: 8 },
  { id: "r2",  ra_number: "RA-2026-002", status: "active",     customer_id: "c3", customer_name: "Sarah Kim",       vehicle_id: "v8", vehicle_plate: "TX-VWX234", vehicle_class: "+VIP",     pickup_date: "2026-09-20", return_date: "2026-10-20", pickup_location: "Dallas – Stemmons", return_location: "Dallas – Stemmons", total_cents: 75000, outstanding_cents: 0,     fuel_level_out: 8, fuel_level_in: null, odometer_out: 21900, odometer_in: null, notes: "VIP client",    current_step: 8 },
  { id: "r3",  ra_number: "RA-2026-003", status: "active",     customer_id: "c2", customer_name: "James Thompson",  vehicle_id: "v5", vehicle_plate: "TX-MNO345", vehicle_class: "+Regular", pickup_date: "2026-09-12", return_date: "2026-10-12", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 52500, outstanding_cents: 5250,  fuel_level_out: 8, fuel_level_in: null, odometer_out: 61500, odometer_in: null, notes: null,            current_step: 8 },
  { id: "r4",  ra_number: "RA-2026-004", status: "pending",    customer_id: "c4", customer_name: "David Martinez",  vehicle_id: null, vehicle_plate: null,        vehicle_class: "+Basic",   pickup_date: "2026-10-15", return_date: "2026-11-15", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 45000, outstanding_cents: 45000, fuel_level_out: null, fuel_level_in: null, odometer_out: null,  odometer_in: null, notes: "Pending vehicle assignment", current_step: 3 },
  { id: "r5",  ra_number: "RA-2026-005", status: "confirmed",  customer_id: "c5", customer_name: "Linda Johnson",   vehicle_id: "v1", vehicle_plate: "TX-ABC123", vehicle_class: "+Hybrid",  pickup_date: "2026-10-18", return_date: "2026-11-18", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 42500, outstanding_cents: 42500, fuel_level_out: null, fuel_level_in: null, odometer_out: null,  odometer_in: null, notes: null,            current_step: 6 },
  { id: "r6",  ra_number: "RA-2026-006", status: "returned",   customer_id: "c1", customer_name: "Maria Rodriguez", vehicle_id: "v3", vehicle_plate: "TX-GHI789", vehicle_class: "+Basic",   pickup_date: "2026-09-01", return_date: "2026-10-01", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 45000, outstanding_cents: 0,     fuel_level_out: 8, fuel_level_in: 3,    odometer_out: 27500, odometer_in: 28900, notes: null,           current_step: 9 },
  { id: "r7",  ra_number: "RA-2026-007", status: "cancelled",  customer_id: "c2", customer_name: "James Thompson",  vehicle_id: null, vehicle_plate: null,        vehicle_class: "+Regular", pickup_date: "2026-08-10", return_date: "2026-09-10", pickup_location: "Dallas – LBJ",      return_location: "Dallas – LBJ",      total_cents: 52500, outstanding_cents: 0,     fuel_level_out: null, fuel_level_in: null, odometer_out: null,  odometer_in: null, notes: "Customer no-show",      current_step: 1 },
];

// ─── Data access functions ─────────────────────────────────────────────────────

export async function getDashboardStats(today?: string): Promise<DashboardStats> {
  const t = today ?? new Date().toISOString().split("T")[0];
  return {
    pickups_today: RESERVATIONS.filter(r => r.pickup_date === t && r.status === "confirmed").length || 2,
    returns_today: RESERVATIONS.filter(r => r.return_date === t && r.status === "active").length || 1,
    overdues: RESERVATIONS.filter(r => r.status === "active" && r.return_date < t).length || 3,
    fleet_on_rent: VEHICLES.filter(v => v.status === "on_rent").length,
    fleet_available: VEHICLES.filter(v => v.status === "available").length,
    fleet_dirty: VEHICLES.filter(v => v.status === "dirty").length,
    fleet_maintenance: VEHICLES.filter(v => v.status === "maintenance").length,
    utilization_by_class: [
      { class_name: "+Hybrid",  pct: 50 },
      { class_name: "+Basic",   pct: 67 },
      { class_name: "+Regular", pct: 50 },
      { class_name: "+VIP",     pct: 50 },
    ],
  };
}

export async function getReservations(status?: ReservationStatus): Promise<Reservation[]> {
  if (!status) return RESERVATIONS;
  return RESERVATIONS.filter(r => r.status === status);
}

export async function getReservation(id: string): Promise<Reservation | null> {
  return RESERVATIONS.find(r => r.id === id) ?? null;
}

export async function getVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
  if (!status) return VEHICLES;
  return VEHICLES.filter(v => v.status === status);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  return VEHICLES.find(v => v.id === id) ?? null;
}

export async function getContacts(category?: ContactCategory): Promise<Contact[]> {
  if (!category) return CONTACTS;
  return CONTACTS.filter(c => c.category === category);
}

export async function getContact(id: string): Promise<Contact | null> {
  return CONTACTS.find(c => c.id === id) ?? null;
}

export async function getVehicleClasses(): Promise<VehicleClass[]> {
  return VEHICLE_CLASSES;
}

export async function getLocations(): Promise<Location[]> {
  return LOCATIONS;
}
