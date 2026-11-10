'use client';
/* Client portal chrome: Ink sidebar, topbar (crumb, search, notifications, profile menu), admin view-as banner,
   signed-out screen, and the shared layers (workflow slide-over, new workflow and message modals). */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useApp } from '@/lib/store';
import { pFirm, openWfs, weekDeadlines, firmOptions } from '@/lib/selectors';
import { Icon, Logo, type IconName } from '@/components/icons';
import { ActionMenu, Avatar, Combobox, announce, confirmDialog, toast, useBusy } from '@/components/ui';
import { WorkflowSheet } from '@/components/shared/WorkflowSheet';
import { usePortalUi, closeWf, openMessage, resetReports, emptyFilters } from './uiStore';
import { focusSoon } from './common';
import { NotificationsButton } from './Notifications';
import { NewWorkflowModal } from './NewWorkflowModal';
import { MessageModal } from './MessageModal';

export const VIEW_TITLES: Record<string, string> = {
  '/portal': 'Overview', '/portal/workflows': 'Workflows', '/portal/deadlines': 'Deadlines', '/portal/reports': 'Reports',
  '/portal/account': 'Account & preferences', '/portal/help': 'Help & support'
};

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/portal';
  const signedOut = useApp(s => s.portalSignedOut);
  const viewAs = useApp(s => s.viewAs);
  const sheet = usePortalUi(s => s.sheet);

  // Move focus to the new view's title after client navigation (not on first load).
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const pf = usePortalUi.getState().pendingFocus;
    if (pf) usePortalUi.getState().set({ pendingFocus: null });
    requestAnimationFrame(() => {
      if (document.activeElement?.closest('[role="dialog"]')) return;
      const el = (pf && document.querySelector<HTMLElement>(pf)) || document.getElementById('view-title');
      el?.focus({ preventScroll: !pf });
    });
  }, [pathname]);

  return (
    <>
      {signedOut ? <SignedOut /> : (
        <div className="portal" id="portal">
          <PortalFrame pathname={pathname} viewAs={viewAs}>{children}</PortalFrame>
        </div>
      )}
      <WorkflowSheet id={signedOut ? null : sheet.id} onClose={closeWf} initialFocus={sheet.focus} />
      <NewWorkflowModal />
      <MessageModal />
    </>
  );
}

/* ---------------- sidebar + topbar ---------------- */
function PortalFrame({ pathname, viewAs, children }: { pathname: string; viewAs: boolean; children: React.ReactNode }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [path, setPath] = useState(pathname);
  if (path !== pathname) { setPath(pathname); setSideOpen(false); setSearchOpen(false); }

  const toggleRef = useRef<HTMLButtonElement>(null);
  const sideRef = useRef<HTMLElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);

  const closeSide = useCallback((restore = true) => {
    setSideOpen(false);
    if (restore) toggleRef.current?.focus({ preventScroll: true });
  }, []);

  // Off-canvas sidebar (≤900px): scroll lock, Esc, focus trap, close when the viewport widens.
  useEffect(() => {
    if (!sideOpen) return;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => sideRef.current?.querySelector<HTMLElement>('.close-side')?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeSide(); return; }
      if (e.key !== 'Tab' || !sideRef.current) return;
      const f = Array.from(sideRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null || el.getClientRects().length);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1], inside = sideRef.current.contains(document.activeElement);
      if (!inside) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 900) closeSide(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [sideOpen, closeSide]);

  const toggleSearch = () => {
    const open = !searchOpen;
    setSearchOpen(open);
    if (open) focusSoon('#global-q-m');
  };
  const onMobileSearchKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); setSearchOpen(false); searchToggleRef.current?.focus(); }
  };

  return (
    <>
      <Sidebar ref={sideRef} pathname={pathname} open={sideOpen} onClose={() => closeSide()} />
      {sideOpen ? <div className="sidebar-scrim is-open" onClick={() => closeSide()} aria-hidden="true" /> : null}
      <div className="portal-body">
        {viewAs ? <ViewAsBanner /> : null}
        <header className="topbar on-light">
          <div className="wrap topbar-row">
            <button
              ref={toggleRef} className="icon-btn side-toggle" type="button" aria-label="Open navigation"
              aria-expanded={sideOpen} aria-controls="sidebar" onClick={() => setSideOpen(true)}
            ><Icon name="menu" /></button>
            <Crumb pathname={pathname} />
            <SearchForm id="global-q" className="top-search" onDone={() => setSearchOpen(false)} />
            <button
              ref={searchToggleRef} className="icon-btn search-toggle" type="button" aria-expanded={searchOpen}
              aria-controls="mobile-search" aria-label="Search" onClick={toggleSearch}
            ><Icon name="search" /></button>
            <div className="top-actions">
              <NotificationsButton />
              <ProfileMenu />
            </div>
          </div>
          <div className={`wrap mobile-search${searchOpen ? ' is-open' : ''}`} id="mobile-search" onKeyDown={onMobileSearchKey}>
            <SearchForm id="global-q-m" className="search-field" onDone={() => setSearchOpen(false)} />
          </div>
        </header>
        <main id="main" tabIndex={-1}>{children}</main>
      </div>
    </>
  );
}

