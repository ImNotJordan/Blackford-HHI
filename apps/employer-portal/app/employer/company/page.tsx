import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";

export default function EmployerCompanyPage() {
  return (
    <PortalShell
        activeNav="company"
        userName="Tom Brooks"
        userInitials="TB"
      >

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-col gap-1.5">
          <h1
            className="m-0 text-[30px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Company, contacts, and payroll
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            Bartram Logistics · details used for enrollment cost per paycheck
            and who Blackford should reach.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section aria-labelledby="company-details" className="card flex flex-col gap-4">
            <h2
              id="company-details"
              className="m-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Company details
            </h2>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Legal name
              <input
                className="field-input"
                defaultValue="Bartram Logistics LLC"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Doing business as
              <input className="field-input" defaultValue="Bartram Logistics" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              EIN
              <input
                className="field-input"
                defaultValue="••-•••6789"
                readOnly
                aria-describedby="ein-note"
              />
            </label>
            <p id="ein-note" className="m-0 text-xs text-[var(--color-text-muted)]">
              EIN is masked. Only Blackford staff with access can see the full
              number.
            </p>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Primary address
              <input
                className="field-input"
                defaultValue="1840 Industrial Park Dr, Tampa, FL 33619"
              />
            </label>
          </section>

          <section aria-labelledby="contacts" className="card flex flex-col gap-4">
            <h2
              id="contacts"
              className="m-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              HR and payroll contacts
            </h2>
            <div className="rounded-xl border border-[var(--color-border)] p-4 flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                HR contact
              </span>
              <strong>Tom Brooks</strong>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                Owner · tom.brooks@example.com · (555) 010-0001
              </span>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4 flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                Payroll contact
              </span>
              <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
                Name
                <input className="field-input" defaultValue="Alicia Ng" />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
                Work email
                <input
                  className="field-input"
                  type="email"
                  defaultValue="alicia.ng@example.com"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
                Mobile
                <input
                  className="field-input"
                  type="tel"
                  defaultValue="(555) 010-0004"
                />
              </label>
            </div>
          </section>
        </div>

        <section aria-labelledby="payroll" className="card flex flex-col gap-4">
          <h2
            id="payroll"
            className="m-0 text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Payroll schedule
          </h2>
          <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
            Pay frequency drives per-paycheck cost on enrollment screens.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Pay frequency
              <select className="field-input" defaultValue="biweekly">
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly (26 / year)</option>
                <option value="semimonthly">Semimonthly (24 / year)</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Next payday
              <input className="field-input" type="date" defaultValue="2027-03-13" />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Deduction start
              <input className="field-input" type="date" defaultValue="2027-07-01" />
            </label>
          </div>
          <div className="rounded-xl bg-[#F4F6F9] px-4 py-3 text-[13px] text-[var(--color-text-muted)]">
            Example: Medical PPO employee-only at $612.40 / month ≈{" "}
            <strong className="text-[var(--color-text)]">$235.54</strong> per
            biweekly paycheck before employer contribution.
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary">
              Save company details
            </button>
            <Link href="/employer/setup" className="btn btn-secondary no-underline">
              Continue to plans
            </Link>
          </div>
        </section>
      </main>
    </PortalShell>
  );
}
