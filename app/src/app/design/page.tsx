/**
 * /design — Design system showcase
 * View all UI primitives in isolation before building screens.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FuelLevelSelector } from "@/components/ui/fuel-level-selector";
import { SelectDemo } from "./_components/select-demo";
import { DialogDemo } from "./_components/dialog-demo";
import { TabsDemo } from "./_components/tabs-demo";
import { DropdownDemo } from "./_components/dropdown-demo";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-10 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-8">
        <h1 className="text-lg font-bold text-[var(--color-text)]">Design System</h1>
        <span className="ml-3 text-sm text-[var(--color-text-muted)]">Rent a Car LLC — primitive components</span>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10 space-y-12">

        {/* COLOURS */}
        <Section title="Colour Tokens">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["bg",          "var(--color-bg)",          "Background"],
              ["surface",     "var(--color-surface)",     "Surface"],
              ["surface-alt", "var(--color-surface-alt)", "Surface Alt"],
              ["sidebar",     "var(--color-sidebar-bg)",  "Sidebar"],
              ["accent",      "var(--color-accent)",      "Accent"],
              ["success",     "var(--color-success-bg)",  "Success bg"],
              ["warning",     "var(--color-warning-bg)",  "Warning bg"],
              ["danger",      "var(--color-danger-bg)",   "Danger bg"],
              ["info",        "var(--color-info-bg)",     "Info bg"],
            ].map(([key, bg, label]) => (
              <div key={key} className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)]">
                <div className="h-12" style={{ background: `var(${bg.slice(4, -1)})` }} />
                <div className="px-2 py-1 bg-[var(--color-surface)]">
                  <p className="text-xs font-medium">{label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{key}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        {/* TYPOGRAPHY */}
        <Section title="Typography">
          <Row label="Scale">
            <span className="text-xs">xs / 12px</span>
            <span className="text-sm">sm / 14px</span>
            <span className="text-base">base / 16px</span>
            <span className="text-lg">lg / 18px</span>
            <span className="text-xl">xl / 20px</span>
            <span className="text-2xl">2xl / 24px</span>
            <span className="text-3xl">3xl / 30px</span>
          </Row>
          <Row label="Weights">
            <span className="font-normal">Normal 400</span>
            <span className="font-medium">Medium 500</span>
            <span className="font-semibold">Semibold 600</span>
            <span className="font-bold">Bold 700</span>
          </Row>
        </Section>

        <Separator />

        {/* BADGES */}
        <Section title="Badge">
          <Row label="Status variants">
            <Badge variant="pending">Pending</Badge>
            <Badge variant="confirmed">Confirmed</Badge>
            <Badge variant="active">Active</Badge>
            <Badge variant="returned">Returned</Badge>
            <Badge variant="cancelled">Cancelled</Badge>
          </Row>
          <Row label="Semantic variants">
            <Badge variant="available">Available</Badge>
            <Badge variant="dirty">Dirty</Badge>
            <Badge variant="maintenance">Maintenance</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </Row>
        </Section>

        <Separator />

        {/* BUTTONS */}
        <Section title="Button">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="danger-outline">Danger Outline</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
          </Row>
        </Section>

        <Separator />

        {/* FORM ELEMENTS */}
        <Section title="Form Inputs">
          <Row label="Input">
            <div className="w-64 space-y-2">
              <Label htmlFor="demo-input">Label</Label>
              <Input id="demo-input" placeholder="Placeholder text" />
            </div>
            <div className="w-64 space-y-2">
              <Label>Error state</Label>
              <Input error placeholder="Invalid value" />
            </div>
            <div className="w-64 space-y-2">
              <Label>Disabled</Label>
              <Input disabled placeholder="Disabled" />
            </div>
          </Row>

          <Row label="Textarea">
            <div className="w-64 space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Enter notes…" rows={3} />
            </div>
          </Row>

          <Row label="Checkbox">
            <div className="flex items-center gap-2">
              <Checkbox id="chk1" />
              <Label htmlFor="chk1">Unchecked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="chk2" defaultChecked />
              <Label htmlFor="chk2">Checked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="chk3" disabled />
              <Label htmlFor="chk3" className="opacity-50">Disabled</Label>
            </div>
          </Row>

          <Row label="Select">
            <div className="w-48">
              <SelectDemo />
            </div>
          </Row>
        </Section>

        <Separator />

        {/* FUEL LEVEL */}
        <Section title="Fuel Level Selector">
          <Row label="Read-only examples">
            <div className="w-40">
              <FuelLevelSelector value={1} readOnly />
            </div>
            <div className="w-40">
              <FuelLevelSelector value={4} readOnly />
            </div>
            <div className="w-40">
              <FuelLevelSelector value={8} readOnly />
            </div>
          </Row>
          <Row label="Interactive">
            <div className="w-56">
              <FuelLevelSelector value={5} />
            </div>
          </Row>
        </Section>

        <Separator />

        {/* OVERLAYS */}
        <Section title="Overlays & Navigation">
          <Row label="Dialog / Modal">
            <DialogDemo />
          </Row>
          <Row label="Dropdown Menu">
            <DropdownDemo />
          </Row>
        </Section>

        <Separator />

        {/* TABS */}
        <Section title="Tabs">
          <TabsDemo />
        </Section>

        <Separator />

        {/* SKELETON */}
        <Section title="Skeleton">
          <Row label="Loading placeholders">
            <div className="space-y-2 w-64">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-20 w-40 rounded-[var(--radius-lg)]" />
          </Row>
        </Section>

        <Separator />

        {/* SPACING / RADIUS */}
        <Section title="Border Radius">
          <Row label="Scale">
            {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
              <div
                key={r}
                className="h-12 w-12 bg-[var(--color-accent)] flex items-center justify-center"
                style={{ borderRadius: `var(--radius-${r})` }}
              >
                <span className="text-[var(--color-on-accent)] text-xs">{r}</span>
              </div>
            ))}
          </Row>
        </Section>

      </main>
    </div>
  );
}
