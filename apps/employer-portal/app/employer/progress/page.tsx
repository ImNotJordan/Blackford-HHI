import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Avatar, Card, PageHeader, Tag, type Tone } from "@/components/ui";

const COUNTS = [
  { label: "Enrolled", value: 29, color: "var(--chart-1)" },
  { label: "Waived", value: 8, color: "var(--chart-2)" },
  { label: "Started", value: 11, color: "var(--chart-3)" },
  { label: "Not started", value: 16, color: "var(--chart-4)" },
];
const TOTAL = COUNTS.reduce((sum, c) => sum + c.value, 0);
const FINISHED = COUNTS[0].value + COUNTS[1].value;
const OUTSTANDING_COUNT = TOTAL - FINISHED;

const OUTSTANDING: { name: string; dept: string; status: string; tone: Tone; reminder: string }[] = [
  { name: "Ashley Kim", dept: "Front office", status: "Ready to sign", tone: "success", reminder: "Today" },
  { name: "Marcus Bell", dept: "Hygiene", status: "Not started", tone: "neutral", reminder: "Today" },
  { name: "Luis Ortega", dept: "Lab", status: "Not started", tone: "neutral", reminder: "Blackford is calling" },
  { name: "Sofia Ramirez", dept: "Hygiene", status: "Started", tone: "warning", reminder: "Today" },
  { name: "Derek Owens", dept: "Front office", status: "Started", tone: "warning", reminder: "Today" },
];

const NEXT = [
  { date: "Feb 18", text: "Last reminder goes to everyone outstanding" },
  { date: "Feb 19", text: "Window closes; Blackford follows up on each person" },
  { date: "Feb 22", text: "Elections sent to carriers" },
  { date: "Mar 1", text: "Coverage starts; you get new payroll deductions" },
];

export default function EmployerProgressPage() {
  const pct = Math.round((FINISHED / TOTAL) * 100);

  return (
    <PortalShell activeNav="progress" userName="Kevin Brooks" userInitials="KB">
      <PageHeader
        context="Riverside Dental Group · plan year starts Mar 1, 2027"
        title="Open enrollment progress"
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Download outstanding list
            </button>
            <Link href="/employer/employees" className="btn btn-primary">
              Add a new hire
            </Link>
          </>
        }
      />

      <section aria-labelledby="summary" className="card gap-6">
        <h2 id="summary" className="sr-only">
          Summary
        </h2>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-[56px] leading-none tabular-nums">{pct}%</span>
            <span className="flex flex-col">
              <span className="text-[17px] font-semibold">
                {FINISHED} of {TOTAL} employees finished
              </span>
              <span className="text-secondary text-sm">Enrolled or waived</span>
            </span>
          </div>
          <Tag tone="warning">Window closes Fri, Feb 19 · 3 days left</Tag>
        </div>
        <div
          className="meter"
          role="img"
          aria-label={COUNTS.map((c) => `${c.label} ${c.value}`).join(", ")}
        >
          {COUNTS.map((c) => (
            <span key={c.label} style={{ width: `${(c.value / TOTAL) * 100}%`, background: c.color }} />
          ))}
        </div>
        <dl className="legend">
          {COUNTS.map((c) => (
            <div key={c.label} className="legend-item">
              <dt>
                <span aria-hidden className="legend-swatch" style={{ background: c.color }} />
                {c.label}
              </dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)]">
        <Card
          title={`Still to finish · ${OUTSTANDING_COUNT}`}
          id="outstanding"
          description="Blackford sends reminders automatically by text and email. You only see progress here — never anyone's plan choices."
          actions={
            <label className="w-full min-w-[220px] sm:w-auto">
              <span className="sr-only">Find an employee</span>
              <input type="search" className="field-input" placeholder="Find an employee" />
            </label>
          }
        >
          <div className="table-wrap">
            <table className="data-table min-w-[560px]">
              <thead>
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Department</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last reminder</th>
                </tr>
              </thead>
              <tbody>
                {OUTSTANDING.map((r) => (
                  <tr key={r.name}>
                    <td className="cell-strong">{r.name}</td>
                    <td className="cell-muted">{r.dept}</td>
                    <td>
                      <Tag tone={r.tone}>{r.status}</Tag>
                    </td>
                    <td className="cell-muted">{r.reminder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="link-button">
            Show all {OUTSTANDING_COUNT} →
          </button>
        </Card>

        <div className="flex min-w-0 flex-col gap-6">
          <Card title="What happens next" id="next">
            <ol className="timeline">
              {NEXT.map((n) => (
                <li key={n.date}>
                  <span className="timeline-date">{n.date}</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Your Blackford contact" id="help">
            <div className="flex items-center gap-3">
              <Avatar initials="DW" size="lg" />
              <div className="flex flex-col">
                <span className="font-semibold">Dana Whitfield</span>
                <span className="text-secondary text-sm">Account manager</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="mailto:dana.whitfield@example.com" className="btn btn-secondary btn-sm">
                Send a message
              </a>
              <a href="tel:+15550100100" className="btn btn-secondary btn-sm font-data">
                (555) 010-0100
              </a>
            </div>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
