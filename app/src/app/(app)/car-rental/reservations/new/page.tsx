export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">New Reservation</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Create a new rental agreement</p>
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex items-center justify-center">
        <p className="text-sm text-[var(--color-text-muted)]">Coming soon</p>
      </div>
    </div>
  );
}
