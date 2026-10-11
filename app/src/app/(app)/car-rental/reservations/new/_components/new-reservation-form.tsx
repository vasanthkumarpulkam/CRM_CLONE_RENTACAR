"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Location, VehicleClass, Vehicle, Contact } from "@/lib/db";
import { submitReservation } from "../actions";

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

type RentalType = "daily" | "weekly" | "monthly";

function diffDays(from: string, to: string): number {
  if (!from || !to) return 0;
  const d = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  return Math.max(0, Math.round(d));
}

function fmtMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function NewReservationForm({ locations, vehicleClasses, vehicles, contacts }: Props) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [created, setCreated] = React.useState<{ id: string; ra_number: string } | null>(null);

  const [form, setForm] = React.useState({
    pickupDate: "",
    returnDate: "",
    pickupLocation: locations[0]?.id ?? "",
    returnLocation: locations[0]?.id ?? "",
    rentalType: "monthly" as RentalType,
    customerId: "",
    vehicleClassId: "",
    vehicleId: "",
    // rates (cents)
    rateMonthly: 0,
    rateDaily: 0,
    rateWeekly: 0,
    securityDeposit: 0,
    notes: "",
    purpose: "",
  });

  function set<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  // Auto-fill rates from selected vehicle class
  React.useEffect(() => {
    const vc = vehicleClasses.find(c => c.id === form.vehicleClassId);
    if (vc) {
      set("rateMonthly", vc.monthly_rate_cents ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.vehicleClassId]);

  // Computed
  const days = diffDays(form.pickupDate, form.returnDate);
  const weeks = form.pickupDate && form.returnDate ? Math.ceil(days / 7) : 0;

  function baseRateCents(): number {
    if (form.rentalType === "daily")   return form.rateDaily * Math.max(1, days);
    if (form.rentalType === "weekly")  return form.rateWeekly * Math.max(1, weeks);
    return form.rateMonthly; // monthly: fixed
  }

  const totalCents = baseRateCents() + form.securityDeposit;

  const selectedContact = contacts.find(c => c.id === form.customerId);
  const selectedClass   = vehicleClasses.find(c => c.id === form.vehicleClassId);
  const selectedVehicle = vehicles.find(v => v.id === form.vehicleId);

  function next() {
    setError(null);
    if (step === 1 && (!form.pickupDate || !form.returnDate)) {
      setError("Please enter pickup and return dates.");
      return;
    }
    if (step === 2 && !form.customerId) {
      setError("Please select a customer.");
      return;
    }
    setStep(s => Math.min(s + 1, 9));
  }
  function prev() { setError(null); setStep(s => Math.max(s - 1, 1)); }

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitReservation({
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        pickupLocationId: form.pickupLocation,
        returnLocationId: form.returnLocation,
        customerId: form.customerId,
        vehicleId: form.vehicleId,
        vehicleClassId: form.vehicleClassId,
        rentalType: form.rentalType,
        rateMonthly: form.rentalType === "monthly" ? form.rateMonthly : 0,
        securityDeposit: form.securityDeposit,
        totalCents,
        notes: form.notes,
      });
      setCreated(result);
      setStep(9);
    } catch (e: any) {
      setError(e.message ?? "Failed to create reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
                  onClick={() => s.n < step && setStep(s.n)}
                  disabled={s.n >= step}
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

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">

        {/* Step 1 — Quote / rental period */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Rental period</h2>

            {/* Rental type toggle */}
            <div className="space-y-1.5">
              <Label>Rental type</Label>
              <div className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden w-fit">
                {(["daily", "weekly", "monthly"] as RentalType[]).map(rt => (
                  <button
                    key={rt}
                    onClick={() => set("rentalType", rt)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium capitalize transition-colors",
                      form.rentalType === rt
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                    )}
                  >
                    {rt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pickup">Pickup date</Label>
                <Input id="pickup" type="date" value={form.pickupDate} onChange={e => set("pickupDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="return">Return date</Label>
                <Input id="return" type="date" value={form.returnDate} onChange={e => set("returnDate", e.target.value)} min={form.pickupDate} />
              </div>
            </div>

            {days > 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                {days} day{days !== 1 ? "s" : ""} · {weeks} week{weeks !== 1 ? "s" : ""}
              </p>
            )}

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

        {/* Step 2 — Customer */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Customer</h2>
            {contacts.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No customers found. Add a customer first.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden max-h-80 overflow-y-auto">
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

        {/* Step 3 — Vehicle class */}
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
                  {vc.monthly_rate_cents > 0 && (
                    <p className="text-sm font-semibold text-[var(--color-accent)] mt-1">
                      {fmtMoney(vc.monthly_rate_cents)}/mo
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Assign vehicle */}
        {step === 4 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Assign vehicle</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Optional — skip to assign later.</p>
            {vehicles.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No available vehicles at this time.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden max-h-80 overflow-y-auto">
                {vehicles
                  .filter(v => !form.vehicleClassId || v.class_id === form.vehicleClassId)
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => set("vehicleId", v.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-bg)] transition-colors",
                        form.vehicleId === v.id && "bg-[var(--color-accent)]/5"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{v.label}</p>
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

        {/* Step 5 — Rates */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Rates</h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Rental type: <span className="font-medium capitalize">{form.rentalType}</span>
              {selectedClass && ` · ${selectedClass.name}`}
            </p>

            {form.rentalType === "monthly" && (
              <div className="space-y-1.5">
                <Label htmlFor="rate-mo">Monthly rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">$</span>
                  <Input
                    id="rate-mo"
                    type="number"
                    min="0"
                    className="pl-7"
                    value={form.rateMonthly ? (form.rateMonthly / 100).toFixed(2) : ""}
                    onChange={e => set("rateMonthly", Math.round(parseFloat(e.target.value || "0") * 100))}
                  />
                </div>
              </div>
            )}

            {form.rentalType === "daily" && (
              <div className="space-y-1.5">
                <Label htmlFor="rate-day">Daily rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">$</span>
                  <Input
                    id="rate-day"
                    type="number"
                    min="0"
                    className="pl-7"
                    value={form.rateDaily ? (form.rateDaily / 100).toFixed(2) : ""}
                    onChange={e => set("rateDaily", Math.round(parseFloat(e.target.value || "0") * 100))}
                  />
                </div>
                {days > 0 && form.rateDaily > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {days} days × {fmtMoney(form.rateDaily)} = {fmtMoney(form.rateDaily * days)}
                  </p>
                )}
              </div>
            )}

            {form.rentalType === "weekly" && (
              <div className="space-y-1.5">
                <Label htmlFor="rate-wk">Weekly rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">$</span>
                  <Input
                    id="rate-wk"
                    type="number"
                    min="0"
                    className="pl-7"
                    value={form.rateWeekly ? (form.rateWeekly / 100).toFixed(2) : ""}
                    onChange={e => set("rateWeekly", Math.round(parseFloat(e.target.value || "0") * 100))}
                  />
                </div>
                {weeks > 0 && form.rateWeekly > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {weeks} week{weeks !== 1 ? "s" : ""} × {fmtMoney(form.rateWeekly)} = {fmtMoney(form.rateWeekly * weeks)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="deposit">Security deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">$</span>
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  className="pl-7"
                  value={form.securityDeposit ? (form.securityDeposit / 100).toFixed(2) : ""}
                  onChange={e => set("securityDeposit", Math.round(parseFloat(e.target.value || "0") * 100))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6 — Details */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose of rental</Label>
              <Input
                id="purpose"
                type="text"
                placeholder="Personal, business, etc."
                value={form.purpose}
                onChange={e => set("purpose", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={4}
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
                placeholder="Internal notes about this reservation…"
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-input)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 7 — Extras */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Extras & add-ons</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Additional services can be added after the reservation is created via the reservation detail page.
            </p>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
              No extras selected — extras total: $0.00
            </div>
          </div>
        )}

        {/* Step 8 — Checkout / summary */}
        {step === 8 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-[var(--color-text)]">Confirm reservation</h2>

            <div className="space-y-3">
              <SummaryRow label="Customer" value={selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}` : "—"} />
              <SummaryRow label="Vehicle class" value={selectedClass?.name ?? "—"} />
              <SummaryRow label="Vehicle" value={selectedVehicle?.label ?? "Not assigned"} />
              <SummaryRow label="Pickup" value={`${form.pickupDate}  ·  ${locations.find(l => l.id === form.pickupLocation)?.name ?? ""}`} />
              <SummaryRow label="Return" value={`${form.returnDate}  ·  ${locations.find(l => l.id === form.returnLocation)?.name ?? ""}`} />
              <SummaryRow label="Duration" value={`${days} day${days !== 1 ? "s" : ""} (${form.rentalType})`} />
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
              <SummaryRow label="Base rate" value={fmtMoney(baseRateCents())} />
              {form.securityDeposit > 0 && (
                <SummaryRow label="Security deposit" value={fmtMoney(form.securityDeposit)} />
              )}
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                <span className="font-semibold text-[var(--color-text)]">Total due</span>
                <span className="font-semibold text-[var(--color-text)]">{fmtMoney(totalCents)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating reservation…</>
              ) : (
                "Confirm & create reservation"
              )}
            </Button>
          </div>
        )}

        {/* Step 9 — Done */}
        {step === 9 && (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto">
              <Check className="h-7 w-7 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--color-text)]">Reservation created</p>
              {created && (
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Agreement #{created.ra_number}
                </p>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Record a payment and complete the pickup checklist on the reservation page.
            </p>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prev} disabled={step === 1 || step === 9}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </Button>
        {step < 8 ? (
          <Button onClick={next}>
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : step === 8 ? (
          <div /> /* confirm button is inside step 8 panel */
        ) : (
          <Button onClick={() => created ? router.push(`/car-rental/reservations/${created.id}`) : router.push("/car-rental/reservations")}>
            {created ? "View reservation" : "Done"}
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="text-[var(--color-text)] font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
