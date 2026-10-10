"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/lib/data";

const STEPS = [
  { n: 1, label: "Quote" },
  { n: 2, label: "Customer" },
  { n: 3, label: "Vehicle Class" },
  { n: 4, label: "Vehicle" },
  { n: 5, label: "Rates" },
  { n: 6, label: "Details" },
  { n: 7, label: "Extras" },
  { n: 8, label: "Checkout" },
  { n: 9, label: "Return" },
];

interface Props {
  reservation: Reservation;
}

export function ReservationWizard({ reservation }: Props) {
  const [activeStep, setActiveStep] = React.useState(reservation.current_step);
  const currentStep = reservation.current_step;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Step bar */}
      <div className="p-4 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {STEPS.map((step, i) => {
            const done = currentStep > step.n;
            const active = activeStep === step.n;
            const reachable = step.n <= currentStep;
            return (
              <React.Fragment key={step.n}>
                {i > 0 && (
                  <div className={cn(
                    "h-px w-6 shrink-0",
                    done ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                  )} />
                )}
                <button
                  onClick={() => reachable && setActiveStep(step.n)}
                  disabled={!reachable}
                  className={cn(
                    "flex flex-col items-center gap-1 px-1 disabled:cursor-default",
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                    done
                      ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                      : active
                        ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                        : reachable
                          ? "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40"
                  )}>
                    {done ? <Check className="h-3.5 w-3.5" /> : step.n}
                  </div>
                  <span className={cn(
                    "text-[10px] whitespace-nowrap",
                    active ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-text-muted)]"
                  )}>
                    {step.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="p-5">
        <StepContent step={activeStep} reservation={reservation} />
      </div>
    </div>
  );
}

function StepContent({ step, reservation: r }: { step: number; reservation: Reservation }) {
  switch (step) {
    case 1: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Quote details</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[var(--color-text-muted)] text-xs">Pickup</p>
            <p className="text-[var(--color-text)]">{r.pickup_date}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-xs">Return</p>
            <p className="text-[var(--color-text)]">{r.return_date}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-xs">Pickup Location</p>
            <p className="text-[var(--color-text)]">{r.pickup_location}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-xs">Return Location</p>
            <p className="text-[var(--color-text)]">{r.return_location}</p>
          </div>
        </div>
      </div>
    );
    case 2: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Customer</p>
        <p className="text-sm text-[var(--color-text)]">{r.customer_name ?? "—"}</p>
      </div>
    );
    case 3: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Vehicle class</p>
        <p className="text-sm text-[var(--color-text)]">{r.vehicle_class ?? "—"}</p>
      </div>
    );
    case 4: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Assigned vehicle</p>
        <p className="text-sm text-[var(--color-text)]">
          {r.vehicle_plate
            ? `${r.vehicle_plate} (${r.vehicle_class})`
            : <span className="text-[var(--color-text-muted)]">No vehicle assigned</span>}
        </p>
      </div>
    );
    case 5: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Rental rates</p>
        <div className="text-sm">
          <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Base rate</span>
            <span className="text-[var(--color-text)] font-medium">${(r.total_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-medium text-[var(--color-text)]">Total</span>
            <span className="font-semibold text-[var(--color-text)]">${(r.total_cents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
    case 6: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Reservation details</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          {r.notes ?? "No additional notes."}
        </p>
      </div>
    );
    case 7: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Extras &amp; add-ons</p>
        <p className="text-sm text-[var(--color-text-muted)]">No extras added.</p>
      </div>
    );
    case 8: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Checkout — vehicle handoff</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Fuel level out</p>
            <p className="text-[var(--color-text)]">{r.fuel_level_out !== null ? `${r.fuel_level_out}/8` : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Odometer out</p>
            <p className="text-[var(--color-text)]">{r.odometer_out !== null ? `${r.odometer_out.toLocaleString()} mi` : "—"}</p>
          </div>
        </div>
      </div>
    );
    case 9: return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Return — vehicle check-in</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Fuel level in</p>
            <p className="text-[var(--color-text)]">{r.fuel_level_in !== null ? `${r.fuel_level_in}/8` : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Odometer in</p>
            <p className="text-[var(--color-text)]">{r.odometer_in !== null ? `${r.odometer_in.toLocaleString()} mi` : "—"}</p>
          </div>
        </div>
        {r.status === "returned" && (
          <p className="mt-3 text-sm text-[var(--color-success)] font-medium">✓ Vehicle returned successfully</p>
        )}
      </div>
    );
    default: return null;
  }
}
