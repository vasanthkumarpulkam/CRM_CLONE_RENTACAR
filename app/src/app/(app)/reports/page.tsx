export const instant = false;

import { connection } from "next/server";
import { getDashboardStats, getReservations, getVehicles } from "@/lib/data";
import { BarChart2, TrendingUp, Car, Users, DollarSign, Calendar } from "lucide-react";

export default async function ReportsPage() {
  await connection();
  const today = new Date().toISOString().split("T")[0];
  const [stats, reservations, vehicles] = await Promise.all([
    getDashboardStats(today),
    getReservations(),
    getVehicles(),
  ]);

  const totalRevenue = reservations.reduce((s, r) => s + r.total_cents, 0);
  const activeCount = reservations.filter(r => r.status === "active").length;
  const returnedCount = reservations.filter(r => r.status === "returned").length;
  const utilization = vehicles.length > 0 ? Math.round((stats.fleet_on_rent / vehicles.length) * 100) : 0;

  const REPORT_CARDS = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${(totalRevenue / 100).toFixed(0)}`,
      sub: "All time",
    },
    {
      icon: Calendar,
      label: "Total Reservations",
      value: reservations.length.toString(),
      sub: `${activeCount} active`,
    },
    {
      icon: Car,
      label: "Fleet Utilization",
      value: `${utilization}%`,
      sub: `${stats.fleet_on_rent} of ${vehicles.length} on rent`,
    },
    {
      icon: TrendingUp,
      label: "Completed Rentals",
      value: returnedCount.toString(),
      sub: "Returned",
    },
  ];

  const QUICK_REPORTS = [
    "Revenue by vehicle class",
    "Utilization by location",
    "Customer lifetime value",
    "Overdue reservations",
    "Maintenance cost summary",
    "Toll & fine charges by period",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Reports</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Fleet and rental performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_CARDS.map(c => (
          <div key={c.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="h-4 w-4 text-[var(--color-text-muted)]" />
              <p className="text-xs text-[var(--color-text-muted)]">{c.label}</p>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text)]">{c.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Fleet breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4 w-4 text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text)]">Fleet status</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "On Rent",     count: stats.fleet_on_rent,     color: "var(--color-accent)" },
              { label: "Available",   count: stats.fleet_available,   color: "var(--color-success)" },
              { label: "Dirty",       count: stats.fleet_dirty,       color: "var(--color-warning)" },
              { label: "Maintenance", count: stats.fleet_maintenance, color: "var(--color-danger)" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                  <p className="text-xs font-medium text-[var(--color-text)]">{s.count}</p>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: vehicles.length > 0 ? `${(s.count / vehicles.length) * 100}%` : "0%",
                      backgroundColor: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text)]">Quick reports</p>
          </div>
          <div className="space-y-1">
            {QUICK_REPORTS.map(r => (
              <button
                key={r}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] text-left transition-colors group"
              >
                <span className="text-sm text-[var(--color-text)]">{r}</span>
                <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">Run →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
