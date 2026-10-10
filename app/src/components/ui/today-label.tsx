"use client";

export function TodayLabel() {
  return (
    <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </p>
  );
}
