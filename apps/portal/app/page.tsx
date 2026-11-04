import Link from "next/link";
import { PortalHeader } from "@/components/portal-header";

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

export default function EmployerPortalHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader showNav={false} />

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-6 py-12">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[13px] font-semibold text-[var(--color-teal)]">
            Module C · Employer HR onboarding
          </p>
          <h1
            className="m-0 text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Employer portal
          </h1>
          <p className="m-0 text-[var(--color-text-muted)] leading-relaxed">
            Bartram Logistics · HR contact Tom Brooks. Complete setup before
            enrollment opens.
          </p>
        </div>

        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {STEPS.map((step, i) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="card flex gap-4 no-underline text-inherit transition hover:border-[var(--color-teal)]"
              >
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#E6F2F1] text-sm font-extrabold text-[var(--color-teal)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span
                    className="font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">
                    {step.blurb}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <Link href="/employer/invite" className="btn btn-primary no-underline self-start">
          Start with invite sign-in
        </Link>
      </main>
    </div>
  );
}
