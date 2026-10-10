export const instant = false;

import { getVehicles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

const REPAIR_ORDERS = [
  { id: "ro1", vehicle_id: "v6", description: "Front bumper scratch repair", status: "open" as const, priority: "medium" as const, opened: "2026-10-03", est_complete: "2026-10-20", cost_cents: 85000, shop: "Dallas Auto Body" },
  { id: "ro2", vehicle_id: "v3", description: "Interior detailing & odor removal", status: "open" as const, priority: "low" as const, opened: "2026-10-09", est_complete: "2026-10-11", cost_cents: 12500, shop: "In-house" },
  { id: "ro3", vehicle_id: "v1", description: "Windshield chip repair", status: "closed" as const, priority: "high" as const, opened: "2026-09-18", est_complete: "2026-09-19", cost_cents: 22000, shop: "Safelite Dallas" },
];

const STATUS_BADGE: Record<string, "active" | "returned" | "pending"> = {
  open:   "active",
  closed: "returned",
  hold:   "pending",
};

const PRIORITY_BADGE: Record<string, "cancelled" | "warning" | "info"> = {
  high:   "cancelled",
  medium: "warning",
  low:    "info",
};

export default async function RepairOrdersPage() {
  const vehicles = await getVehicles();
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Repair Orders</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{REPAIR_ORDERS.length} orders</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New Repair Order
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Description</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Shop</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Est. Complete</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Cost</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {REPAIR_ORDERS.map(ro => {
              const v = vehicleMap[ro.vehicle_id];
              return (
                <tr key={ro.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3">
                    {v ? (
                      <>
                        <p className="font-medium text-[var(--color-text)]">{v.year} {v.make} {v.model}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{v.plate}</p>
                      </>
                    ) : <span className="text-[var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-[var(--color-text)]">{ro.description}</p>
                    <div className="mt-0.5">
                      <Badge variant={PRIORITY_BADGE[ro.priority]}>{ro.priority}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{ro.shop}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">{formatDate(ro.est_complete)}</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--color-text)] hidden md:table-cell">
                    ${(ro.cost_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[ro.status]}>{ro.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
