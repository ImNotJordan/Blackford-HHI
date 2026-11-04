"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** CRM and onboarding MVP — modules A, B, C, staff side of F */
const NAV_ITEMS: {
  label: string;
  href: string;
  badge?: number;
  match?: (pathname: string) => boolean;
}[] = [
  { label: "My work today", href: "/" },
  {
    label: "Clients and pipeline",
    href: "/clients",
    match: (p) =>
      p.startsWith("/clients") ||
      p.startsWith("/groups") ||
      p.startsWith("/households") ||
      p === "/import",
  },
  {
    label: "Shared inbox",
    href: "/inbox",
    badge: 5,
    match: (p) => p.startsWith("/inbox"),
  },
  { label: "Bulk send", href: "/bulk-send" },
  { label: "Message templates", href: "/templates" },
  { label: "Onboarding", href: "/onboarding" },
  {
    label: "Changes and renewals",
    href: "/changes",
    match: (p) => p.startsWith("/changes") || p.startsWith("/renewals"),
  },
];

function isNavActive(pathname: string, item: (typeof NAV_ITEMS)[number]) {
  if (item.match) return item.match(pathname);
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-wrap bg-[var(--color-bg)] text-[var(--color-text)]">
      <nav
        aria-label="Main"
        className="flex min-h-screen w-full max-w-[232px] flex-1 flex-col gap-6 bg-[var(--color-navy)] px-4 py-6 text-[var(--color-nav-text)]"
      >
        <div className="flex items-center gap-2.5 px-2">
          <div className="heading flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[var(--color-teal)] text-base font-extrabold text-white">
            B
          </div>
          <div className="flex flex-col">
            <span className="heading text-base font-extrabold text-white">
              Blackford
            </span>
            <span className="text-xs text-[#A9BBCD]">CRM and onboarding</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 no-underline ${
                  active
                    ? "bg-[var(--color-navy-muted)] font-semibold text-white"
                    : "text-[var(--color-nav-text)] hover:bg-[var(--color-navy-muted)]/50"
                }`}
              >
                <span>{item.label}</span>
                {item.badge != null ? (
                  <span className="badge-amber">{item.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex items-center gap-2.5 border-t border-[#2E5378] px-2 pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F2F1] text-sm font-bold text-[var(--color-teal)]">
            DW
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-white">
              Dana Whitfield
            </span>
            <span className="text-xs text-[#A9BBCD]">Account manager</span>
          </div>
        </div>
      </nav>

      <main className="flex min-w-0 flex-[999] flex-col gap-6 px-8 py-7 pb-12">
        {children}
      </main>
    </div>
  );
}
