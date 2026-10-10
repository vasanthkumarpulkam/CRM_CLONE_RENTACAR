# Component Specs — Rent a Car LLC CRM Clone

Every component is built with shadcn/ui primitives (Radix UI) + Tailwind tokens.
Icon set: Lucide React (MIT). No HQ Rentals icons copied.

---

## Layout Shells

### AppShell
  purpose   Root layout: sidebar + header + main content area
  layout    `flex h-screen overflow-hidden`; sidebar fixed-width, main scrolls
  tokens    bg-sidebar-bg (sidebar), bg-bg (page), header height 56px
  used on   All authenticated screens S01–S28, S30

### Sidebar
  variants  expanded (240px), collapsed (64px, icons only)
  states    expanded, collapsed, item-active, item-hover
  sections  Brand logo top, nav groups (Car Rental ▾, Fleet ▾, Contacts ▾), bottom actions
  tokens    bg sidebar-bg, text sidebar-text, active: bg sidebar-active-bg + text sidebar-active-text
  a11y      `<nav role="navigation">`, `aria-current="page"` on active link, keyboard navigable
  used on   All screens

### TopHeader
  purpose   Company name/logo left, user name + avatar right, breadcrumb center
  height    56px
  tokens    bg surface, border-b border, shadow-sm
  used on   All screens

---

## Navigation

### NavGroup (sidebar section)
  purpose   Collapsible section header (e.g. "Car Rental ▾")
  states    open, closed
  tokens    text sidebar-text, chevron rotates on open
  a11y      `<button aria-expanded>` for the toggle

### NavItem (sidebar link)
  states    default, hover, active
  tokens    default: text sidebar-text; hover: bg sidebar-active-bg/50; active: bg sidebar-active-bg + text sidebar-active-text
  a11y      `<a>` with href, aria-current="page" when active

### WizardProgress
  purpose   10-tab progress indicator across reservation steps (Dates/Vehicles/.../History)
  variants  step-complete, step-active, step-pending
  tokens    complete: bg accent text on-accent; active: bg accent/10 text accent font semibold; pending: text text-muted
  a11y      `<nav aria-label="Reservation steps">`, active step `aria-current="step"`
  used on   S03–S12

---

## Data Display

### DataTable
  purpose   Sortable, filterable, paginated table (core component — used everywhere)
  features  Column headers with sort chevrons, row hover, checkbox multi-select, save-search, export
  row height  48px
  header style  text-xs uppercase tracking-wide font-semibold text-muted bg-surface-alt
  tokens    border border, row hover bg-surface-alt, selected row bg-accent/5
  toolbar   Actions button | Columns button | Print | Reset | Export | Delete (floats above table)
  empty     Centered illustration + "No records found" + optional action button
  states    loading (skeleton rows), empty, filled, filtered, error
  a11y      `<table>` with `<th scope="col">`, `aria-sort`, keyboard row navigation
  used on   S02, S13–S24, S26–S27

### TableToolbar
  purpose   Floating action bar above DataTable
  items     Actions (dropdown), Columns (column picker), Print, Reset, Export CSV, Delete (danger)
  tokens    bg surface, border, shadow-sm, radius-md, p-2

### StatusBadge
  purpose   Colour-coded status pill (reservation status, vehicle status)
  variants  pending, confirmed, active, returned, cancelled, available, dirty, out-of-service, overdue
  colours
    pending:    bg warning-bg text warning
    confirmed:  bg info-bg text info
    active:     bg active-rental/10 text active-rental
    returned:   bg success-bg text success
    cancelled:  bg danger-bg text danger
    available:  bg success-bg text success
    dirty:      bg warning-bg text warning
    out-of-service: bg danger-bg text danger
  sizes     sm (px-2 py-0.5 text-xs), md (px-3 py-1 text-sm)
  tokens    radius-full, font-semibold
  a11y      Wrap with `<span>` + visually-hidden text for screen readers
  used on   S02, S14, S17, S21

### AlertChip
  purpose   Inline contextual alert (reservation modified, deposit unpaid, balance due)
  variants  info, warning, danger
  tokens    bg info-bg/warning-bg/danger-bg, text info/warning/danger, border matching colour, radius-md
  layout    Icon left + text, full-width in summary panel
  used on   S04 summary panel

