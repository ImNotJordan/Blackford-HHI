'use client';
/* In-site navigation helpers: smooth section scrolling (sticky-header offset comes from [data-spy] scroll-margin in CSS),
   focus management after navigation, and the hand-off of focus / area intents across route changes. */
import { AREA_OPTS, LEGAL } from '@/lib/data';
import { useSite } from './siteStore';

export const SITE_SECTIONS = ['home', 'pillars', 'services', 'model', 'difference', 'proof', 'approach', 'contact'];
export const SPY_ORDER = ['pillars', 'services', 'model', 'difference', 'proof', 'approach', 'contact'];
export const LEGAL_KEYS = Object.keys(LEGAL);

/** Set by a site link click, consumed by the view that handles the navigation. */
export const pending: { nav: boolean; section: string | null; focus: string | null } = { nav: false, section: null, focus: null };

/** Last area applied from a CTA or the ?area= query, so a re-render does not re-apply it. */
let lastArea: string | null = null;
export function applyArea(area: string | null) {
  if (!area || area === lastArea || !AREA_OPTS.includes(area)) return;
  lastArea = area;
  useSite.getState().setArea(area);
}
export function forceArea(area: string) {
  if (!AREA_OPTS.includes(area)) return;
  lastArea = area;
  useSite.getState().setArea(area);
}

export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function focusEl(el: HTMLElement | null | undefined) {
  if (el) el.focus({ preventScroll: true });
}

/** Scrolls to a home-page section; on in-app navigation also moves focus to the pending target or the section heading. */
export function goSection(id: string, initial: boolean) {
  const pf = pending.focus;
  pending.focus = null;
  pending.nav = false;
  pending.section = null;
  const behavior: ScrollBehavior = initial || reduced() ? 'instant' : 'smooth';
  requestAnimationFrame(() => {
    const el = id === 'home' ? null : document.getElementById(id);
    if (!el) window.scrollTo({ top: 0, behavior });
    else el.scrollIntoView({ behavior, block: 'start' });
    if (initial) return;
    const target = (pf && document.getElementById(pf))
      || (el ? el.querySelector<HTMLElement>('h1[tabindex],h2[tabindex]') : document.getElementById('hero-title'));
    focusEl(target);
  });
}
