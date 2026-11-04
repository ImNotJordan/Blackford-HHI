import Link from "next/link";

const STEPS = [
  {
    href: "/employer/invite",
    title: "Invite and secure sign-in",
    blurb: "One-time code for the HR contact — no password.",
  },
  {
    href: "/employer/company",
    title: "Company, contacts, and payroll",
    blurb: "Company details, HR/payroll contacts, pay frequency. EIN masked.",
  },
  {
    href: "/employer/setup",
    title: "Group setup and agreement",
    blurb: "Plans, rates by tier, contributions, eligibility; sign agreement.",
  },
  {
    href: "/employer/census",
    title: "Census upload",
    blurb: "Blackford template, validated field by field.",
  },
  {
    href: "/employer/employees",
    title: "Employees and new hires",
    blurb: "Roster; add a new hire with eligibility date.",
  },
] as const;

export default function EmployerPortalLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-ivory)]">
      <header className="bg-[var(--brand-ink)] text-[var(--brand-ivory)]">
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-6 py-5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-ruby)] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            B
          </div>
          <div>
            <p
              className="m-0 text-lg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blackford
            </p>
            <p className="eyebrow m-0 !text-[var(--brand-pale-gold)]">
              Employer portal
            </p>
          </div>
        </div>
        <div className="signature-bar" aria-hidden>
          <span />
          <span />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-8 px-6 py-12">
        <div className="rise flex flex-col gap-3">
          <p className="eyebrow m-0">Module C · Onboarding</p>
          <h1
            className="m-0 text-[clamp(32px,5vw,44px)] leading-[1.1] text-[var(--brand-ink)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Set up your group with Blackford.
          </h1>
          <p className="m-0 max-w-[36rem] text-[16px] leading-relaxed text-[var(--brand-gray)]">
            Bartram Logistics · HR contact Tom Brooks. Complete these steps
            before enrollment opens.
          </p>
        </div>

        <ol className="rise rise-delay-1 m-0 flex list-none flex-col gap-3 p-0">
          {STEPS.map((step, i) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="card flex gap-4 no-underline text-inherit transition hover:border-[var(--brand-gold)]"
              >
                <span
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-[var(--brand-ink)] text-[var(--brand-pale-gold)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span
                    className="text-lg text-[var(--brand-ink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </span>
                  <span className="text-[14px] text-[var(--brand-gray)]">
                    {step.blurb}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <Link
          href="/employer/invite"
          className="btn btn-accent no-underline self-start"
        >
          Start with invite sign-in
        </Link>
      </main>
    </div>
  );
}
