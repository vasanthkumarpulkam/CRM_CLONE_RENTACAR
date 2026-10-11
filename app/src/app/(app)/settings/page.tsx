export const instant = false;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, User, Bell, Shield, CreditCard, Users, DollarSign } from "lucide-react";

const SECTIONS = [
  {
    id: "company",
    icon: Building2,
    title: "Company",
    fields: [
      { id: "company_name",   label: "Company name",    value: "Rent a Car LLC",            type: "text" },
      { id: "company_email",  label: "Business email",  value: "admin@rentacarllc.com",      type: "email" },
      { id: "company_phone",  label: "Business phone",  value: "214-555-0001",               type: "tel" },
      { id: "company_tax",    label: "Tax ID",          value: "XX-XXXXXXX",                 type: "text" },
    ],
  },
  {
    id: "locations",
    icon: MapPin,
    title: "Locations",
    fields: [
      { id: "loc1_name",    label: "Location 1 name",    value: "Dallas – LBJ",                                  type: "text" },
      { id: "loc1_address", label: "Location 1 address", value: "6537 Lyndon B Johnson Fwy, Dallas, TX 75240",    type: "text" },
      { id: "loc2_name",    label: "Location 2 name",    value: "Dallas – Stemmons",                              type: "text" },
      { id: "loc2_address", label: "Location 2 address", value: "2121 Stemmons Fwy, Dallas, TX 75207",            type: "text" },
    ],
  },
  {
    id: "account",
    icon: User,
    title: "Account",
    fields: [
      { id: "admin_name",  label: "Your name",  value: "Admin User",           type: "text" },
      { id: "admin_email", label: "Your email", value: "admin@rentacarllc.com", type: "email" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage your account and fleet configuration</p>
      </div>

      {/* Nav pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { icon: Building2, label: "Company" },
          { icon: MapPin,    label: "Locations" },
          { icon: User,      label: "Account" },
          { icon: Bell,      label: "Notifications" },
          { icon: Shield,    label: "Security" },
          { icon: CreditCard, label: "Billing" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors text-[var(--color-text-muted)]"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {SECTIONS.map(section => (
        <div key={section.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
            <section.icon className="h-4 w-4 text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text)]">{section.title}</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map(f => (
                <div key={f.id} className="space-y-1.5">
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input
                    id={f.id}
                    type={f.type}
                    defaultValue={f.value}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-1">
              <Button size="sm">Save {section.title}</Button>
            </div>
          </div>
        </div>
      ))}

      {/* User management */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
          <Users className="h-4 w-4 text-[var(--color-text-muted)]" />
          <p className="text-sm font-medium text-[var(--color-text)]">Team members</p>
          <span className="ml-auto text-xs text-[var(--color-text-muted)]">1 member</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Admin User</p>
              <p className="text-xs text-[var(--color-text-muted)]">admin@rentacarllc.com · Admin</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium">You</span>
          </div>
        </div>
        <div className="p-5 pt-3 border-t border-[var(--color-border)]">
          <Button size="sm" variant="ghost">
            <Users className="h-3.5 w-3.5" />
            Invite team member
          </Button>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Invite additional staff to manage reservations and fleet. Multi-role support coming soon.
          </p>
        </div>
      </div>

      {/* Pricing & rates */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border)]">
          <DollarSign className="h-4 w-4 text-[var(--color-text-muted)]" />
          <p className="text-sm font-medium text-[var(--color-text)]">Pricing &amp; rates</p>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Default daily, weekly, and monthly rates are set per vehicle class.
            These rates auto-fill when a new reservation is created.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["Daily rate", "Weekly rate", "Monthly rate"].map(label => (
              <div key={label} className="space-y-1.5">
                <Label>{label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">$</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    className="pl-6"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            To set rates per class, go to each vehicle class in Fleet → Vehicle Classes.
          </p>
          <div className="flex justify-end">
            <Button size="sm">Save Rates</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
