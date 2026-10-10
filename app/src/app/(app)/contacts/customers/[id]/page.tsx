export const instant = false;

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, CreditCard, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { getContact, getReservations } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const [contact, allReservations] = await Promise.all([
    getContact(id),
    getReservations(),
  ]);
  if (!contact) notFound();

  const reservations = allReservations.filter(r => r.customer_id === id);

  const today = new Date().toISOString().split("T")[0];
  const dlExpired = contact.dl_expiry < today;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Link
            href="/contacts/customers"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)]">
              {contact.first_name} {contact.last_name}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">Customer profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-lg font-semibold text-[var(--color-accent)]">
                {contact.first_name[0]}{contact.last_name[0]}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)]">{contact.first_name} {contact.last_name}</p>
                <p className="text-xs text-[var(--color-text-muted)] capitalize">{contact.category}</p>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5 shrink-0" />
                <span className="text-[var(--color-text)] break-all">{contact.email}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5 shrink-0" />
                <span className="text-[var(--color-text)]">{contact.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[var(--color-text)]">{contact.street}</p>
                  <p className="text-[var(--color-text)]">{contact.city}, {contact.state} {contact.zip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver's License */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <CreditCard className="h-4 w-4 text-[var(--color-text-muted)]" />
              <p className="text-sm font-medium text-[var(--color-text)]">Driver&apos;s License</p>
            </div>
            <p className="text-sm text-[var(--color-text)] font-medium">{contact.dl_number}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className={`text-xs ${dlExpired ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]"}`}>
                Expires {formatDate(contact.dl_expiry)}
              </p>
              {dlExpired && (
                <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-danger)]" />
              )}
            </div>
            {dlExpired && (
              <p className="mt-2 text-xs text-[var(--color-danger)] font-medium">License expired</p>
            )}
          </div>
        </div>

        {/* Right: reservations */}
        <div className="lg:col-span-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Reservations
              </p>
              <span className="text-xs text-[var(--color-text-muted)]">{reservations.length} total</span>
            </div>
            {reservations.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">RA #</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:table-cell">Dates</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {reservations.map(r => (
                    <tr key={r.id} className="hover:bg-[var(--color-bg)] transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/car-rental/reservations/${r.id}`}
                          className="font-medium text-[var(--color-accent)] hover:underline"
                        >
                          {r.ra_number}
                        </Link>
                        <p className="text-xs text-[var(--color-text-muted)]">{r.vehicle_class}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] hidden sm:table-cell">
                        {formatDate(r.pickup_date)} → {formatDate(r.return_date)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.status}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--color-text)]">
                        ${(r.total_cents / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                No reservations yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
