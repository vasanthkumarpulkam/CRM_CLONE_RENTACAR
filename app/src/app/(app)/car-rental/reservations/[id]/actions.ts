"use server";

import { revalidatePath } from "next/cache";
import { recordPickup, recordReturn, recordPayment } from "@/lib/db";

export async function submitPickup(
  reservationId: string,
  data: { odometer: number; fuel_level: number }
) {
  await recordPickup(reservationId, data);
  revalidatePath(`/car-rental/reservations/${reservationId}`);
}

export async function submitReturn(
  reservationId: string,
  data: { odometer: number; fuel_level: number; charge_fuel: boolean }
) {
  await recordReturn(reservationId, data);
  revalidatePath(`/car-rental/reservations/${reservationId}`);
}

export async function submitPayment(data: {
  reservation_id: string;
  amount_cents: number;
  method: "cash" | "card" | "check" | "other";
  notes?: string;
}) {
  await recordPayment(data);
  revalidatePath(`/car-rental/reservations/${data.reservation_id}`);
}
