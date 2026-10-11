import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { submitAddVehicle } from "../actions";
import { Button } from "@/components/ui/button";

export default function NewVehiclePage() {
  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/fleets/vehicles"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Add Vehicle</h1>
      </div>

      <form action={submitAddVehicle} className="space-y-5">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Vehicle details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Make <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                name="make"
                required
                placeholder="Toyota"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Model <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                name="model"
                required
                placeholder="Camry"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Year <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                name="year"
                type="number"
                required
                min={1990}
                max={2030}
                defaultValue={new Date().getFullYear()}
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Color
              </label>
              <input
                name="color"
                placeholder="White"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Plate # <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                name="plate"
                required
                placeholder="ABC-1234"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                VIN
              </label>
              <input
                name="vin"
                placeholder="1HGBH41JXMN109186"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Initial odometer (mi)
              </label>
              <input
                name="odometer"
                type="number"
                min={0}
                defaultValue={0}
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                Status
              </label>
              <select
                name="status"
                defaultValue="available"
                className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                <option value="available">Available</option>
                <option value="on_rent">On Rent</option>
                <option value="dirty">Dirty</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="out_of_service">Out of Service</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Fuel level
            </label>
            <select
              name="fuel_level"
              defaultValue="1"
              className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
            >
              <option value="1">Full</option>
              <option value="0.875">7/8</option>
              <option value="0.75">3/4</option>
              <option value="0.625">5/8</option>
              <option value="0.5">1/2</option>
              <option value="0.375">3/8</option>
              <option value="0.25">1/4</option>
              <option value="0.125">1/8</option>
              <option value="0">Empty</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/fleets/vehicles">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit">Add Vehicle</Button>
        </div>
      </form>
    </div>
  );
}
