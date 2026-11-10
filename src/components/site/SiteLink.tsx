'use client';
/* Link for website navigation.
   - `/#section` on the home page: pushes the URL, smooth-scrolls (even when the hash is already current) and focuses
     the section heading, or the element named by `focus`.
   - From another page: client-side navigation; the destination view consumes the pending section / focus.
   - `area` preselects the contact form's area field. */
import Link from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { focusEl, forceArea, goSection, LEGAL_KEYS, pending, reduced } from './nav';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  /** id of the element to focus after navigating */
  focus?: string;
  /** contact-form area to preselect */
  area?: string;
  children: ReactNode;
};

export function SiteLink({ href, focus, area, onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(href, window.location.href);
    const legal = LEGAL_KEYS.includes(url.pathname.slice(1));
    if (url.pathname !== '/' && !legal) return;
    pending.nav = true;
    pending.focus = focus || null;
    if (area) forceArea(area);
    if (legal) {
      if (window.location.pathname !== url.pathname) return;
      e.preventDefault();
      pending.nav = false;
      pending.focus = null;
      window.scrollTo({ top: 0, behavior: reduced() ? 'instant' : 'smooth' });
      focusEl(document.getElementById('legal-title'));
      return;
    }
    const section = url.hash.slice(1) || 'home';
    if (window.location.pathname === '/') {
      e.preventDefault();
      const next = url.pathname + url.search + url.hash;
      const cur = window.location.pathname + window.location.search + window.location.hash;
      if (next !== cur) window.history.pushState(null, '', next);
      goSection(section, false);
    } else {
      pending.section = section;
    }
  };
  return <Link href={href} scroll={false} onClick={handle} {...rest}>{children}</Link>;
}
