'use client';
/* List dropdowns: Select, Combobox, MultiSelect, StatusDropdown, ActionMenu.
   Ported from legacy ui-components.js (listStart / renderOpts / listKey / ddChoose). */
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { Icon } from '@/components/icons';
import { STATUS, STATUS_ICON } from '@/lib/data';
import type { StatusKey } from '@/lib/types';
import { cx, reduced, trapTab, scrollWithin } from './core';
import { Chev, DdPop, Field, ddClose, ddIsOpen, ddShow, hl, nameAttrs, useDdOpen } from './dd-core';
import { announce } from './feedback';
import type { ActionMenuProps, MenuEntry, MultiSelectProps, Option, SelectProps, StatusDropdownProps } from './types';

interface Opt extends Option { sep?: false; danger?: boolean; run?: () => void }
type Row = Opt | { sep: true };
const isOpt = (r: Row): r is Opt => !r.sep;
type ListKind = 'select' | 'combo' | 'multi' | 'status' | 'menu';
type Where = 'trigger' | 'search' | 'list' | 'other';

interface ListCfg {
  id: string;
  kind: ListKind;
  rows: Row[];
  title: string;
  anchorRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
  value?: string;
  values?: string[];
  searchable?: boolean;
  loadMs?: number;
  alwaysLoad?: boolean;
  initialQuery?: string;
  onPick?(v: string): void;
  onMulti?(v: string[]): void;
}

