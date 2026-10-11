export const instant = false;

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getReservation, getLocations, getVehicleClasses, updateReservationDetails } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { connection } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditReservationPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const [reservation, locations, classes] = await Promise.all([
    getReservation(id),
    getLocations(),
    getVehicleClasses(),
  ]);
  if (!reservation) notFound();

  const r = reservation;

  async function handleUpdate(formData: FormData) {
    "use server";
    const pickup_date        = formData.get("pickup_date")        as string;
    const return_date        = formData.get("return_date")        as string;
    const pickup_location_id = formData.get("pickup_location_id") as string;
    const return_location_id = formData.get("return_location_id") as string;
    const rental_type        = formData.get("rental_type")        as "daily" | "weekly" | "monthly";
    const notes              = formData.get("notes")              as string | null;
    const base_rate_str      = formData.get("base_rate")          as string;
    const total_str          = formData.get("total")              as string;

    await updateReservationDetails(id, {
      pickup_date:        pickup_date || undefined,
      return_date:        return_date || undefined,
      pickup_location_id: pickup_location_id || undefined,
      return_location_id: return_location_id || undefined,
      rental_type:        rental_type || undefined,
      notes:              notes ?? undefined,
      base_rate_cents:    base_rate_str ? Math.round(parseFloat(base_rate_str) * 100) : undefined,
      total_cents:        total_str    ? Math.round(parseFloat(total_str) * 100)    : undefined,
    });
    redirect(`/car-rental/reservations/${id}`);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/car-rental/reservations/${id}`}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Edit {r.ra_number}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{r.customer_name}</p>
        </div>
      </div>

      <form action={handleUpdate} className="space-y-5">
        {/* Dates */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Pickup date</label>
              <input
                name="pickup_date"
                type="date"
                defaultValue={r.pickup_date}
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Return date</label>
              <input
                name="return_date"
                type="date"
                defaultValue={r.return_date}
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Locations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Pickup</label>
              <select
                name="pickup_location_id"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} selected={r.pickup_location === loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Return</label>
              <select
                name="return_location_id"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} selected={r.return_location === loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rental type & rate */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Rate</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Rental type</label>
              <select
                name="rental_type"
                defaultValue={r.rental_type ?? "monthly"}
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Base rate ($)</label>
              <input
                name="base_rate"
                type="number"
                min={0}
                step={0.01}
                defaultValue={r.base_rate_cents != null ? (r.base_rate_cents / 100).toFixed(2) : ""}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Total ($)</label>
              <input
                name="total"
                type="number"
                min={0}
                step={0.01}
                defaultValue={r.total_cents != null ? (r.total_cents / 100).toFixed(2) : ""}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Notes</h2>
          <textarea
            name="notes"
            rows={3}
            defaultValue={r.notes ?? ""}
            placeholder="Any notes about this reservation…"
            className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href={`/car-rental/reservations/${id}`}>
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
