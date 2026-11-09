import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";

const ERRORS = [
  {
    row: 12,
    name: "Jordan Hayes",
    field: "Hire date",
    issue: "“13/02/2026” isn't a valid date. Use MM/DD/YYYY.",
    fixValue: "02/13/2026",
    fixed: true,
  },
  {
    row: 27,
    name: "Alicia Moreno",
    field: "Hours per week",
    issue: "Missing. Needed to check the 30-hour rule.",
    placeholder: "e.g. 40",
    fixed: false,
  },
  {
    row: 41,
    name: "Sam Whitaker",
    field: "Email and mobile",
    issue: "Both empty. We need one to send the enrollment link.",
    placeholder: "Mobile or email",
    fixed: false,
  },
];

export default function EmployerCensusPage() {
  return (
    <PortalShell
        activeNav="census"
        userName="Tom Brooks"
        userInitials="TB"
      >

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
            Bartram Logistics · setup for coverage starting Jul 1, 2027
          </p>
          <h1
            className="m-0 text-[30px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Employee census
          </h1>
        </div>

        <ol
          aria-label="Steps"
          className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3"
        >
          <li className="card flex items-center gap-3 py-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal)] text-sm font-bold text-white">
              1
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Download the template</span>
              <Link href="#" className="text-[13px]">
                Blackford census template.xlsx
              </Link>
            </span>
          </li>
          <li className="card flex items-center gap-3 py-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal)] text-sm font-bold text-white">
              2
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Upload it</span>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                bartram_census_feb.xlsx · Feb 12
              </span>
            </span>
          </li>
          <li
            aria-current="step"
            className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-amber-border)] bg-[var(--color-amber-bg)] p-3.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-amber-dark)] text-sm font-bold text-white">
              3
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Fix 3 rows</span>
              <span className="text-[13px] text-[#5C3204]">
                Then we can set up your plans
              </span>
            </span>
          </li>
        </ol>

        <section
          aria-labelledby="census-errors"
          className="card flex flex-col gap-4 rounded-[14px] p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2
                id="census-errors"
                className="m-0 text-xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                3 rows need fixing
              </h2>
              <p className="m-0 text-[var(--color-text-muted)]">
                We checked 47 rows. 44 are ready. Fix the rows below here, or
                fix your file and upload it again. Census files may include SSN
                last four only — full SSNs are never displayed after upload.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary">
                Download error list
              </button>
              <button type="button" className="btn btn-secondary">
                Upload a new file
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="portal-table w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th scope="col">Row</th>
                  <th scope="col">Employee</th>
                  <th scope="col">Field</th>
                  <th scope="col">What&apos;s wrong</th>
                  <th scope="col" className="w-[220px]">
                    Fix
                  </th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map((err, idx) => (
                  <tr key={err.row}>
                    <td className="text-[var(--color-text-muted)]">{err.row}</td>
                    <td className="font-semibold">{err.name}</td>
                    <td>{err.field}</td>
                    <td className="text-[#7A3F06]">{err.issue}</td>
                    <td className={idx === ERRORS.length - 1 ? "border-b-0" : ""}>
                      <label>
                        <span className="sr-only">
                          Fix {err.field} for {err.name}
                        </span>
                        <input
                          className="field-input min-h-10"
                          style={{
                            borderColor: err.fixed ? "var(--color-teal)" : "#E2B98A",
                          }}
                          defaultValue={err.fixValue}
                          placeholder={err.placeholder}
                          readOnly={!!err.fixValue}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-row-border)] pt-4">
            <span className="text-[13px] text-[var(--color-text-muted)]">
              1 of 3 fixed
            </span>
            <button type="button" className="btn btn-primary">
              Save fixes and check again
            </button>
          </div>
        </section>

        <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
          Questions about the template? Message Dana Whitfield at Blackford from
          the Documents tab. Sign in with a one-time code — no password.
          You&apos;re signed out after 15 minutes idle.
        </p>
      </main>
    </PortalShell>
  );
}
