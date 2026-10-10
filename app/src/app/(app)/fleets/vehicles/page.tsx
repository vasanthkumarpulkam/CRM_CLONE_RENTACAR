export const instant = false;

import { getVehicles } from "@/lib/data";
import type { VehicleStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import Link from "next/link";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available:   "Available",
  on_rent:     "On Rent",
  dirty:       "Dirty",
  maintenance: "Maintenance",
  repair:      "Repair",
};

const STATUS_BADGE: Record<VehicleStatus, "active" | "confirmed" | "pending" | "returned" | "cancelled" | "info" | "warning"> = {
  available:   "active",
  on_rent:     "confirmed",
  dirty:       "warning",
  maintenance: "pending",
  repair:      "cancelled",
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function VehiclesPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const vehicles = await getVehicles(status as VehicleStatus | undefined);

  const ALL_STATUSES: { value: VehicleStatus | "all"; label: string }[] = [
    { value: "all",         label: "All" },
    { value: "available",   label: "Available" },
    { value: "on_rent",     label: "On Rent" },
    { value: "dirty",       label: "Dirty" },
    { value: "maintenance", label: "Maintenance" },
    { value: "repair",      label: "Repair" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Vehicles</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
        {ALL_STATUSES.map(s => {
          const isActive = (status ?? "all") === s.value;
          const href = s.value === "all" ? "/fleets/vehicles" : `/fleets/vehicles?status=${s.value}`;
          return (
            <Link
              key={s.value}
              href={href}
              className={[
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div
            key={v.id}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-text)] truncate">
                  {v.year} {v.make} {v.model}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{v.plate} · {v.color}</p>
              </div>
              <Badge variant={STATUS_BADGE[v.status]} className="shrink-0">
                {STATUS_LABELS[v.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[var(--color-text-muted)]">Class</p>
                <p className="text-[var(--color-text)] font-medium">{v.class_name}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Key</p>
                <p className="text-[var(--color-text)] font-medium">{v.key}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Odometer</p>
                <p className="text-[var(--color-text)] font-medium">{v.odometer.toLocaleString()} mi</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Location</p>
                <p className="text-[var(--color-text)] font-medium truncate">{v.location_name}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1.5">Fuel</p>
              <FuelLevelSelector value={v.fuel_level} readOnly />
            </div>

            {v.current_renter && (
              <div className="text-xs pt-1 border-t border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">Rented by </span>
                <span className="text-[var(--color-text)] font-medium">{v.current_renter}</span>
                {v.available_date && (
                  <span className="text-[var(--color-text-muted)]"> · returns {v.available_date}</span>
                )}
              </div>
            )}
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-[var(--color-text-muted)]">
            No vehicles found
          </div>
        )}
      </div>
    </div>
  );
}
