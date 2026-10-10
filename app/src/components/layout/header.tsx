"use client";

import * as React from "react";
import { Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-[var(--sidebar-width)] right-0 h-[var(--header-height)] bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center px-4 gap-3 z-20">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        <Input
          placeholder="Search reservations, customers…"
          className="pl-8 h-8 text-sm bg-[var(--color-surface)]"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <Button
        size="sm"
        onClick={() => router.push("/car-rental/reservations/new")}
      >
        <Plus className="h-3.5 w-3.5" />
        New Reservation
      </Button>

      <button className="relative h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
      </button>
    </header>
  );
}
