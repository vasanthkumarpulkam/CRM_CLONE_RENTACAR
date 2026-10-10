export const instant = false;

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const QUOTES = [
  { id: "q1", number: "Q-2024-001", customer: "David Martinez",  vehicle_class: "+Regular", pickup: "2026-10-15", return_date: "2026-10-20", total_cents: 26250, status: "sent" as const,    created: "2026-10-08" },
  { id: "q2", number: "Q-2024-002", customer: "Linda Johnson",   vehicle_class: "+VIP",     pickup: "2026-10-22", return_date: "2026-10-25", total_cents: 22500, status: "draft" as const,   created: "2026-10-09" },
  { id: "q3", number: "Q-2024-003", customer: "Maria Rodriguez", vehicle_class: "+Hybrid",  pickup: "2026-11-01", return_date: "2026-11-07", total_cents: 29750, status: "accepted" as const, created: "2026-10-05" },
  { id: "q4", number: "Q-2024-004", customer: "James Thompson",  vehicle_class: "+Basic",   pickup: "2026-10-12", return_date: "2026-10-14", total_cents: 9000,  status: "expired" as const, created: "2026-10-01" },
];

const STATUS_BADGE: Record<string, "active" | "confirmed" | "pending" | "returned" | "cancelled"> = {
  sent:     "active",
  draft:    "pending",
  accepted: "returned",
  expired:  "cancelled",
};

export default function QuotesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Quotes</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{QUOTES.length} quotes</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New Quote
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Quote #</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Period</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {QUOTES.map(q => (
              <tr key={q.id} className="hover:bg-[var(--color-bg)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-accent)]">{q.number}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{q.vehicle_class}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">{q.customer}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">
                  {formatDate(q.pickup)} → {formatDate(q.return_date)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">
                  ${(q.total_cents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE[q.status]}>{q.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
