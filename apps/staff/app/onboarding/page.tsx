import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

export default function OnboardingPage() {
  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Clients and groups", href: "/clients" }, { label: "Bartram Logistics" }]}
        title="Bartram Logistics"
        tags={<Tag variant="info">Onboarding · 5 of 9</Tag>}
        meta={[
          "Signed Feb 3 (e-signed)",
          "Effective Apr 1, 2027",
          "HR: Angela Price",
          "47 employees on census",
        ]}
        actions={
          <button type="button" className="btn btn-primary">
            Send setup summary to HR
          </button>
        }
      />

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="chk" className="card min-w-0 flex-[2_1_340px] gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="chk" className="section-title">
              Checklist
            </h2>
            <p className="m-0 text-[13px] text-muted">
              Due dates count back from the Apr 1 effective date.
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Checklist progress"
            aria-valuenow={5}
            aria-valuemin={0}
            aria-valuemax={9}
            className="progress progress-sm"
          >
            <span style={{ width: "56%" }} />
          </div>
          <ol className="m-0 flex list-none flex-col p-0">
            <CheckItem done label="Broker agreement signed" date="Feb 3" />
            <CheckItem done label="HR invited to employer portal" date="Feb 3" />
            <CheckItem done label="Company details and payroll schedule" date="Feb 6" />
            <CheckItem done label="Census uploaded and valid" date="Feb 11" />
            <CheckItem done label="Plans and rates by tier" date="Feb 15" />
            <CheckItem current label="Contributions and eligibility" date="Due Feb 19" />
            <CheckItem label="HR approves setup summary" date="Due Feb 24" />
            <CheckItem label="Carrier templates confirmed" date="Due Feb 26" />
            <CheckItem label="Lock setup · ready to enroll" date="Due Mar 1" />
          </ol>
        </section>

        <section aria-labelledby="elig" className="card min-w-0 flex-[3_1_460px] gap-6">
          <h2 id="elig" className="section-title">
            Contributions and eligibility
          </h2>

          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="label mb-3">Employer contribution · medical</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <fieldset className="m-0 flex flex-col gap-3 border-0 border-t border-divider p-0 pt-5">
            <legend className="label float-left mb-3 w-full">Eligibility</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <fieldset className="m-0 flex flex-col gap-3 border-0 border-t border-divider p-0 pt-5">
            <legend className="label float-left mb-3 w-full">Enrollment window</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="field-label">
                Opens
                <input type="date" className="field-in" defaultValue="2027-03-08" readOnly />
              </label>
              <label className="field-label">
                Closes
                <input type="date" className="field-in" defaultValue="2027-03-19" readOnly />
              </label>
            </div>
            <label className="check-row">
              <input type="checkbox" />
              Mark people who don&apos;t respond as waived (only if Bartram&apos;s
              rules say so)
            </label>
          </fieldset>

          <Callout tone="info">
            With these rules, 44 of 47 people on the census are eligible now. 3
            drivers become eligible Apr 1 and get their invite automatically.
          </Callout>

          <div className="flex flex-wrap justify-end gap-2 border-t border-divider pt-5">
            <button type="button" className="btn btn-secondary">
              Save draft
            </button>
            <button type="button" className="btn btn-primary">
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
    <svg aria-hidden width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function CheckItem({
  label,
  date,
  done,
  current,
}: {
  label: string;
  date: string;
  done?: boolean;
  current?: boolean;
}) {
  return (
    <li
      aria-current={current ? "step" : undefined}
      className={`flex items-center gap-3 border-b border-divider py-2.5 last:border-b-0 ${
        current ? "-mx-3 rounded-md border-l-[3px] border-b-transparent border-l-gold bg-parchment-soft px-3" : ""
      }`}
    >
      <span
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-ink text-pale-gold"
            : current
              ? "border-2 border-gold bg-surface"
              : "border-2 border-hairline"
        }`}
      >
        {done ? <CheckIcon /> : null}
        <span className="sr-only">{done ? "Done:" : current ? "In progress:" : "To do:"}</span>
      </span>
      <span className={`flex-1 ${current ? "font-semibold" : done ? "text-muted line-through decoration-hairline" : ""}`}>
        {label}
      </span>
      <span className={`font-mono text-xs ${current ? "font-medium text-gold-deep" : "text-muted"}`}>
        {date}
      </span>
    </li>
  );
}
