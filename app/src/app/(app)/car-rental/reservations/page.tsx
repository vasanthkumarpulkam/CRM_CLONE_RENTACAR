export const instant = false;

import { connection } from "next/server";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { getReservations } from "@/lib/data";
import type { ReservationStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCents, formatDate } from "@/lib/utils";

const STATUSES: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "active",    label: "Active" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending",   label: "Pending" },
  { value: "returned",  label: "Returned" },
  { value: "cancelled", label: "Cancelled" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ReservationsPage({ searchParams }: Props) {
  await connection();
  const { status } = await searchParams;
  const filter = (status as ReservationStatus | undefined) || undefined;
  const reservations = await getReservations(filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Reservations</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {reservations.length} agreement{reservations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/car-rental/reservations/new">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New Reservation
          </Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border)] pb-0">
        {STATUSES.map(s => {
          const isActive = (status ?? "all") === s.value;
          const href = s.value === "all"
            ? "/car-rental/reservations"
            : `/car-rental/reservations?status=${s.value}`;
          return (
            <Link
              key={s.value}
              href={href}
              className={[
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">RA #</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {reservations.map(r => (
              <tr
                key={r.id}
                className="hover:bg-[var(--color-bg)] transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/car-rental/reservations/${r.id}`}
                    className="font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {r.ra_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-text)]">
                  {r.customer_name ?? <span className="text-[var(--color-text-muted)]">—</span>}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                  {r.vehicle_plate
                    ? <span>{r.vehicle_plate} <span className="text-xs">({r.vehicle_class})</span></span>
                    : <span className="italic">Unassigned</span>}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">
                  {formatDate(r.pickup_date)} → {formatDate(r.return_date)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={r.status}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">
                  {formatCents(r.total_cents)}
                  {r.outstanding_cents > 0 && (
                    <span className="block text-xs text-[var(--color-danger)]">
                      {formatCents(r.outstanding_cents)} due
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