### SummaryPanel
  purpose   Right-side info panel during reservation wizard
  width     320px, fixed right, full height of wizard area
  sections  Alert chips stack, Rental block (dates/locations), Active Vehicle block, Audits block
  tokens    bg surface, border-l border, p-6
  used on   S04–S12

---

## Forms

### Input
  variants  default, disabled, error, with-icon-left, with-icon-right
  sizes     sm (32px), md (40px — default), lg (48px)
  tokens    border border-input, bg surface, text text, radius-md
  states    rest, hover (border accent/40), focus (ring-2 ring border-focus outline-none), error (border danger ring-danger/30), disabled (opacity-50 cursor-not-allowed)
  a11y      Always paired with `<label>` (htmlFor), error message via `aria-describedby`
  used on   All form screens

### Select
  base      Radix Select (accessible keyboard navigation, portal dropdown)
  variants  same as Input
  tokens    same border/focus tokens as Input, dropdown: bg surface shadow-md border radius-md
  used on   S03 (locations, time), S04 (vehicle class), S17 (status filter)

### DatePicker
  base      shadcn Calendar + Popover
  variants  single date, date range
  tokens    calendar grid: text-sm; selected day: bg accent text on-accent; today: ring-1 ring accent; range: bg accent/15
  a11y      `aria-label` on trigger, keyboard navigation within calendar
  used on   S03, S06 (birthday, DL expiry, insurance dates), S28

### TimePicker
  purpose   Hour:Minute select (12-hour with AM/PM or 24-hour)
  implementation  Two `<Select>` components (hour + minute) + AM/PM toggle
  used on   S03 (pickup/return time), S09 (pickup time override), S11 (return time override)

### Textarea
  variants  default, error, disabled
  tokens    same as Input; min-height 80px; resize-y
  used on   S03 (comments), S09 (damage report), S20 (notes)

### Checkbox
  base      Radix Checkbox
  tokens    border border-input; checked: bg accent border-accent; focus: ring-2 ring border-focus
  a11y      `<label>` wraps checkbox; `aria-checked`
  used on   S05 (discount type toggle), S09 (recalculate toggle), S11

