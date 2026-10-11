export const instant = false;

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Printer } from "lucide-react";
import { getReservation } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCents, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReservationAgreementPage({ params }: Props) {
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const r = reservation;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/car-rental/reservations/${id}`}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)]">Rental Agreement</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{r.ra_number} · {r.customer_name}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={undefined}
          // Use window.print() via a client-side click; for now this prints the page
          className="print:hidden"
        >
          <Printer className="h-3.5 w-3.5" />
          Print Agreement
        </Button>
      </div>

      {/* Agreement document */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 space-y-6 text-sm print:border-none print:shadow-none">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-[var(--color-text)]">VEHICLE RENTAL AGREEMENT</h2>
          <p className="text-[var(--color-text-muted)]">Rental Agreement No. {r.ra_number}</p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Rental Company</h3>
            <div className="space-y-1 text-[var(--color-text)]">
              <p className="font-medium">Rent a Car LLC</p>
              <p className="text-[var(--color-text-muted)]">Dallas, TX</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Renter</h3>
            <div className="space-y-1 text-[var(--color-text)]">
              <p className="font-medium">{r.customer_name}</p>
            </div>
          </div>
        </div>

        {/* Rental details */}
        <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)] w-40">Vehicle class</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{r.vehicle_class ?? "—"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Pickup date</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{formatDate(r.pickup_date)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Return date</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{formatDate(r.return_date)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Pickup location</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{r.pickup_location ?? "—"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Return location</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{r.return_location ?? "—"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Rental type</td>
                <td className="px-4 py-2.5 text-[var(--color-text)] font-medium capitalize">{r.rental_type ?? "—"}</td>
              </tr>
              {r.base_rate_cents != null && (
                <tr>
                  <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Base rate</td>
                  <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{formatCents(r.base_rate_cents)}</td>
                </tr>
              )}
              {r.total_cents != null && (
                <tr>
                  <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Total</td>
                  <td className="px-4 py-2.5 text-[var(--color-text)] font-bold">{formatCents(r.total_cents)}</td>
                </tr>
              )}
              {r.security_deposit_cents != null && (
                <tr>
                  <td className="px-4 py-2.5 text-[var(--color-text-muted)]">Security deposit</td>
                  <td className="px-4 py-2.5 text-[var(--color-text)] font-medium">{formatCents(r.security_deposit_cents)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Terms */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Terms &amp; Conditions</h3>
          <div className="space-y-2 text-[var(--color-text-muted)] leading-relaxed text-xs">
            <p>
              1. <strong className="text-[var(--color-text)]">Renter Responsibility.</strong> The renter accepts full responsibility for the vehicle during the rental period. Any damage, theft, or loss will be charged to the renter.
            </p>
            <p>
              2. <strong className="text-[var(--color-text)]">Fuel Policy.</strong> The vehicle must be returned with the same fuel level as at pickup. Failure to do so will result in a fuel service fee.
            </p>
            <p>
              3. <strong className="text-[var(--color-text)]">Traffic Violations.</strong> The renter is responsible for all traffic citations, fines, and violations incurred during the rental period.
            </p>
            <p>
              4. <strong className="text-[var(--color-text)]">Late Returns.</strong> Vehicles returned after the agreed return date and time will be charged at the daily rate for each additional day or part thereof.
            </p>
            <p>
              5. <strong className="text-[var(--color-text)]">Authorized Drivers.</strong> Only the named renter and pre-approved additional drivers may operate the vehicle.
            </p>
            <p>
              6. <strong className="text-[var(--color-text)]">Security Deposit.</strong> A security deposit is held and will be released upon satisfactory return of the vehicle, subject to any applicable charges.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-4">
          <div className="space-y-2">
            <div className="border-b border-[var(--color-border)] h-8" />
            <p className="text-xs text-[var(--color-text-muted)]">Renter signature</p>
            <p className="text-xs text-[var(--color-text-muted)]">Date: _______________</p>
          </div>
          <div className="space-y-2">
            <div className="border-b border-[var(--color-border)] h-8" />
            <p className="text-xs text-[var(--color-text-muted)]">Authorized representative</p>
            <p className="text-xs text-[var(--color-text-muted)]">Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
