/**
 * Real data layer — queries Supabase.
 * All functions are scoped to the current user's company via RLS.
 * Same function signatures as the old fake data.ts so screen code is unchanged.
 */

import { createClient as _createClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createClient(): Promise<any> {
  return _createClient();
}

// ─── Types (re-exported for screens to import from one place) ─────────────────

export type ReservationStatus =
  | "pending" | "confirmed" | "active" | "returned" | "cancelled";

export type VehicleStatus =
  | "available" | "on_rent" | "dirty" | "maintenance" | "repair"
  | "out_of_service" | "on_sale" | "sold" | "complementary" | "new"
  | "reserved" | "stolen" | "recovered" | "totaled" | "repossessed";

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
  fuel_level: number;
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
  current_step: number;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(ts: string | null): string {
  if (!ts) return "";
  return ts.slice(0, 10);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(today?: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const t = today ?? new Date().toISOString().slice(0, 10);

  const [{ data: reservations }, { data: vehicles }, { data: classes }] = await Promise.all([
    supabase.from("reservations").select(`
      id, status, pickup_date, return_date, balance_due_cents, total_cents,
      vehicle_class_id, vehicle:vehicles(status)
    `).eq("is_quote", false),
    supabase.from("vehicles").select("id, status, vehicle_class_id"),
    supabase.from("vehicle_classes").select("id, name"),
  ]);

  const rs: Array<{ id: string; status: string; pickup_date: string | null; return_date: string | null; vehicle_class_id: string | null; balance_due_cents?: number | null; total_cents?: number | null }> = reservations ?? [];
  const vs: Array<{ id: string; status: string; vehicle_class_id: string | null }> = vehicles ?? [];
  const cs: Array<{ id: string; name: string }> = classes ?? [];

  const pickups_today = rs.filter(r =>
    r.status === "confirmed" && toDateStr(r.pickup_date) === t
  ).length;

  const returns_today = rs.filter(r =>
    r.status === "active" && toDateStr(r.return_date) === t
  ).length;

  const overdues = rs.filter(r =>
    r.status === "active" && toDateStr(r.return_date) < t
  ).length;

  const fleet_on_rent    = vs.filter(v => v.status === "reserved" || vs.filter(vx => vx.id === v.id && rs.some(r => r.status === "active" && (r as any).vehicle_id === v.id)).length > 0).length;
  const fleet_available  = vs.filter(v => v.status === "available").length;
  const fleet_dirty      = vs.filter(v => v.status === "dirty").length;
  const fleet_maintenance = vs.filter(v => v.status === "out_of_service").length;

  // Utilization by class
  const totalByClass: Record<string, number> = {};
  const onRentByClass: Record<string, number> = {};
  vs.forEach(v => {
    if (!v.vehicle_class_id) return;
    totalByClass[v.vehicle_class_id] = (totalByClass[v.vehicle_class_id] ?? 0) + 1;
  });
  rs.filter(r => r.status === "active").forEach(r => {
    if (!r.vehicle_class_id) return;
    onRentByClass[r.vehicle_class_id] = (onRentByClass[r.vehicle_class_id] ?? 0) + 1;
  });

  const utilization_by_class = cs.map(c => ({
    class_name: c.name,
    pct: totalByClass[c.id]
      ? Math.round(((onRentByClass[c.id] ?? 0) / totalByClass[c.id]) * 100)
      : 0,
  }));

  return {
    pickups_today,
    returns_today,
    overdues,
    fleet_on_rent: rs.filter(r => r.status === "active").length,
    fleet_available,
    fleet_dirty,
    fleet_maintenance,
    utilization_by_class,
  };
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export async function getReservations(status?: ReservationStatus): Promise<Reservation[]> {
  const supabase = await createClient();

  let query = supabase
    .from("reservations")
    .select(`
      id, ra_number, status, contact_id, vehicle_id, vehicle_class_id,
      pickup_date, return_date, total_cents, balance_due_cents,
      fuel_at_pickup, fuel_at_return, odometer_at_pickup, odometer_at_return,
      notes, is_quote,
      contact:contacts(first_name, last_name),
      vehicle:vehicles(plate, vehicle_class:vehicle_classes(name)),
      pickup_loc:locations!pickup_location_id(name),
      return_loc:locations!return_location_id(name)
    `)
    .eq("is_quote", false)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    ra_number: r.ra_number,
    status: r.status as ReservationStatus,
    customer_id: r.contact_id,
    customer_name: r.contact
      ? `${r.contact.first_name ?? ""} ${r.contact.last_name ?? ""}`.trim()
      : null,
    vehicle_id: r.vehicle_id,
    vehicle_plate: r.vehicle?.plate ?? null,
    vehicle_class: r.vehicle?.vehicle_class?.name ?? null,
    pickup_date: toDateStr(r.pickup_date),
    return_date: toDateStr(r.return_date),
    pickup_location: r.pickup_loc?.name ?? "",
    return_location: r.return_loc?.name ?? "",
    total_cents: r.total_cents ?? 0,
    outstanding_cents: r.balance_due_cents ?? 0,
    fuel_level_out: r.fuel_at_pickup,
    fuel_level_in: r.fuel_at_return,
    odometer_out: r.odometer_at_pickup,
    odometer_in: r.odometer_at_return,
    notes: r.notes,
    current_step: r.status === "returned" ? 9 : r.status === "active" ? 8 : 5,
  }));
}

