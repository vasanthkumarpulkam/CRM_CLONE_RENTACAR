import { Car } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-[var(--color-accent)] flex items-center justify-center">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--color-text)]">Rent a Car LLC</p>
          <p className="text-sm text-[var(--color-text-muted)]">Fleet Management System</p>
        </div>
      </div>
      {children}
    </div>
  );
}
