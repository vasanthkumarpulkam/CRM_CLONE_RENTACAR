import {
  Car, CalendarCheck, CalendarX, AlertTriangle,
  Wrench, Droplets, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getReservations, getVehicles } from "@/lib/db";
export const instant = false;

import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { TodayLabel } from "@/components/ui/today-label";
import { formatCents, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  await connection();
  const today = new Date().toISOString().split("T")[0];
  const [stats, reservations, vehicles] = await Promise.all([
    getDashboardStats(today),
    getReservations(),
    getVehicles(),
  ]);

  const activeReservations = reservations.filter(r =>
    r.status === "active" || r.status === "confirmed"
  ).slice(0, 5);

  const fleetSummary = [
    { label: "On Rent",      value: stats.fleet_on_rent,    color: "text-[var(--color-accent)]",   bg: "bg-[var(--color-accent)]/10",  icon: Car },
    { label: "Available",    value: stats.fleet_available,  color: "text-[var(--color-success)]",  bg: "bg-[var(--color-success)]/10", icon: CalendarCheck },
    { label: "Dirty",        value: stats.fleet_dirty,      color: "text-[var(--color-warning)]",  bg: "bg-[var(--color-warning)]/10", icon: Droplets },
    { label: "Maintenance",  value: stats.fleet_maintenance, color: "text-[var(--color-danger)]",  bg: "bg-[var(--color-danger)]/10",  icon: Wrench },
  ];

  const activityCards = [
    { label: "Pickups Today",  value: stats.pickups_today, icon: CalendarCheck, color: "text-[var(--color-accent)]" },
    { label: "Returns Today",  value: stats.returns_today, icon: CalendarX,     color: "text-[var(--color-text-muted)]" },
    { label: "Overdue",        value: stats.overdues,      icon: AlertTriangle,  color: "text-[var(--color-danger)]" },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Dashboard</h1>
        <TodayLabel />
      </div>

      {/* Activity row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activityCards.map(card => (
          <div
            key={card.label}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-[var(--radius-md)] bg-[var(--color-bg)] flex items-center justify-center shrink-0">
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--color-text)]">{card.value}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet status */}
      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Fleet Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fleetSummary.map(item => (
            <div
              key={item.label}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className={`inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] ${item.bg} mb-3`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Utilization by class */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Utilization by Class</h2>
        </div>
        <div className="space-y-3">
          {stats.utilization_by_class.map(item => (
            <div key={item.class_name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-text)]">{item.class_name}</span>
                <span className="text-[var(--color-text-muted)]">{item.pct}%</span>
              </div>
              <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reservations */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Active &amp; Upcoming</h2>
          <Link
            href="/car-rental/reservations"
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {activeReservations.map(r => (
            <Link
              key={r.id}
              href={`/car-rental/reservations/${r.id}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--color-bg)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">
                  {r.ra_number}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {r.customer_name} · {r.vehicle_class}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {formatDate(r.pickup_date)} → {formatDate(r.return_date)}
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {formatCents(r.total_cents)}
                </p>
              </div>
              <Badge variant={r.status as "active" | "confirmed" | "pending" | "returned" | "cancelled"}>
                {r.status}
              </Badge>
            </Link>
          ))}
          {activeReservations.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">
              No active reservations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
