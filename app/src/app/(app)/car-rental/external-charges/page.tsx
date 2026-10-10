export const instant = false;

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const CHARGES = [
  { id: "ec1", ra_number: "RA-1001", reservation_id: "r1", customer: "Maria Rodriguez", type: "Fuel Surcharge",   amount_cents: 4500,  date: "2026-10-08", status: "billed" as const },
  { id: "ec2", ra_number: "RA-1002", reservation_id: "r2", customer: "James Thompson",  type: "Late Return Fee",  amount_cents: 12000, date: "2026-10-07", status: "paid" as const },
  { id: "ec3", ra_number: "RA-1003", reservation_id: "r3", customer: "Sarah Kim",       type: "Damage Fee",       amount_cents: 35000, date: "2026-10-05", status: "pending" as const },
  { id: "ec4", ra_number: "RA-1001", reservation_id: "r1", customer: "Maria Rodriguez", type: "Toll Charge",      amount_cents: 875,   date: "2026-10-02", status: "paid" as const },
];

const STATUS_BADGE: Record<string, "active" | "returned" | "confirmed" | "pending"> = {
  billed:  "active",
  paid:    "returned",
  pending: "pending",
};

export default async function ExternalChargesPage() {
  const total = CHARGES.reduce((s, c) => s + c.amount_cents, 0);
  const outstanding = CHARGES.filter(c => c.status !== "paid").reduce((s, c) => s + c.amount_cents, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">External Charges</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{CHARGES.length} charges</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Charge
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Total charges</p>
          <p className="text-xl font-bold text-[var(--color-text)] mt-1">${(total / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Outstanding</p>
          <p className="text-xl font-bold text-[var(--color-danger)] mt-1">${(outstanding / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reservation</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {CHARGES.map(c => (
              <tr key={c.id} className="hover:bg-[var(--color-bg)] transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/car-rental/reservations/${c.reservation_id}`} className="font-medium text-[var(--color-accent)] hover:underline">
                    {c.ra_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">{c.customer}</td>
                <td className="px-4 py-3 text-[var(--color-text)]">{c.type}</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{formatDate(c.date)}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">${(c.amount_cents / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE[c.status]}>{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
