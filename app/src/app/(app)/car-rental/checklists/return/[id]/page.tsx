export const instant = false;

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getReservation } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatDate, formatCents } from "@/lib/utils";
import { connection } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

const RETURN_ITEMS = [
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
  { id: "personal_items",   label: "Personal items cleared" },
  { id: "fuel_level",       label: "Fuel level recorded" },
  { id: "odometer",         label: "Odometer recorded" },
  { id: "keys_returned",    label: "Keys returned" },
];

export default async function ReturnChecklistPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const r = reservation;

  async function handleReturnChecklist(formData: FormData) {
    "use server";
    // In a full implementation this would save checklist items and trigger return flow.
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
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Return Checklist</h1>
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
          <p className="text-[var(--color-text-muted)] text-xs">Return due</p>
          <p className="text-[var(--color-text)] font-medium">{formatDate(r.return_date)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Return location</p>
          <p className="text-[var(--color-text)] font-medium">{r.return_location ?? "—"}</p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs">Balance due</p>
          <p className="text-[var(--color-text)] font-medium">{r.balance_due_cents != null ? formatCents(r.balance_due_cents) : "—"}</p>
        </div>
      </div>

      <form action={handleReturnChecklist} className="space-y-5">
        {/* Inspection checklist */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Post-rental inspection</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Check each item and note any new damage since pickup</p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {RETURN_ITEMS.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                <input
                  type="checkbox"
                  name={`item_${item.id}`}
                  id={`ret_item_${item.id}`}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor={`ret_item_${item.id}`} className="text-sm text-[var(--color-text)] cursor-pointer">
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
                  <option value="new_damage">New damage</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="missing">Missing</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Odometer & fuel at return */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Readings at return</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Odometer (mi)</label>
              <input
                name="odometer_return"
                type="number"
                min={0}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Fuel level</label>
              <select
                name="fuel_level_return"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                {["full","7/8","3/4","5/8","1/2","3/8","1/4","1/8","empty"].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="charge_fuel"
              id="charge_fuel"
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
            />
            <label htmlFor="charge_fuel" className="text-sm text-[var(--color-text)] cursor-pointer">
              Charge fuel fee (vehicle returned below pickup fuel level)
            </label>
          </div>
        </div>

        {/* Additional charges */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Additional charges</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Damage charge ($)</label>
              <input
                name="damage_charge"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Cleaning fee ($)</label>
              <input
                name="cleaning_fee"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>
          <textarea
            name="return_notes"
            rows={2}
            placeholder="Return notes or final observations…"
            className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href={`/car-rental/reservations/${id}`}>
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit">Complete Return Checklist</Button>
        </div>
      </form>
    </div>
  );
}
