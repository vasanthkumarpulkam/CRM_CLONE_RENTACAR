"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Calendar, Truck, Users,
  FileText, Receipt, BarChart3, Trash2, ClipboardList,
  ChevronDown, ChevronRight, Tag, AlertTriangle,
  Settings, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: "Dashboard",     href: "/dashboard",             icon: LayoutDashboard },
  {
    label: "Car Rental",    icon: Car,
    children: [
      { label: "Reservations",         href: "/car-rental/reservations" },
      { label: "Reservation Attempts", href: "/car-rental/reservation-attempts" },
      { label: "Quotes",               href: "/car-rental/quotes" },
      { label: "External Charges",     href: "/car-rental/external-charges" },
      { label: "Calendar",             href: "/car-rental/calendar" },
    ],
  },
  {
    label: "Fleet",         icon: Truck,
    children: [
      { label: "Vehicles",       href: "/fleets/vehicles" },
      { label: "Maintenance",    href: "/fleets/maintenance" },
      { label: "Repair Orders",  href: "/fleets/repair-orders" },
    ],
  },
  {
    label: "Contacts",      icon: Users,
    children: [
      { label: "Customers",  href: "/contacts/customers" },
      { label: "Companies",  href: "/contacts/companies" },
    ],
  },
  {
    label: "Forms",         icon: ClipboardList,
    children: [
      { label: "Fines",      href: "/fines" },
      { label: "Toll Tags",  href: "/toll-tags" },
    ],
  },
  { label: "Reports",   href: "/reports",    icon: BarChart3 },
  { label: "Audit Logs",href: "/audit-logs", icon: BookOpen },
  { label: "Trash",     href: "/trash",      icon: Trash2 },
  { label: "Settings",  href: "/settings",   icon: Settings },
];

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = item.children
    ? item.children.some(c => pathname.startsWith(c.href))
    : item.href && pathname.startsWith(item.href);
  const [open, setOpen] = React.useState(!!isActive);

  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors",
          isActive
            ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
            : "text-[var(--color-sidebar-text)] hover:bg-white/8 hover:text-white"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors",
          isActive
            ? "text-white"
            : "text-[var(--color-sidebar-text)] hover:bg-white/8 hover:text-white"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open
          ? <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          : <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        }
      </button>
      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
          {item.children!.map(child => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-2 py-1.5 rounded-[var(--radius-sm)] text-sm transition-colors",
                pathname.startsWith(child.href)
                  ? "text-[var(--color-accent)] font-medium"
                  : "text-[var(--color-sidebar-text)] hover:text-white"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[var(--sidebar-width)] bg-[var(--color-sidebar-bg)] flex flex-col z-30">
      {/* Logo */}
      <div className="h-[var(--header-height)] flex items-center px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-[var(--radius-md)] bg-[var(--color-accent)] flex items-center justify-center">
            <Car className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Rent a Car LLC</p>
            <p className="text-[10px] text-[var(--color-sidebar-text)] leading-tight">Fleet Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map(item => (
          <NavGroup key={item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="h-7 w-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-xs font-bold text-white">
            V
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">Vasant</p>
            <p className="text-xs text-[var(--color-sidebar-text)] truncate">Staff</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