function useListDd(c: ListCfg) {
  const open = useDdOpen(c.id);
  const isOpen = !!open, sheet = !!open?.sheet;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false), sess = useRef(0), typed = useRef({ s: '', at: 0 }), scrollReq = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null), listRef = useRef<HTMLUListElement>(null), popRef = useRef<HTMLDivElement>(null);

  const isMenu = c.kind === 'menu', isMulti = c.kind === 'multi';
  const searchable = !isMenu && (c.kind === 'combo' || !!c.searchable || (sheet && c.rows.filter(isOpt).length > 7));
  const focusOn: Where = searchable ? 'search' : sheet || isMenu ? 'list' : 'trigger';

  const q = query.trim().toLowerCase();
  const shown = c.rows.filter(x => (x.sep ? !q : !q || `${x.label} ${x.sub || ''}`.toLowerCase().includes(q)));
  const list = shown.filter(isOpt);
  const selIdx = isMulti || isMenu ? -1 : list.findIndex(x => x.value === c.value);
  const firstEnabled = list.findIndex(x => !x.disabled);
  const act = loading ? -1 : active >= 0 && active < list.length ? active : selIdx >= 0 ? selIdx : firstEnabled;
  const activeId = act >= 0 ? `dd-o-${act}` : undefined;

  const toggle = () => {
    if (c.disabled) return;
    if (ddIsOpen(c.id)) { ddClose(true); return; }
    setQuery(c.initialQuery || '');
    setActive(-1);
    const need = !!c.loadMs && (!loaded.current || !!c.alwaysLoad);
    setLoading(need);
    const s = ++sess.current;
    if (need) {
      setTimeout(() => {
        if (sess.current !== s || !ddIsOpen(c.id)) return;
        loaded.current = true;
        setLoading(false);
      }, reduced() ? 300 : c.loadMs);
    }
    scrollReq.current = true;
    ddShow(c.id);
  };

  // Move focus into the panel (search field / list) or keep it on the trigger.
  useEffect(() => {
    if (!isOpen) return;
    const el = focusOn === 'search' ? searchRef.current : focusOn === 'list' ? listRef.current : document.getElementById(c.id);
    if (el && el !== document.activeElement) el.focus({ preventScroll: true });
    const s = searchRef.current;
    if (focusOn === 'search' && s && s.value) s.setSelectionRange(s.value.length, s.value.length);
  }, [isOpen, focusOn, c.id]);

  // Keep the active option visible after keyboard moves (not on mouse hover).
  useEffect(() => {
    if (!isOpen || !scrollReq.current) return;
    scrollReq.current = false;
    if (activeId) scrollWithin(document.getElementById(activeId), listRef.current);
  });

  const setAct = (i: number, scroll: boolean) => { scrollReq.current = scroll; setActive(i); };
  const move = (step: number) => {
    const n = list.length;
    if (!n) return;
    let i = act < 0 ? (step > 0 ? -1 : 0) : act;
    for (let k = 0; k < n; k++) { i = (i + step + n) % n; if (!list[i].disabled) break; }
    setAct(i, true);
  };

  const choose = (i: number) => {
    const x = list[i];
    if (!x || x.disabled) return;
    if (isMenu) { ddClose(true); x.run?.(); return; }
    if (isMulti) {
      const set = new Set(c.values || []);
      if (set.has(x.value)) set.delete(x.value); else set.add(x.value);
      const next = c.rows.filter(isOpt).filter(y => set.has(y.value)).map(y => y.value);
      setAct(i, false);
      c.onMulti?.(next);
      return;
    }
    ddClose(true);
    if (x.value !== c.value) c.onPick?.(x.value);
  };
  const setAll = (all: boolean) => c.onMulti?.(all ? c.rows.filter(isOpt).filter(x => !x.disabled).map(x => x.value) : []);
  const clearQ = () => { setQuery(''); setActive(-1); searchRef.current?.focus(); };

  const onKey = (e: KeyboardEvent<HTMLElement>, where: Where) => {
    if (!ddIsOpen(c.id)) {
      if (where === 'trigger' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); toggle(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ddClose(true); return; }
    if (e.key === 'Tab') {
      const pop = popRef.current;
      if (where !== 'trigger' && pop && (isMulti || sheet)) { trapTab(e, pop); return; }
      ddClose(true);
      return;
    }
    if (where === 'other') return;
    const inSearch = where === 'search';
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); move(1); return;
      case 'ArrowUp': e.preventDefault(); move(-1); return;
      case 'Home': if (!inSearch) { e.preventDefault(); setAct(firstEnabled, true); } return;
      case 'End': if (!inSearch) { e.preventDefault(); let j = list.length - 1; while (j > 0 && list[j].disabled) j--; setAct(j, true); } return;
      case 'Enter': e.preventDefault(); e.stopPropagation(); if (act >= 0) choose(act); return;
      case ' ': if (!inSearch) { e.preventDefault(); e.stopPropagation(); if (act >= 0) choose(act); } return;
      default:
        if (!inSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = e.timeStamp, t = typed.current;
          t.s = (now - t.at < 650 ? t.s : '') + e.key.toLowerCase();
          t.at = now;
          const n = list.length, start = t.s.length === 1 ? act + 1 : Math.max(0, act);
          for (let k = 0; k < n; k++) {
            const j = (((start + k) % n) + n) % n;
            if (!list[j].disabled && list[j].label.toLowerCase().startsWith(t.s)) { setAct(j, true); break; }
          }
        }
    }
  };
  const whereOf = (t: EventTarget): Where => (t === searchRef.current ? 'search' : t === listRef.current ? 'list' : 'other');

  let items: ReactNode[];
  if (loading) {
    items = [70, 52, 64].map(w => <li key={w} className="dd-sk" role="presentation"><span className="sk" style={{ height: 12, width: `${w}%` }} /></li>);
    items.push(<li key="l" className="sr-only" role="presentation">Loading options</li>);
  } else if (!list.length) {
    items = [q
      ? <li key="e" className="dd-empty" role="presentation"><span>No matches for “{query.trim()}”</span><button type="button" className="text-btn" onClick={clearQ}>Clear search</button></li>
      : <li key="e" className="dd-empty" role="presentation"><span>No options</span></li>];
  } else {
    items = [];
    let lastGroup: string | undefined, i = 0;
    shown.forEach((x, k) => {
      if (!isOpt(x)) { items.push(<li key={`s${k}`} className="dd-sep" role="separator" />); return; }
      if (x.group && x.group !== lastGroup) { items.push(<li key={`g${k}`} className="dd-group" role="presentation">{x.group}</li>); lastGroup = x.group; }
      const idx = i++;
      const sel = isMulti ? (c.values || []).includes(x.value) : c.value === x.value;
      const label = hl(x.label, q);
      let inner: ReactNode;
      if (isMenu) inner = <><Icon name={x.icon || 'arrow-right'} size={16} /><span className="dd-ol">{label}</span></>;
      else if (c.kind === 'status') inner = <><span className={`badge st-${x.value}`}>{x.icon ? <Icon name={x.icon} size={12} /> : null}{label}</span><span className="dd-check" aria-hidden="true">{sel ? <Icon name="check" size={16} /> : null}</span></>;
      else inner = <>
        {isMulti ? <span className="dd-box" aria-hidden="true">{sel ? <Icon name="check" size={12} /> : null}</span> : null}
        {x.icon ? <Icon name={x.icon} size={16} /> : null}
        <span className="dd-ol"><span>{label}</span>{x.sub ? <span className="dd-sub">{x.sub}</span> : null}</span>
        {!isMulti ? <span className="dd-check" aria-hidden="true">{sel ? <Icon name="check" size={16} /> : null}</span> : null}
      </>;
      items.push(
        <li key={`o${k}`} role={isMenu ? 'menuitem' : 'option'} id={`dd-o-${idx}`}
          className={cx('dd-opt', idx === act && 'is-active', sel && !isMenu && 'is-sel', x.danger && 'is-danger')}
          aria-selected={isMenu ? undefined : sel} aria-disabled={x.disabled || undefined}
          onMouseDown={e => e.preventDefault()} onClick={() => choose(idx)}
          onMouseMove={() => { if (idx !== act && !x.disabled) setAct(idx, false); }}>
          {inner}
        </li>
      );
    });
  }

  const pop = isOpen ? (
    <DdPop kind={c.kind} sheet={sheet} title={c.title} anchorRef={c.anchorRef} popRef={popRef} onKeyDown={e => onKey(e, whereOf(e.target))}>
      {searchable ? (
        <div className="dd-search">
          <Icon name="search" size={16} />
          <input ref={searchRef} type="text" id="dd-q" className="dd-q" role="combobox" aria-expanded="true" aria-controls="dd-list" aria-autocomplete="list"
            autoComplete="off" aria-label={`Search ${c.title}`} placeholder={`Search ${c.title.toLowerCase()}`} value={query}
            aria-activedescendant={activeId} onChange={e => { setQuery(e.target.value); setActive(-1); }} />
        </div>
      ) : null}
      {isMulti ? (
        <div className="dd-tools">
          <button type="button" className="text-btn" onClick={() => setAll(true)}>Select all</button>
          <button type="button" className="text-btn" onClick={() => setAll(false)}>Clear</button>
        </div>
      ) : null}
      <ul ref={listRef} className="dd-list" id="dd-list" role={isMenu ? 'menu' : 'listbox'} aria-multiselectable={isMulti || undefined}
        aria-label={c.title} tabIndex={-1} aria-busy={loading || undefined} aria-activedescendant={focusOn === 'list' ? activeId : undefined}>
        {items}
      </ul>
      {sheet && isMulti ? <div className="dd-foot"><button type="button" className="btn btn-dark btn-block" onClick={() => ddClose(true)}>Done</button></div> : null}
    </DdPop>
  ) : null;

  return { isOpen, toggle, onKey, activeId: isOpen && focusOn === 'trigger' ? activeId : undefined, pop };
}