function Crumb({ pathname }: { pathname: string }) {
  const firm = useApp(s => pFirm(s).name);
  return (
    <p className="crumb-trail">
      <span className="firm">{firm}</span><span className="firm" aria-hidden="true">/</span>
      <b>{VIEW_TITLES[pathname] || 'Overview'}</b>
    </p>
  );
}

function SearchForm({ id, className, onDone }: { id: string; className: string; onDone(): void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    onDone();
    router.push(`/portal/workflows?q=${encodeURIComponent(t)}`);
    announce(t ? `Showing workflows matching ${t}` : 'Showing all workflows');
  };
  return (
    <form className={className} role="search" onSubmit={submit}>
      <Icon name="search" />
      <label className="sr-only" htmlFor={id}>Search workflows</label>
      <input className="input" id={id} type="search" placeholder="Search workflows, matters, people" autoComplete="off" value={q} onChange={e => setQ(e.target.value)} />
    </form>
  );
}

function ProfileMenu() {
  const router = useRouter();
  const profile = useApp(s => s.profile);
  const signOut = async () => {
    const ok = await confirmDialog({ title: 'Sign out of the portal?', body: 'You will need to sign back in to see your workflows, deadlines and reports.', confirmLabel: 'Sign out' });
    if (!ok) return;
    usePortalUi.getState().set({ sheet: { id: null }, newWfOpen: false, messageTo: null });
    useApp.getState().portalSignOut();
  };
  return (
    <ActionMenu
      id="profile-btn" label="Account menu" triggerClassName="profile-btn"
      trigger={<><Avatar name={profile.name} /><span className="who"><b>{profile.name}</b><span>{profile.title}</span></span><Icon name="chevron-down" /></>}
      items={[
        { label: 'Account & preferences', icon: 'user', onSelect: () => router.push('/portal/account') },
        { label: 'Help & support', icon: 'help', onSelect: () => router.push('/portal/help') },
        { label: 'Switch to website', icon: 'home', onSelect: () => router.push('/') },
        'separator',
        { label: 'Sign out', icon: 'logout', danger: true, onSelect: () => { void signOut(); } }
      ]}
    />
  );
}

/* ---------------- sidebar ---------------- */
const NAV: { href: string; label: string; icon: IconName; count?: 'open' | 'week' }[] = [
  { href: '/portal', label: 'Overview', icon: 'grid' },
  { href: '/portal/workflows', label: 'Workflows', icon: 'list', count: 'open' },
  { href: '/portal/deadlines', label: 'Deadlines', icon: 'calendar', count: 'week' },
  { href: '/portal/reports', label: 'Reports', icon: 'chart' }
];
const NAV_ACCOUNT: { href: string; label: string; icon: IconName }[] = [
  { href: '/portal/account', label: 'Account & preferences', icon: 'sliders' },
  { href: '/portal/help', label: 'Help & support', icon: 'help' }
];

