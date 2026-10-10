export const instant = false;

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const ATTEMPTS = [
  { id: "a1", customer: "Unknown",        email: "guest1@email.com",  phone: "214-555-0099", vehicle_class: "+Basic",   pickup: "2026-10-15", return_date: "2026-10-18", reason: "No vehicles available", date: "2026-10-08" },
  { id: "a2", customer: "Robert Greene",  email: "rgreene@email.com", phone: "972-555-0188", vehicle_class: "+VIP",     pickup: "2026-10-20", return_date: "2026-10-25", reason: "Credit check failed",   date: "2026-10-07" },
  { id: "a3", customer: "Unknown",        email: "guest2@email.com",  phone: "",             vehicle_class: "+Regular", pickup: "2026-10-22", return_date: "2026-10-24", reason: "Location closed",       date: "2026-10-06" },
  { id: "a4", customer: "Priya Sharma",   email: "psharma@email.com", phone: "469-555-0277", vehicle_class: "+Hybrid",  pickup: "2026-10-12", return_date: "2026-10-14", reason: "License expired",       date: "2026-10-05" },
];

export default function ReservationAttemptsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Reservation Attempts</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          {ATTEMPTS.length} failed attempt{ATTEMPTS.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Requested</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reason</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {ATTEMPTS.map(a => (
              <tr key={a.id} className="hover:bg-[var(--color-bg)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text)]">{a.customer}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{a.email}</p>
                  {a.phone && <p className="text-xs text-[var(--color-text-muted)]">{a.phone}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-[var(--color-text)]">{a.vehicle_class}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDate(a.pickup)} → {formatDate(a.return_date)}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="cancelled">{a.reason}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">{formatDate(a.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
