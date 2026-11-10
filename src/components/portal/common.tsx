'use client';
/* Small form and layout helpers used across the client portal. */
import { Icon } from '@/components/icons';
import type { InputHTMLAttributes } from 'react';

/** Ink helper text with a Ruby icon. Rendered hidden when there is no message so aria-describedby stays valid. */
export function FieldError({ id, msg }: { id: string; msg?: string | null }) {
  return (
    <p className="err" id={id} hidden={!msg}>
      {msg ? <><Icon name="alert" size={16} /><span>{msg}</span></> : null}
    </p>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  id: string;
  label: string;
  value: string;
  onChange(v: string): void;
  error?: string | null;
  optional?: boolean;
  full?: boolean;
}
/** Labelled text input with error helper (legacy `fieldHTML`). */
export function TextField({ id, label, value, onChange, error, optional, full, type = 'text', ...rest }: TextFieldProps) {
  return (
    <div className={`field${full ? ' full' : ''}`}>
      <label className="label" htmlFor={id}>{label}{optional ? <> <span className="opt">(optional)</span></> : null}</label>
      <input
        className="input" id={id} name={id} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        aria-required={optional ? undefined : true}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-err`}
        {...rest}
      />
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Focus an element after React has painted the latest state (headings get tabindex=-1 first). */
export function focusSoon(selector: string, fallback?: string) {
  requestAnimationFrame(() => {
    const el = (document.querySelector(selector) || (fallback ? document.querySelector(fallback) : null)) as HTMLElement | null;
    if (!el) return;
    if (/^H\d$/.test(el.tagName) && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus();
  });
}