export async function getReservation(id: string): Promise<Reservation | null> {
  const supabase = await createClient();

  const { data: r, error } = await supabase
    .from("reservations")
    .select(`
      id, ra_number, status, contact_id, vehicle_id, vehicle_class_id,
      pickup_date, return_date, total_cents, balance_due_cents,
      fuel_at_pickup, fuel_at_return, odometer_at_pickup, odometer_at_return,
      notes,
      contact:contacts(first_name, last_name),
      vehicle:vehicles(plate, vehicle_class:vehicle_classes(name)),
      pickup_loc:locations!pickup_location_id(name),
      return_loc:locations!return_location_id(name)
    `)
    .eq("id", id)
    .single();

  if (error || !r) return null;

  return {
    id: (r as any).id,
    ra_number: (r as any).ra_number,
    status: (r as any).status as ReservationStatus,
    customer_id: (r as any).contact_id,
    customer_name: (r as any).contact
      ? `${(r as any).contact.first_name ?? ""} ${(r as any).contact.last_name ?? ""}`.trim()
      : null,
    vehicle_id: (r as any).vehicle_id,
    vehicle_plate: (r as any).vehicle?.plate ?? null,
    vehicle_class: (r as any).vehicle?.vehicle_class?.name ?? null,
    pickup_date: toDateStr((r as any).pickup_date),
    return_date: toDateStr((r as any).return_date),
    pickup_location: (r as any).pickup_loc?.name ?? "",
    return_location: (r as any).return_loc?.name ?? "",
    total_cents: (r as any).total_cents ?? 0,
    outstanding_cents: (r as any).balance_due_cents ?? 0,
    fuel_level_out: (r as any).fuel_at_pickup,
    fuel_level_in: (r as any).fuel_at_return,
    odometer_out: (r as any).odometer_at_pickup,
    odometer_in: (r as any).odometer_at_return,
    notes: (r as any).notes,
    current_step: (r as any).status === "returned" ? 9 : (r as any).status === "active" ? 8 : 5,
  };
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export async function getVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
  const supabase = await createClient();

  let query = supabase
    .from("vehicles")
    .select(`
      id, vehicle_key, vin, plate, year, color, odometer, status, fuel_level,
      vehicle_model:vehicle_models(make, model),
      vehicle_class:vehicle_classes(id, name),
      location:locations(id, name),
      active_reservations:reservations(contact:contacts(first_name, last_name), return_date)
    `)
    .is("deleted_at", null)
    .order("vehicle_key");

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((v: any) => {
    const activeRes = v.active_reservations?.find((r: any) => r.contact);
    return {
      id: v.id,
      key: v.vehicle_key ?? "",
      vin: v.vin ?? "",
      plate: v.plate ?? "",
      make: v.vehicle_model?.make ?? "",
      model: v.vehicle_model?.model ?? "",
      year: v.year ?? 0,
      color: v.color ?? "",
      class_id: v.vehicle_class?.id ?? "",
      class_name: v.vehicle_class?.name ?? "",
      status: v.status as VehicleStatus,
      fuel_level: v.fuel_level ?? 0,
      odometer: v.odometer ?? 0,
      location_id: v.location?.id ?? "",
      location_name: v.location?.name ?? "",
      available_date: activeRes?.return_date ? toDateStr(activeRes.return_date) : null,
      current_renter: activeRes?.contact
        ? `${activeRes.contact.first_name ?? ""} ${(activeRes.contact.last_name ?? "")[0] ?? ""}.`
        : null,
    };
  });
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const vs = await getVehicles();
  return vs.find(v => v.id === id) ?? null;
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function getContacts(category?: ContactCategory): Promise<Contact[]> {
  const supabase = await createClient();

  let query = supabase
    .from("contacts")
    .select("id, category, first_name, last_name, email, phone, street, city, state, zip, dl_number, dl_expiration_date")
    .is("deleted_at", null)
    .order("last_name");

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error || !data) return [];

  // Count reservations per contact
  const ids = data.map((c: any) => c.id);
  const { data: counts } = await supabase
    .from("reservations")
    .select("contact_id")
    .in("contact_id", ids)
    .eq("is_quote", false);

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((r: any) => {
    countMap[r.contact_id] = (countMap[r.contact_id] ?? 0) + 1;
  });

  return data.map((c: any) => ({
    id: c.id,
    category: c.category as ContactCategory,
    first_name: c.first_name ?? "",
    last_name: c.last_name ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    street: c.street ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    zip: c.zip ?? "",
    dl_number: c.dl_number ?? "",
    dl_expiry: c.dl_expiration_date ?? "",
    reservation_count: countMap[c.id] ?? 0,
  }));
}

