'use client';
/* Dropdown frame shared by the list family (dropdown.tsx) and the date family (date.tsx).
   One open dropdown at a time; one floating panel `#dd-pop` portaled to <body>, positioned under the
   trigger (flips above, min-width = trigger). At ≤768px it becomes a bottom sheet with `#dd-scrim`,
   a drag handle (drag down >90px closes) and a title row. */
import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/icons';
import { createStore, cx, lockScroll, mobileQ, useStore } from './core';
import { hideTip } from './tip';

export type DdKind = 'select' | 'combo' | 'multi' | 'status' | 'menu' | 'date' | 'datetime' | 'range' | 'month';

/* ---------- Registry: which dropdown is open ---------- */
interface OpenState { id: string; sheet: boolean }
const openDd = createStore<OpenState | null>(null);

/** Returns `{ id, sheet }` while dropdown `id` is open, else null. */
export function useDdOpen(id: string) {
  const s = useStore(openDd);
  return s && s.id === id ? s : null;
}
export const ddIsOpen = (id: string) => openDd.get()?.id === id;
/** Opens dropdown `id` (closing any other). Returns whether it opened as a bottom sheet. */
export function ddShow(id: string) {
  const sheet = mobileQ();
  hideTip();
  openDd.set({ id, sheet });
  return sheet;
}
/** Closes the open dropdown; optionally returns focus to its trigger (the element with the dropdown's id). */
export function ddClose(focusTrigger: boolean) {
  const cur = openDd.get();
  if (!cur) return;
  openDd.set(null);
  hideTip();
  if (focusTrigger) {
    const t = document.getElementById(cur.id);
    if (t) t.focus({ preventScroll: true });
  }
}

/* ---------- Small shared bits ---------- */
export const Chev = () => <span className="dd-chev" aria-hidden="true"><Icon name="chevron-down" size={16} /></span>;

export function hl(label: string, q: string): ReactNode {
  const i = q ? label.toLowerCase().indexOf(q) : -1;
  if (i < 0) return label;
  return <>{label.slice(0, i)}<mark>{label.slice(i, i + q.length)}</mark>{label.slice(i + q.length)}</>;
}

export interface FieldLike {
  id: string; labelId?: string; ariaLabel?: string; title?: string; size?: 'md' | 'sm';
  disabled?: boolean; hintId?: string; className?: string; demo?: 'is-hover' | 'is-focus';
}
/** Accessible-name / description attributes for a trigger. */
export function nameAttrs(b: FieldLike, error: string | null | undefined) {
  const desc = [error ? `${b.id}-err` : '', b.hintId || ''].filter(Boolean).join(' ');
  return {
    id: b.id,
    'aria-labelledby': b.labelId,
    'aria-label': b.labelId ? undefined : b.ariaLabel || b.title || 'Choose',
    'aria-describedby': desc || undefined,
    'aria-invalid': error ? true : undefined,
    disabled: b.disabled
  } as const;
}

/** `.dd` wrapper: trigger + inline error (`${id}-err`) + the portaled panel. */
export function Field({ base, kind, open, error, anchorRef, children }: {
  base: FieldLike; kind: DdKind; open: boolean; error: string | null | undefined;
  anchorRef: RefObject<HTMLDivElement | null>; children: ReactNode;
}) {
  return (
    <div ref={anchorRef} data-dd={base.id}
      className={cx('dd', `dd-k-${kind}`, base.size === 'sm' && 'dd-sm', error && 'is-error', base.disabled && 'is-disabled', base.demo, open && 'is-open', base.className)}>
      {children}
      {error ? <p className="dd-err" id={`${base.id}-err`}><Icon name="alert" size={16} /><span>{error}</span></p> : null}
    </div>
  );
}

