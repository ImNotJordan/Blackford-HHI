'use client';
/* Admin chrome: sign-in gate, sidebar (ADMIN flag, nav, new-lead pill), topbar (crumb, role switcher, staff menu), thin signature bar. */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { Icon, Logo, type IconName } from '@/components/icons';
import { ActionMenu, Avatar, Select, confirmDialog, toast } from '@/components/ui';
import { ROLES, ROLE_DESC } from '@/lib/data';
import { initials } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { Role } from '@/lib/types';

interface NavItem { seg: string; href: string; label: string; icon: IconName }
const NAV: [string, NavItem[]][] = [
  ['Operations', [
    { seg: '', href: '/admin', label: 'Dashboard', icon: 'grid' },
    { seg: 'clients', href: '/admin/clients', label: 'Client firms', icon: 'briefcase' },
    { seg: 'workflows', href: '/admin/workflows', label: 'Workflows', icon: 'workflow' },
    { seg: 'team', href: '/admin/team', label: 'Team & capacity', icon: 'users' },
    { seg: 'leads', href: '/admin/leads', label: 'Leads', icon: 'inbox' }
  ]],
  ['Website', [{ seg: 'content', href: '/admin/content', label: 'Website content', icon: 'file' }]],
  ['Governance', [
    { seg: 'users', href: '/admin/users', label: 'Users & roles', icon: 'shield' },
    { seg: 'audit', href: '/admin/audit', label: 'Audit log', icon: 'list' },
    { seg: 'settings', href: '/admin/settings', label: 'Settings', icon: 'sliders' },
    { seg: 'design-system', href: '/admin/design-system', label: 'Design system', icon: 'layers' }
  ]]
];
const ALL_NAV = NAV.flatMap(([, items]) => items);
const ROLE_OPTS = ROLES.map(r => ({ value: r, label: r, sub: ROLE_DESC[r], icon: 'shield' as IconName }));

export const SIGN_IN = '/admin/sign-in';
const segOf = (path: string) => path.replace(/^\/admin\/?/, '').split('/')[0] || '';

/** Wraps every /admin route: sends signed-out visitors to the sign-in screen, otherwise renders the admin chrome. */
export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/admin';
  const router = useRouter();
  const signedIn = useApp(s => s.admin.signedIn);
  const onSignIn = pathname === SIGN_IN || pathname.startsWith(`${SIGN_IN}/`);

  useEffect(() => {
    if (signedIn || onSignIn) return;
    const next = `${pathname}${window.location.search}`;
    router.replace(`${SIGN_IN}?next=${encodeURIComponent(next)}`);
  }, [signedIn, onSignIn, pathname, router]);

  if (onSignIn) return <>{children}</>;
  if (!signedIn) return null;
  return <AdminShell pathname={pathname}>{children}</AdminShell>;
}

function AdminShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const router = useRouter();
  const admin = useApp(s => s.admin);
  const newLeads = useApp(s => s.leads.filter(l => l.status === 'New').length);
  const [navOpen, setNavOpen] = useState(false);
  const sideRef = useRef<HTMLElement>(null);
  const seg = segOf(pathname);
  const crumb = ALL_NAV.find(n => n.seg === seg)?.label || 'Dashboard';
  const name = admin.name || 'Hyacinth staff';

  /* Focus the view heading on route change (not on first load). */
  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const t = document.getElementById('view-title');
      if (t) t.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  /* Off-canvas sidebar (≤900px): focus the close button on open, Escape closes, Tab stays inside. */
  useEffect(() => {
    if (!navOpen) return;
    const el = sideRef.current;
    el?.querySelector<HTMLElement>('.close-side')?.focus();
  }, [navOpen]);
  const closeNav = (restore = true) => {
    setNavOpen(false);
    if (restore) requestAnimationFrame(() => document.getElementById('admin-side-toggle')?.focus());
  };
  const onSideKey = (e: KeyboardEvent<HTMLElement>) => {
    if (!navOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeNav(); return; }
    if (e.key !== 'Tab') return;
    const f = [...(sideRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') || [])].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const onNavClick = (e: MouseEvent<HTMLElement>) => { if ((e.target as HTMLElement).closest('a')) closeNav(false); };

  const switchRole = (v: string) => {
    const r = v as Role;
    if (r === admin.role) return;
    useApp.getState().setRole(r);
    toast(`Viewing as ${r}. ${r === 'Super Admin' ? 'Everything is editable.' : 'Some controls are now read-only.'}`, { icon: 'shield' });
    requestAnimationFrame(() => document.getElementById('role-switch')?.focus());
  };

  const signOut = async () => {
    const ok = await confirmDialog({ title: 'Sign out of admin?', body: 'You will need to sign in again to use the admin area.', confirmLabel: 'Sign out' });
    if (!ok) return;
    useApp.getState().adminSignOut();
    toast('Signed out of admin.', { icon: 'logout' });
  };

  return (
    <div id="admin" className="portal admin">
      <aside id="admin-sidebar" ref={sideRef} className={`sidebar on-ink${navOpen ? ' is-open' : ''}`} aria-label="Admin navigation" onKeyDown={onSideKey}>
        <div className="sidebar-top">
          <Link className="brand" href="/admin" aria-label="Admin dashboard" onClick={() => closeNav(false)}>
            <Logo /><span className="brand-word"><b>Hyacinth</b><span>Admin</span></span>
          </Link>
          <button className="icon-btn close-side" type="button" aria-label="Close navigation" onClick={() => closeNav()}><Icon name="x" /></button>
        </div>
        <span className="admin-flag">Admin · Internal</span>
        <nav className="side-nav" aria-label="Admin" onClick={onNavClick}>
          {NAV.map(([group, items]) => (
            <SideGroup key={group} label={group}>
              {items.map(n => (
                <Link key={n.href} className="side-link" href={n.href} aria-current={seg === n.seg ? 'page' : undefined}>
                  <Icon name={n.icon} />{n.label}
                  {n.seg === 'leads' && newLeads > 0 ? <span className="lead-pill" id="lead-count" aria-label={`${newLeads} new`}>{newLeads}</span> : null}
                </Link>
              ))}
            </SideGroup>
          ))}
          <p className="side-label">Leave admin</p>
          <Link className="side-link" href="/portal"><Icon name="eye" />Client portal</Link>
          <Link className="side-link" href="/"><Icon name="home" />Website</Link>
        </nav>
        <div className="lead-card">
          <span className="person">
            <Avatar name={name} />
            <span><b>{name}</b><span className="small">{admin.role}</span></span>
          </span>
        </div>
      </aside>
      <div className={`sidebar-scrim${navOpen ? ' is-open' : ''}`} hidden={!navOpen} onClick={() => closeNav()} aria-hidden="true" />
      <div className="portal-body">
        <header className="topbar admin-top on-light">
          <div className="wrap topbar-row">
            <button
              className="icon-btn side-toggle" type="button" id="admin-side-toggle" aria-label="Open navigation"
              aria-expanded={navOpen} aria-controls="admin-sidebar" onClick={() => setNavOpen(true)}
            ><Icon name="menu" /></button>
            <p className="crumb-trail"><span className="firm">Hyacinth admin</span><span className="firm" aria-hidden="true">/</span><b id="admin-crumb">{crumb}</b></p>
            <div className="role-switch">
              <span className="label" id="role-l">Viewing as role</span>
              <Select id="role-switch" labelId="role-l" title="Role" value={admin.role} options={ROLE_OPTS} onChange={switchRole} />
            </div>
            <ActionMenu
              id="admin-user-btn" label="Staff account menu" triggerClassName="profile-btn"
              trigger={<><span className="avatar" aria-hidden="true">{initials(name)}</span><Icon name="chevron-down" /></>}
              items={[
                { label: 'Settings', icon: 'sliders', onSelect: () => router.push('/admin/settings') },
                { label: 'Audit log', icon: 'list', onSelect: () => router.push('/admin/audit') },
                { label: 'Open the client portal', icon: 'eye', onSelect: () => router.push('/portal') },
                'separator',
                { label: 'Sign out of admin', icon: 'logout', danger: true, onSelect: () => { void signOut(); } }
              ]}
            />
          </div>
          <div className="sigbar" role="presentation" />
        </header>
        <main id="main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}

function SideGroup({ label, children }: { label: string; children: ReactNode }) {
  return <><p className="side-label">{label}</p>{children}</>;
}