export async function getContact(id: string): Promise<Contact | null> {
  const supabase = await createClient();

  const { data: c, error } = await supabase
    .from("contacts")
    .select("id, category, first_name, last_name, email, phone, street, city, state, zip, dl_number, dl_expiration_date")
    .eq("id", id)
    .single();

  if (error || !c) return null;

  const { count } = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("contact_id", id)
    .eq("is_quote", false);

  return {
    id: (c as any).id,
    category: (c as any).category as ContactCategory,
    first_name: (c as any).first_name ?? "",
    last_name: (c as any).last_name ?? "",
    email: (c as any).email ?? "",
    phone: (c as any).phone ?? "",
    street: (c as any).street ?? "",
    city: (c as any).city ?? "",
    state: (c as any).state ?? "",
    zip: (c as any).zip ?? "",
    dl_number: (c as any).dl_number ?? "",
    dl_expiry: (c as any).dl_expiration_date ?? "",
    reservation_count: count ?? 0,
  };
}

// ─── Vehicle Classes & Locations ──────────────────────────────────────────────

export async function getVehicleClasses(): Promise<VehicleClass[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_classes")
    .select("id, name, transmission_type, monthly_rate_cents")
    .order("order_index");

  if (error || !data) return [];
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    transmission: c.transmission_type,
    monthly_rate_cents: c.monthly_rate_cents ?? 0,
  }));
}

export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, address")
    .eq("is_active", true)
    .order("name");

  if (error || !data) return [];
  return data.map((l: any) => ({
    id: l.id,
    name: l.name,
    address: l.address ?? "",
  }));
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreateReservationInput {
  pickup_date: string;
  return_date: string;
  pickup_location_id: string;
  return_location_id: string;
}

export async function createReservation(input: CreateReservationInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: crmUser } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!crmUser) throw new Error("User not found");

  const { data: raNumber } = await supabase
    .rpc("next_ra_number", { p_company_id: crmUser.company_id });

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      company_id: crmUser.company_id,
      ra_number: raNumber ?? "RA-0001",
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      pickup_location_id: input.pickup_location_id,
      return_location_id: input.return_location_id,
      status: "pending",
      rental_type: "monthly",
      is_quote: false,
      created_by: user.id,
    })
    .select("id, ra_number")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateVehicleStatus(
  id: string,
  status: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function recordPickup(
  reservationId: string,
  data: { odometer: number; fuel_level: number }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({
      odometer_at_pickup: data.odometer,
      fuel_at_pickup: data.fuel_level,
      actual_pickup_date: new Date().toISOString(),
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservationId);

  if (error) throw new Error(error.message);
}

export async function recordReturn(
  reservationId: string,
  data: { odometer: number; fuel_level: number; charge_fuel: boolean }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({
      odometer_at_return: data.odometer,
      fuel_at_return: data.fuel_level,
      charge_fuel: data.charge_fuel,
      actual_return_date: new Date().toISOString(),
      status: "returned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservationId);

  if (error) throw new Error(error.message);
}

export async function recordPayment(data: {
  reservation_id: string;
  amount_cents: number;
  method: "cash" | "card" | "check" | "other";
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: crmUser } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user!.id)
    .single();

  const { error } = await supabase.from("payments").insert({
    company_id: (crmUser as any).company_id,
    reservation_id: data.reservation_id,
    amount_cents: data.amount_cents,
    method: data.method,
    type: "offline",
    notes: data.notes ?? null,
    recorded_at: new Date().toISOString(),
    created_by: user!.id,
  });

  if (error) throw new Error(error.message);

  // Update balance_due on the reservation
  const { data: payments } = await supabase
    .from("payments")
    .select("amount_cents")
    .eq("reservation_id", data.reservation_id);

  const paid = (payments ?? []).reduce((s: number, p: any) => s + p.amount_cents, 0);

  const { data: res } = await supabase
    .from("reservations")
    .select("total_cents")
    .eq("id", data.reservation_id)
    .single();

  const balance = Math.max(0, ((res as any)?.total_cents ?? 0) - paid);

  await supabase
    .from("reservations")
    .update({ balance_due_cents: balance })
    .eq("id", data.reservation_id);
}

export async function createContact(data: {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  dl_number?: string;
  dl_expiration_date?: string;
  category?: ContactCategory;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: crmUser } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user!.id)
    .single();

  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      company_id: (crmUser as any).company_id,
      category: data.category ?? "customer",
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      street: data.street ?? null,
      city: data.city ?? null,
      state: data.state ?? "Texas",
      zip: data.zip ?? null,
      dl_number: data.dl_number ?? null,
      dl_expiration_date: data.dl_expiration_date ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return contact;
}