/* =========================================================
   Select / Combobox
   ========================================================= */
function SelectImpl(p: SelectProps & { kind: 'select' | 'combo' }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const title = p.title || p.ariaLabel || 'Choose';
  const dd = useListDd({
    id: p.id, kind: p.kind, rows: p.options, title, anchorRef, disabled: p.disabled, value: p.value,
    searchable: p.searchable, loadMs: p.loadMs, alwaysLoad: p.alwaysLoad, initialQuery: p.initialQuery, onPick: p.onChange
  });
  const o = p.options.find(x => x.value === p.value);
  const ic = o?.icon || p.icon;
  return (
    <Field base={p} kind={p.kind} open={dd.isOpen} error={p.error} anchorRef={anchorRef}>
      <button type="button" className="dd-trigger" {...nameAttrs(p, p.error)} role="combobox" aria-haspopup="listbox" aria-expanded={dd.isOpen}
        aria-controls="dd-list" aria-activedescendant={dd.activeId}
        onClick={e => { e.stopPropagation(); dd.toggle(); }} onKeyDown={e => dd.onKey(e, 'trigger')}>
        {ic ? <Icon name={ic} size={16} /> : null}
        <span className={cx('dd-value', !o && 'is-ph')}>{o ? o.label : p.placeholder || 'Select'}</span>
        <Chev />
      </button>
      {dd.pop}
    </Field>
  );
}
export function Select(p: SelectProps) { return <SelectImpl {...p} kind="select" />; }
export function Combobox(p: SelectProps) { return <SelectImpl {...p} kind="combo" />; }

/* =========================================================
   MultiSelect — chips with remove buttons, "+N" overflow with tooltip, Select all / Clear
   ========================================================= */
