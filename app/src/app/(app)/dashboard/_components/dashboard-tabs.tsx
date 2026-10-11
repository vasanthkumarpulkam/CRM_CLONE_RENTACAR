"use client";

import { useState } from "react";
import { AlertTriangle, CalendarDays, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCents } from "@/lib/utils";
import type { Reservation } from "@/lib/db";

interface AvailabilityDay {
  date: string;
  rented: number;
  available: number;
}

interface Props {
  activeReservations: Reservation[];
  overdueReservations: Reservation[];
  availabilityDays: AvailabilityDay[];
  totalFleet: number;
}

const TABS = [
  { id: "bookings",     label: "Active & Upcoming", icon: CalendarDays },
  { id: "availability", label: "Availability",       icon: BarChart2 },
  { id: "overdues",     label: "Overdues",           icon: AlertTriangle },
] as const;

type TabId = typeof TABS[number]["id"];

export function DashboardTabs({
  activeReservations,
  overdueReservations,
  availabilityDays,
  totalFleet,
}: Props) {
  const [active, setActive] = useState<TabId>("bookings");

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Tab bar */}
      <div className="flex border-b border-[var(--color-border)] px-1 pt-1 gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={[
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-[var(--radius-md)] transition-colors",
              active === tab.id
                ? "bg-[var(--color-bg)] text-[var(--color-text)] border border-b-0 border-[var(--color-border)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.id === "overdues" && overdueReservations.length > 0 && (
              <span className="ml-0.5 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1">
                {overdueReservations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {active === "bookings" && (
          <BookingsTab reservations={activeReservations} />
        )}
        {active === "availability" && (
          <AvailabilityTab days={availabilityDays} totalFleet={totalFleet} />
        )}
        {active === "overdues" && (
          <OverduesTab reservations={overdueReservations} />
        )}
      </div>
    </div>
  );
}

/* ── Bookings tab ── */
function BookingsTab({ reservations }: { reservations: Reservation[] }) {
  if (reservations.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] py-6 text-center">
        No active or upcoming reservations.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[var(--color-border)]">
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">RA#</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Customer</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Vehicle</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Pickup</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Return</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Status</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {reservations.map((r) => (
            <tr key={r.id} className="hover:bg-[var(--color-bg)] transition-colors">
              <td className="py-2.5 px-1">
                <Link
                  href={`/car-rental/reservations/${r.id}`}
                  className="text-[var(--color-accent)] hover:underline font-medium text-xs"
                >
                  {r.ra_number}
                </Link>
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text)] truncate max-w-[120px]">
                {r.customer_name ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text-muted)] hidden sm:table-cell">
                {r.vehicle_class ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text-muted)] hidden md:table-cell text-xs">
                {formatDate(r.pickup_date)}
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text-muted)] hidden md:table-cell text-xs">
                {formatDate(r.return_date)}
              </td>
              <td className="py-2.5 px-1">
                <Badge variant={r.status}>{r.status}</Badge>
              </td>
              <td className="py-2.5 px-1 text-right font-medium text-[var(--color-text)] text-xs">
                {formatCents(r.total_cents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Availability tab ── */
function AvailabilityTab({ days, totalFleet }: { days: AvailabilityDay[]; totalFleet: number }) {
  if (totalFleet === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] py-6 text-center">
        No vehicles in fleet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        14-day availability · {totalFleet} vehicles total
      </p>
      {days.map((day) => {
        const pct = totalFleet > 0 ? Math.round((day.rented / totalFleet) * 100) : 0;
        const dayLabel = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        return (
          <div key={day.date}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-[var(--color-text)]">{dayLabel}</span>
              <span className="text-[var(--color-text-muted)]">
                {day.available} avail · {day.rented} rented
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: pct >= 90
                    ? "var(--color-danger)"
                    : pct >= 70
                    ? "var(--color-warning)"
                    : "var(--color-success)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Overdues tab ── */
function OverduesTab({ reservations }: { reservations: Reservation[] }) {
  if (reservations.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] py-6 text-center">
        No overdue reservations.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-[var(--color-border)]">
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">RA#</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Customer</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Due back</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Vehicle</th>
            <th className="pb-2 px-1 font-medium text-[var(--color-text-muted)] text-xs uppercase tracking-wide text-right">Outstanding</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {reservations.map((r) => (
            <tr key={r.id} className="hover:bg-[var(--color-bg)] transition-colors">
              <td className="py-2.5 px-1">
                <Link
                  href={`/car-rental/reservations/${r.id}`}
                  className="text-[var(--color-danger)] hover:underline font-medium text-xs"
                >
                  {r.ra_number}
                </Link>
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text)]">
                {r.customer_name ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-xs text-[var(--color-danger)] font-medium">
                {formatDate(r.return_date)}
              </td>
              <td className="py-2.5 px-1 text-[var(--color-text-muted)] hidden sm:table-cell text-xs">
                {r.vehicle_plate ?? r.vehicle_class ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-right font-medium text-[var(--color-danger)] text-xs">
                {r.outstanding_cents > 0 ? formatCents(r.outstanding_cents) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
