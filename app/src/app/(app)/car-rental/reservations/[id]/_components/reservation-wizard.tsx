"use client";

import * as React from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import type { Reservation } from "@/lib/db";
import { submitPickup, submitReturn, submitPayment } from "../actions";

const STEPS = [
  { n: 1, label: "Quote" },
  { n: 2, label: "Customer" },
  { n: 3, label: "Vehicle Class" },
  { n: 4, label: "Vehicle" },
  { n: 5, label: "Rates" },
  { n: 6, label: "Payment" },
  { n: 7, label: "Extras" },
  { n: 8, label: "Pickup" },
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
                  className="flex flex-col items-center gap-1 px-1 disabled:cursor-default"
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

// ─── Individual step content ──────────────────────────────────────────────────

function StepContent({ step, reservation: r }: { step: number; reservation: Reservation }) {
  switch (step) {
    case 1: return <Step1Quote r={r} />;
    case 2: return <Step2Customer r={r} />;
    case 3: return <Step3VehicleClass r={r} />;
    case 4: return <Step4Vehicle r={r} />;
    case 5: return <Step5Rates r={r} />;
    case 6: return <Step6Payment r={r} />;
    case 7: return <Step7Extras />;
    case 8: return <Step8Pickup r={r} />;
    case 9: return <Step9Return r={r} />;
    default: return null;
  }
}

// ─── Step 1 — Quote ───────────────────────────────────────────────────────────

function Step1Quote({ r }: { r: Reservation }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Quote details</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoField label="Pickup date" value={r.pickup_date} />
        <InfoField label="Return date" value={r.return_date} />
        <InfoField label="Pickup location" value={r.pickup_location} />
        <InfoField label="Return location" value={r.return_location} />
      </div>
    </div>
  );
}

// ─── Step 2 — Customer ────────────────────────────────────────────────────────

function Step2Customer({ r }: { r: Reservation }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Customer</p>
      <p className="text-sm text-[var(--color-text)]">{r.customer_name ?? "—"}</p>
    </div>
  );
}

// ─── Step 3 — Vehicle class ───────────────────────────────────────────────────

function Step3VehicleClass({ r }: { r: Reservation }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Vehicle class</p>
      <p className="text-sm text-[var(--color-text)]">{r.vehicle_class ?? "—"}</p>
    </div>
  );
}

// ─── Step 4 — Vehicle ────────────────────────────────────────────────────────

function Step4Vehicle({ r }: { r: Reservation }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Assigned vehicle</p>
      <p className="text-sm text-[var(--color-text)]">
        {r.vehicle_plate
          ? `${r.vehicle_plate} (${r.vehicle_class})`
          : <span className="text-[var(--color-text-muted)]">No vehicle assigned</span>}
      </p>
    </div>
  );
}

// ─── Step 5 — Rates ──────────────────────────────────────────────────────────

function Step5Rates({ r }: { r: Reservation }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Rental rates</p>
      <div className="text-sm divide-y divide-[var(--color-border)]">
        <div className="flex justify-between py-1.5">
          <span className="text-[var(--color-text-muted)]">Base rate</span>
          <span className="text-[var(--color-text)] font-medium">{formatCents(r.total_cents)}</span>
        </div>
        <div className="flex justify-between py-1.5 font-medium">
          <span className="text-[var(--color-text)]">Total</span>
          <span className="text-[var(--color-text)]">{formatCents(r.total_cents)}</span>
        </div>
        {r.outstanding_cents > 0 && (
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--color-danger)]">Balance due</span>
            <span className="text-[var(--color-danger)] font-medium">{formatCents(r.outstanding_cents)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 6 — Record payment ─────────────────────────────────────────────────

function Step6Payment({ r }: { r: Reservation }) {
  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState<"cash" | "card" | "check" | "other">("cash");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitPayment({
        reservation_id: r.id,
        amount_cents: Math.round(amountNum * 100),
        method,
        notes: notes || undefined,
      });
      setSuccess(`Payment of $${amountNum.toFixed(2)} recorded.`);
      setAmount("");
      setNotes("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setSubmitting(false);
    }
  }

  const METHODS: Array<{ value: "cash" | "card" | "check" | "other"; label: string }> = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "check", label: "Check" },
    { value: "other", label: "Other" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[var(--color-text)]">Record a payment</p>
        {r.outstanding_cents > 0 && (
          <span className="text-xs text-[var(--color-danger)] font-medium">
            {formatCents(r.outstanding_cents)} outstanding
          </span>
        )}
        {r.outstanding_cents === 0 && r.total_cents > 0 && (
          <span className="text-xs text-[var(--color-success)] font-medium">Paid in full</span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 p-3 mb-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 p-3 mb-3 text-sm text-[var(--color-success)]">
          <Check className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Method toggle */}
        <div>
          <Label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">Payment method</Label>
          <div className="flex gap-1">
            {METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] border transition-colors",
                  method === m.value
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="pay-amount" className="text-xs text-[var(--color-text-muted)] mb-1 block">
            Amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">$</span>
            <Input
              id="pay-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="pay-notes" className="text-xs text-[var(--color-text-muted)] mb-1 block">
            Notes (optional)
          </Label>
          <Input
            id="pay-notes"
            placeholder="e.g. deposit, final payment…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Recording…</> : "Record payment"}
        </Button>
      </form>
    </div>
  );
}

// ─── Step 7 — Extras ─────────────────────────────────────────────────────────

function Step7Extras() {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-3">Extras &amp; add-ons</p>
      <p className="text-sm text-[var(--color-text-muted)]">No extras added to this reservation.</p>
    </div>
  );
}

