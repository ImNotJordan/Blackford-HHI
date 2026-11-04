import Link from "next/link";

export type EmployerNavKey = "company" | "plans" | "census" | "employees";

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
    <header className="border-b border-[var(--brand-hairline)] bg-[var(--brand-surface)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline text-inherit"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-ink)] text-base text-[var(--brand-ivory)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            B
          </div>
          <div className="flex flex-col">
            <span
              className="text-[16px] leading-tight text-[var(--brand-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blackford &amp; Associates
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--brand-gold-deep)]">
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
                  className={`flex min-h-11 items-center rounded-[10px] px-3.5 no-underline text-[14px] ${
                    isCurrent
                      ? "bg-[var(--brand-parchment)] font-semibold text-[var(--brand-ink)] border border-[var(--brand-gold)]"
                      : "text-[var(--brand-ink)] hover:bg-[var(--brand-ivory)]"
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
            <span className="text-[13px] text-[var(--brand-gray)]">{userName}</span>
            {userInitials ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-parchment)] text-[13px] font-semibold text-[var(--brand-ink)]">
                {userInitials}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="signature-bar" aria-hidden>
        <span />
        <span />
      </div>
    </header>
  );
}
