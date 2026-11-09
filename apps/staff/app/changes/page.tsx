import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

export default function ChangeApprovalsPage() {
  return (
    <StaffShell>
      <PageHeader
        title="Changes and renewals"
        description="Life events waiting for approval, and every group renewing in the next 120 days."
        actions={
          <button type="button" className="btn btn-secondary">
            Enter a change or termination
          </button>
        }
      />

      <div className="flex flex-wrap items-stretch gap-4">
        <section aria-labelledby="q" className="panel min-w-0 flex-[1_1_300px] self-start">
          <div className="panel-head">
            <h2 id="q" className="section-title text-[19px]">
              Waiting for approval
            </h2>
            <span className="badge-count">3</span>
          </div>
          <div className="divided">
            <QueueItem active title="Priya Nair · birth" time="2 days" warn sub="Coastal Marine Supply · proof uploaded" />
            <QueueItem title="James Okafor · marriage" time="Today" sub="Riverside Dental · proof uploaded" />
            <QueueItem title="Lena Fischer · lost coverage" time="Today" sub="Outside 30-day window · exception" subWarn />
          </div>
        </section>

        <section aria-labelledby="det" className="card min-w-0 flex-[2_1_460px] gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="det" className="section-title text-[24px]">
                Priya Nair — had a baby
              </h2>
              <span className="text-[13px] text-muted">
                Reported Feb 14 from her phone · event date Feb 3, 2027
              </span>
            </div>
            <Tag variant="ok">Inside window · until Mar 5</Tag>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 rounded-lg bg-ivory p-4">
            <div className="flex flex-col gap-2">
              <span className="label">Requested changes</span>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[14px]">
                <li>Add child: Aanya Nair</li>
                <li>Medical: Employee only → Employee + child</li>
                <li>Dental: Employee only → Employee + child</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <span className="label">Payroll deduction</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-muted line-through">$61.20</span>
                <span className="stat-figure text-[28px]">$154.80</span>
                <span className="text-[13px] text-muted">per paycheck</span>
              </div>
              <span className="text-[13px] text-muted">
                HR is told the new amount once approved.
              </span>
            </div>
          </div>
          <Callout
            tone="info"
            icon="file"
            action={
              <Link href="#" className="link-action">
                View proof
              </Link>
            }
          >
            <span className="font-mono text-[13px] text-ink">hospital_record.jpg</span>
          </Callout>
          <Callout tone="warn" title="Date of birth missing">
            The baby&apos;s date of birth is missing on the dependent. It&apos;s
            holding the dental change file — add it before approving.
          </Callout>
          <div className="flex flex-wrap justify-end gap-2 border-t border-divider pt-5">
            <button type="button" className="btn btn-ghost">
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

      <section aria-labelledby="ren" className="card">
        <div className="card-head">
          <h2 id="ren" className="section-title">
            Renewals in the next 120 days
          </h2>
          <Link href="/renewals" className="link-action">
            Renewal calendar
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table min-w-[760px]">
            <thead>
              <tr>
                <th scope="col" className="th">Group</th>
                <th scope="col" className="th">Renews</th>
                <th scope="col" className="th">Step</th>
                <th scope="col" className="th">Type</th>
                <th scope="col" className="th">Next task</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td font-semibold">
                  <Link href="/renewals" className="text-ink no-underline hover:underline">
                    Southside Pediatrics
                  </Link>
                </td>
                <td className="td">May 1</td>
                <td className="td">
                  <Tag variant="info">Options to HR</Tag>
                </td>
                <td className="td">Re-enroll everyone</td>
                <td className="td text-muted">HR decision due Feb 26</td>
              </tr>
              <tr>
                <td className="td font-semibold">Bartram Logistics</td>
                <td className="td">Jun 1</td>
                <td className="td">
                  <Tag variant="warn">Waiting on rates</Tag>
                </td>
                <td className="td">Not decided</td>
                <td className="td text-muted">Chase carrier rates</td>
              </tr>
              <tr>
                <td className="td font-semibold">Coastal Marine Supply</td>
                <td className="td">Jun 1</td>
                <td className="td">
                  <Tag variant="mute">Task list created</Tag>
                </td>
                <td className="td">Passive renewal</td>
                <td className="td text-muted">Request rates</td>
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
    <a href="#" aria-current={active ? "true" : undefined} className="list-row">
      <span className="flex justify-between gap-2">
        <span className="font-semibold">{title}</span>
        <span className={`shrink-0 text-xs ${warn ? "font-semibold text-gold-deep" : "text-muted"}`}>
          {time}
        </span>
      </span>
      <span className={`text-[13px] ${subWarn ? "font-semibold text-gold-deep" : "text-muted"}`}>
        {sub}
      </span>
    </a>
  );
}
