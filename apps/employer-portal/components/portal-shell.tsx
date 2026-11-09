import Link from "next/link";
import type { ReactNode } from "react";

export type EmployerNavKey =
  | "company"
  | "plans"
  | "census"
  | "employees"
  | "progress"
  | "payroll";

const NAV_GROUPS: {
  label: string;
  items: { key: EmployerNavKey; label: string; href: string }[];
}[] = [
  {
    label: "Onboarding",
    items: [
      { key: "company", label: "Company and payroll", href: "/employer/company" },
      { key: "plans", label: "Plans and agreement", href: "/employer/setup" },
      { key: "census", label: "Census upload", href: "/employer/census" },
      { key: "employees", label: "Employees", href: "/employer/employees" },
    ],
  },
  {
    label: "Enrollment",
    items: [
      { key: "progress", label: "Enrollment progress", href: "/employer/progress" },
      { key: "payroll", label: "Payroll updates", href: "/employer/payroll" },
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
  return (
    <div className="flex min-h-screen bg-[var(--brand-ivory)] text-[var(--brand-ink)]">
      <nav
        aria-label="Employer"
        className="relative flex min-h-screen w-[248px] shrink-0 flex-col gap-7 bg-[var(--brand-ink)] px-4 py-7 max-[900px]:w-[200px] max-[640px]:w-[160px] max-[640px]:px-2"
      >
        <Link href="/" className="flex items-center gap-2.5 px-2 no-underline">
          <div
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[var(--brand-ruby)] text-base text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            B
          </div>
          <div className="flex min-w-0 flex-col">
            <span
              className="text-base leading-tight text-[var(--brand-ivory)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blackford
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--brand-pale-gold)]">
              Employer portal
            </span>
          </div>
        </Link>

        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-3 pb-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--brand-pale-gold)]">
              {group.label}
            </span>
            {group.items.map((item) => {
              const active = item.key === activeNav;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-[10px] border-l-[3px] px-3 py-2.5 text-[15px] leading-snug no-underline transition-colors hover:no-underline ${
                    active
                      ? "border-[var(--brand-gold)] bg-[#2A241C] font-semibold text-[var(--brand-pale-gold)]"
                      : "border-transparent text-[var(--brand-ivory)] hover:bg-[#2A241C] hover:text-[var(--brand-pale-gold)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="mt-auto flex items-center gap-2.5 border-t border-[#3A352C] px-2 pt-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-parchment)] text-sm font-semibold text-[var(--brand-ink)]">
            {userInitials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-semibold text-[var(--brand-ivory)]">
              {userName}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--brand-pale-gold)]">
              Employer HR
            </span>
          </div>
        </div>
        <Link
          href="/employer/invite"
          className="px-2 text-[13px] text-[var(--brand-pale-gold)] hover:text-[var(--brand-ivory)]"
        >
          Sign out
        </Link>
        <div className="signature-bar -mx-4 max-[640px]:-mx-2" aria-hidden>
          <span />
          <span />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
