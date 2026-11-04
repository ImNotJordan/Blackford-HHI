import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default function ChangeApprovalsPage() {
  return (
    <StaffShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
          Changes and renewals
        </h1>
        <button type="button" className="btn btn-secondary">
          Enter a change or termination
        </button>
      </header>

      <div className="flex flex-wrap items-stretch gap-4">
        <section
          aria-labelledby="q"
          className="flex min-w-0 flex-[1_1_300px] flex-col rounded-xl border border-[var(--color-border)] bg-white"
        >
          <h2 id="q" className="heading m-0 px-4 pt-4 pb-2.5 text-base font-bold">
            Waiting for approval · 3
          </h2>
          <QueueItem active title="Priya Nair · birth" time="2 days" warn sub="Coastal Marine Supply · proof uploaded" />
          <QueueItem title="James Okafor · marriage" time="Today" sub="Riverside Dental · proof uploaded" />
          <QueueItem title="Lena Fischer · lost coverage" time="Today" sub="Outside 30-day window · exception" subWarn />
        </section>

        <section aria-labelledby="det" className="card min-w-0 flex-[2_1_460px] gap-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="det" className="heading m-0 text-xl font-bold">
                Priya Nair — had a baby
              </h2>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                Reported Feb 14 from her phone · event date Feb 3, 2027
              </span>
            </div>
            <Tag variant="ok">Inside window · until Mar 5</Tag>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Requested changes
              </span>
              <div className="flex flex-col gap-1.5 text-sm">
                <span>Add child: Aanya Nair</span>
                <span>Medical: Employee only → Employee + child</span>
                <span>Dental: Employee only → Employee + child</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Payroll deduction
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[var(--color-text-muted)] line-through">$61.20</span>
                <span className="heading text-[22px] font-extrabold">$154.80</span>
                <span className="text-[13px] text-[var(--color-text-muted)]">per paycheck</span>
              </div>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                HR is told the new amount once approved.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[10px] bg-[var(--color-bg)] px-3.5 py-3">
            <svg aria-hidden width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth={2}>
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <path d="M14 3v6h6" />
            </svg>
            <span className="flex-1">hospital_record.jpg</span>
            <Link href="#" className="text-[13px] font-semibold">
              View proof
            </Link>
          </div>
          <div className="flex items-start gap-3 rounded-[10px] bg-[#FDF3E7] px-3.5 py-3 text-[13px] text-[#5C3204]">
            <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#A1540A" strokeWidth={2} className="mt-px shrink-0">
              <path d="M12 3 2 20h20L12 3z" />
              <path d="M12 10v4" />
              <path d="M12 17h.01" />
            </svg>
            <span>
              The baby&apos;s date of birth is missing on the dependent. It&apos;s
              holding the dental change file — add it before approving.
            </span>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="btn btn-secondary">
              Deny
            </button>
            <button type="button" className="btn btn-secondary">
              Ask for more
            </button>
            <button type="button" className="btn btn-primary">
              Approve and queue for carriers
            </button>
          </div>
        </section>
      </div>

      <section aria-labelledby="ren" className="card gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="ren" className="heading m-0 text-lg font-bold">
            Renewals in the next 120 days
          </h2>
          <Link href="/renewals" className="text-[13px] font-semibold">
            Renewal calendar
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="th">Group</th>
                <th className="th">Renews</th>
                <th className="th">Step</th>
                <th className="th">Type</th>
                <th className="th">Next task</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td font-semibold">Southside Pediatrics</td>
                <td className="td">May 1</td>
                <td className="td">
                  <Tag variant="info">Options to HR</Tag>
                </td>
                <td className="td">Re-enroll everyone</td>
                <td className="td text-[var(--color-text-muted)]">HR decision due Feb 26</td>
              </tr>
              <tr>
                <td className="td font-semibold">Bartram Logistics</td>
                <td className="td">Jun 1</td>
                <td className="td">
                  <Tag variant="warn">Waiting on rates</Tag>
                </td>
                <td className="td">Not decided</td>
                <td className="td text-[var(--color-text-muted)]">Chase carrier rates</td>
              </tr>
              <tr>
                <td className="td border-0 font-semibold">Coastal Marine Supply</td>
                <td className="td border-0">Jun 1</td>
                <td className="td border-0">
                  <Tag variant="mute">Task list created</Tag>
                </td>
                <td className="td border-0">Passive renewal</td>
                <td className="td border-0 text-[var(--color-text-muted)]">Request rates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </StaffShell>
  );
}

function QueueItem({
  title,
  time,
  sub,
  warn,
  subWarn,
  active,
}: {
  title: string;
  time: string;
  sub: string;
  warn?: boolean;
  subWarn?: boolean;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      aria-current={active}
      className={`flex flex-col gap-0.5 border-t border-[#EEF1F5] px-4 py-3 no-underline text-[var(--color-text)] ${
        active ? "border-l-[3px] border-l-[var(--color-teal)] bg-[#F2F8F7]" : ""
      }`}
    >
      <span className="flex justify-between">
        <span className="font-bold">{title}</span>
        <span className={`text-xs ${warn ? "font-semibold text-[var(--color-amber-dark)]" : "text-[var(--color-text-muted)]"}`}>
          {time}
        </span>
      </span>
      <span className={`text-xs ${subWarn ? "font-semibold text-[var(--color-amber-dark)]" : "text-[var(--color-text-muted)]"}`}>
        {sub}
      </span>
    </a>
  );
}
