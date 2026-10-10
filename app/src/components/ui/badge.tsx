import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[var(--color-surface-alt)] text-[var(--color-text)]",
        pending:     "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
        confirmed:   "bg-[var(--color-info-bg)] text-[var(--color-info)]",
        active:      "bg-purple-100 text-purple-800",
        returned:    "bg-[var(--color-success-bg)] text-[var(--color-success)]",
        cancelled:   "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
        available:   "bg-[var(--color-success-bg)] text-[var(--color-success)]",
        dirty:       "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
        maintenance: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
        info:        "bg-[var(--color-info-bg)] text-[var(--color-info)]",
        success:     "bg-[var(--color-success-bg)] text-[var(--color-success)]",
        warning:     "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
        danger:      "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
