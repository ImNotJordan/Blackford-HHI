import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark, Initials, cx } from "@/components/ui";
import { CONTACT, EMPLOYER } from "@/lib/demo-data";

/**
 * Staff CRM navigation. Only the Benefits Portal screens exist in this project;
 * other CRM sections are shown for orientation but are not links.
 */
const STAFF_NAV: { label: string; href?: string }[] = [
  { label: "My work today" },
  { label: "Clients and groups" },
  { label: "Inbox" },
  { label: "Onboarding" },
  { label: "Enrollments", href: "/staff/enrollments" },
  { label: "In-person session", href: "/staff/assist" },
  { label: "Changes and renewals" },
  { label: "Carrier files" },
  { label: "Reports" },
  { label: "Automations" },
  { label: "Audit log" },
  { label: "Settings" },
];

export function StaffShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-wrap bg-canvas text-sm">
      <nav
        aria-label="Main"
        className="flex max-w-full flex-[1_1_232px] flex-col gap-6 bg-navy px-4 py-6 text-on-navy lg:max-w-[260px]"
      >
        <Link href="/" className="flex items-center gap-2.5 px-2 no-underline">
          <BrandMark size={34} tone="teal" />
          <span className="flex flex-col">
            <span className="font-display text-base font-extrabold text-white">Blackford</span>
            <span className="text-xs text-on-navy-subtle">Benefits Platform</span>
          </span>
        </Link>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {STAFF_NAV.map((item) =>
            item.href ? (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={item.href === current ? "page" : undefined}
                  className={cx(
                    "flex min-h-11 items-center rounded-lg px-3 py-2.5 no-underline",
                    item.href === current
                      ? "bg-navy-active font-semibold text-white hover:text-white"
                      : "text-on-navy hover:bg-navy-active hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label}>
                <span className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-on-navy-subtle" title="Not part of the Benefits Portal build">
                  {item.label}
                </span>
              </li>
            ),
          )}
        </ul>
        <div className="mt-auto flex items-center gap-2.5 border-t border-navy-line px-2 pt-3">
          <Initials text="DW" />
          <span className="flex flex-col">
            <span className="text-[13px] font-semibold text-white">{CONTACT.name}</span>
            <span className="text-xs text-on-navy-subtle">{CONTACT.role}</span>
          </span>
        </div>
      </nav>
      <main id="main" className="flex min-w-0 flex-[999_1_560px] flex-col gap-5 px-5 pt-7 pb-12 sm:px-8">
        {children}
      </main>
    </div>
  );
}

const EMPLOYER_NAV: { label: string; href?: string }[] = [
  { label: "Enrollment", href: "/employer/progress" },
  { label: "Employees" },
  { label: "Census" },
  { label: "Plans" },
  { label: "Payroll", href: "/employer/payroll" },
  { label: "Company" },
];

export function EmployerShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-sm">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 text-ink no-underline hover:text-ink">
            <BrandMark size={32} />
            <span className="flex flex-col">
              <span className="font-display text-[15px] font-extrabold">Blackford &amp; Associates</span>
              <span className="text-xs text-muted">Employer portal</span>
            </span>
          </Link>
          <nav aria-label="Employer">
            <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
              {EMPLOYER_NAV.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={item.href === current ? "page" : undefined}
                      className={cx(
                        "flex min-h-11 items-center rounded-lg px-3.5 no-underline",
                        item.href === current
                          ? "bg-brand-tint font-semibold text-brand-hover hover:text-brand-hover"
                          : "text-ink-2 hover:bg-canvas hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="flex min-h-11 items-center px-3.5 text-muted" title="Not part of the Benefits Portal build">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-muted">{EMPLOYER.hrName}</span>
            <Initials text={EMPLOYER.hrInitials} tone="info" />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto box-border flex w-full max-w-[1200px] flex-col gap-6 px-6 pt-8 pb-14">
        {children}
      </main>
    </div>
  );
}
