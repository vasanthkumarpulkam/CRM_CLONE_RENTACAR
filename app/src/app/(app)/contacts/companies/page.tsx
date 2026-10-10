export const instant = false;

import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { getContacts } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function CompaniesPage() {
  const companies = await getContacts("company");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Companies</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{companies.length} company{companies.length !== 1 ? "s" : ""}</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Company
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        {companies.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reservations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/contacts/companies/${c.id}`}
                      className="font-medium text-[var(--color-accent)] hover:underline block"
                    >
                      {c.first_name} {c.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                    <p>{c.email}</p>
                    <p className="text-xs">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">
                    {c.city}, {c.state}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[var(--color-text)] font-medium">{c.reservation_count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="h-10 w-10 text-[var(--color-border)] mb-3" />
            <p className="text-sm font-medium text-[var(--color-text)]">No companies yet</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Add a company to track corporate accounts</p>
          </div>
        )}
      </div>
    </div>
  );
}