### Toggle (Yes/No)
  purpose   Binary choice (replaces checkbox in HQ's style)
  implementation  Two Button variants (one active, one ghost) in a group
  used on   S05, S09, S11

### FuelLevelSelector
  purpose   Pick fuel level on 0–8 scale (unique to car rental domain)
  implementation  8-segment bar with clickable segments; selected and below filled with accent; 0 = empty (danger), 8 = full (success)
  a11y      `<input type="range" min=0 max=8>` underneath for screen readers; visible segments are `aria-hidden`
  tokens    filled: bg accent; empty: bg surface-alt; danger zone (0-2): bg danger
  used on   S09, S11, S17 (display only), S18

### SignaturePad
  purpose   Freehand signature capture
  implementation  HTML5 Canvas + pointer events; save as base64 PNG URL → store in Supabase Storage
  controls  Clear button + Save button
  states    empty, drawing, saved
  a11y      `role="img" aria-label="Signature"` on canvas; Save button confirms capture
  used on   S07 (confirm), S09 (pickup), S10 (contract)

### ImageUpload
  purpose   Drag-and-drop or click-to-upload for vehicle damage photos and DL scans
  implementation  shadcn file input wrapper; preview thumbnails after upload
  limits    10MB per file, images only (jpeg/png/webp), max 10 per reservation step
  states    idle, dragging, uploading (progress bar), uploaded (thumbnail grid), error
  tokens    border-dashed border-2 border-border, hover: border-accent bg-accent/5, radius-lg
  a11y      `<input type="file" accept="image/*">` + `aria-describedby` for limits
  used on   S09, S11, S18

### AutocompleteSearch
  purpose   Type-ahead search for customers, RA numbers, vehicle keys
  implementation  Radix Combobox pattern; debounced API call at 300ms; keyboard-selectable results
  states    idle, typing, loading, results, empty ("New Customer" option shown), selected
  tokens    Input styles + dropdown: bg surface shadow-md border radius-md max-h-64 overflow-y-auto
  a11y      `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-activedescendant`
  used on   S01 (RA# search), S06 (customer attach), S21

### CouponInput
  purpose   Coupon code field with Apply button inline
  layout    Input + Button side by side
  states    idle, applied (success chip), invalid (danger chip)
  used on   S05

---

## Buttons

### Button
  variants  primary (bg accent), secondary (border accent text accent bg surface), ghost (no border), danger (bg danger), link (text accent no bg)
  sizes     sm (h-8 px-3 text-xs), md (h-10 px-4 text-sm — default), lg (h-12 px-6 text-base)
  states    default, hover (accent-hover), active (scale-95), focus-visible (ring-2 ring border-focus ring-offset-2), disabled (opacity-50 cursor-not-allowed), loading (spinner replaces or precedes label; label kept for screen readers)
  tokens    radius-md, font-semibold, transition-colors duration-normal
  a11y      Real `<button type="button">` or `type="submit"`; `aria-disabled` when disabled; `aria-busy` when loading
  used on   All screens

### IconButton
  purpose   Square button with icon only (table row actions, sidebar collapse)
  sizes     sm (32px), md (40px), lg (48px)
  variants  ghost, secondary
  a11y      `aria-label` required; tooltip on hover
  used on   DataTable row actions, TopHeader

### ButtonGroup
  purpose   Visually connected group of buttons (Yes/No toggles, wizard nav)
  tokens    First button: rounded-l-md rounded-r-none; last: rounded-r-md rounded-l-none; inner: rounded-none; share border
  used on   S05, S09, S11

### DropdownMenu
  base      Radix DropdownMenu
  purpose   Actions menu (table rows, reservation header "Email Templates")
  tokens    bg surface border shadow-md radius-md; item: px-3 py-2 text-sm hover:bg-surface-alt
  a11y      `role="menu"`, `role="menuitem"`, keyboard navigation
  used on   DataTable toolbar, Reservation header

---

## Feedback

### Toast
  purpose   Success/error/info notifications (top-right, auto-dismiss 4s)
  base      sonner or Radix Toast
  variants  success (bg success-bg text success), error (bg danger-bg text danger), info (bg info-bg text info)
  tokens    shadow-lg radius-lg p-4, icon left
  a11y      `role="status"` (success/info) or `role="alert"` (error)
  used on   All create/update/delete actions

### Modal
  base      Radix Dialog
  sizes     sm (max-w-sm), md (max-w-md — default), lg (max-w-2xl), xl (max-w-4xl)
  tokens    bg surface shadow-xl radius-xl; backdrop: bg black/50; header: pb-4 border-b border; footer: pt-4 border-t border flex gap-2 justify-end
  a11y      `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, ESC to close
  used on   Quick actions, confirmations, damage reports, payment entry

### ConfirmDialog
  purpose   "Are you sure?" for destructive actions (cancel reservation, delete vehicle)
  tokens    Modal sm + danger Button + secondary Button
  used on   Cancel reservation, delete contact, hard delete from trash

### LoadingSpinner
  purpose   Inline and full-page loading states
  variants  xs (12px), sm (16px), md (24px), lg (48px — full-page overlay)
  tokens    text accent, animate-spin
  a11y      `aria-live="polite"` container; `role="status"` + visually-hidden "Loading..."

### SkeletonRow
  purpose   Placeholder rows while table data loads
  tokens    bg surface-alt animate-pulse; height = table-row-height
  used on   All DataTable loading states

### EmptyState
  purpose   Zero-records state for tables and sections
  layout    Center-aligned icon (Lucide) + heading + subtext + optional action button
  tokens    text text-muted, icon 48px
  used on   All DataTable empty states, Dashboard no-data

---

## Navigation / Tabs

### Tabs
  base      Radix Tabs
  variants  underline (dashboard), pill (card tabs in wizard steps)
  underline: active tab: border-b-2 border-accent text-accent; inactive: text-muted hover:text-text
  pill: active: bg accent text on-accent; inactive: text-muted hover:bg-surface-alt
  tokens    radius-full (pill), none (underline)
  a11y      `role="tablist"`, `role="tab"`, `role="tabpanel"`, keyboard arrow navigation
  used on   S01 (dashboard tabs), S10 (contract modification tabs)

### Pagination
  purpose   Table page navigation
  variants  previous/next only (mobile), numbered (desktop)
  tokens    Button ghost; active page: Button secondary; gap-1
  a11y      `<nav aria-label="Pagination">`, `aria-current="page"` on active page
  used on   All DataTables

---

## Domain-Specific

### VehicleClassCard
  purpose   Selectable card for vehicle class in Step 2 of reservation wizard
  content   Class name, transmission type, $ rate/month, $ total for N days, "Excl. taxes & insurance(s)", availability count + %
  states    default, hover, selected (ring-2 ring accent bg accent/5), unavailable (opacity-50 cursor-not-allowed)
  tokens    bg surface border radius-lg p-4 shadow-sm; selected: border-accent
  a11y      `role="radio"` or actual `<input type="radio">`; `aria-disabled` when unavailable
  used on   S04

### ReservationHeader
  purpose   Fixed header on all wizard steps showing RA#, customer, PDF actions
  content   Customer full name + RA number + "Rental" tag; buttons: Agreement PDF | Receipt PDF | Email Templates
  tokens    bg surface border-b border; p-4; flex between
  used on   S03–S12

### CalendarGrid
  purpose   Visual vehicle availability calendar (vehicles as rows, dates as columns)
  views     Week (7 cols), Month (~30 cols), 3 Months (~90 cols), Year
  row       Vehicle icon + plate + class name label; reservation blocks span date range
  block colours  active: bg active-rental/80 text white; pending: bg warning/60; repair: bg danger/60
  tokens    border border, row-height 36px, header: sticky top bg-surface
  overflow  Horizontal scroll on smaller screens
  a11y      `role="grid"`, `role="row"`, `role="gridcell"`, keyboard navigation
  used on   S16

### ExtensionsTable
  purpose   List of contract extensions (manual + auto-renewal) on Step 8
  columns   #, Return Date, Days Extended, Comments, Distance Driven, Is Pending?, Created By, Created At
  auto-renewal rows  "System Background" in Created By column, visually differentiated (italic text)
  used on   S10

### ReportCard
  purpose   Clickable card for selecting a report type
  content   Report name + description icon
  tokens    bg surface border radius-lg p-4 hover:shadow-md hover:border-accent cursor-pointer
  used on   S25

### PaymentActionBar
  purpose   Group of payment-related action buttons in wizard steps
  buttons   Add Offline Payment | Process Payment | Request Payment | Add Offline Refund | Add Discount
  layout    flex gap-2 flex-wrap
  used on   S08, S10, S11

### DamageReport
  purpose   Text area + image upload section for recording vehicle damage
  sections  Description textarea + ImageUpload
  used on   S09, S10, S11

### ContactHistoryTable
  purpose   Previous rental history shown inline on Step 4 (Customer attach)
  columns   #, Pickup Date, Return Date, Vehicle Class, Status, Notes, Selected Discounts, Outstanding Balance, Total Price
  tokens    Same DataTable styles but compact row height (40px), no pagination (max 10 rows shown)
  used on   S06

---

## Tailwind Theme Mapping

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg:           'var(--color-bg)',
      surface:      'var(--color-surface)',
      'surface-alt':'var(--color-surface-alt)',
      sidebar:      'var(--color-sidebar-bg)',
      border:       'var(--color-border)',
      'border-input':'var(--color-border-input)',
      'border-focus':'var(--color-border-focus)',
      text:         'var(--color-text)',
      muted:        'var(--color-text-muted)',
      accent:       'var(--color-accent)',
      'accent-hover':'var(--color-accent-hover)',
      'on-accent':  'var(--color-on-accent)',
      success:      'var(--color-success)',
      'success-bg': 'var(--color-success-bg)',
      warning:      'var(--color-warning)',
      'warning-bg': 'var(--color-warning-bg)',
      danger:       'var(--color-danger)',
      'danger-bg':  'var(--color-danger-bg)',
      info:         'var(--color-info)',
      'info-bg':    'var(--color-info-bg)',
    },
    fontFamily: {
      sans: ['var(--font-sans)'],
      mono: ['var(--font-mono)'],
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
    },
    width: {
      sidebar: 'var(--sidebar-width)',
      'sidebar-sm': 'var(--sidebar-collapsed-width)',
      'summary-panel': 'var(--summary-panel-width)',
    },
    height: {
      header: 'var(--header-height)',
    },
  },
}
```
