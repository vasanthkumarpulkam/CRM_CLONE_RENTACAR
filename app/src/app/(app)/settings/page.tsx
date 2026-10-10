export const instant = false;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, User, Bell, Shield, CreditCard } from "lucide-react";

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
    </div>
  );
}
