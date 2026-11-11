'use client';
/* Shared, non-visual UI-kit infrastructure: media queries, focus helpers, scroll lock and a tiny external store. */
import { useSyncExternalStore } from 'react';

/** Scrolls `el` into view inside `box` only — never scrolls the page (which would close the panel). */
export function scrollWithin(el: HTMLElement | null | undefined, box: HTMLElement | null | undefined) {
  if (!el || !box) return;
  const er = el.getBoundingClientRect(), br = box.getBoundingClientRect();
  if (er.top < br.top) box.scrollTop -= br.top - er.top;
  else if (er.bottom > br.bottom) box.scrollTop += er.bottom - br.bottom;
  if (er.left < br.left) box.scrollLeft -= br.left - er.left;
  else if (er.right > br.right) box.scrollLeft += er.right - br.right;
}
export const mobileQ = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export const isVisible = (el: HTMLElement) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
export const focusables = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);

/** Cycles Tab / Shift+Tab inside `root`. Returns true when it handled the key. */
export function trapTab(e: { key: string; shiftKey: boolean; target: EventTarget; preventDefault(): void }, root: HTMLElement) {
  if (e.key !== 'Tab') return false;
  const f = focusables(root);
  if (!f.length) { e.preventDefault(); return true; }
  const t = e.target as HTMLElement;
  if (!root.contains(t)) return false;
  if (e.shiftKey && (t === f[0] || t === root)) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && t === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  return true;
}

/* ---------- body.no-scroll, shared by modals, sheets and the mobile dropdown sheet ---------- */
let locks = 0;
export function lockScroll() {
  locks++;
  document.body.classList.add('no-scroll');
  let done = false;
  return () => {
    if (done) return;
    done = true;
    locks = Math.max(0, locks - 1);
    if (!locks) document.body.classList.remove('no-scroll');
  };
}

/* ---------- Minimal external store (module singletons → React via useSyncExternalStore) ---------- */
export interface Store<T> { get(): T; set(v: T): void; subscribe(f: () => void): () => void; size(): number }
export function createStore<T>(initial: T): Store<T> {
  let v = initial;
  const subs = new Set<() => void>();
  return {
    get: () => v,
    set: n => { v = n; subs.forEach(f => f()); },
    subscribe: f => { subs.add(f); return () => { subs.delete(f); }; },
    size: () => subs.size
  };
}
export function useStore<T>(s: Store<T>): T {
  return useSyncExternalStore(s.subscribe, s.get, s.get);
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
