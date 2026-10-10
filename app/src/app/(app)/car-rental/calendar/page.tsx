export const instant = false;

import { connection } from "next/server";
import { getReservations } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default async function CalendarPage() {
  await connection();
  const reservations = await getReservations();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const monthName = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  // Build a map of day → reservations starting that day
  const byDay: Record<number, typeof reservations> = {};
  for (const r of reservations) {
    const d = new Date(r.pickup_date + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      byDay[day] = [...(byDay[day] ?? []), r];
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Calendar</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{monthName}</p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          {DAYS.map(d => (
            <div key={d} className="px-2 py-2.5 text-xs font-medium text-[var(--color-text-muted)] text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 divide-x divide-[var(--color-border)]">
          {cells.map((day, i) => (
            <div
              key={i}
              className={[
                "min-h-[90px] p-1.5 border-b border-[var(--color-border)] align-top",
                day === null ? "bg-[var(--color-bg)]/40" : "",
              ].join(" ")}
            >
              {day !== null && (
                <>
                  <p className={[
                    "text-xs font-medium mb-1 w-5 h-5 rounded-full flex items-center justify-center",
                    day === today
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-muted)]",
                  ].join(" ")}>
                    {day}
                  </p>
                  <div className="space-y-0.5">
                    {(byDay[day] ?? []).slice(0, 2).map(r => (
                      <Link
                        key={r.id}
                        href={`/car-rental/reservations/${r.id}`}
                        className="block truncate text-[10px] rounded px-1 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors"
                      >
                        {r.ra_number}
                      </Link>
                    ))}
                    {(byDay[day]?.length ?? 0) > 2 && (
                      <p className="text-[10px] text-[var(--color-text-muted)] pl-1">
                        +{(byDay[day]?.length ?? 0) - 2} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming list */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <p className="text-sm font-medium text-[var(--color-text)]">Upcoming pickups &amp; returns</p>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {reservations
            .filter(r => r.status === "confirmed" || r.status === "active")
            .slice(0, 8)
            .map(r => (
              <Link
                key={r.id}
                href={`/car-rental/reservations/${r.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{r.ra_number}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{r.customer_name} · {r.vehicle_class}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDate(r.pickup_date)} → {formatDate(r.return_date)}</p>
                  <div className="flex justify-end mt-0.5">
                    <Badge variant={r.status}>{r.status}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          {reservations.filter(r => r.status === "confirmed" || r.status === "active").length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
              No upcoming reservations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
