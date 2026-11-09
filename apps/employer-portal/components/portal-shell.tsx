"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Avatar, SignatureBar } from "@/components/ui";
import {
  BanknoteIcon,
  BuildingIcon,
  ChartIcon,
  ChevronLeftIcon,
  DocumentCheckIcon,
  SignOutIcon,
  UploadIcon,
  UsersIcon,
} from "@/components/icons";

export type EmployerNavKey =
  | "company"
  | "plans"
  | "census"
  | "employees"
  | "progress"
  | "payroll";

const STORAGE_KEY = "blackford.sidebar";

const NAV_GROUPS: {
  label: string;
  items: { key: EmployerNavKey; label: string; href: string; icon: ReactNode; step?: number }[];
}[] = [
  {
    label: "Onboarding",
    items: [
      { key: "company", label: "Company and payroll", href: "/employer/company", icon: <BuildingIcon />, step: 1 },
      { key: "plans", label: "Plans and agreement", href: "/employer/setup", icon: <DocumentCheckIcon />, step: 2 },
      { key: "census", label: "Census upload", href: "/employer/census", icon: <UploadIcon />, step: 3 },
      { key: "employees", label: "Employees", href: "/employer/employees", icon: <UsersIcon />, step: 4 },
    ],
  },
  {
    label: "Enrollment",
    items: [
      { key: "progress", label: "Enrollment progress", href: "/employer/progress", icon: <ChartIcon /> },
      { key: "payroll", label: "Payroll updates", href: "/employer/payroll", icon: <BanknoteIcon /> },
    ],
  },
];

export function PortalShell({
  activeNav,
  userName,
  userInitials,
  children,
}: {
  activeNav: EmployerNavKey;
  userName: string;
  userInitials: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  // Bumped on every click; remounting the ripple via `key` replays its animation.
  const [pulse, setPulse] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Restore the saved choice once, then enable the width transition.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "collapsed") setCollapsed(true);
    } catch {
      /* storage unavailable: stay open */
    }
    // On narrow screens the nav is a horizontal strip: bring the current page into view.
    if (window.matchMedia("(max-width: 900px)").matches) {
      document
        .querySelector<HTMLElement>('.nav-groups .nav-link[aria-current="page"]')
        ?.scrollIntoView({ inline: "center", block: "nearest" });
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function toggle() {
    setPulse((n) => n + 1);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      // Squash-and-stretch press, springing back past rest before settling.
      toggleRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(0.8)", offset: 0.3 },
          { transform: "scale(1.14)", offset: 0.65 },
          { transform: "scale(1)" },
        ],
        { duration: 420, easing: "ease-out" },
      );
    }
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "collapsed" : "open");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div
      className="shell"
      data-sidebar={collapsed ? "collapsed" : "open"}
      data-ready={ready ? "" : undefined}
      data-animated={pulse > 0 ? "" : undefined}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <aside id="sidebar" className="shell-nav">
        <button
          ref={toggleRef}
          type="button"
          className="sidebar-toggle"
          onClick={toggle}
          aria-controls="sidebar"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {pulse > 0 ? <span key={pulse} className="toggle-ripple" aria-hidden /> : null}
          <ChevronLeftIcon className="toggle-chevron" />
        </button>

        <div className="shell-nav-inner">
          <div className="shell-top">
            <Link href="/" className="brand-lockup" title="Blackford employer portal">
              <span className="brand-mark" aria-hidden>
                B
              </span>
              <span className="brand-text flex min-w-0 flex-col">
                <span className="brand-name">Blackford</span>
                <span className="brand-sub">Employer portal</span>
              </span>
            </Link>
            <div className="only-mobile items-center gap-3">
              <Link href="/employer/invite" className="shell-signout">
                <SignOutIcon />
                Sign out
              </Link>
              <span title={userName}>
                <Avatar initials={userInitials} />
              </span>
            </div>
          </div>

          <nav aria-label="Employer" className="nav-groups">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} className="nav-group">
                <span className="nav-group-label">{group.label}</span>
                {group.items.map((item, i) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={item.key === activeNav ? "page" : undefined}
                    className="nav-link"
                    style={{ "--i": gi * 4 + i } as CSSProperties}
                  >
                    <span className="nav-icon">
                      {item.icon}
                      {item.step ? (
                        <span className="nav-step" aria-hidden>
                          {item.step}
                        </span>
                      ) : null}
                    </span>
                    <span className="nav-text">
                      {item.step ? <span className="sr-only">Step {item.step}: </span> : null}
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="shell-user only-desktop">
            <div className="shell-user-row">
              <Avatar initials={userInitials} />
              <div className="nav-text flex min-w-0 flex-col">
                <span className="shell-user-name">{userName}</span>
                <span className="shell-user-role">Employer HR</span>
              </div>
            </div>
            <Link href="/employer/invite" className="shell-signout">
              <SignOutIcon />
              <span className="nav-text">Sign out</span>
            </Link>
          </div>
        </div>
        <SignatureBar />
      </aside>

      <div className="shell-main">
        <main id="main" className="page rise">
          {children}
        </main>
      </div>
    </div>
  );
}
