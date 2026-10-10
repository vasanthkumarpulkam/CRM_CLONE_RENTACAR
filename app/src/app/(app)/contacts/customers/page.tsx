export const instant = false;

import { connection } from "next/server";
import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { getContacts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function CustomersPage() {
  await connection();
  const customers = await getContacts("customer");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Customers</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Customer
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">License</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reservations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {customers.map(c => {
              const dlExpired = c.dl_expiry < today;
              return (
                <tr key={c.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/contacts/customers/${c.id}`}
                      className="font-medium text-[var(--color-accent)] hover:underline block"
                    >
                      {c.first_name} {c.last_name}
                    </Link>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {c.city}, {c.state}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                    <p>{c.email}</p>
                    <p className="text-xs">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--color-text-muted)]">{c.dl_number}</span>
                      {dlExpired && (
                        <span title="License expired" className="text-[var(--color-danger)]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${dlExpired ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}`}>
                      exp {formatDate(c.dl_expiry)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[var(--color-text)] font-medium">{c.reservation_count}</span>
                  </td>
                </tr>
              );
            })}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
