"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FuelLevelSelectorProps {
  value: number; // 0–8
  onChange?: (level: number) => void;
  readOnly?: boolean;
  className?: string;
}

const SEGMENTS = 8;

export function FuelLevelSelector({ value, onChange, readOnly, className }: FuelLevelSelectorProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const display = hovered ?? value;

  const getColor = (idx: number) => {
    const active = idx < display;
    if (!active) return "bg-[var(--color-border)] hover:bg-[var(--color-border-input)]";
    if (display <= 2) return "bg-[var(--color-danger)]";
    if (display <= 5) return "bg-[var(--color-warning)]";
    return "bg-[var(--color-success)]";
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} aria-label={`Fuel level ${value} of 8`}>
      <div className="flex gap-1 items-center">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            aria-label={`Set fuel to ${i + 1}`}
            className={cn(
              "h-6 flex-1 rounded-[var(--radius-sm)] transition-colors duration-100",
              getColor(i + 1),
              !readOnly && "cursor-pointer",
              readOnly && "cursor-default"
            )}
            onClick={() => !readOnly && onChange?.(i + 1)}
            onMouseEnter={() => !readOnly && setHovered(i + 1)}
            onMouseLeave={() => !readOnly && setHovered(null)}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
        <span>E</span>
        <span className="font-medium text-[var(--color-text)]">{value} / 8</span>
        <span>F</span>
      </div>
    </div>
  );
}
