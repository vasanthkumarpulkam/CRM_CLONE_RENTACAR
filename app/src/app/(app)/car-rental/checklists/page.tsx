export const instant = false;

import Link from "next/link";
import { getReservations } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ClipboardList, ClipboardCheck } from "lucide-react";

export default async function ChecklistsPage() {
  const allReservations = await getReservations();
  const pickupPending = allReservations.filter(r => r.status === "confirmed");
  const returnPending = allReservations.filter(r => r.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Checklists</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Pickup and return vehicle inspections</p>
      </div>

      {/* Pickup checklists */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
          <ClipboardList className="h-4 w-4 text-[var(--color-text-muted)]" />
          <p className="text-sm font-medium text-[var(--color-text)]">Pending Pickups</p>
          <span className="ml-auto text-xs text-[var(--color-text-muted)]">{pickupPending.length} reservation{pickupPending.length !== 1 ? "s" : ""}</span>
        </div>
        {pickupPending.length === 0 ? (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">No pending pickups</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pickupPending.map(r => (
              <Link
                key={r.id}
                href={`/car-rental/checklists/pickup/${r.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{r.ra_number} · {r.customer_name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {r.vehicle_class} · Pickup {formatDate(r.pickup_date)}
                  </p>
                </div>
                <Badge variant="confirmed">Confirmed</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Return checklists */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
          <ClipboardCheck className="h-4 w-4 text-[var(--color-text-muted)]" />
          <p className="text-sm font-medium text-[var(--color-text)]">Pending Returns</p>
          <span className="ml-auto text-xs text-[var(--color-text-muted)]">{returnPending.length} reservation{returnPending.length !== 1 ? "s" : ""}</span>
        </div>
        {returnPending.length === 0 ? (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">No active rentals pending return</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {returnPending.map(r => (
              <Link
                key={r.id}
                href={`/car-rental/checklists/return/${r.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{r.ra_number} · {r.customer_name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {r.vehicle_class} · Return due {formatDate(r.return_date)}
                  </p>
                </div>
                <Badge variant="active">Active</Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
