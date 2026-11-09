import Link from "next/link";

/** Brand-only top bar for signed-out screens (invite and sign-in). */
export function PortalHeader() {
  return (
    <header className="border-b border-[var(--brand-hairline)] bg-[var(--brand-surface)]">
      <div className="mx-auto flex max-w-[1200px] items-center px-6 py-3.5">
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
      </div>
      <div className="signature-bar" aria-hidden>
        <span />
        <span />
      </div>
    </header>
  );
}
