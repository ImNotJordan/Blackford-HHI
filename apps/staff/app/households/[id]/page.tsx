import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default async function HouseholdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = id === "okafor" ? "Okafor household" : `${id.replace(/-/g, " ")} household`;

  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/clients" className="no-underline">
          Clients
        </Link>{" "}
        <span aria-hidden>/</span> {title}
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
              {title}
            </h1>
            <Tag variant="info">Individual and Medicare</Tag>
            <Tag variant="ok">Active</Tag>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--color-text-muted)]">
            <span>Owner: Dana Whitfield</span>
            <span>Client since 2021</span>
            <span>Texts and email: opted in</span>
            <span>Prefers Spanish</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Text
          </button>
          <button type="button" className="btn btn-secondary">
            Email
          </button>
          <button type="button" className="btn btn-primary">
            New service request
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#F3D3AE] bg-[#FDF3E7] px-4 py-3.5">
        <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#A1540A" strokeWidth={2} className="shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
        <span className="min-w-[300px] flex-1 text-[#5C3204]">
          <b>Grace Okafor turns 65 on Jul 14.</b> Medicare enrollment window opens
          Apr 1. Task created by the nightly check.
        </span>
        <Link href="#" className="font-semibold text-[#7A3F06]">
          Open task
        </Link>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-6">
          <section aria-labelledby="mem" className="card gap-3">
            <h2 id="mem" className="heading m-0 text-lg font-bold">
              Members and policies
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    <th className="th">Person</th>
                    <th className="th">Plan and carrier</th>
                    <th className="th">Policy</th>
                    <th className="th">Effective</th>
                    <th className="th">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td">
                      <b>Grace Okafor</b>
                      <div className="text-xs text-[var(--color-text-muted)]">Primary · 64</div>
                    </td>
                    <td className="td">Individual PPO · [Carrier]</td>
                    <td className="td font-mono text-[13px]">IND-448210</td>
                    <td className="td">2026-01-01</td>
                    <td className="td">
                      <Tag variant="warn">Turning 65</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="td">
                      <b>Samuel Okafor</b>
                      <div className="text-xs text-[var(--color-text-muted)]">Spouse · 67</div>
                    </td>
                    <td className="td">Medicare Supplement G · [Carrier]</td>
                    <td className="td font-mono text-[13px]">MS-190377</td>
                    <td className="td">2024-09-01</td>
                    <td className="td">
                      <Tag variant="ok">OK</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="td">
                      <b>Samuel Okafor</b>
                      <div className="text-xs text-[var(--color-text-muted)]">Spouse · 67</div>
                    </td>
                    <td className="td">Part D · [Carrier]</td>
                    <td className="td font-mono text-[13px]">PD-552019</td>
                    <td className="td">2024-09-01</td>
                    <td className="td">
                      <Tag variant="ok">OK</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="td border-0">
                      <b>Ada Okafor</b>
                      <div className="text-xs text-[var(--color-text-muted)]">Child · 25</div>
                    </td>
                    <td className="td border-0">Individual PPO · [Carrier]</td>
                    <td className="td border-0 font-mono text-[13px]">IND-448211</td>
                    <td className="td border-0">2026-01-01</td>
                    <td className="td border-0">
                      <Tag variant="warn">Turns 26 in 74 days</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="sr" className="card gap-3">
            <h2 id="sr" className="heading m-0 text-lg font-bold">
              Service requests
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr>
                    <th className="th">Request</th>
                    <th className="th">Assigned</th>
                    <th className="th">Due</th>
                    <th className="th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td">
                      <b>Replacement ID card for Samuel</b>
                    </td>
                    <td className="td">Marcus Lee</td>
                    <td className="td">Feb 18</td>
                    <td className="td">
                      <Tag variant="info">In progress</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="td border-0">
                      <b>Compare Medicare Advantage options for Grace</b>
                    </td>
                    <td className="td border-0">Dana Whitfield</td>
                    <td className="td border-0">Mar 15</td>
                    <td className="td border-0">
                      <Tag variant="mute">Open</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="tl" className="card gap-1">
            <h2 id="tl" className="heading mb-2 m-0 text-lg font-bold">
              Activity
            </h2>
            <ActivityLine title="Text received from Grace" body={'“¿Me pueden llamar sobre Medicare?”'} time="Today 8:41 AM" />
            <ActivityLine title="Task created: Medicare window" time="Nightly check · Today 2:00 AM" />
            <ActivityLine title="Document added: Samuel Part D letter" time="Marcus Lee · Feb 12" last />
          </section>
          <section aria-labelledby="docs" className="card gap-2">
            <h2 id="docs" className="heading mb-1 m-0 text-lg font-bold">
              Documents and notes
            </h2>
            <Link href="#" className="font-semibold">
              2026 individual application (signed)
            </Link>
            <Link href="#" className="font-semibold">
              Part D annual notice
            </Link>
            <Link href="#" className="font-semibold">
              3 notes
            </Link>
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}

function ActivityLine({
  title,
  body,
  time,
  last,
}: {
  title: string;
  body?: string;
  time: string;
  last?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 py-2.5 ${last ? "" : "border-b border-[#EEF1F5]"}`}>
      <span className="font-semibold">{title}</span>
      {body ? <span className="text-[13px] text-[#3A4756]">{body}</span> : null}
      <span className="text-xs text-[var(--color-text-muted)]">{time}</span>
    </div>
  );
}