/* ---------- The floating panel / bottom sheet ---------- */
export function DdPop({ kind, sheet, title, anchorRef, popRef, dialog, onKeyDown, children }: {
  kind: DdKind; sheet: boolean; title: string;
  anchorRef: RefObject<HTMLElement | null>;
  popRef: RefObject<HTMLDivElement | null>;
  /** role=dialog even as a floating panel (date family) */
  dialog?: boolean;
  onKeyDown?(e: KeyboardEvent<HTMLDivElement>): void;
  children: ReactNode;
}) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const flags = useRef({ shown: false, above: false });
  const pathname = usePathname();
  const path0 = useRef(pathname);

  // Re-apply the imperatively managed classes after every commit.
  useLayoutEffect(() => {
    const p = popRef.current;
    if (!p) return;
    p.classList.toggle('is-open', flags.current.shown);
    p.classList.toggle('is-above', flags.current.above);
  });

  useLayoutEffect(() => {
    const p = popRef.current, anchor = anchorRef.current;
    if (!p || !anchor) return;
    const f = flags.current;
    // Bring the trigger into view instantly. This also cancels any in-progress smooth scroll
    // (html has scroll-behavior: smooth), which would otherwise trip the "trigger left the viewport" close rule.
    if (!sheet) {
      const tr = anchor.getBoundingClientRect();
      if (tr.top < 0 || tr.bottom > window.innerHeight) anchor.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' as ScrollBehavior });
      else window.scrollTo({ top: window.scrollY, behavior: 'instant' as ScrollBehavior });
    }
    const place = () => {
      if (sheet) return;
      const refEl = anchor.querySelector<HTMLElement>('.dd-trigger') || anchor;
      const r = refEl.getBoundingClientRect();
      p.style.minWidth = Math.max(r.width, kind === 'menu' ? 220 : 0) + 'px';
      const pw = p.offsetWidth, ph = p.offsetHeight;
      let left = kind === 'menu' ? r.right - pw : r.left;
      left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
      let top = r.bottom + 6, above = false;
      if (top + ph > window.innerHeight - 8 && r.top - ph - 6 > 8) { top = r.top - ph - 6; above = true; }
      p.style.left = left + 'px';
      p.style.top = Math.max(8, top) + 'px';
      f.above = above;
      p.classList.toggle('is-above', above);
    };
    place();
    void p.offsetWidth;
    const raf = requestAnimationFrame(() => {
      f.shown = true;
      p.classList.add('is-open');
      scrimRef.current?.classList.add('is-open');
    });
    const ro = new ResizeObserver(() => place());
    ro.observe(p);
    const onScroll = (e: Event) => {
      if (sheet) return;
      if (e.target instanceof Node && p.contains(e.target)) return;
      const r = anchor.getBoundingClientRect();
      if (!anchor.isConnected || r.bottom < 0 || r.top > window.innerHeight) ddClose(false);
      else place();
    };
    const onResize = () => { if (sheet !== mobileQ()) ddClose(false); else place(); };
    const onDown = (e: Event) => {
      const t = e.target as Node | null;
      if (!t || p.contains(t) || anchor.contains(t) || scrimRef.current?.contains(t)) return;
      ddClose(false);
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('pointerdown', onDown, true);
    const unlock = sheet ? lockScroll() : null;
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointerdown', onDown, true);
      if (unlock) unlock();
      f.shown = false;
      hideTip();
    };
  }, [sheet, kind, anchorRef, popRef]);

  // Close on route change.
  useEffect(() => { if (pathname !== path0.current) ddClose(false); }, [pathname]);

  const startDrag = (e: RPointerEvent<HTMLDivElement>) => {
    const p = popRef.current;
    if (!p || (e.target as Element).closest('button')) return;
    const y0 = e.clientY;
    let dy = 0;
    p.style.transition = 'none';
    const move = (ev: PointerEvent) => { dy = Math.max(0, ev.clientY - y0); p.style.transform = `translateY(${dy}px)`; };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      p.style.transition = '';
      p.style.transform = '';
      if (dy > 90) ddClose(true);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const isDialog = sheet || !!dialog;
  return createPortal(
    <>
      {sheet ? <div id="dd-scrim" ref={scrimRef} onClick={e => { e.stopPropagation(); ddClose(true); }} /> : null}
      <div id="dd-pop" ref={popRef} className={cx('dd-pop', `dd-pop-${kind}`, sheet && 'is-sheet')}
        role={isDialog ? 'dialog' : undefined} aria-modal={sheet ? true : undefined} aria-label={isDialog ? title : undefined}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => { onKeyDown?.(e); e.stopPropagation(); }}>
        {sheet ? (
          <div className="dd-sheet-head" onPointerDown={startDrag}>
            <span className="dd-handle" aria-hidden="true" />
            <div className="dd-sheet-title">
              <b>{title}</b>
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => ddClose(true)}><Icon name="x" size={18} /></button>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </>,
    document.body
  );
}
