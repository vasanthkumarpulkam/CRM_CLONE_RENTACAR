export const instant = false;

import Link from "next/link";
import { Plus, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const FINES = [
  { id: "f1", reservation_id: "r2", ra_number: "RA-1002", customer: "James Thompson",  type: "Speeding",        jurisdiction: "Dallas PD",      amount_cents: 22500, date: "2026-10-06", status: "open" as const },
  { id: "f2", reservation_id: "r3", ra_number: "RA-1003", customer: "Sarah Kim",       type: "Parking Ticket",  jurisdiction: "City of Plano",  amount_cents: 7500,  date: "2026-10-04", status: "transferred" as const },
  { id: "f3", reservation_id: "r1", ra_number: "RA-1001", customer: "Maria Rodriguez", type: "Toll Violation",  jurisdiction: "NTTA",           amount_cents: 1250,  date: "2026-09-28", status: "closed" as const },
];

const STATUS_BADGE: Record<string, "cancelled" | "warning" | "returned"> = {
  open:        "cancelled",
  transferred: "warning",
  closed:      "returned",
};

export default function FinesPage() {
  const total = FINES.reduce((s, f) => s + f.amount_cents, 0);
  const open = FINES.filter(f => f.status === "open").reduce((s, f) => s + f.amount_cents, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Fines</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{FINES.length} fines on record</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Fine
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Total fines</p>
          <p className="text-xl font-bold text-[var(--color-text)] mt-1">${(total / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Open amount</p>
          <p className="text-xl font-bold text-[var(--color-danger)] mt-1">${(open / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        {FINES.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reservation</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Jurisdiction</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {FINES.map(f => (
                <tr key={f.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/car-rental/reservations/${f.reservation_id}`} className="font-medium text-[var(--color-accent)] hover:underline">
                      {f.ra_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">{f.customer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <AlertOctagon className="h-3.5 w-3.5 text-[var(--color-danger)] shrink-0" />
                      <span className="text-[var(--color-text)]">{f.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">{f.jurisdiction}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{formatDate(f.date)}</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">${(f.amount_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[f.status]}>{f.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">No fines on record</div>
        )}
      </div>
    </div>
  );
}