function Sidebar({ ref, pathname, open, onClose }: { ref: React.Ref<HTMLElement>; pathname: string; open: boolean; onClose(): void }) {
  const s = useApp();
  const F = pFirm(s);
  const open_ = openWfs(s).length, wk = weekDeadlines(s).length;
  const lead = s.team[F.lead];
  const sinceText = F.status === 'Onboarding' ? 'Onboarding with Hyacinth' : `Managed by Hyacinth since ${F.since.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  const link = (href: string, label: string, icon: IconName, count?: 'open' | 'week') => (
    <Link key={href} className="side-link" href={href} aria-current={pathname === href ? 'page' : undefined} onClick={onClose}>
      <Icon name={icon} />{label}
      {count === 'open' ? <span className="side-count" aria-label={`${open_} open`}>{open_}</span> : null}
      {count === 'week' ? <span className="side-count" aria-label={`${wk} due this week`}>{wk}</span> : null}
    </Link>
  );
  return (
    <aside ref={ref} id="sidebar" className={`sidebar on-ink${open ? ' is-open' : ''}`} aria-label="Portal navigation">
      <div className="sidebar-top">
        <Link className="brand" href="/portal" aria-label="Portal overview" onClick={onClose}>
          <Logo /><span className="brand-word"><b>Hyacinth</b><span>Client portal</span></span>
        </Link>
        <button className="icon-btn close-side" type="button" aria-label="Close navigation" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="firm-chip" id="firm-chip"><b>{F.name}</b><span>{sinceText}</span></div>
      <nav className="side-nav" aria-label="Portal">
        <p className="side-label">Workspace</p>
        {NAV.map(n => link(n.href, n.label, n.icon, n.count))}
        <p className="side-label">Account</p>
        {NAV_ACCOUNT.map(n => link(n.href, n.label, n.icon))}
        <Link className="side-link" href="/"><Icon name="home" />Back to website</Link>
      </nav>
      {lead ? (
        <div className="lead-card" id="portal-lead">
          <span className="person"><Avatar name={lead.name} /><span><b>{lead.name}</b><span className="small">Your engagement lead</span></span></span>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => { onClose(); openMessage(F.lead); }}><Icon name="message" size={18} />Message {lead.name.split(' ')[0]}</button>
        </div>
      ) : null}
    </aside>
  );
}

/* ---------------- admin view-as banner ---------------- */
function ViewAsBanner() {
  const router = useRouter();
  const s = useApp();
  const F = pFirm(s);
  const pick = (id: string) => {
    if (!id || id === s.portalFirm) return;
    const name = s.firms.find(f => f.id === id)?.name || 'this firm';
    useApp.getState().viewAsClient(id);
    usePortalUi.getState().setWf({ ...emptyFilters, area: [] });
    resetReports(0);
    router.push('/portal');
    toast(`Previewing the portal as ${name}.`, { icon: 'eye' });
  };
  const exit = () => {
    const signedIn = useApp.getState().admin.signedIn;
    useApp.getState().exitViewAs();
    resetReports(0);
    if (signedIn) router.push('/admin/clients');
  };
  return (
    <div className="viewas" id="viewas">
      <div className="wrap">
        <span><Icon name="eye" size={16} /> <b>Admin preview.</b> You are viewing the client portal as {F.name}. Changes here update the shared demo data.</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="sr-only" id="va-firm-l">Preview firm</span>
          <span style={{ minWidth: 220 }}>
            <Combobox id="va-firm" size="sm" labelId="va-firm-l" title="Preview firm" value={F.id} options={firmOptions(s)} onChange={pick} />
          </span>
          <button className="btn btn-dark btn-sm" type="button" onClick={exit}>Exit preview</button>
        </span>
      </div>
    </div>
  );
}

/* ---------------- signed out ---------------- */
function SignedOut() {
  const firm = useApp(s => pFirm(s).name);
  const [busy, run] = useBusy();
  useEffect(() => {
    const prev = document.title;
    document.title = 'Signed out · Hyacinth client portal';
    requestAnimationFrame(() => document.getElementById('so-title')?.focus());
    return () => { document.title = prev; };
  }, []);
  const signIn = () => run(() => {
    useApp.getState().portalSignIn();
    focusSoon('#view-title');
    toast(`Signed in as ${useApp.getState().profile.name}.`);
  }, reduced() ? 250 : 600);
  return (
    <main id="main" tabIndex={-1} className="signed-out on-ink">
      <div className="box">
        <Logo />
        <div className="sigbar" role="presentation" />
        <h1 className="ph1" id="so-title" tabIndex={-1}>You’re signed out.</h1>
        <p>Your {firm} portal session has ended. Sign back in to see your workflows, deadlines and reports.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" type="button" onClick={signIn} aria-busy={busy || undefined} disabled={busy}>Sign back in</button>
          <Link className="btn btn-ghost" href="/">Go to the website</Link>
        </div>
      </div>
    </main>
  );
}
