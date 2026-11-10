/* =========================================================================
   UI COMPONENT CONTRACT — every surface (website, portal, admin) imports
   these components from '@/components/ui'. Props here are the API; the
   UI-kit implementation must match them exactly.

   Visual spec, behavior and class names come from the legacy app:
   legacy/src/js/ui-components.js (dropdown + date system), legacy/src/js/core.js
   (layers, toasts, modals, sheet, charts) and src/app/globals.css (all classes).
   ========================================================================= */
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import type { IconName } from '@/components/icons';
import type { DateRange, MonthValue, StatusKey, Undo } from '@/lib/types';

/* ---------- Dropdown family ---------- */
export interface Option { value: string; label: string; sub?: string; icon?: IconName; group?: string; short?: string; disabled?: boolean }

interface FieldBase {
  /** id of the trigger element (button or input). Must be unique on the page. */
  id: string;
  /** id of an external visible label element (preferred). */
  labelId?: string;
  /** used when there is no visible label */
  ariaLabel?: string;
  /** panel / bottom-sheet title */
  title?: string;
  /** 'md' 40px (default), 'sm' 32px; both become 48px at ≤768px */
  size?: 'md' | 'sm';
  disabled?: boolean;
  /** shows Ruby border + Ink helper with Ruby icon below the trigger (id `${id}-err`) */
  error?: string | null;
  hintId?: string;
  className?: string;
  /** design-system demo of forced states */
  demo?: 'is-hover' | 'is-focus';
}
export interface SelectProps extends FieldBase {
  value: string;
  onChange(v: string): void;
  options: Option[];
  placeholder?: string;
  icon?: IconName;
  /** forces a search field (Combobox always has one) */
  searchable?: boolean;
  /** show 3 skeleton rows for this long when opened (first open, or every open with alwaysLoad) */
  loadMs?: number;
  alwaysLoad?: boolean;
  /** pre-filled search text when opened (design-system no-results demo) */
  initialQuery?: string;
}
export type ComboboxProps = SelectProps;
export interface MultiSelectProps extends FieldBase {
  value: string[];
  onChange(v: string[]): void;
  options: Option[];
  placeholder?: string;
  /** chips shown before collapsing into "+N" (default 2) */
  maxChips?: number;
  searchable?: boolean;
}
export interface StatusDropdownProps extends FieldBase { value: StatusKey; onChange(v: StatusKey): void }

export interface MenuItem { label: string; icon?: IconName; danger?: boolean; disabled?: boolean; onSelect(): void }
export type MenuEntry = MenuItem | 'separator';
export interface ActionMenuProps {
  /** aria-label of the trigger and title of the menu / bottom sheet */
  label: string;
  items: MenuEntry[];
  /** trigger content; default is the ⋯ icon */
  trigger?: ReactNode;
  /** default 'icon-btn' */
  triggerClassName?: string;
  id?: string;
  style?: CSSProperties;
}

/* ---------- Date family ---------- */
export type Markers = (d: Date) => { risk: number; normal: number; titles: string[] };
interface DateBase extends FieldBase {
  min?: Date | null; minReason?: string;
  max?: Date | null; maxReason?: string;
  /** Ruby dot = at-risk deadline, Gold dot = deadline; with legend + tooltip */
  markers?: Markers;
  placeholder?: string;
  required?: boolean;
  requiredMsg?: string;
}
export interface DatePickerProps extends DateBase {
  value: Date | null;
  onChange(v: Date | null): void;
  /** called whenever typed text becomes valid/invalid so forms can block submit */
  onValidityChange?(valid: boolean): void;
}
/** 15-minute time list; times shown in the time zone from store settings. */
export type DateTimePickerProps = DatePickerProps;
export interface DateRangePickerProps extends DateBase { value: DateRange | null; onChange(v: DateRange | null): void }
export interface MonthPickerProps extends FieldBase {
  value: MonthValue | null;
  onChange(v: MonthValue): void;
  monthAllowed?(y: number, m: number): boolean;
  monthReason?: string;
  required?: boolean;
}

/* ---------- Layers & feedback ---------- */
export interface ModalProps {
  open: boolean;
  onClose(): void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** when given, body + footer are wrapped in <form noValidate>; preventDefault is already called */
  onSubmit?(e: FormEvent<HTMLFormElement>): void;
  /** CSS selector inside the modal to focus on open */
  initialFocus?: string;
}
export interface SheetProps {
  open: boolean;
  onClose(): void;
  labelledBy: string;
  /** render .sheet-head / .sheet-body / .sheet-foot yourself (classes in globals.css) */
  children: ReactNode;
  initialFocus?: string;
}
export interface ToastOptions { icon?: IconName; undo?: Undo; action?: { label: string; onClick(): void } }
export interface ConfirmOptions { title: string; body: string; confirmLabel?: string; danger?: boolean }

/* ---------- Page building blocks ---------- */
export interface BandProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  /** rendered above the title row (breadcrumbs) */
  crumbs?: ReactNode;
  /** rendered under the title row, e.g. <KpiRow> */
  children?: ReactNode;
}
export interface KpiTileProps {
  label: ReactNode; value: ReactNode; foot: ReactNode;
  /** link tile (next/link) … */
  href?: string;
  /** … or button tile; pass `pressed` for filter tiles */
  onClick?(): void;
  pressed?: boolean;
  id?: string;
}
export interface KpiRowProps { children: ReactNode; cols?: 3 | 4 | 5; ariaLabel?: string }
export interface EmptyStateProps { icon?: IconName; title: string; text: ReactNode; actions?: ReactNode }
export interface ErrorStateProps { title: string; text: string; onRetry(): void; extra?: ReactNode; retryId?: string }
export interface SwitchProps { id: string; checked: boolean; onChange(v: boolean): void; labelledBy?: string; ariaLabel?: string; describedBy?: string; disabled?: boolean }
export interface SegmentedProps<T extends string> { label: string; value: T; onChange(v: T): void; options: { value: T; label: ReactNode; id?: string }[] }

/* ---------- Charts (inline SVG, Gold / Warm Gray tints, Ink) ---------- */
export interface LineSeries { name: string; values: number[]; color: string; area?: boolean }
export interface LineChartProps { labels: string[]; series: LineSeries[]; ariaLabel: string; summary: string }
export interface HBarSegment { name: string; value: number; color: string }
export interface HBarRow { label: string; segments: HBarSegment[]; valueText?: string; tip?: { label: string; value: ReactNode }[] }
export interface HBarChartProps { rows: HBarRow[]; ariaLabel: string; summary: string }
