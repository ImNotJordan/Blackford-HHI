'use client';
/* Small form + interaction helpers shared by the leads, content, users, audit, settings and design-system screens. */
import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { toast } from '@/components/ui';
import { useApp } from '@/lib/store';

/** Business time zone from settings (every date-time display follows it). */
export const useTz = () => useApp(s => s.settings.tz);

export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Inline field error: Ruby icon + Ink text, linked from the field with aria-describedby `${id}-err`. */
export function FieldErr({ id, msg }: { id: string; msg?: string | null }) {
  return (
    <p className="err" id={`${id}-err`} hidden={!msg}>
      {msg ? <><Icon name="alert" size={16} /><span>{msg}</span></> : null}
    </p>
  );
}

interface TextFieldProps {
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
}
/** Text input field with label, optional marker and inline error (legacy fieldHTML). */
export function TextField({ id, label, value, onChange, type = 'text', opt, full, error, disabled, placeholder, autoComplete }: TextFieldProps) {
  return (
    <div className={`field${full ? ' full' : ''}`}>
      <label className="label" htmlFor={id}>{label}{opt ? <> <span className="opt">(optional)</span></> : null}</label>
      <input
        className="input" id={id} name={id} type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        placeholder={placeholder} autoComplete={autoComplete} aria-required={opt ? undefined : true}
        aria-invalid={error ? true : undefined} aria-describedby={`${id}-err`}
      />
      <FieldErr id={id} msg={error} />
    </div>
  );
}

/** Copies text and confirms with a toast (falls back to "Select and copy"). */
export function copyText(txt: string) {
  const fallback = () => toast(`Select and copy: ${txt}`, { icon: 'copy' });
  try {
    navigator.clipboard.writeText(txt).then(() => toast(`Copied ${txt}.`, { icon: 'copy' }), fallback);
  } catch {
    fallback();
  }
}

/** Scrolls an element into the middle of the view and moves focus to it (KPI tiles that jump to a section). */
export function scrollFocus(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.scrollIntoView({ block: 'center', inline: 'center', behavior: prefersReduced() ? 'auto' : 'smooth' });
  el.focus({ preventScroll: true });
}

/** Focuses a field by id on the next frame (after React has committed an error state). */
export function focusLater(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}
