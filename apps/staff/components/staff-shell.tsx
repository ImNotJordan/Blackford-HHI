"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS: {
  label: string;
  href: string;
  badge?: number;
  match?: (pathname: string) => boolean;
}[] = [
  {
    label: "My work today",
    href: "/work",
    match: (p) => p === "/work" || p === "/work/",
  },
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
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-wrap bg-[var(--brand-ivory)] text-[var(--brand-ink)]">
      <nav
        aria-label="Main"
        className="relative flex min-h-screen w-[260px] shrink-0 flex-col gap-8 bg-[var(--brand-ink)] px-4 py-7"
      >
        <Link href="/" className="flex items-center gap-2.5 px-2 no-underline">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[var(--brand-ruby)] text-base text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            B
          </div>
          <div className="flex flex-col">
            <span
              className="text-base leading-tight text-[var(--brand-ivory)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blackford
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--brand-pale-gold)]">
              CRM
            </span>
          </div>
        </Link>

        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between rounded-[10px] border-l-[3px] px-3 py-2.5 no-underline transition-colors ${
                  active
                    ? "border-[var(--brand-gold)] bg-[#2A241C] font-semibold text-[var(--brand-pale-gold)]"
                    : "border-transparent text-[var(--brand-ivory)] hover:bg-[#2A241C] hover:text-[var(--brand-pale-gold)]"
                }`}
              >
                <span className="text-[15px] leading-snug">{item.label}</span>
                {item.badge != null ? (
                  <span className="badge-count">{item.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex items-center gap-2.5 border-t border-[#3A352C] px-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-parchment)] text-sm font-semibold text-[var(--brand-ink)]">
            DW
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-semibold text-[var(--brand-ivory)]">
              Dana Whitfield
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--brand-pale-gold)]">
              Account manager
            </span>
          </div>
        </div>
        <div className="signature-bar -mx-4 mt-4" aria-hidden>
          <span />
          <span />
        </div>
      </nav>

      <main className="flex min-w-0 flex-[999] flex-col gap-6 px-8 py-8 pb-14">
        {children}
      </main>
    </div>
  );
}
