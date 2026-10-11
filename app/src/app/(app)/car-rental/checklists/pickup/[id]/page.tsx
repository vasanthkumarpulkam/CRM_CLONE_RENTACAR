export const instant = false;

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getReservation } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import { formatDate } from "@/lib/utils";
import { connection } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

const PICKUP_ITEMS = [
  { id: "exterior_front",   label: "Exterior – Front" },
  { id: "exterior_rear",    label: "Exterior – Rear" },
  { id: "exterior_left",    label: "Exterior – Driver side" },
  { id: "exterior_right",   label: "Exterior – Passenger side" },
  { id: "roof",             label: "Roof & sunroof" },
  { id: "windshield",       label: "Windshield & glass" },
  { id: "tires",            label: "Tires & wheels" },
  { id: "lights",           label: "Lights (head, tail, brake)" },
  { id: "interior",         label: "Interior – seats & carpet" },
  { id: "dashboard",        label: "Dashboard & controls" },
  { id: "trunk",            label: "Trunk / cargo area" },
  { id: "spare_tire",       label: "Spare tire & tools" },
  { id: "fuel_level",       label: "Fuel level recorded" },
  { id: "odometer",         label: "Odometer recorded" },
  { id: "keys",             label: "Keys handed to customer" },
];

export default async function PickupChecklistPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const r = reservation;

  async function handlePickupChecklist(formData: FormData) {
    "use server";
    // In a full implementation this would save checklist items to a checklist_items table.
    // For now, redirect back to the reservation detail.
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
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Pickup Checklist</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{r.ra_number} · {r.customer_name}</p>
        </div>
      </div>

      {/* Reservation summary */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Vehicle class</p>
          <p className="text-[var(--color-text)] font-medium">{r.vehicle_class ?? "—"}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Pickup date</p>
          <p className="text-[var(--color-text)] font-medium">{formatDate(r.pickup_date)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Pickup location</p>
          <p className="text-[var(--color-text)] font-medium">{r.pickup_location ?? "—"}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Return date</p>
          <p className="text-[var(--color-text)] font-medium">{formatDate(r.return_date)}</p>
        </div>
      </div>

      <form action={handlePickupChecklist} className="space-y-5">
        {/* Inspection checklist */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Pre-rental inspection</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Check each item and note any existing damage</p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {PICKUP_ITEMS.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                <input
                  type="checkbox"
                  name={`item_${item.id}`}
                  id={`item_${item.id}`}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor={`item_${item.id}`} className="text-sm text-[var(--color-text)] cursor-pointer">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    name={`note_${item.id}`}
                    placeholder="Notes (optional)"
                    className="mt-1 w-full px-2 py-1 text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40"
                  />
                </div>
                <select
                  name={`condition_${item.id}`}
                  className="text-xs px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40"
                >
                  <option value="ok">OK</option>
                  <option value="minor">Minor damage</option>
                  <option value="major">Major damage</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Odometer & fuel */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Readings at pickup</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Odometer (mi)</label>
              <input
                name="odometer"
                type="number"
                min={0}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Fuel level</label>
              <select
                name="fuel_level"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                {["full","7/8","3/4","5/8","1/2","3/8","1/4","1/8","empty"].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Customer acknowledgement</h2>
          <textarea
            name="customer_notes"
            rows={2}
            placeholder="Customer notes or acknowledgement…"
            className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 resize-none"
          />
          <p className="text-xs text-[var(--color-text-muted)]">
            Customer confirms vehicle condition as noted above.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href={`/car-rental/reservations/${id}`}>
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit">Complete Pickup Checklist</Button>
        </div>
      </form>
    </div>
  );
}
