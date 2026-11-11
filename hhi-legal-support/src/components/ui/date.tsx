'use client';
/* Date family: DatePicker, DateTimePicker, DateRangePicker, MonthPicker.
   Ported from legacy ui-components.js (dpStart / dpRender / dpKey / dpClick / ddCommitTyped). */
import { useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '@/components/icons';
import {
  TZS, addDays, addMonths, fmtD, fmtDT, fmtLong, fmtMonth, fmtRange, iso, monthLabel, parseDateText, parseDateTimeText,
  sameDay, startOf, today, tzParts, wallToDate, weekStart
} from '@/lib/format';
import { useApp } from '@/lib/store';
import type { DateRange, MonthValue } from '@/lib/types';
import { cx, mobileQ, scrollWithin, trapTab } from './core';
import { Chev, DdPop, Field, ddClose, ddIsOpen, ddShow, nameAttrs, useDdOpen } from './dd-core';
import { showTip } from './tip';
import type { DatePickerProps, DateRangePickerProps, DateTimePickerProps, MonthPickerProps } from './types';

type Kind = 'date' | 'datetime' | 'range' | 'month';
type View = 'days' | 'months' | 'years';
interface TmpRange { start: Date | null; end: Date | null }

type DFProps = Omit<DatePickerProps, 'value' | 'onChange'> & Partial<Pick<MonthPickerProps, 'monthAllowed' | 'monthReason'>> & {
  kind: Kind;
  dateValue?: Date | null; onDate?(v: Date | null): void;
  rangeValue?: DateRange | null; onRange?(v: DateRange | null): void;
  monthValue?: MonthValue | null; onMonth?(v: MonthValue): void;
};

const DOW = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PRESETS: { k: string; label: string; f: (() => [Date, Date]) | null }[] = [
  { k: 'today', label: 'Today', f: () => { const t = today(); return [t, t]; } },
  { k: 'yesterday', label: 'Yesterday', f: () => [addDays(-1), addDays(-1)] },
  { k: '7', label: 'Last 7 days', f: () => [addDays(-6), today()] },
  { k: '30', label: 'Last 30 days', f: () => [addDays(-29), today()] },
  { k: 'month', label: 'This month', f: () => { const t = today(); return [new Date(t.getFullYear(), t.getMonth(), 1), new Date(t.getFullYear(), t.getMonth() + 1, 0)]; } },
  { k: 'lastmonth', label: 'Last month', f: () => { const t = today(); return [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)]; } },
  { k: 'quarter', label: 'This quarter', f: () => { const t = today(), q = Math.floor(t.getMonth() / 3) * 3; return [new Date(t.getFullYear(), q, 1), new Date(t.getFullYear(), q + 3, 0)]; } },
  { k: 'custom', label: 'Custom', f: null }
];
const GRID_STEP: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
const t0 = (d: Date) => startOf(d).getTime();

