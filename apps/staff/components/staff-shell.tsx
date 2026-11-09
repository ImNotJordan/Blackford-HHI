"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* Stroke icons for the iPad icon rail (nav collapses below 1200px). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="hidden shrink-0 max-[1199px]:block"
    >
      {children}
    </svg>
  );
}

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  match?: (pathname: string) => boolean;
}[] = [
  {
    label: "My work today",
    href: "/work",
    icon: <path d="M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13" />,
    match: (p) => p === "/work" || p === "/work/",
  },
  {
    label: "Clients and pipeline",
    href: "/clients",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    match: (p) =>
      p.startsWith("/clients") ||
      p.startsWith("/groups") ||
      p.startsWith("/households") ||
      p.startsWith("/documents") ||
      p === "/import",
  },
  {
    label: "Shared inbox",
    href: "/inbox",
    badge: 5,
    icon: (
      <>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    match: (p) => p.startsWith("/inbox"),
  },
  {
    label: "Bulk send",
    href: "/bulk-send",
    icon: (
      <>
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </>
    ),
  },
  {
    label: "Message templates",
    href: "/templates",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8" />
      </>
    ),
  },
  {
    label: "Onboarding",
    href: "/onboarding",
    icon: (
      <>
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    label: "Enrollments",
    href: "/enrollments",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="m16 11 2 2 4-4" />
      </>
    ),
  },
  {
    label: "Changes and renewals",
    href: "/changes",
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </>
    ),
    match: (p) => p.startsWith("/changes") || p.startsWith("/renewals"),
  },
  {
    label: "Carrier files",
    href: "/carrier-files",
    badge: 2,
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" />
      </>
    ),
  },
  {
    label: "Exceptions",
    href: "/exceptions",
    icon: (
      <>
        <path d="M12 3 2 20h20L12 3z" />
        <path d="M12 10v4M12 17h.01" />
      </>
    ),
  },
];

function isNavActive(pathname: string, item: (typeof NAV_ITEMS)[number]) {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--brand-ivory)] text-[var(--brand-ink)]">
      <nav
        aria-label="Main"
        className="relative flex min-h-screen w-[260px] shrink-0 flex-col gap-8 bg-[var(--brand-ink)] px-4 py-7 max-[1199px]:w-[76px] max-[1199px]:gap-6 max-[1199px]:px-2"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 no-underline max-[1199px]:justify-center max-[1199px]:px-0"
        >
          <div
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[var(--brand-ruby)] text-base text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            B
          </div>
          <div className="flex flex-col max-[1199px]:sr-only">
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
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center justify-between rounded-[10px] border-l-[3px] px-3 py-2.5 no-underline transition-colors max-[1199px]:min-h-[52px] max-[1199px]:justify-center max-[1199px]:px-0 ${
                  active
                    ? "border-[var(--brand-gold)] bg-[#2A241C] font-semibold text-[var(--brand-pale-gold)]"
                    : "border-transparent text-[var(--brand-ivory)] hover:bg-[#2A241C] hover:text-[var(--brand-pale-gold)]"
                }`}
              >
                <Icon>{item.icon}</Icon>
                <span className="text-[15px] leading-snug max-[1199px]:sr-only">
                  {item.label}
                </span>
                {item.badge != null ? (
                  <span className="badge-count max-[1199px]:absolute max-[1199px]:right-1 max-[1199px]:top-1 max-[1199px]:px-1.5 max-[1199px]:py-0 max-[1199px]:text-[10px]">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex items-center gap-2.5 border-t border-[#3A352C] px-2 pt-4 max-[1199px]:justify-center max-[1199px]:px-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-parchment)] text-sm font-semibold text-[var(--brand-ink)]">
            DW
          </div>
          <div className="flex min-w-0 flex-col max-[1199px]:sr-only">
            <span className="truncate text-[14px] font-semibold text-[var(--brand-ivory)]">
              Dana Whitfield
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--brand-pale-gold)]">
              Account manager
            </span>
          </div>
        </div>
        <Link
          href="/login"
          className="px-2 text-[13px] text-[var(--brand-pale-gold)] hover:text-[var(--brand-ivory)] max-[1199px]:px-0 max-[1199px]:text-center max-[1199px]:text-[11px]"
        >
          Sign out
        </Link>
        <div className="signature-bar -mx-4 max-[1199px]:-mx-2" aria-hidden>
          <span />
          <span />
        </div>
      </nav>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-8 py-8 pb-14 max-[1199px]:px-6">
        {children}
      </main>
    </div>
  );
}
