import Link from "next/link";

export type EmployerNavKey =
  | "company"
  | "plans"
  | "census"
  | "employees";

const EMPLOYER_NAV: { key: EmployerNavKey; label: string; href: string }[] = [
  { key: "company", label: "Company", href: "/employer/company" },
  { key: "plans", label: "Plans & agreement", href: "/employer/setup" },
  { key: "census", label: "Census", href: "/employer/census" },
  { key: "employees", label: "Employees", href: "/employer/employees" },
];

type PortalHeaderProps = {
  activeNav?: EmployerNavKey;
  showNav?: boolean;
  userName?: string;
  userInitials?: string;
};

export function PortalHeader({
  activeNav,
  showNav = true,
  userName,
  userInitials,
}: PortalHeaderProps) {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-white)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-inherit">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-navy)] text-base font-extrabold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            B
          </div>
          <div className="flex flex-col">
            <span
              className="text-[15px] font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Blackford &amp; Associates
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Employer portal
            </span>
          </div>
        </Link>

        {showNav ? (
          <nav
            aria-label="Employer"
            className="flex flex-wrap gap-1 max-[640px]:order-3 max-[640px]:w-full"
          >
            {EMPLOYER_NAV.map((item) => {
              const isCurrent = activeNav === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-lg px-3.5 no-underline ${
                    isCurrent
                      ? "bg-[#E6F2F1] font-semibold text-[var(--color-teal-hover)]"
                      : "text-[#3A4756] hover:bg-[#EEF1F5]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {userName ? (
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-[var(--color-text-muted)]">
              {userName}
            </span>
            {userInitials ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0FD] text-[13px] font-bold text-[#1D4ED8]">
                {userInitials}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
