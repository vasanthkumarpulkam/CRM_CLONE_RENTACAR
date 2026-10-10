"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Location, VehicleClass, Vehicle, Contact } from "@/lib/db";

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
  locations: Location[];
  vehicleClasses: VehicleClass[];
  vehicles: Vehicle[];
  contacts: Contact[];
}

export default function NewReservationForm({ locations, vehicleClasses, vehicles, contacts }: Props) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: locations[0]?.id ?? "",
    returnLocation: locations[0]?.id ?? "",
    customerId: "",
    vehicleClassId: "",
    vehicleId: "",
    notes: "",
  });

  function set(key: keyof typeof form, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function next() { setStep(s => Math.min(s + 1, 9)); }
  function prev() { setStep(s => Math.max(s - 1, 1)); }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">New Reservation</h1>
      </div>

      {/* Step bar */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {STEPS.map((s, i) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <React.Fragment key={s.n}>
                {i > 0 && (
                  <div className={cn("h-px w-5 shrink-0", done ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]")} />
                )}
                <button
                  onClick={() => s.n <= step && setStep(s.n)}
                  disabled={s.n > step}
                  className="flex flex-col items-center gap-1 px-1 disabled:cursor-default"
                >
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                    done ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                      : active ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40"
                  )}>
                    {done ? <Check className="h-3.5 w-3.5" /> : s.n}
                  </div>
                  <span className={cn(
                    "text-[10px] whitespace-nowrap",
                    active ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-text-muted)]"
                  )}>
                    {s.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Quote — rental period</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pickup">Pickup date</Label>
                <Input id="pickup" type="date" value={form.pickupDate} onChange={e => set("pickupDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="return">Return date</Label>
                <Input id="return" type="date" value={form.returnDate} onChange={e => set("returnDate", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ploc">Pickup location</Label>
                <select
                  id="ploc"
                  value={form.pickupLocation}
                  onChange={e => set("pickupLocation", e.target.value)}
                  className="w-full h-9 rounded-[var(--radius-md)] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                >
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rloc">Return location</Label>
                <select
                  id="rloc"
                  value={form.returnLocation}
                  onChange={e => set("returnLocation", e.target.value)}
                  className="w-full h-9 rounded-[var(--radius-md)] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                >
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Customer</h2>
            {contacts.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No customers found. Add a customer first.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
                {contacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => set("customerId", c.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-bg)] transition-colors",
                      form.customerId === c.id && "bg-[var(--color-accent)]/5"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{c.email} · {c.phone}</p>
                    </div>
                    {form.customerId === c.id && (
                      <Check className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Vehicle class</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicleClasses.map(vc => (
                <button
                  key={vc.id}
                  onClick={() => set("vehicleClassId", vc.id)}
                  className={cn(
                    "rounded-[var(--radius-md)] border p-4 text-left hover:border-[var(--color-accent)]/50 transition-colors",
                    form.vehicleClassId === vc.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-border)]"
                  )}
                >
                  <p className="font-medium text-[var(--color-text)]">{vc.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{vc.transmission}</p>
                  {vc.monthly_rate_cents && (
                    <p className="text-sm font-semibold text-[var(--color-accent)] mt-1">
                      ${(vc.monthly_rate_cents / 100).toFixed(0)}/mo
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Assign vehicle</h2>
            {vehicles.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No available vehicles at this time.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => set("vehicleId", v.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-bg)] transition-colors",
                      form.vehicleId === v.id && "bg-[var(--color-accent)]/5"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{v.year} {v.make} {v.model}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{v.plate} · {v.class_name} · {v.odometer?.toLocaleString()} mi</p>
                    </div>
                    {form.vehicleId === v.id && (
                      <Check className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step >= 5 && step <= 7 && (
          <div className="py-6 text-center text-sm text-[var(--color-text-muted)]">
            Step {step} — {STEPS[step - 1].label} (coming soon)
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Checkout summary</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Review and confirm to create the reservation.</p>
          </div>
        )}

        {step === 9 && (
          <div className="py-6 text-center">
            <Check className="h-10 w-10 text-[var(--color-success)] mx-auto mb-3" />
            <p className="text-base font-semibold text-[var(--color-text)]">Reservation created</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">The rental agreement is now active.</p>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prev} disabled={step === 1}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </Button>
        {step < 9 ? (
          <Button onClick={next}>
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button onClick={() => router.push("/car-rental/reservations")}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
