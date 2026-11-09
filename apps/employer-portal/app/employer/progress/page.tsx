import { PortalShell } from "@/components/portal-shell";

const COUNTS = [
  { label: "Enrolled", value: 29, color: "var(--brand-ink)" },
  { label: "Waived", value: 8, color: "var(--brand-gold)" },
  { label: "Started", value: 11, color: "var(--brand-pale-gold)" },
  { label: "Not started", value: 16, color: "var(--brand-hairline)" },
];
const TOTAL = 64;

const OUTSTANDING: { name: string; dept: string; status: string; tag: string; reminder: string }[] = [
  { name: "Ashley Kim", dept: "Front office", status: "Ready to sign", tag: "tag tag-warn", reminder: "Today" },
  { name: "Marcus Bell", dept: "Hygiene", status: "Not started", tag: "tag tag-mute", reminder: "Today" },
  { name: "Luis Ortega", dept: "Lab", status: "Not started", tag: "tag tag-mute", reminder: "Blackford is calling" },
  { name: "Sofia Ramirez", dept: "Hygiene", status: "Started", tag: "tag tag-warn", reminder: "Today" },
  { name: "Derek Owens", dept: "Front office", status: "Started", tag: "tag tag-warn", reminder: "Today" },
];

const NEXT = [
  { date: "Feb 18", text: "last reminder goes to everyone outstanding" },
  { date: "Feb 19", text: "window closes; Blackford follows up on each person" },
  { date: "Feb 22", text: "elections sent to carriers" },
  { date: "Mar 1", text: "coverage starts; you get new payroll deductions" },
];

export default function EmployerProgressPage() {
  return (
    <PortalShell activeNav="progress" userName="Kevin Brooks" userInitials="KB">

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="m-0 text-[var(--color-text-muted)]">
              Riverside Dental Group · plan year starting Mar 1, 2027
            </p>
            <h1
              className="m-0 text-[30px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Open enrollment progress
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary">
              Download outstanding list
            </button>
            <a href="/employer/employees" className="btn btn-primary">
              Add a new hire
            </a>
          </div>
        </div>

        <section aria-labelledby="sum" className="card flex flex-col gap-5">
          <h2 id="sum" className="sr-only">
            Summary
          </h2>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span
              className="text-[44px] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              58%
            </span>
            <span className="font-semibold">
              37 of 64 employees have finished (enrolled or waived)
            </span>
            <span className="text-[var(--color-text-muted)]">
              Window closes Friday, Feb 19 · 3 days left
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex h-3 overflow-hidden rounded-full border border-[var(--brand-hairline)]" aria-hidden>
              {COUNTS.map((c) => (
                <div key={c.label} style={{ width: `${(c.value / TOTAL) * 100}%`, background: c.color }} />
              ))}
            </div>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
              {COUNTS.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-2 rounded-[10px] bg-[var(--brand-ivory)] px-3 py-2">
                  <dt className="flex items-center gap-2 text-[14px]">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-[var(--brand-hairline)]" style={{ background: c.color }} />
                    {c.label}
                  </dt>
                  <dd className="m-0 font-[family-name:var(--font-mono)] text-[14px]">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="flex flex-wrap items-start gap-6">
          <section aria-labelledby="out" className="card flex min-w-0 flex-[3_1_560px] flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="out" className="m-0 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Still to finish · 27
              </h2>
              <label className="field-label min-w-[220px] !flex-none">
                <span className="sr-only">Find an employee</span>
                <input type="search" className="field-input" placeholder="Find an employee" />
              </label>
            </div>
            <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
              Blackford sends reminders automatically by text and email. You
              only see progress here — never anyone&apos;s plan choices.
            </p>
            <div className="overflow-x-auto">
              <table className="portal-table w-full min-w-[560px] border-collapse">
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
                      <td className="font-semibold">{r.name}</td>
                      <td>{r.dept}</td>
                      <td>
                        <span className={r.tag}>{r.status}</span>
                      </td>
                      <td>{r.reminder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="self-start cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]">
              Show all 27
            </button>
          </section>

          <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
            <section aria-labelledby="next" className="card flex flex-col gap-3">
              <h2 id="next" className="m-0 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                What happens next
              </h2>
              <ol className="m-0 flex flex-col gap-2 pl-5 text-[14px] leading-relaxed">
                {NEXT.map((n) => (
                  <li key={n.date}>
                    <strong>{n.date}</strong> — {n.text}
                  </li>
                ))}
              </ol>
            </section>
            <section aria-labelledby="help" className="card flex flex-col gap-3">
              <h2 id="help" className="m-0 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Your Blackford contact
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-parchment)] text-[14px] font-semibold">
                  DW
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Dana Whitfield</span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">Account manager</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-[14px]">
                <a href="mailto:dana.whitfield@example.com" className="font-semibold">
                  Send a message
                </a>
                <a href="tel:+15550100100" className="font-semibold">
                  (555) 010-0100
                </a>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </PortalShell>
  );
}
