'use client';
/* Global tooltip `#dd-tip`: shown on hover AND keyboard focus of any element with `data-tip`,
   and imperatively (showTip) for e.g. clicks on disabled calendar days. Rendered once by <Announcer/>. */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

let tipEl: HTMLDivElement | null = null;

export function showTip(el: Element, text: string | null | undefined) {
  const t = tipEl;
  if (!t || !text) return;
  t.textContent = text;
  t.hidden = false;
  const r = el.getBoundingClientRect(), tw = t.offsetWidth, th = t.offsetHeight;
  t.style.left = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2)) + 'px';
  t.style.top = (r.top - th - 8 < 4 ? r.bottom + 8 : r.top - th - 8) + 'px';
}
export function hideTip() { if (tipEl) tipEl.hidden = true; }

const tipTarget = (e: Event) => {
  const t = e.target as Element | null;
  return t && typeof t.closest === 'function' ? (t.closest('[data-tip]') as HTMLElement | null) : null;
};

export function TipHost() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    tipEl = el;
    const on = (e: Event) => { const el = tipTarget(e); if (el && el.dataset.tip) showTip(el, el.dataset.tip); else hideTip(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') hideTip(); };
    document.addEventListener('mouseover', on);
    document.addEventListener('focusin', on);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', hideTip, true);
    return () => {
      document.removeEventListener('mouseover', on);
      document.removeEventListener('focusin', on);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', hideTip, true);
      if (tipEl === el) tipEl = null;
    };
  }, []);
  return createPortal(<div id="dd-tip" role="tooltip" hidden ref={ref} />, document.body);
}