export function MultiSelect(p: MultiSelectProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const title = p.title || p.ariaLabel || 'Choose';
  const dd = useListDd({ id: p.id, kind: 'multi', rows: p.options, title, anchorRef, disabled: p.disabled, values: p.value, searchable: p.searchable, onMulti: p.onChange });
  const vals = p.value || [], max = p.maxChips ?? 2;
  const lab = (v: string): Option => p.options.find(x => x.value === v) || { value: v, label: v };
  const remove = (v: string) => {
    if (p.disabled) return;
    const label = lab(v).label;
    document.getElementById(p.id)?.focus({ preventScroll: true });
    p.onChange(vals.filter(x => x !== v));
    announce(`${label} removed`);
  };
  return (
    <Field base={p} kind="multi" open={dd.isOpen} error={p.error} anchorRef={anchorRef}>
      <div className="dd-trigger dd-multi" onClick={e => { e.stopPropagation(); dd.toggle(); }}>
        {vals.slice(0, max).map(v => (
          <span className="dd-chip" key={v}>
            {lab(v).short || lab(v).label}
            <button type="button" className="dd-chip-x" aria-label={`Remove ${lab(v).label}`} disabled={p.disabled}
              onClick={e => { e.stopPropagation(); remove(v); }}><Icon name="x" size={12} /></button>
          </span>
        ))}
        {vals.length > max ? <span className="dd-more" data-tip={vals.slice(max).map(v => lab(v).label).join(', ')}>+{vals.length - max}</span> : null}
        <button type="button" className="dd-mbtn" {...nameAttrs(p, p.error)} role="combobox" aria-haspopup="listbox" aria-expanded={dd.isOpen}
          aria-controls="dd-list" aria-activedescendant={dd.activeId} onKeyDown={e => dd.onKey(e, 'trigger')}>
          <span className={cx('dd-value', vals.length ? 'sr-only' : 'is-ph')}>
            {vals.length ? `${vals.length} selected: ${vals.map(v => lab(v).label).join(', ')}` : p.placeholder || 'Any'}
          </span>
          <Chev />
        </button>
      </div>
      {dd.pop}
    </Field>
  );
}

/* =========================================================
   StatusDropdown — badge trigger
   ========================================================= */
const STATUS_OPTS: Option[] = (Object.keys(STATUS) as StatusKey[]).map(k => ({ value: k, label: STATUS[k], icon: STATUS_ICON[k] }));
export function StatusDropdown(p: StatusDropdownProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const title = p.title || p.ariaLabel || 'Status';
  const dd = useListDd({ id: p.id, kind: 'status', rows: STATUS_OPTS, title, anchorRef, disabled: p.disabled, value: p.value, onPick: v => p.onChange(v as StatusKey) });
  return (
    <Field base={p} kind="status" open={dd.isOpen} error={p.error} anchorRef={anchorRef}>
      <button type="button" className={`dd-trigger dd-badge st-${p.value}`} {...nameAttrs(p, p.error)} role="combobox" aria-haspopup="listbox" aria-expanded={dd.isOpen}
        aria-controls="dd-list" aria-activedescendant={dd.activeId}
        onClick={e => { e.stopPropagation(); dd.toggle(); }} onKeyDown={e => dd.onKey(e, 'trigger')}>
        <Icon name={STATUS_ICON[p.value] || 'clock'} size={14} />
        <span className="dd-value">{STATUS[p.value] || p.value}</span>
        {p.disabled ? null : <Chev />}
      </button>
      {dd.pop}
    </Field>
  );
}

/* =========================================================
   ActionMenu — icons; destructive items last, in Ruby, after a divider
   ========================================================= */
function menuRows(items: MenuEntry[]): Row[] {
  const normal: Row[] = [], danger: Row[] = [];
  items.forEach(it => {
    if (it === 'separator') { normal.push({ sep: true }); return; }
    (it.danger ? danger : normal).push({ value: it.label, label: it.label, icon: it.icon, disabled: it.disabled, danger: it.danger, run: it.onSelect });
  });
  const all: Row[] = danger.length ? [...normal, { sep: true }, ...danger] : normal;
  const out: Row[] = [];
  all.forEach(r => { if (r.sep && (!out.length || out[out.length - 1].sep)) return; out.push(r); });
  while (out.length && out[out.length - 1].sep) out.pop();
  return out;
}

export function ActionMenu({ label, items, trigger, triggerClassName, id, style }: ActionMenuProps) {
  const auto = useId();
  const tid = id || `mt-${auto.replace(/[^\w-]/g, '')}`;
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dd = useListDd({ id: tid, kind: 'menu', rows: menuRows(items), title: label, anchorRef });
  return (
    <>
      <button type="button" id={tid} ref={anchorRef} className={triggerClassName || 'icon-btn'} style={style} aria-label={label}
        aria-haspopup="menu" aria-expanded={dd.isOpen} aria-controls={dd.isOpen ? 'dd-list' : undefined}
        onClick={e => { e.stopPropagation(); dd.toggle(); }} onKeyDown={e => dd.onKey(e, 'trigger')}>
        {trigger || <Icon name="more" />}
      </button>
      {dd.pop}
    </>
  );
}
