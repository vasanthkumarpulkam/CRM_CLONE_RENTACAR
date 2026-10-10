export const instant = false;

import { getVehicles } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TOLL_TAGS = [
  { id: "tt1", tag_number: "NTTA-00012345", vehicle_id: "v1", provider: "NTTA",    balance_cents: 2500,  status: "active" as const },
  { id: "tt2", tag_number: "NTTA-00023456", vehicle_id: "v2", provider: "NTTA",    balance_cents: 750,   status: "low" as const },
  { id: "tt3", tag_number: "NTTA-00034567", vehicle_id: "v4", provider: "NTTA",    balance_cents: 5000,  status: "active" as const },
  { id: "tt4", tag_number: "TXTA-00045678", vehicle_id: "v5", provider: "TxTag",   balance_cents: 1200,  status: "active" as const },
  { id: "tt5", tag_number: "TXTA-00056789", vehicle_id: "v7", provider: "TxTag",   balance_cents: 0,     status: "inactive" as const },
  { id: "tt6", tag_number: "NTTA-00067890", vehicle_id: "v8", provider: "NTTA",    balance_cents: 3300,  status: "active" as const },
];

const STATUS_BADGE: Record<string, "active" | "warning" | "cancelled"> = {
  active:   "active",
  low:      "warning",
  inactive: "cancelled",
};

export default async function TollTagsPage() {
  const vehicles = await getVehicles();
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Toll Tags</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{TOLL_TAGS.length} tags</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Tag
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Tag Number</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Provider</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Balance</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {TOLL_TAGS.map(t => {
              const v = vehicleMap[t.vehicle_id];
              return (
                <tr key={t.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text)] font-mono text-xs">{t.tag_number}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {v ? (
                      <>
                        <p className="text-[var(--color-text)]">{v.year} {v.make} {v.model}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{v.plate}</p>
                      </>
                    ) : <span className="text-[var(--color-text-muted)]">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{t.provider}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={t.balance_cents <= 0 ? "text-[var(--color-danger)] font-medium" : t.balance_cents < 1000 ? "text-[var(--color-warning)] font-medium" : "text-[var(--color-text)] font-medium"}>
                      ${(t.balance_cents / 100).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[t.status]}>{t.status}</Badge>
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
