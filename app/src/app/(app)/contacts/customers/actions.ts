"use server";

import { revalidatePath } from "next/cache";
import { createContact } from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitAddContact(formData: FormData) {
  const first_name = formData.get("first_name") as string;
  const last_name  = formData.get("last_name")  as string;
  const email      = formData.get("email")      as string | null;
  const phone      = formData.get("phone")      as string | null;
  const address    = formData.get("address")    as string | null;
  const city       = formData.get("city")       as string | null;
  const state      = formData.get("state")      as string | null;
  const zip        = formData.get("zip")        as string | null;
  const dl_number  = formData.get("dl_number")  as string | null;
  const dl_expiry  = formData.get("dl_expiry")  as string | null;
  const notes      = formData.get("notes")      as string | null;

  if (!first_name || !last_name) {
    throw new Error("First and last name are required.");
  }

  await createContact({
    first_name,
    last_name,
    type: "customer",
    email:      email      || undefined,
    phone:      phone      || undefined,
    address:    address    || undefined,
    city:       city       || undefined,
    state:      state      || undefined,
    zip:        zip        || undefined,
    dl_number:  dl_number  || undefined,
    dl_expiry:  dl_expiry  || undefined,
    notes:      notes      || undefined,
  });

  revalidatePath("/contacts/customers");
  redirect("/contacts/customers");
}
