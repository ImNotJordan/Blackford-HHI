'use client';
/* Page building blocks: Band, KPI tiles, empty / error states, Switch, Segmented, badges, chips, RelTime, Avatar, useBusy. */
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { STATUS, STATUS_ICON } from '@/lib/data';
import { fmtDT, initials, relText } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { StatusKey } from '@/lib/types';
import { cx, reduced } from './core';
import { dueChipInfo } from './helpers';
import type { BandProps, EmptyStateProps, ErrorStateProps, KpiRowProps, KpiTileProps, SegmentedProps, SwitchProps } from './types';

export function Band({ eyebrow, title, sub, actions, crumbs, children }: BandProps) {
  return (
    <section className="pband on-ink" aria-labelledby="view-title">
      <div className="wrap">
        {crumbs}
        <div className="pband-row">
          <div className="stack-8">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="ph1" id="view-title" tabIndex={-1}>{title}</h1>
            {sub ? <p className="pband-sub">{sub}</p> : null}
          </div>
          {actions ? <div className="pband-actions">{actions}</div> : null}
        </div>
        {children}
      </div>
      <div className="sigbar" role="presentation" />
    </section>
  );
}

export function KpiTile({ label, value, foot, href, onClick, pressed, id }: KpiTileProps) {
  const inner = (
    <>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      <span className="kpi-foot"><span>{foot}</span><Icon name="arrow-right" size={18} /></span>
    </>
  );
  if (href) return <Link className="kpi" href={href} id={id}>{inner}</Link>;
  return <button type="button" className="kpi" id={id} onClick={onClick} aria-pressed={pressed == null ? undefined : !!pressed}>{inner}</button>;
}

export function KpiRow({ children, cols = 4, ariaLabel }: KpiRowProps) {
  return <div className={cx('kpis', cols === 3 && 'k3', cols === 5 && 'k5')} role={ariaLabel ? 'group' : undefined} aria-label={ariaLabel}>{children}</div>;
}

export function EmptyState({ icon = 'inbox', title, text, actions }: EmptyStateProps) {
  return (
    <div className="state-panel">
      <span className="state-icon"><Icon name={icon} size={24} /></span>
      <h3 className="h4">{title}</h3>
      <p className="small">{text}</p>
      {actions ? <div className="state-actions">{actions}</div> : null}
    </div>
  );
}

export function ErrorState({ title, text, onRetry, extra, retryId }: ErrorStateProps) {
  return (
    <div className="state-panel error" role="alert">
      <span className="state-icon"><Icon name="alert" size={24} /></span>
      <h3 className="h4">{title}</h3>
      <p className="small">{text}</p>
      <div className="state-actions">
        <button className="btn btn-dark btn-sm" type="button" id={retryId} onClick={onRetry}><Icon name="refresh" size={16} />Try again</button>
        {extra}
      </div>
    </div>
  );
}

export function Switch({ id, checked, onChange, labelledBy, ariaLabel, describedBy, disabled }: SwitchProps) {
  return (
    <button className="switch" type="button" role="switch" id={id} aria-checked={checked} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : ariaLabel}
      aria-describedby={describedBy} disabled={disabled} onClick={() => onChange(!checked)} />
  );
}

export function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(o => (
        <button key={o.value} type="button" id={o.id} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: StatusKey }) {
  return <span className={`badge st-${status}`}><Icon name={STATUS_ICON[status]} size={14} />{STATUS[status]}</span>;
}

export function DueChip({ date, done }: { date: Date; done?: boolean }) {
  const c = dueChipInfo(date, done);
  return <span className={`due-chip ${c.cls}`}>{c.icon ? <Icon name={c.icon} size={14} /> : null}{c.text}</span>;
}

/** Relative time ("3h ago") with the full business-time-zone date-time in a tooltip and for screen readers. */
export function RelTime({ date }: { date: Date }) {
  const tz = useApp(s => s.settings.tz);
  const full = fmtDT(date, tz);
  return (
    <time dateTime={date.toISOString()} data-tip={full}>
      <span aria-hidden="true">{relText(date)}</span>
      <span className="sr-only">{full}</span>
    </time>
  );
}

export function Avatar({ name, className = '' }: { name: string; className?: string }) {
  return <span className={cx('avatar', className)} aria-hidden="true">{initials(name)}</span>;
}

/** [busy, run]: run(fn, ms) marks busy, waits, then calls fn. Put aria-busy={busy} disabled={busy} on the button. */
export function useBusy(): [boolean, (fn: () => void, ms?: number) => void] {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  // The action still runs if the caller unmounts mid-wait (the user already committed to it).
  const run = useCallback((fn: () => void, ms = 600) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setTimeout(() => { busyRef.current = false; setBusy(false); fn(); }, reduced() ? 250 : ms);
  }, []);
  return [busy, run];
}
