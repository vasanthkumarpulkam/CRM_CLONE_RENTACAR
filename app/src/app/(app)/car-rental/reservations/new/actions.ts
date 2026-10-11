"use server";

import { redirect } from "next/navigation";
import { createReservation } from "@/lib/db";

export interface NewReservationPayload {
  pickupDate: string;
  returnDate: string;
  pickupLocationId: string;
  returnLocationId: string;
  customerId: string;
  vehicleId: string;
  vehicleClassId: string;
  rentalType: "daily" | "weekly" | "monthly";
  rateMonthly: number;   // cents
  securityDeposit: number; // cents
  totalCents: number;
  notes: string;
}

export async function submitReservation(payload: NewReservationPayload): Promise<{ id: string; ra_number: string }> {
  if (!payload.pickupDate || !payload.returnDate) {
    throw new Error("Pickup and return dates are required.");
  }
  if (!payload.customerId) {
    throw new Error("A customer must be selected.");
  }

  const result = await createReservation({
    pickup_date: payload.pickupDate,
    return_date: payload.returnDate,
    pickup_location_id: payload.pickupLocationId,
    return_location_id: payload.returnLocationId,
    contact_id: payload.customerId || undefined,
    vehicle_id: payload.vehicleId || undefined,
    vehicle_class_id: payload.vehicleClassId || undefined,
    rental_type: payload.rentalType,
    monthly_rate_cents: payload.rateMonthly,
    base_rate_cents: payload.rateMonthly,
    security_deposit_cents: payload.securityDeposit,
    total_cents: payload.totalCents,
    balance_due_cents: payload.totalCents,
    notes: payload.notes || undefined,
    is_quote: false,
  });

  return result as { id: string; ra_number: string };
}
