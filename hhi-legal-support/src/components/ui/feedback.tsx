'use client';
/* Feedback: toasts, confirm dialog, CSV export modal, screen-reader announcer (+ the global tooltip host). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/icons';
import { createStore, useStore } from './core';
import { Modal } from './layers';
import { TipHost } from './tip';
import type { ConfirmOptions, ToastOptions } from './types';

/* =========================================================
   Toasts — max 3 visible (1 at ≤560px); 5s, or 8s with undo/action; pause on hover/focus
   ========================================================= */
interface ToastItem { id: number; msg: string; opts: ToastOptions }
const toasts = createStore<ToastItem[]>([]);
let toastSeq = 0;

export function toast(msg: string, opts: ToastOptions = {}) {
  if (typeof window === 'undefined') return;
  const max = window.matchMedia('(max-width: 560px)').matches ? 1 : 3;
  let list = toasts.get();
  while (list.length >= max) list = list.slice(1);
  toasts.set([...list, { id: ++toastSeq, msg, opts }]);
}
const dismiss = (id: number) => toasts.set(toasts.get().filter(t => t.id !== id));

function Toast({ t }: { t: ToastItem }) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { undo, action, icon } = t.opts;
  const ms = undo || action ? 8000 : 5000;
  const pause = () => clearTimeout(timer.current);
  const arm = () => { clearTimeout(timer.current); timer.current = setTimeout(() => dismiss(t.id), ms); };
  useEffect(() => {
    timer.current = setTimeout(() => dismiss(t.id), ms);
    return () => clearTimeout(timer.current);
  }, [t.id, ms]);
  return (
    <div className="toast" onMouseEnter={pause} onMouseLeave={arm} onFocus={pause} onBlur={arm}>
      <Icon name={icon || 'check'} size={20} />
      <span>{t.msg}</span>
      <span className="toast-actions">
        {undo ? <button type="button" onClick={() => { dismiss(t.id); undo(); toast('Change undone.', { icon: 'refresh' }); }}>Undo</button> : null}
        {action ? <button type="button" onClick={() => { dismiss(t.id); action.onClick(); }}>{action.label}</button> : null}
        <button type="button" className="icon-btn" aria-label="Dismiss message" onClick={() => dismiss(t.id)}><Icon name="x" size={16} /></button>
      </span>
    </div>
  );
}

export function Toaster() {
  const list = useStore(toasts);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => { root.style.setProperty('--toast-h', (el.children.length ? el.offsetHeight + 16 : 0) + 'px'); });
    ro.observe(el);
    return () => { ro.disconnect(); root.style.setProperty('--toast-h', '0px'); };
  }, []);
  return createPortal(
    <div className="toasts" id="toasts" aria-live="polite" aria-atomic="false" ref={ref}>
      {list.map(t => <Toast key={t.id} t={t} />)}
    </div>,
    document.body
  );
}

/* =========================================================
   Announcer — polite live region; also hosts the global #dd-tip tooltip
   ========================================================= */
const announced = createStore('');
let annTimer: ReturnType<typeof setTimeout> | undefined;
export function announce(msg: string) {
  announced.set('');
  clearTimeout(annTimer);
  annTimer = setTimeout(() => announced.set(msg), 30);
}
export function Announcer() {
  const text = useStore(announced);
  return (
    <>
      <div className="sr-only" id="announcer" aria-live="polite">{text}</div>
      <TipHost />
    </>
  );
}

/** Keeps the last non-null request so a closing modal keeps its content during the exit transition. */
function useLast<T>(v: T | null): T | null {
  const [last, setLast] = useState<T | null>(v);
  if (v !== null && v !== last) setLast(v);
  return v ?? last;
}

/* =========================================================
   Confirm dialog — resolves true on confirm, false on cancel / Esc / scrim
   ========================================================= */
interface ConfirmReq { o: ConfirmOptions; resolve(v: boolean): void }
const confirmReq = createStore<ConfirmReq | null>(null);

export function confirmDialog(o: ConfirmOptions): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    if (!confirmReq.size()) { resolve(typeof window !== 'undefined' && window.confirm(`${o.title}\n\n${o.body}`)); return; }
    const prev = confirmReq.get();
    if (prev) prev.resolve(false);
    confirmReq.set({ o, resolve });
  });
}
export function ConfirmHost() {
  const req = useStore(confirmReq);
  const shown = useLast(req);
  const finish = (v: boolean) => { const r = confirmReq.get(); if (!r) return; confirmReq.set(null); r.resolve(v); };
  const o = shown?.o;
  return (
    <Modal
      open={!!req}
      onClose={() => finish(false)}
      title={o?.title ?? ''}
      initialFocus="#confirm-ok"
      footer={o ? <>
        <button className="btn btn-quiet" type="button" onClick={() => finish(false)}>Cancel</button>
        <button className={`btn ${o.danger ? 'btn-primary' : 'btn-dark'}`} type="button" id="confirm-ok" onClick={() => finish(true)}>{o.confirmLabel || 'Confirm'}</button>
      </> : null}
    >
      {o ? <p>{o.body}</p> : null}
    </Modal>
  );
}

/* =========================================================
   CSV export modal — preview, Copy CSV (clipboard, select-all fallback), Download .csv (Blob)
   ========================================================= */
interface CsvReq { title: string; filename: string; csv: string }
const csvReq = createStore<CsvReq | null>(null);
export function openCsv(title: string, filename: string, csv: string) { csvReq.set({ title, filename, csv }); }

export function CsvHost() {
  const req = useStore(csvReq);
  const shown = useLast(req);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const close = () => csvReq.set(null);
  const copy = () => {
    const ta = taRef.current;
    if (!ta) return;
    const fallback = () => { ta.focus(); ta.select(); toast('CSV selected. Press Ctrl+C or Cmd+C to copy it.', { icon: 'copy' }); };
    try {
      if (!navigator.clipboard) { fallback(); return; }
      navigator.clipboard.writeText(ta.value).then(() => toast('CSV copied to your clipboard.', { icon: 'copy' }), fallback);
    } catch { fallback(); }
  };
  const download = () => {
    if (!shown) return;
    try {
      const url = URL.createObjectURL(new Blob([shown.csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url; a.download = shown.filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast(`Downloading ${shown.filename}.`, { icon: 'download' });
    } catch { toast('The download could not start. Use Copy CSV instead.', { icon: 'alert' }); }
  };
  // Keep the textarea scrolled to the top whenever a new export opens.
  useLayoutEffect(() => { if (req && taRef.current) taRef.current.scrollTop = 0; }, [req]);
  return (
    <Modal
      open={!!req}
      onClose={close}
      title={shown?.title ?? ''}
      initialFocus="#csv-copy"
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={close}>Close</button>
        <button className="btn btn-ghost" type="button" id="csv-download" onClick={download}><Icon name="download" size={18} />Download .csv</button>
        <button className="btn btn-primary" type="button" id="csv-copy" onClick={copy}><Icon name="copy" size={18} />Copy CSV</button>
      </>}
    >
      <p className="small">Download the CSV, or copy it and paste it into Excel or Google Sheets.</p>
      <label className="label" htmlFor="csv-text">CSV preview · {shown?.filename}</label>
      <textarea className="textarea csv-box" id="csv-text" readOnly value={shown?.csv ?? ''} ref={taRef} />
    </Modal>
  );
}
