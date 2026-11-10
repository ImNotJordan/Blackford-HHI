'use client';
/* Website chrome: sticky header (brand, primary nav with scroll-spy, portal + contact CTAs, mobile menu toggle),
   the mobile menu (≤1079px, focus-trapped with the header, Esc closes, closes on navigation), main landmark and footer. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, Logo } from '@/components/icons';
import { SiteLink } from './SiteLink';
import { reduced } from './nav';
import { useSite } from './siteStore';

const PRIMARY: [string, string][] = [['services', 'Services'], ['model', 'Operating model'], ['difference', 'Why Hyacinth'], ['proof', 'Proof'], ['approach', 'How we start']];
const MOBILE: [string, string][] = [['/#services', 'Services'], ['/#model', 'Operating model'], ['/#difference', 'Why Hyacinth'], ['/#proof', 'Proof of execution'], ['/#approach', 'How we start'], ['/portal', 'Client portal']];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const isVisible = (el: HTMLElement) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';

function Brand() {
  return (
    <SiteLink className="brand" href="/" aria-label="Hyacinth Legal Support, home">
      <Logo /><span className="brand-word"><b>Hyacinth</b><span>Legal Support</span></span>
    </SiteLink>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const spy = useSite(s => s.spy);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [top, setTop] = useState<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const lockScroll = useCallback((on: boolean) => {
    if (on === locked.current) return;
    locked.current = on;
    document.body.classList.toggle('no-scroll', on);
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    setShown(false);
    lockScroll(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setMounted(false), reduced() ? 0 : 230);
    if (restoreFocus) toggleRef.current?.focus({ preventScroll: true });
  }, [lockScroll]);

  const openMenu = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const h = headerRef.current;
    setTop(h ? Math.max(0, h.getBoundingClientRect().bottom) : undefined);
    setMounted(true);
    lockScroll(true);
    requestAnimationFrame(() => {
      setShown(true);
      const first = menuRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    });
  };

  /* Esc + focus trap across the menu and the header (the toggle stays reachable). */
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); return; }
      if (e.key !== 'Tab') return;
      const roots = [menuRef.current, headerRef.current].filter((r): r is HTMLElement => !!r);
      const f = roots.flatMap(r => Array.from(r.querySelectorAll<HTMLElement>(FOCUSABLE))).filter(isVisible);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1], active = document.activeElement as HTMLElement | null;
      const inside = roots.some(r => r.contains(active));
      if (!inside) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    let lastW = window.innerWidth;
    const onResize = () => { const w = window.innerWidth; if (w !== lastW && w >= 1080) closeMenu(false); lastW = w; };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [shown, closeMenu]);

  /* Close on any route change; clean up on unmount. */
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (mounted || shown) { setShown(false); setMounted(false); }
  }
  useEffect(() => { if (!shown && !mounted) lockScroll(false); }, [shown, mounted, lockScroll]);
  useEffect(() => () => {
    lockScroll(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, [lockScroll]);

  const menuNav = () => closeMenu(false);

  return (
    <div id="site">
      <header className="site-header on-ink" ref={headerRef}>
        <div className="wrap">
          <Brand />
          <nav className="site-nav" aria-label="Primary">
            {PRIMARY.map(([id, label]) => (
              <SiteLink key={id} href={`/#${id}`} aria-current={pathname === '/' && spy === id ? 'true' : undefined}>{label}</SiteLink>
            ))}
          </nav>
          <div className="header-actions">
            <SiteLink className="btn btn-ghost btn-sm hide-md" href="/portal">Client portal</SiteLink>
            <SiteLink className="btn btn-primary btn-sm" href="/#contact" focus="c-name" onClick={shown ? menuNav : undefined}>Talk to us</SiteLink>
            <button ref={toggleRef} className="icon-btn menu-toggle" type="button" aria-expanded={shown} aria-controls="mobile-menu"
              aria-label={shown ? 'Close menu' : 'Open menu'} onClick={() => (shown ? closeMenu(true) : openMenu())}>
              <Icon name={shown ? 'x' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" ref={menuRef} className={`mobile-menu on-ink${shown ? ' is-open' : ''}`} hidden={!mounted} style={top != null ? { top } : undefined}>
        <div className="wrap">
          <nav aria-label="Mobile">
            {MOBILE.map(([href, label]) => (
              <SiteLink key={href} href={href} onClick={menuNav}>{label} <Icon name="arrow-right" /></SiteLink>
            ))}
          </nav>
          <div className="menu-ctas">
            <SiteLink className="btn btn-primary btn-block" href="/#contact" focus="c-name" onClick={menuNav}>Talk to us about capacity</SiteLink>
          </div>
        </div>
      </div>

      <main id="main" tabIndex={-1}>{children}</main>

      <footer className="site-footer on-ink">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col foot-brand">
              <Brand />
              <p>A managed operating layer behind the practice of law.</p>
              <SiteLink className="btn btn-primary" href="/#contact" focus="c-name" style={{ width: 'fit-content' }}>Talk to us</SiteLink>
            </div>
            <nav className="foot-col" aria-label="Services">
              <h2>Services</h2>
              <SiteLink href="/#services">Where we plug in</SiteLink>
              <SiteLink href="/#model">Operating model</SiteLink>
              <SiteLink href="/#proof">Proof of execution</SiteLink>
              <SiteLink href="/#approach">How we start</SiteLink>
            </nav>
            <nav className="foot-col" aria-label="Client portal">
              <h2>Client portal</h2>
              <SiteLink href="/portal">Overview</SiteLink>
              <SiteLink href="/portal/workflows">Workflows</SiteLink>
              <SiteLink href="/portal/deadlines">Deadlines</SiteLink>
              <SiteLink href="/portal/reports">Reports</SiteLink>
            </nav>
            <nav className="foot-col" aria-label="Legal">
              <h2>Legal</h2>
              <SiteLink href="/privacy" aria-current={pathname === '/privacy' ? 'page' : undefined}>Privacy notice</SiteLink>
              <SiteLink href="/terms" aria-current={pathname === '/terms' ? 'page' : undefined}>Terms of use</SiteLink>
              <SiteLink href="/accessibility" aria-current={pathname === '/accessibility' ? 'page' : undefined}>Accessibility</SiteLink>
            </nav>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Hyacinth Industries, LLC. All rights reserved.</span>
            <span>Managed operations for midsize law firms</span>
          </div>
        </div>
        <div className="sigbar" role="presentation" />
      </footer>
    </div>
  );
}