function DateField(p: DFProps) {
  const { kind, id } = p;
  const tz = useApp(s => s.settings.tz);
  const open = useDdOpen(id);
  const isOpen = !!open, sheet = !!open?.sheet;
  const anchorRef = useRef<HTMLDivElement>(null), popRef = useRef<HTMLDivElement>(null), inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string | null>(null);
  const [typedErr, setTypedErr] = useState<string | null>(null);
  const [view, setView] = useState<View>('days');
  const [cursor, setCursor] = useState<Date>(() => today());
  const [tmpDT, setTmpDT] = useState<Date | null>(null);
  const [tmpR, setTmpR] = useState<TmpRange>({ start: null, end: null });
  const [preset, setPreset] = useState<string | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const focusReq = useRef(false);
  const validRef = useRef(true);

  const isInput = kind === 'date' || kind === 'datetime';
  const error = typedErr || p.error;
  const td = today();

  const why = (d: Date): string | false => {
    if (p.min && t0(d) < t0(p.min)) return p.minReason || `Choose ${fmtD(p.min)} or later.`;
    if (p.max && t0(d) > t0(p.max)) return p.maxReason || `Choose ${fmtD(p.max)} or earlier.`;
    return false;
  };
  const fmtVal = (d: Date | null | undefined) => (!d ? '' : kind === 'date' ? fmtD(d) : fmtDT(d, tz));
  const validity = (v: boolean) => { if (validRef.current !== v) { validRef.current = v; p.onValidityChange?.(v); } };

  /* ---------- open / commit ---------- */
  const openPicker = (focusGrid: boolean) => {
    if (p.disabled) return;
    if (ddIsOpen(id)) { ddClose(true); return; }
    const base = kind === 'range' ? p.rangeValue?.start : kind === 'month' ? (p.monthValue ? new Date(p.monthValue.y, p.monthValue.m, 1) : null) : p.dateValue;
    let c = startOf(base || today());
    if (p.min && t0(c) < t0(p.min)) c = startOf(p.min);
    setView(kind === 'month' ? 'months' : 'days');
    setCursor(c);
    setTmpDT(kind === 'datetime' && p.dateValue ? new Date(p.dateValue) : null);
    setTmpR(p.rangeValue ? { start: p.rangeValue.start, end: p.rangeValue.end } : { start: null, end: null });
    setPreset(kind === 'range' && p.rangeValue ? p.rangeValue.preset || 'custom' : null);
    setHover(null);
    const asSheet = ddShow(id);
    focusReq.current = focusGrid || asSheet || kind === 'range' || kind === 'month';
  };
  const commitDate = (d: Date | null) => {
    ddClose(true);
    setText(null); setTypedErr(null); validity(true);
    p.onDate?.(d);
  };
  const commitRange = (r: DateRange | null) => { ddClose(true); p.onRange?.(r); };
  const commitMonth = (m: MonthValue) => { ddClose(true); p.onMonth?.(m); };

  /** Typed text → value. Invalid text stays in the field with an inline error. */
  const commitTyped = (): boolean => {
    const inp = inputRef.current;
    if (!isInput || !inp) return true;
    const txt = inp.value;
    if (txt === fmtVal(p.dateValue) && !typedErr) { if (text !== null) setText(null); return true; }
    const v = kind === 'date' ? parseDateText(txt) : parseDateTimeText(txt, tz);
    if (v === undefined) {
      setText(txt);
      setTypedErr(kind === 'date' ? 'Enter a date like Nov 2, 2026, 11/02/2026 or 2026-11-02.' : 'Enter a date and time like Nov 2, 2026 3:30 PM.');
      validity(false);
      return false;
    }
    if (v === null && p.required) { setText(''); setTypedErr(p.requiredMsg || 'Choose a date.'); validity(false); return false; }
    const w = v ? why(v) : false;
    if (w) { setText(txt); setTypedErr(w); validity(false); return false; }
    const prev = p.dateValue ?? null;
    const changed = prev && v ? prev.getTime() !== v.getTime() : prev !== v;
    setText(null); setTypedErr(null); validity(true);
    if (changed) p.onDate?.(v);
    return true;
  };

  /* ---------- picking ---------- */
  const pick = (d: Date, el?: HTMLElement | null) => {
    const w = why(d);
    if (w) { if (el) showTip(el, w); return; }
    setCursor(d);
    if (kind === 'date') { commitDate(d); return; }
    if (kind === 'datetime') {
      const pp = tmpDT ? tzParts(tmpDT, tz) : { hour: 9, minute: 0 };
      setTmpDT(wallToDate(d.getFullYear(), d.getMonth(), d.getDate(), pp.hour, pp.minute, tz));
      return;
    }
    if (kind === 'range') {
      setPreset('custom');
      setHover(null);
      const r = tmpR;
      if (!r.start || r.end) setTmpR({ start: d, end: null });
      else if (t0(d) < t0(r.start)) setTmpR({ start: d, end: r.start });
      else setTmpR({ start: r.start, end: d });
    }
  };
  const stepView = (s: number) => setCursor(addMonths(cursor, view === 'days' ? s : view === 'months' ? 12 * s : 144 * s));
  const goUp = () => { setView(view === 'days' ? 'months' : 'years'); focusReq.current = true; };
  const onToday = (el: HTMLElement) => {
    const t = today();
    if (kind === 'month') {
      if (!p.monthAllowed || p.monthAllowed(t.getFullYear(), t.getMonth())) commitMonth({ y: t.getFullYear(), m: t.getMonth() });
      else showTip(el, p.monthReason || 'Not available');
      return;
    }
    setCursor(t); setView('days');
    if (kind === 'range') { setTmpR({ start: t, end: t }); setPreset('today'); return; }
    if (kind === 'date') { const w = why(t); if (w) showTip(el, w); else commitDate(t); return; }
    pick(t, el);
  };
  const onClear = () => {
    if (kind === 'range') { setTmpR({ start: null, end: null }); setPreset(null); return; }
    commitDate(null);
  };
  const onApply = () => {
    if (kind === 'range') { commitRange(tmpR.start ? { start: tmpR.start, end: tmpR.end || tmpR.start, preset: preset ?? undefined } : null); return; }
    if (kind === 'datetime' && tmpDT) commitDate(new Date(tmpDT));
  };
  const onPreset = (k: string) => {
    const pr = PRESETS.find(x => x.k === k);
    if (!pr) return;
    setPreset(k);
    setView('days');
    if (pr.f) { const [s, e] = pr.f(); setTmpR({ start: s, end: e }); setCursor(startOf(e)); }
    else { setTmpR({ start: null, end: null }); focusReq.current = true; }
  };

  /* ---------- keyboard ---------- */
  const dayKey = (e: KeyboardEvent<HTMLButtonElement>, d: Date) => {
    let n: Date;
    switch (e.key) {
      case 'ArrowLeft': n = addDays(-1, d); break;
      case 'ArrowRight': n = addDays(1, d); break;
      case 'ArrowUp': n = addDays(-7, d); break;
      case 'ArrowDown': n = addDays(7, d); break;
      case 'Home': n = weekStart(d); break;
      case 'End': n = addDays(6, weekStart(d)); break;
      case 'PageUp': n = addMonths(d, e.shiftKey ? -12 : -1); break;
      case 'PageDown': n = addMonths(d, e.shiftKey ? 12 : 1); break;
      case 'Enter': case ' ': e.preventDefault(); e.stopPropagation(); pick(d, e.currentTarget); return;
      default: return;
    }
    e.preventDefault(); e.stopPropagation();
    setCursor(n);
    focusReq.current = true;
    if (kind === 'range' && tmpR.start && !tmpR.end) setHover(n);
  };
  const gridKey = (e: KeyboardEvent<HTMLButtonElement>, i: number, go: (j: number) => void) => {
    const s = GRID_STEP[e.key];
    if (!s) return;
    e.preventDefault(); e.stopPropagation();
    go(Math.max(0, Math.min(11, i + s)));
    focusReq.current = true;
  };
  const slotKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    const pop = popRef.current;
    if (!dir || !pop) return;
    e.preventDefault(); e.stopPropagation();
    const all = Array.from(pop.querySelectorAll<HTMLButtonElement>('.dp-slot'));
    const j = Math.max(0, Math.min(all.length - 1, all.indexOf(e.currentTarget) + dir));
    all[j].focus({ preventScroll: true });
    scrollWithin(all[j], all[j].closest<HTMLElement>('.dp-times'));
  };
  const popKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); ddClose(true); return; }
    if (e.key === 'Tab' && popRef.current) trapTab(e, popRef.current);
  };
  const inputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!ddIsOpen(id)) {
      if (e.key === 'ArrowDown') { e.preventDefault(); openPicker(true); }
      else if (e.key === 'Enter' && text !== null) { e.preventDefault(); commitTyped(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ddClose(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); popRef.current?.querySelector<HTMLElement>('.dp-day[tabindex="0"]')?.focus(); }
    else if (e.key === 'Tab') ddClose(false);
    else if (e.key === 'Enter') { if (text !== null) { e.preventDefault(); commitTyped(); } ddClose(false); }
  };
  const btnKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!ddIsOpen(id) && e.key === 'ArrowDown') { e.preventDefault(); openPicker(true); }
    else if (ddIsOpen(id) && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ddClose(true); }
  };
  const inputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const rel = e.relatedTarget as Node | null;
    if (rel && (anchorRef.current?.contains(rel) || popRef.current?.contains(rel))) return;
    setTimeout(() => {
      const pop = document.getElementById('dd-pop');
      if (ddIsOpen(id) && pop && pop.contains(document.activeElement)) return;
      if (ddIsOpen(id)) ddClose(false);
      commitTyped();
    }, 0);
  };

  /* ---------- effects: focus the roving cell, centre the selected time slot ---------- */
  useLayoutEffect(() => {
    if (!isOpen || !focusReq.current) return;
    const pop = popRef.current;
    if (!pop) return;
    focusReq.current = false;
    pop.querySelector<HTMLElement>('.dp-day[tabindex="0"], .dp-mo[tabindex="0"]')?.focus({ preventScroll: true });
  });
  const tmpKey = tmpDT ? tmpDT.getTime() : 0;
  useLayoutEffect(() => {
    if (!isOpen || kind !== 'datetime' || view !== 'days') return;
    const s = popRef.current?.querySelector<HTMLElement>('.dp-slot[tabindex="0"]');
    const list = s?.closest<HTMLElement>('.dp-times');
    if (!s || !list) return;
    const sr = s.getBoundingClientRect(), lr = list.getBoundingClientRect();
    if (sheet) list.scrollLeft += sr.left - lr.left - list.clientWidth / 2 + sr.width / 2;
    else list.scrollTop += sr.top - lr.top - list.clientHeight / 2 + sr.height / 2;
  }, [isOpen, kind, view, sheet, tmpKey]);

  /* ---------- panel ---------- */
  let panel: ReactNode = null;
  if (isOpen) {
    const y = cursor.getFullYear(), y0 = y - (y % 12);
    const title = view === 'days' ? fmtMonth(cursor) : view === 'months' ? String(y) : `${y0} – ${y0 + 11}`;
    const unit = view === 'days' ? 'month' : view === 'months' ? 'year' : '12 years';
    const dtp = kind === 'datetime' && tmpDT ? tzParts(tmpDT, tz) : null;
    const r = kind === 'range' ? tmpR : null;

    let grid: ReactNode;
    if (view === 'days') {
      const gs = weekStart(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
      const rows: ReactNode[] = [];
      for (let w = 0; w < 6; w++) {
        const cells: ReactNode[] = [];
        for (let k = 0; k < 7; k++) {
          const d = addDays(w * 7 + k, gs), dt = d.getTime();
          const out = d.getMonth() !== cursor.getMonth(), dis = why(d);
          const m = p.markers ? p.markers(d) : null;
          const cnt = m ? m.risk + m.normal : 0;
          const sel = kind === 'date' ? !!p.dateValue && sameDay(p.dateValue, d)
            : dtp ? dtp.year === d.getFullYear() && dtp.month - 1 === d.getMonth() && dtp.day === d.getDate() : false;
          const isStart = !!(r?.start && sameDay(d, r.start)), isEnd = !!(r?.end && sameDay(d, r.end));
          const inR = !!(r?.start && r.end && dt > t0(r.start) && dt < t0(r.end));
          const inPrev = !!(r?.start && !r.end && hover && ((dt > t0(r.start) && dt <= t0(hover)) || (dt < t0(r.start) && dt >= t0(hover))));
          const isToday = sameDay(d, td), picked = sel || isStart || isEnd;
          const label = `${fmtLong(d)}, ${d.getFullYear()}${isToday ? ', today' : ''}${m && cnt ? `, ${cnt} ${cnt === 1 ? 'deadline' : 'deadlines'}${m.risk ? `, ${m.risk} at risk` : ''}` : ''}${dis ? ', unavailable' : ''}${picked ? ', selected' : ''}`;
          const tip = dis || (m && cnt ? `${cnt} ${cnt === 1 ? 'deadline' : 'deadlines'}: ${m.titles.slice(0, 3).join('; ')}${m.titles.length > 3 ? '…' : ''}` : '');
          cells.push(
            <span role="gridcell" aria-selected={picked} key={iso(d)}>
              <button type="button" tabIndex={sameDay(d, cursor) ? 0 : -1} aria-label={label} aria-disabled={dis ? true : undefined} data-tip={tip || undefined}
                className={cx('dp-day', out && 'is-out', dis && 'is-dis', isToday && 'is-today', sel && 'is-sel', isStart && 'is-start', isEnd && 'is-end', inR && 'in-range', inPrev && 'in-preview')}
                onClick={e => pick(d, e.currentTarget)} onKeyDown={e => dayKey(e, d)}
                onMouseEnter={() => { if (kind === 'range' && tmpR.start && !tmpR.end && !(hover && sameDay(hover, d))) setHover(d); }}>
                {d.getDate()}
                {m && cnt ? <span className="dp-dots" aria-hidden="true">{m.risk ? <i className="dot-r" /> : null}{m.normal ? <i className="dot-g" /> : null}</span> : null}
              </button>
            </span>
          );
        }
        rows.push(<div role="row" className="dp-row" key={w}>{cells}</div>);
      }
      grid = (
        <div role="grid" className="dp-grid" aria-labelledby="dp-title">
          <div role="row" className="dp-row dp-dow">{DOW.map(n => <span role="columnheader" aria-label={n} key={n}>{n.slice(0, 2)}</span>)}</div>
          {rows}
        </div>
      );
    } else if (view === 'months') {
      grid = (
        <div className="dp-months" role="group" aria-label={`Months in ${y}`}>
          {Array.from({ length: 12 }, (_, mo) => {
            const allowed = p.monthAllowed ? p.monthAllowed(y, mo) : true;
            const sel = kind === 'month' && !!p.monthValue && p.monthValue.y === y && p.monthValue.m === mo;
            const isCur = y === td.getFullYear() && mo === td.getMonth();
            const first = new Date(y, mo, 1);
            return (
              <button key={mo} type="button" className={cx('dp-mo', sel && 'is-sel', isCur && 'is-today')} tabIndex={cursor.getMonth() === mo ? 0 : -1}
                aria-label={`${fmtMonth(first)}${allowed ? '' : ', unavailable'}${sel ? ', selected' : ''}`} aria-pressed={sel}
                aria-disabled={allowed ? undefined : true} data-tip={allowed ? undefined : p.monthReason || 'Not available'}
                onClick={e => {
                  if (!allowed) { showTip(e.currentTarget, p.monthReason || 'Not available'); return; }
                  if (kind === 'month') { commitMonth({ y, m: mo }); return; }
                  setCursor(new Date(y, mo, Math.min(cursor.getDate(), 28))); setView('days'); focusReq.current = true;
                }}
                onKeyDown={e => gridKey(e, mo, j => setCursor(new Date(y, j, 1)))}>
                {first.toLocaleDateString('en-US', { month: 'short' })}
              </button>
            );
          })}
        </div>
      );
    } else {
      grid = (
        <div className="dp-months" role="group" aria-label="Years">
          {Array.from({ length: 12 }, (_, i) => {
            const yr = y0 + i;
            return (
              <button key={yr} type="button" className={cx('dp-mo', yr === td.getFullYear() && 'is-today', yr === y && 'is-sel')} tabIndex={yr === y ? 0 : -1} aria-pressed={yr === y}
                onClick={() => { setCursor(new Date(yr, cursor.getMonth(), 1)); setView('months'); focusReq.current = true; }}
                onKeyDown={e => gridKey(e, i, j => setCursor(new Date(y0 + j, cursor.getMonth(), 1)))}>
                {yr}
              </button>
            );
          })}
        </div>
      );
    }

    const slots: ReactNode[] = [];
    if (kind === 'datetime' && view === 'days') {
      for (let mins = 0; mins < 1440; mins += 15) {
        const h = Math.floor(mins / 60), mi = mins % 60;
        const on = !!dtp && dtp.hour === h && dtp.minute === mi;
        slots.push(
          <li key={mins}>
            <button type="button" className="dp-slot" aria-pressed={on} tabIndex={on || (!dtp && mins === 540) ? 0 : -1} onKeyDown={slotKey}
              onClick={e => {
                if (!tmpDT) { const w = why(cursor); if (w) { showTip(e.currentTarget, w); return; } }
                const b = tmpDT ? tzParts(tmpDT, tz) : { year: cursor.getFullYear(), month: cursor.getMonth() + 1, day: cursor.getDate() };
                setTmpDT(wallToDate(b.year, b.month - 1, b.day, h, mi, tz));
              }}>
              {`${((h + 11) % 12) + 1}:${String(mi).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`}
            </button>
          </li>
        );
      }
    }

    const status = kind === 'range'
      ? <p className="dp-status" aria-live="polite">{tmpR.start ? (tmpR.end ? fmtRange(tmpR.start, tmpR.end) : `${fmtD(tmpR.start)} – choose an end date`) : 'Choose a start date'}</p>
      : kind === 'datetime' ? <p className="dp-status" aria-live="polite">{tmpDT ? fmtDT(tmpDT, tz) : 'Choose a day, then a time'}</p> : null;

    panel = (
      <DdPop kind={kind} sheet={sheet} dialog anchorRef={anchorRef} popRef={popRef} onKeyDown={popKey}
        title={p.title || (kind === 'range' ? 'Choose a date range' : kind === 'month' ? 'Choose a month' : 'Choose a date')}>
        <div className="dp-body">
          {kind === 'range' ? (
            <div className="dp-presets" role="group" aria-label="Quick ranges">
              {PRESETS.map(pr => (
                <button key={pr.k} type="button" className={cx('dp-preset', preset === pr.k && 'is-on')} aria-pressed={preset === pr.k} onClick={() => onPreset(pr.k)}>{pr.label}</button>
              ))}
            </div>
          ) : null}
          <div className="dp-main">
            <div className="dp-head">
              <button type="button" className="icon-btn dp-nav" aria-label={`Previous ${unit}`} onClick={() => stepView(-1)}><Icon name="chevron-left" size={18} /></button>
              {view === 'years'
                ? <span className="dp-title" id="dp-title" aria-live="polite">{title}</span>
                : <button type="button" className="dp-title" id="dp-title" aria-live="polite" aria-label={`${title}. Choose ${view === 'days' ? 'month and year' : 'year'}`} onClick={goUp}>{title}<Icon name="chevron-down" size={14} /></button>}
              <button type="button" className="icon-btn dp-nav" aria-label={`Next ${unit}`} onClick={() => stepView(1)}><Icon name="chevron-right" size={18} /></button>
            </div>
            {grid}
            {p.markers && view === 'days' ? <p className="dp-legend"><span><i className="dot-r" />At-risk deadline</span><span><i className="dot-g" />Deadline</span></p> : null}
            {status}
          </div>
          {slots.length ? (
            <div className="dp-time">
              <p className="dp-tz" id="dp-tz">Time · {TZS[tz].name} ({tz})</p>
              <ul className="dp-times" aria-labelledby="dp-tz">{slots}</ul>
            </div>
          ) : null}
        </div>
        <div className="dp-foot">
          <span className="grp">
            {kind === 'month'
              ? <button type="button" className="btn btn-quiet btn-sm" onClick={e => onToday(e.currentTarget)}>This month</button>
              : <>
                <button type="button" className="btn btn-quiet btn-sm" onClick={e => onToday(e.currentTarget)}>Today</button>
                {p.required ? null : <button type="button" className="btn btn-quiet btn-sm" onClick={onClear}>Clear</button>}
              </>}
          </span>
          <span className="grp">
            {kind === 'range' ? <>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => ddClose(true)}>Cancel</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={onApply}>Apply</button>
            </> : kind === 'datetime' ? <button type="button" className="btn btn-dark btn-sm" disabled={!tmpDT} onClick={onApply}>Done</button> : null}
          </span>
        </div>
      </DdPop>
    );
  }

  /* ---------- trigger ---------- */
  let trigger: ReactNode;
  if (isInput) {
    trigger = (
      <div className="dd-trigger dd-inputwrap">
        <Icon name="calendar" size={18} />
        <input ref={inputRef} type="text" className="dd-input" {...nameAttrs(p, error)} role="combobox" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="dd-pop"
          aria-required={p.required || undefined} autoComplete="off" spellCheck={false} value={text ?? fmtVal(p.dateValue)}
          placeholder={p.placeholder || (kind === 'date' ? 'Nov 2, 2026' : 'Nov 2, 2026 · 3:30 PM')}
          onChange={e => {
            const v = e.target.value;
            setText(v);
            if (kind === 'date' && ddIsOpen(id)) { const d = parseDateText(v); if (d && !sameDay(d, cursor)) setCursor(d); }
          }}
          onClick={e => { e.stopPropagation(); if (!mobileQ() && !ddIsOpen(id)) openPicker(false); }}
          onKeyDown={inputKey} onBlur={inputBlur} />
        <button type="button" className="dd-calbtn" tabIndex={-1} aria-label="Open calendar" disabled={p.disabled} onClick={e => { e.stopPropagation(); openPicker(true); }}><Chev /></button>
      </div>
    );
  } else {
    const txt = kind === 'range' ? (p.rangeValue ? fmtRange(p.rangeValue.start, p.rangeValue.end) : '') : monthLabel(p.monthValue);
    trigger = (
      <button type="button" className="dd-trigger" {...nameAttrs(p, error)} aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="dd-pop"
        onClick={e => { e.stopPropagation(); openPicker(true); }} onKeyDown={btnKey}>
        <Icon name="calendar" size={18} />
        <span className={cx('dd-value', !txt && 'is-ph')}>{txt || p.placeholder || (kind === 'month' ? 'Choose a month' : 'Any date')}</span>
        <Chev />
      </button>
    );
  }

  return (
    <Field base={p} kind={kind} open={isOpen} error={error} anchorRef={anchorRef}>
      {trigger}
      {panel}
    </Field>
  );
}

export function DatePicker({ value, onChange, ...rest }: DatePickerProps) {
  return <DateField {...rest} kind="date" dateValue={value} onDate={onChange} />;
}
export function DateTimePicker({ value, onChange, ...rest }: DateTimePickerProps) {
  return <DateField {...rest} kind="datetime" dateValue={value} onDate={onChange} />;
}
export function DateRangePicker({ value, onChange, ...rest }: DateRangePickerProps) {
  return <DateField {...rest} kind="range" rangeValue={value} onRange={onChange} />;
}
export function MonthPicker({ value, onChange, ...rest }: MonthPickerProps) {
  return <DateField {...rest} kind="month" monthValue={value} onMonth={onChange} />;
}
