export const instant = false;

import { getVehicles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Fake maintenance records derived from vehicles in maintenance/repair
const MAINTENANCE_RECORDS = [
  { id: "m1", vehicle_id: "v6", type: "Oil Change", status: "in_progress" as const, started: "2026-10-05", due: "2026-10-18", tech: "Mike S.", notes: "Full synthetic 5W-30, filter replaced" },
  { id: "m2", vehicle_id: "v3", type: "Detail & Clean", status: "scheduled" as const, started: "2026-10-10", due: "2026-10-11", tech: "Anna L.", notes: "Post-rental detail" },
  { id: "m3", vehicle_id: "v2", type: "Tire Rotation", status: "completed" as const, started: "2026-09-20", due: "2026-09-20", tech: "Mike S.", notes: "All 4 tires rotated, pressure checked" },
  { id: "m4", vehicle_id: "v5", type: "Brake Inspection", status: "completed" as const, started: "2026-09-15", due: "2026-09-15", tech: "Carlos R.", notes: "Front pads at 40%, rear at 60%" },
];

const STATUS_BADGE: Record<string, "active" | "confirmed" | "pending" | "returned" | "cancelled" | "info"> = {
  in_progress: "active",
  scheduled:   "confirmed",
  completed:   "returned",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  scheduled:   "Scheduled",
  completed:   "Completed",
};

export default async function MaintenancePage() {
  const vehicles = await getVehicles();
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Maintenance</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{MAINTENANCE_RECORDS.length} records</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New Work Order
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "In Progress", count: MAINTENANCE_RECORDS.filter(m => m.status === "in_progress").length, variant: "active" as const },
          { label: "Scheduled",   count: MAINTENANCE_RECORDS.filter(m => m.status === "scheduled").length,   variant: "confirmed" as const },
          { label: "Completed",   count: MAINTENANCE_RECORDS.filter(m => m.status === "completed").length,   variant: "returned" as const },
        ].map(s => (
          <div key={s.label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
            <p className="text-2xl font-bold text-[var(--color-text)]">{s.count}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        {MAINTENANCE_RECORDS.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Technician</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Due</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MAINTENANCE_RECORDS.map(m => {
                const v = vehicleMap[m.vehicle_id];
                return (
                  <tr key={m.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3">
                      {v ? (
                        <>
                          <p className="font-medium text-[var(--color-text)]">{v.year} {v.make} {v.model}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{v.plate}</p>
                        </>
                      ) : (
                        <span className="text-[var(--color-text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-[var(--color-text-muted)] shrink-0" />
                        <span className="text-[var(--color-text)]">{m.type}</span>
                      </div>
                      {m.notes && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate max-w-xs">{m.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">{m.tech}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{formatDate(m.due)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[m.status]}>{STATUS_LABELS[m.status]}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
            No maintenance records
          </div>
        )}
      </div>
    </div>
  );
}
