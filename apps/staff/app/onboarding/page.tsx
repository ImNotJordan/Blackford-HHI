import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default function OnboardingPage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/clients" className="no-underline">
          Clients and groups
        </Link>{" "}
        <span aria-hidden>/</span> Bartram Logistics
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
              Bartram Logistics
            </h1>
            <Tag variant="info">Onboarding · 5 of 9</Tag>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--color-text-muted)]">
            <span>Signed Feb 3 (e-signed)</span>
            <span>Effective Apr 1, 2027</span>
            <span>HR: Angela Price</span>
            <span>47 employees on census</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary">
          Send setup summary to HR
        </button>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="chk" className="card min-w-0 flex-[2_1_340px] gap-1">
          <h2 id="chk" className="heading mb-1 m-0 text-lg font-bold">
            Checklist
          </h2>
          <p className="mb-2 text-[13px] text-[var(--color-text-muted)]">
            Due dates count back from the Apr 1 effective date.
          </p>
          <CheckItem done label="Broker agreement signed" date="Feb 3" />
          <CheckItem done label="HR invited to employer portal" date="Feb 3" />
          <CheckItem done label="Company details and payroll schedule" date="Feb 6" />
          <CheckItem done label="Census uploaded and valid" date="Feb 11" />
          <CheckItem done label="Plans and rates by tier" date="Feb 15" />
          <CheckItem current label="Contributions and eligibility" due="Due Feb 19" />
          <CheckItem label="HR approves setup summary" due="Due Feb 24" />
          <CheckItem label="Carrier templates confirmed" due="Due Feb 26" />
          <CheckItem label="Lock setup · ready to enroll" due="Due Mar 1" last />
        </section>

        <section aria-labelledby="elig" className="card min-w-0 flex-[3_1_460px] gap-4">
          <h2 id="elig" className="heading m-0 text-lg font-bold">
            Contributions and eligibility
          </h2>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Employer contribution · medical
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="field-label">
                Employee only
                <input className="field-in" defaultValue="80%" readOnly />
              </label>
              <label className="field-label">
                Dependents
                <input className="field-in" defaultValue="50% of the dependent cost" readOnly />
              </label>
            </div>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Eligibility
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="field-label">
                Classes
                <select className="field-in">
                  <option>Office · Drivers (2 classes)</option>
                </select>
              </label>
              <label className="field-label">
                Waiting period
                <select className="field-in">
                  <option>First of the month after 60 days</option>
                </select>
              </label>
              <label className="field-label">
                Minimum hours per week
                <input className="field-in" defaultValue="30" readOnly />
              </label>
              <label className="field-label">
                Dependent age limit
                <input className="field-in" defaultValue="26" readOnly />
              </label>
            </div>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Enrollment window
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="field-label">
                Opens
                <input type="date" className="field-in" defaultValue="2027-03-08" readOnly />
              </label>
              <label className="field-label">
                Closes
                <input type="date" className="field-in" defaultValue="2027-03-19" readOnly />
              </label>
            </div>
            <label className="flex items-center gap-2.5 text-[13px]">
              <input type="checkbox" className="h-[18px] w-[18px] accent-[var(--color-teal)]" />
              Mark people who don&apos;t respond as waived (only if Bartram&apos;s
              rules say so)
            </label>
          </fieldset>

          <div className="flex items-start gap-3 rounded-[10px] bg-[var(--color-bg)] px-3.5 py-3 text-[13px] text-[#3A4756]">
            <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#586575" strokeWidth={2} className="mt-px shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
            <span>
              With these rules, 44 of 47 people on the census are eligible now. 3
              drivers become eligible Apr 1 and get their invite automatically.
            </span>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="btn btn-secondary">
              Save draft
            </button>
            <button type="button" className="btn min-h-11 border-0 bg-[var(--color-text)] text-white">
              Save and mark done
            </button>
          </div>
        </section>
      </div>
    </StaffShell>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function CheckItem({
  label,
  date,
  due,
  done,
  current,
  last,
}: {
  label: string;
  date?: string;
  due?: string;
  done?: boolean;
  current?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-2.5 ${last ? "" : "border-b border-[#EEF1F5]"} ${
        current ? "-mx-2 rounded-lg bg-[#F2F8F7] px-2" : ""
      }`}
    >
      <span
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-[var(--color-teal)] text-white"
            : "box-border border-2 border-[#C5CED8]"
        } ${current ? "border-2 border-[var(--color-teal)] bg-transparent" : ""}`}
      >
        {done ? <CheckIcon /> : null}
      </span>
      <span className={`flex-1 ${current ? "font-semibold" : done ? "text-[var(--color-text-muted)]" : ""}`}>
        {label}
      </span>
      <span
        className={`text-xs ${due && current ? "font-bold text-[#0B5953]" : "text-[var(--color-text-muted)]"}`}
      >
        {date ?? due}
      </span>
    </div>
  );
}
