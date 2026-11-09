"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

/* Stroke icons for the nav; shown alone when the rail is collapsed. */
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
      className="shrink-0 opacity-90"
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

const STORAGE_KEY = "blackford.nav.collapsed";

/*
 * Every page renders its own <StaffShell>, so the shell remounts on each
 * navigation. Caching the choice at module level lets the next page start at
 * the right width instead of rendering expanded and sliding shut.
 */
let collapsedCache: boolean | null = null;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function readSavedCollapsed(): boolean {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved != null) return saved === "1";
  } catch {
    /* storage unavailable */
  }
  return window.innerWidth < 1200;
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => collapsedCache ?? false);
  // Width transitions stay off until the saved state is applied, so a page
  // load never animates; they turn on for the person's own clicks.
  const [animate, setAnimate] = useState(false);
  // Bumped on every click to replay the ring pulse on the toggle.
  const [pulse, setPulse] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (collapsedCache == null) {
      collapsedCache = readSavedCollapsed();
      setCollapsed(collapsedCache);
    }
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function toggle() {
    const next = !collapsed;
    collapsedCache = next;
    setCollapsed(next);
    setPulse((n) => n + 1);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  }

  /** Text that only shows while the rail is expanded. */
  const hideWhenCollapsed = collapsed
    ? "sr-only"
    : pulse > 0
      ? "animate-[nav-label-in_240ms_ease-out_60ms_both]"
      : "";

  return (
    <div className="flex min-h-screen bg-ivory text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <div
        className={`sticky top-0 z-20 h-screen shrink-0 ${
          animate ? "transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" : ""
        } ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <nav
          id="main-nav"
          aria-label="Main"
          className={`flex h-full flex-col overflow-y-auto overflow-x-hidden bg-ink pt-7 ${
            collapsed ? "gap-6 px-2" : "gap-7 px-4"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-2.5 no-underline ${collapsed ? "justify-center px-0" : "px-2"}`}
          >
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-ruby font-serif text-base text-white">
              B
            </div>
            <div className={`flex flex-col ${hideWhenCollapsed}`}>
              <span className="whitespace-nowrap font-serif text-[17px] leading-tight text-ivory">
                Blackford
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-pale-gold">
                CRM
              </span>
            </div>
          </Link>

          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 rounded-lg border-l-[3px] py-2.5 no-underline transition-colors ${
                    collapsed ? "min-h-[52px] justify-center px-0" : "min-h-11 px-3"
                  } ${
                    active
                      ? "border-gold bg-ink-raised font-semibold text-pale-gold hover:text-pale-gold"
                      : "border-transparent text-ivory/85 hover:bg-ink-raised hover:text-pale-gold"
                  }`}
                >
                  <Icon>{item.icon}</Icon>
                  <span className={`flex-1 whitespace-nowrap text-[15px] leading-snug ${hideWhenCollapsed}`}>
                    {item.label}
                  </span>
                  {item.badge != null ? (
                    <span
                      className={`badge-count ${
                        collapsed ? "absolute right-1 top-1 px-1.5 py-0 text-[10px]" : ""
                      }`}
                    >
                      <span className="sr-only">, </span>
                      {item.badge}
                      <span className="sr-only"> new</span>
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className={`mt-auto flex flex-col gap-3 border-t border-ink-soft pt-4 ${collapsed ? "px-0" : "px-2"}`}>
            <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
              <span className="avatar avatar-sm bg-parchment text-ink" title={collapsed ? "Dana Whitfield" : undefined}>
                DW
              </span>
              <div className={`flex min-w-0 flex-col ${hideWhenCollapsed}`}>
                <span className="truncate text-[14px] font-semibold text-ivory">
                  Dana Whitfield
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.08em] text-pale-gold">
                  Account manager
                </span>
              </div>
            </div>
            <Link
              href="/login"
              className={`text-gray no-underline hover:text-ivory ${
                collapsed ? "text-center text-[11px]" : "text-[13px]"
              }`}
            >
              Sign out
            </Link>
          </div>
          <div className={`signature-bar shrink-0 ${collapsed ? "-mx-2" : "-mx-4"}`} aria-hidden>
            <span />
            <span />
          </div>
        </nav>

        <button
          type="button"
          onClick={toggle}
          aria-controls="main-nav"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="group absolute -right-3.5 top-9 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-[var(--shadow-raised)] transition-[scale,background-color,border-color] duration-200 ease-out hover:scale-110 hover:border-gold hover:bg-parchment active:scale-90"
        >
          {pulse > 0 ? (
            <span
              key={pulse}
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-full border-2 border-gold animate-[nav-toggle-ping_550ms_ease-out_forwards]"
            />
          ) : null}
          <svg
            aria-hidden
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-[rotate,translate] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              collapsed
                ? "rotate-180 group-hover:translate-x-0.5"
                : "rotate-0 group-hover:-translate-x-0.5"
            }`}
          >
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      </div>

      <main
        id="main"
        className={`flex min-w-0 flex-1 flex-col py-8 pb-16 ${animate ? "transition-[padding] duration-300" : ""} ${
          collapsed ? "px-6 lg:px-10" : "px-8"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-7">{children}</div>
      </main>
    </div>
  );
}
