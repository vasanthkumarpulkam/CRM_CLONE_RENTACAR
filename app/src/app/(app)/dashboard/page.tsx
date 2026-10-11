export const instant = false;

import {
  Car, CalendarCheck, CalendarX, AlertTriangle,
  Wrench, Droplets, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getReservations, getVehicles, getOverdueReservations } from "@/lib/db";

import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { TodayLabel } from "@/components/ui/today-label";
import { formatCents, formatDate } from "@/lib/utils";
import { DashboardTabs } from "./_components/dashboard-tabs";

export default async function DashboardPage() {
  await connection();
  const today = new Date().toISOString().split("T")[0];
  const [stats, reservations, vehicles, overdues] = await Promise.all([
    getDashboardStats(today),
    getReservations(),
    getVehicles(),
    getOverdueReservations(),
  ]);

  const activeReservations = reservations.filter(r =>
    r.status === "active" || r.status === "confirmed"
  ).slice(0, 8);

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

  // Availability: for the next 14 days, count confirmed+active reservations per day
  const availabilityDays: { date: string; rented: number; available: number }[] = [];
  const totalFleet = vehicles.length;
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().split("T")[0];
    const rented = reservations.filter(r =>
      (r.status === "active" || r.status === "confirmed") &&
      r.pickup_date <= ds && r.return_date >= ds
    ).length;
    availabilityDays.push({ date: ds, rented, available: Math.max(0, totalFleet - rented) });
  }

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
          {stats.utilization_by_class.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)]">No vehicle class data.</p>
          )}
        </div>
      </div>

      {/* Tabbed section: Bookings | Availability | Overdues */}
      <DashboardTabs
        activeReservations={activeReservations}
        overdueReservations={overdues}
        availabilityDays={availabilityDays}
        totalFleet={totalFleet}
      />
    </div>
  );
}
