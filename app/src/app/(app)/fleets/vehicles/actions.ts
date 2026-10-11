"use server";

import { revalidatePath } from "next/cache";
import { createVehicle } from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitAddVehicle(formData: FormData) {
  const make  = formData.get("make")  as string;
  const model = formData.get("model") as string;
  const year  = parseInt(formData.get("year") as string, 10);
  const plate = formData.get("plate") as string;
  const vin   = formData.get("vin")   as string | null;
  const color = formData.get("color") as string | null;
  const odometer = parseInt(formData.get("odometer") as string || "0", 10);
  const status = (formData.get("status") as string) || "available";
  const fuel_level = parseFloat(formData.get("fuel_level") as string || "1");

  if (!make || !model || !year || !plate) {
    throw new Error("Make, model, year, and plate are required.");
  }

  await createVehicle({
    make,
    model,
    year,
    plate,
    vin: vin || undefined,
    color: color || undefined,
    odometer,
    status: status as any,
    fuel_level,
  });

  revalidatePath("/fleets/vehicles");
  redirect("/fleets/vehicles");
}
