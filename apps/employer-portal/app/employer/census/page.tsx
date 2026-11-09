import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Card, PageHeader, SecurityNote, Tag } from "@/components/ui";

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

const fixedCount = ERRORS.filter((e) => e.fixed).length;

export default function EmployerCensusPage() {
  return (
    <PortalShell activeNav="census" userName="Tom Brooks" userInitials="TB">
      <PageHeader
        context="Step 3 of 4 · Bartram Logistics · coverage starts Jul 1, 2027"
        title="Employee census"
        description="Upload your employee list so we can check eligibility and send enrollment links."
      />

      <ol aria-label="Census steps" className="steps">
        <li className="step is-done">
          <span className="step-num" aria-hidden>
            ✓
          </span>
          <span className="step-body">
            <span className="step-title">Download the template</span>
            <Link href="#" className="step-meta">
              Blackford census template.xlsx
            </Link>
          </span>
        </li>
        <li className="step is-done">
          <span className="step-num" aria-hidden>
            ✓
          </span>
          <span className="step-body">
            <span className="step-title">Upload it</span>
            <span className="step-meta">bartram_census_feb.xlsx · Feb 12</span>
          </span>
        </li>
        <li className="step is-current" aria-current="step">
          <span className="step-num" aria-hidden>
            3
          </span>
          <span className="step-body">
            <span className="step-title">Fix {ERRORS.length} rows</span>
            <span className="step-meta">Then we can set up your plans</span>
          </span>
        </li>
      </ol>

      <Card
        title={`${ERRORS.length} rows need fixing`}
        id="census-errors"
        description={
          <>
            We checked 47 rows and <strong className="text-[var(--color-text)]">44 are ready</strong>.
            Fix the rows below here, or fix your file and upload it again.
          </>
        }
        actions={
          <>
            <button type="button" className="btn btn-secondary btn-sm">
              Download error list
            </button>
            <button type="button" className="btn btn-secondary btn-sm">
              Upload a new file
            </button>
          </>
        }
        footer={
          <>
            <Tag tone={fixedCount === ERRORS.length ? "success" : "warning"}>
              {fixedCount} of {ERRORS.length} fixed
            </Tag>
            <button type="button" className="btn btn-primary">
              Save fixes and check again
            </button>
          </>
        }
      >
        <div className="table-wrap">
          <table className="data-table min-w-[820px]">
            <thead>
              <tr>
                <th scope="col" className="num w-[72px]">Row</th>
                <th scope="col">Employee</th>
                <th scope="col">Field</th>
                <th scope="col">What&apos;s wrong</th>
                <th scope="col" className="w-[240px]">Fix</th>
              </tr>
            </thead>
            <tbody>
              {ERRORS.map((err) => (
                <tr key={err.row}>
                  <td className="num cell-muted">{err.row}</td>
                  <td className="cell-strong">{err.name}</td>
                  <td>{err.field}</td>
                  <td className={err.fixed ? "cell-muted line-through" : "text-[var(--status-danger-fg)]"}>
                    {err.issue}
                  </td>
                  <td>
                    <label>
                      <span className="sr-only">
                        Fix {err.field} for {err.name}
                      </span>
                      <input
                        className={`field-input ${err.fixed ? "is-valid" : "is-invalid"}`}
                        defaultValue={err.fixValue}
                        placeholder={err.placeholder}
                        readOnly={!!err.fixValue}
                        aria-invalid={!err.fixed}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-caption text-[13px]">
          Census files may include SSN last four only — full SSNs are never
          displayed after upload.
        </p>
      </Card>

      <SecurityNote>
        Questions about the template? Message Dana Whitfield at Blackford from
        the Documents tab.
      </SecurityNote>
    </PortalShell>
  );
}
