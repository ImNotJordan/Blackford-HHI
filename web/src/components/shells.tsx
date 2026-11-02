"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut, Menu, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { roleNav, roleRoots, type NavItem } from "@/lib/nav";
import { roleUsers, type RoleId } from "@/lib/roles";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-ivory"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M12 3c-2.2 3.4-5.5 5.4-5.5 9.2A5.5 5.5 0 0 0 12 17.7a5.5 5.5 0 0 0 5.5-5.5C17.5 8.4 14.2 6.4 12 3Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M12 8.5c-1.1 1.7-2.6 2.7-2.6 4.5a2.6 2.6 0 1 0 5.2 0c0-1.8-1.5-2.8-2.6-4.5Z"
            fill="#A8820F"
          />
        </svg>
      </span>
      <span className="text-ink">
        <span className="block font-display text-lg leading-none">Blackford</span>
        <span className="label-mono !tracking-[0.16em] !text-[10px] !text-muted">
          Benefits platform
        </span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  root,
  onClick,
}: NavItem & { root: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active =
    href === root
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex min-h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px] no-underline transition-[background-color,color] duration-150 xl:min-h-10 xl:text-[14px] ${
        active
          ? "bg-ivory font-medium text-ink"
          : "text-muted hover:bg-ivory hover:text-ink"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {active ? (
        <span
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-ruby"
          aria-hidden
        />
      ) : null}
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

function groupNav(items: NavItem[]) {
  const groups: { title?: string; items: NavItem[] }[] = [];
  let current: { title?: string; items: NavItem[] } = { items: [] };
  for (const item of items) {
    if (item.section) {
      if (current.items.length) groups.push(current);
      current = { title: item.section, items: [item] };
    } else {
      current.items.push(item);
    }
  }
  if (current.items.length) groups.push(current);
  return groups;
}

export function AppShell({
  role,
  children,
  searchHref,
  banner,
}: {
  role: RoleId;
  children: ReactNode;
  searchHref?: string;
  banner?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { root, signIn } = roleRoots[role];
  const user = roleUsers[role];
  const nav = roleNav[role];
  const groups = useMemo(() => groupNav(nav), [nav]);

  if (pathname?.startsWith(signIn)) {
    return (
      <div className="animate-page mx-auto min-h-screen max-w-md px-4 py-10">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[10px] focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen min-w-0">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[min(16rem,85vw)] flex-col border-r border-hairline bg-surface transition-transform duration-300 ease-out lg:static lg:w-56 lg:translate-x-0 xl:w-60 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-hairline px-4 py-4">
            <BrandMark />
            <button
              type="button"
              className="ui-press rounded-[10px] p-2 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="nav-enter flex-1 space-y-4 overflow-y-auto p-3"
            aria-label={`${user.role} navigation`}
          >
            {groups.map((group) => (
              <div key={group.title ?? group.items[0]?.href}>
                {group.title ? (
                  <p className="label-mono mb-1.5 px-3 !text-[10px]">
                    {group.title}
                  </p>
                ) : null}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      {...item}
                      root={root}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-hairline p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-parchment font-mono text-xs text-ink">
                {user.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted">{user.role}</p>
              </div>
            </div>
            <Link
              href={signIn}
              className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted no-underline hover:text-ink"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </Link>
            <Link
              href="/"
              className="mt-1 flex min-h-9 items-center text-xs text-muted no-underline hover:text-ink"
            >
              Switch role
            </Link>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="sticky top-0 z-20 flex min-h-12 items-center gap-2 border-b border-hairline bg-surface/95 px-3 backdrop-blur-sm sm:gap-3 sm:px-4 lg:px-5">
            <button
              type="button"
              className="ui-press shrink-0 rounded-[10px] p-2 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            {searchHref ? (
              <Link
                href={searchHref}
                className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-hairline bg-ivory px-3 text-sm text-muted no-underline transition-colors hover:border-gold-deep/40"
              >
                <Search className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">Search…</span>
              </Link>
            ) : (
              <div className="min-w-0 flex-1 truncate text-sm text-muted">
                {user.role} workspace
              </div>
            )}
            <span className="hidden max-w-[10rem] items-center gap-2 truncate rounded-full border border-hairline bg-ivory px-2.5 py-1 text-xs text-ink sm:inline-flex">
              <span
                className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-gold"
                aria-hidden
              />
              <span className="truncate">{user.role}</span>
            </span>
          </header>
          {banner}
          <main
            id="main"
            className={`panel-fit animate-page flex-1 px-3 py-4 sm:px-4 sm:py-5 lg:px-5 ${
              role === "employee" || role === "client"
                ? "mx-auto w-full max-w-3xl"
                : "w-full max-w-[1200px]"
            }`}
          >
            {children}
          </main>
          <footer className="mt-auto">
            <div className="signature-bar" />
          </footer>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return <AppShell role="admin">{children}</AppShell>;
}

export function ManagerShell({ children }: { children: ReactNode }) {
  return (
    <AppShell role="manager" searchHref="/manager/search">
      {children}
    </AppShell>
  );
}

export function EmployerShell({ children }: { children: ReactNode }) {
  return <AppShell role="employer">{children}</AppShell>;
}

export function ClientShell({ children }: { children: ReactNode }) {
  return <AppShell role="client">{children}</AppShell>;
}

/** Employee keeps progress banner when step provided */
export function EmployeeShell({
  children,
  step,
}: {
  children: ReactNode;
  step?: number;
}) {
  const banner =
    typeof step === "number" ? (
      <div className="border-b border-hairline bg-surface px-3 py-2.5 sm:px-4 lg:px-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1.5 flex justify-between gap-2 text-xs text-muted">
            <span className="min-w-0 truncate">
              Enrollment step {step} of 7
            </span>
            <span className="shrink-0 tabular-nums">
              {Math.round((step / 7) * 100)}% complete
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-hairline"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={7}
            aria-label="Enrollment progress"
          >
            <div
              className="progress-fill h-full rounded-full bg-ink"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>
    ) : null;

  return (
    <AppShell role="employee" banner={banner}>
      {children}
    </AppShell>
  );
}

/** @deprecated */
export function StaffShell({ children }: { children: ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}
