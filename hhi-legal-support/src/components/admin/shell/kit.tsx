'use client';
/* Small form + interaction helpers for the dashboard, clients, workflows and team screens. */
import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import { Icon } from '@/components/icons';

export const prefersReduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Moves focus to an element by id (after the current render when `defer`). */
export function focusId(id: string, defer = false) {
  const go = () => { const el = document.getElementById(id); if (el) el.focus({ preventScroll: false }); };
  if (defer) requestAnimationFrame(go); else go();
}

/** Focuses the view heading (after bulk actions, archive, etc.). */
export function focusViewTitle() {
  requestAnimationFrame(() => { const t = document.getElementById('view-title'); if (t) t.focus({ preventScroll: true }); });
}

/** Scrolls a section heading into the middle of the view and focuses it (KPI tiles that jump to a section). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id); if (!el) return;
  el.setAttribute('tabindex', '-1');
  el.scrollIntoView({ block: 'center', inline: 'center', behavior: prefersReduced() ? 'auto' : 'smooth' });
  el.focus({ preventScroll: true });
}

/** Inline field error: Ruby icon + Ink text, linked from the field with aria-describedby `${id}-err`. */
export function ErrText({ id, msg }: { id: string; msg?: string | null }) {
  return (
    <p className="err" id={`${id}-err`} hidden={!msg}>
      {msg ? <><Icon name="alert" size={16} /><span>{msg}</span></> : null}
    </p>
  );
}

interface FieldProps {
  id: string;
  label: ReactNode;
  value: string;
  onChange(v: string): void;
  type?: HTMLInputTypeAttribute;
  opt?: boolean;
  full?: boolean;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
}
/** Labelled text input with optional marker and inline error (legacy fieldHTML). */
export function Field({ id, label, value, onChange, type = 'text', opt, full, error, disabled, placeholder, autoComplete, inputMode }: FieldProps) {
  return (
    <div className={`field${full ? ' full' : ''}`}>
      <label className="label" htmlFor={id}>{label}{opt ? <> <span className="opt">(optional)</span></> : null}</label>
      <input
        className="input" id={id} name={id} type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} aria-required={opt ? undefined : true}
        aria-invalid={error ? true : undefined} aria-describedby={`${id}-err`}
      />
      <ErrText id={id} msg={error} />
    </div>
  );
}

/** Search box used in filter bars. */
export function SearchField({ id, value, onChange, placeholder }: { id: string; value: string; onChange(v: string): void; placeholder: string }) {
  return (
    <div className="field wide">
      <label className="flabel" htmlFor={id}>Search</label>
      <div className="search-field">
        <Icon name="search" size={18} />
        <input className="input" id={id} type="search" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} autoComplete="off" />
      </div>
    </div>
  );
}

/** Sortable column header (aria-sort on the th, button inside). */
export function SortTh<K extends string>({ k, label, sort, dir, onSort, idPrefix }: { k: K; label: string; sort: K; dir: 'asc' | 'desc'; onSort(k: K): void; idPrefix: string }) {
  return (
    <th scope="col" aria-sort={sort === k ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="sort" id={`${idPrefix}-${k}`} onClick={() => onSort(k)}>{label}<Icon name="chevron-down" size={14} /></button>
    </th>
  );
}

/** Generic comparison used by sortable tables. */
export const cmp = (a: string | number, b: string | number) => (a < b ? -1 : a > b ? 1 : 0);
