export const instant = false;

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Edit, Printer, Copy, Trash2,
  MapPin, User, Car, Fuel, Gauge,
} from "lucide-react";
import { getReservation } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import { formatCents, formatDate, formatDateTime } from "@/lib/utils";
import { ReservationWizard } from "./_components/reservation-wizard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params;
  const reservation = await getReservation(id);
  if (!reservation) notFound();

  const r = reservation;

  return (
    <div className="space-y-5">
      {/* Breadcrumb + actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/car-rental/reservations"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-[var(--color-text)]">{r.ra_number}</h1>
              <Badge variant={r.status}>{r.status}</Badge>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5 truncate">
              {r.customer_name} · {r.vehicle_class} · {formatDate(r.pickup_date)} → {formatDate(r.return_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm">
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <User className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Customer</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">{r.customer_name ?? "—"}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Car className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Vehicle</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {r.vehicle_plate ?? <span className="text-[var(--color-text-muted)] font-normal">Unassigned</span>}
          </p>
          {r.vehicle_class && (
            <p className="text-xs text-[var(--color-text-muted)]">{r.vehicle_class}</p>
          )}
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Locations</span>
          </div>
          <p className="text-xs text-[var(--color-text)]">↑ {r.pickup_location}</p>
          <p className="text-xs text-[var(--color-text)]">↓ {r.return_location}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Total</p>
          <p className="text-lg font-bold text-[var(--color-text)]">{formatCents(r.total_cents)}</p>
          {r.outstanding_cents > 0 && (
            <p className="text-xs text-[var(--color-danger)]">{formatCents(r.outstanding_cents)} outstanding</p>
          )}
        </div>
      </div>

      {/* Fuel / Odometer row */}
      {(r.fuel_level_out !== null || r.fuel_level_in !== null) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Fuel Out / In</p>
            <div className="flex items-center gap-4">
              {r.fuel_level_out !== null && (
                <div className="text-center">
                  <FuelLevelSelector value={r.fuel_level_out} readOnly />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Out</p>
                </div>
              )}
              {r.fuel_level_in !== null && (
                <div className="text-center">
                  <FuelLevelSelector value={r.fuel_level_in} readOnly />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">In</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Odometer</p>
            <div className="flex items-center gap-6">
              {r.odometer_out !== null && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{r.odometer_out.toLocaleString()} mi</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Out</p>
                </div>
              )}
              {r.odometer_in !== null && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{r.odometer_in.toLocaleString()} mi</p>
                  <p className="text-xs text-[var(--color-text-muted)]">In</p>
                </div>
              )}
              {r.odometer_out !== null && r.odometer_in !== null && (
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{(r.odometer_in - r.odometer_out).toLocaleString()} mi</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Driven</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9-step wizard */}
      <ReservationWizard reservation={r} />

      {/* Notes */}
      {r.notes && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Notes</p>
          <p className="text-sm text-[var(--color-text)]">{r.notes}</p>
        </div>
      )}
    </div>
  );
}