// ─── Step 8 — Pickup (vehicle handoff) ───────────────────────────────────────

function Step8Pickup({ r }: { r: Reservation }) {
  const alreadyPickedUp = r.odometer_out !== null || r.status === "active" || r.status === "returned";

  const [odometer, setOdometer] = React.useState(r.odometer_out?.toString() ?? "");
  const [fuelLevel, setFuelLevel] = React.useState<number>(r.fuel_level_out ?? 4);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(alreadyPickedUp);

  async function handlePickup(e: React.FormEvent) {
    e.preventDefault();
    const odo = parseInt(odometer, 10);
    if (isNaN(odo) || odo < 0) {
      setError("Enter a valid odometer reading.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitPickup(r.id, { odometer: odo, fuel_level: fuelLevel });
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record pickup.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Pickup — vehicle handoff</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoField label="Fuel level out" value={r.fuel_level_out !== null ? `${r.fuel_level_out}/8` : fuelLevel + "/8"} />
          <InfoField label="Odometer out" value={r.odometer_out !== null ? `${r.odometer_out.toLocaleString()} mi` : odometer + " mi"} />
        </div>
        <p className="mt-3 text-sm text-[var(--color-success)] font-medium flex items-center gap-1.5">
          <Check className="h-4 w-4" /> Pickup recorded — reservation is active
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-4">Pickup — vehicle handoff</p>

      {error && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 p-3 mb-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handlePickup} className="space-y-4">
        <div>
          <Label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">Fuel level</Label>
          <FuelLevelSelector value={fuelLevel} onChange={setFuelLevel} />
        </div>

        <div>
          <Label htmlFor="pickup-odo" className="text-xs text-[var(--color-text-muted)] mb-1 block">
            Odometer reading (miles)
          </Label>
          <Input
            id="pickup-odo"
            type="number"
            min="0"
            placeholder="e.g. 24500"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Recording…</> : "Confirm pickup"}
        </Button>
      </form>
    </div>
  );
}

// ─── Step 9 — Return (vehicle check-in) ──────────────────────────────────────

function Step9Return({ r }: { r: Reservation }) {
  const alreadyReturned = r.status === "returned";

  const [odometer, setOdometer] = React.useState(r.odometer_in?.toString() ?? "");
  const [fuelLevel, setFuelLevel] = React.useState<number>(r.fuel_level_in ?? 4);
  const [chargeFuel, setChargeFuel] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(alreadyReturned);

  async function handleReturn(e: React.FormEvent) {
    e.preventDefault();
    const odo = parseInt(odometer, 10);
    if (isNaN(odo) || odo < 0) {
      setError("Enter a valid odometer reading.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitReturn(r.id, { odometer: odo, fuel_level: fuelLevel, charge_fuel: chargeFuel });
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record return.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div>
        <p className="text-sm font-medium text-[var(--color-text)] mb-3">Return — vehicle check-in</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <InfoField label="Fuel level in" value={r.fuel_level_in !== null ? `${r.fuel_level_in}/8` : fuelLevel + "/8"} />
          <InfoField label="Odometer in" value={r.odometer_in !== null ? `${r.odometer_in.toLocaleString()} mi` : odometer + " mi"} />
        </div>
        <p className="mt-3 text-sm text-[var(--color-success)] font-medium flex items-center gap-1.5">
          <Check className="h-4 w-4" /> Vehicle returned successfully
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)] mb-4">Return — vehicle check-in</p>

      {error && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 p-3 mb-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleReturn} className="space-y-4">
        <div>
          <Label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">Fuel level returned</Label>
          <FuelLevelSelector value={fuelLevel} onChange={setFuelLevel} />
        </div>

        <div>
          <Label htmlFor="return-odo" className="text-xs text-[var(--color-text-muted)] mb-1 block">
            Odometer reading (miles)
          </Label>
          <Input
            id="return-odo"
            type="number"
            min="0"
            placeholder="e.g. 25800"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={chargeFuel}
            onChange={(e) => setChargeFuel(e.target.checked)}
            className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
          />
          <span className="text-sm text-[var(--color-text)]">Charge fuel fee</span>
        </label>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Recording…</> : "Confirm return"}
        </Button>
      </form>
    </div>
  );
}

// ─── Shared helper ────────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{label}</p>
      <p className="text-sm text-[var(--color-text)]">{value ?? "—"}</p>
    </div>
  );
}
