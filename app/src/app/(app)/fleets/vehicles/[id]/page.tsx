export const instant = false;

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Car, MapPin, Gauge, Fuel } from "lucide-react";
import { getVehicle, getVehicleReservations } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import { formatDate, formatCents } from "@/lib/utils";
import { connection } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<string, "active" | "confirmed" | "pending" | "returned" | "cancelled" | "info" | "warning"> = {
  available:     "active",
  on_rent:       "confirmed",
  dirty:         "warning",
  maintenance:   "pending",
  repair:        "cancelled",
  out_of_service: "cancelled",
  on_sale:       "info",
  sold:          "returned",
  complementary: "info",
  new:           "info",
  reserved:      "confirmed",
  stolen:        "cancelled",
  recovered:     "warning",
  totaled:       "cancelled",
  repossessed:   "cancelled",
};

export default async function VehicleDetailPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const [vehicle, reservations] = await Promise.all([
    getVehicle(id),
    getVehicleReservations(id),
  ]);
  if (!vehicle) notFound();

  const v = vehicle;
  const statusVariant = STATUS_BADGE[v.status] ?? "info";
  const statusLabel = v.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/fleets/vehicles"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[var(--color-text)]">{v.label}</h1>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {v.plate} · {v.class_name}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Car className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Class</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">{v.class_name}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Location</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">{v.location_name}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Odometer</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">{v.odometer.toLocaleString()} mi</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Fuel className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Fuel</span>
          </div>
          <FuelLevelSelector value={v.fuel_level} readOnly />
        </div>
      </div>

      {/* Details */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Vehicle details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          {[
            { label: "Make",  value: v.make },
            { label: "Model", value: v.model },
            { label: "Year",  value: String(v.year) },
            { label: "Color", value: v.color || "—" },
            { label: "VIN",   value: v.vin  || "—" },
            { label: "Plate", value: v.plate || "—" },
            { label: "Key",   value: v.key  || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{label}</p>
              <p className="font-medium text-[var(--color-text)]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current rental */}
      {v.current_renter && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/5 p-4">
          <p className="text-sm font-medium text-[var(--color-text)]">
            Currently rented by <span className="text-[var(--color-warning)]">{v.current_renter}</span>
          </p>
          {v.available_date && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Expected return: {formatDate(v.available_date)}
            </p>
          )}
        </div>
      )}

      {/* Reservation history */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-text)]">Reservation history</p>
          <span className="text-xs text-[var(--color-text-muted)]">
            {reservations.length} {reservations.length === 1 ? "reservation" : "reservations"}
          </span>
        </div>
        {reservations.length === 0 ? (
          <p className="px-4 py-8 text-sm text-[var(--color-text-muted)] text-center">No reservations yet.</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {reservations.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <Link
                    href={`/car-rental/reservations/${r.id}`}
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {r.ra_number}
                  </Link>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {r.customer_name ?? "—"} · {formatDate(r.pickup_date)} → {formatDate(r.return_date)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={r.status}>{r.status}</Badge>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatCents(r.total_cents)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
