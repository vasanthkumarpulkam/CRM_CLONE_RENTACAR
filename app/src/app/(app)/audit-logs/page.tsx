export const instant = false;

import { formatDateTime } from "@/lib/utils";

const AUDIT_LOGS = [
  { id: "al1",  action: "reservation.created",       user: "admin@rentacarllc.com", entity: "RA-1001", ts: "2026-10-01T09:12:34Z", details: "Reservation created for Maria Rodriguez" },
  { id: "al2",  action: "reservation.status_changed", user: "admin@rentacarllc.com", entity: "RA-1001", ts: "2026-10-01T09:15:00Z", details: "Status: pending → confirmed" },
  { id: "al3",  action: "vehicle.status_changed",     user: "admin@rentacarllc.com", entity: "TX-DEF456", ts: "2026-10-03T14:22:11Z", details: "Status: available → on_rent" },
  { id: "al4",  action: "reservation.checkout",       user: "admin@rentacarllc.com", entity: "RA-1002", ts: "2026-10-04T10:05:44Z", details: "Checkout recorded: fuel 7/8, odometer 51000" },
  { id: "al5",  action: "customer.updated",           user: "admin@rentacarllc.com", entity: "c2",       ts: "2026-10-05T11:30:00Z", details: "Phone number updated" },
  { id: "al6",  action: "fine.created",               user: "admin@rentacarllc.com", entity: "RA-1002", ts: "2026-10-06T08:45:00Z", details: "Speeding fine $225.00 recorded" },
  { id: "al7",  action: "reservation.return",         user: "admin@rentacarllc.com", entity: "RA-1003", ts: "2026-10-07T16:20:00Z", details: "Vehicle returned: fuel 5/8, odometer 74890" },
  { id: "al8",  action: "vehicle.fuel_updated",       user: "admin@rentacarllc.com", entity: "TX-GHI789", ts: "2026-10-08T09:00:00Z", details: "Fuel level updated 3/8 → marked dirty" },
  { id: "al9",  action: "external_charge.created",    user: "admin@rentacarllc.com", entity: "RA-1001", ts: "2026-10-08T13:15:00Z", details: "Fuel surcharge $45.00 added" },
  { id: "al10", action: "reservation.created",        user: "admin@rentacarllc.com", entity: "RA-1004", ts: "2026-10-09T09:30:00Z", details: "Reservation created for Linda Johnson" },
];

const ACTION_COLORS: Record<string, string> = {
  "reservation.created":        "text-[var(--color-accent)]",
  "reservation.status_changed": "text-[var(--color-warning)]",
  "reservation.checkout":       "text-[var(--color-success)]",
  "reservation.return":         "text-[var(--color-success)]",
  "vehicle.status_changed":     "text-[var(--color-text-muted)]",
  "vehicle.fuel_updated":       "text-[var(--color-text-muted)]",
  "customer.updated":           "text-[var(--color-text-muted)]",
  "fine.created":               "text-[var(--color-danger)]",
  "external_charge.created":    "text-[var(--color-warning)]",
};

export default function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Audit Logs</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Activity trail for all system changes</p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {AUDIT_LOGS.map(log => (
            <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-[var(--color-bg)] transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-mono font-medium ${ACTION_COLORS[log.action] ?? "text-[var(--color-text-muted)]"}`}>
                    {log.action}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">·</span>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono">{log.entity}</span>
                </div>
                <p className="text-sm text-[var(--color-text)] mt-0.5">{log.details}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{log.user}</p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] shrink-0 mt-0.5">
                {formatDateTime(log.ts)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
