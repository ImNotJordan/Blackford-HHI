import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

const MEMBERS: {
  name: string;
  role: string;
  plan: string;
  policy: string;
  effective: string;
  flag: string;
  tag: "ok" | "warn";
}[] = [
  { name: "Grace Okafor", role: "Primary · 64", plan: "Individual PPO · [Carrier]", policy: "IND-448210", effective: "2026-01-01", flag: "Turning 65", tag: "warn" },
  { name: "Samuel Okafor", role: "Spouse · 67", plan: "Medicare Supplement G · [Carrier]", policy: "MS-190377", effective: "2024-09-01", flag: "OK", tag: "ok" },
  { name: "Samuel Okafor", role: "Spouse · 67", plan: "Part D · [Carrier]", policy: "PD-552019", effective: "2024-09-01", flag: "OK", tag: "ok" },
  { name: "Ada Okafor", role: "Child · 25", plan: "Individual PPO · [Carrier]", policy: "IND-448211", effective: "2026-01-01", flag: "Turns 26 in 74 days", tag: "warn" },
];

export default async function HouseholdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = id === "okafor" ? "Okafor household" : `${id.replace(/-/g, " ")} household`;

  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Clients", href: "/clients" }, { label: title }]}
        title={title}
        tags={
          <>
            <Tag variant="info">Individual and Medicare</Tag>
            <Tag variant="ok">Active</Tag>
          </>
        }
        meta={[
          "Owner: Dana Whitfield",
          "Client since 2021",
          "Texts and email: opted in",
          "Prefers Spanish",
        ]}
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Text
            </button>
            <button type="button" className="btn btn-secondary">
              Email
            </button>
            <button type="button" className="btn btn-primary">
              New service request
            </button>
          </>
        }
      />

      <Callout
        tone="warn"
        icon="clock"
        title="Grace Okafor turns 65 on Jul 14."
        action={
          <Link href="#" className="btn btn-secondary btn-sm">
            Open task
          </Link>
        }
      >
        Medicare enrollment window opens Apr 1. Task created by the nightly check.
      </Callout>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-6">
          <section aria-labelledby="mem" className="card">
            <h2 id="mem" className="section-title">
              Members and policies
            </h2>
            <div className="overflow-x-auto">
              <table className="table min-w-[640px]">
                <thead>
                  <tr>
                    <th scope="col" className="th">Person</th>
                    <th scope="col" className="th">Plan and carrier</th>
                    <th scope="col" className="th">Policy</th>
                    <th scope="col" className="th">Effective</th>
                    <th scope="col" className="th">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map((m) => (
                    <tr key={m.policy}>
                      <td className="td">
                        <span className="font-semibold">{m.name}</span>
                        <div className="td-sub">{m.role}</div>
                      </td>
                      <td className="td">{m.plan}</td>
                      <td className="td font-mono text-[13px]">{m.policy}</td>
                      <td className="td font-mono text-[13px]">{m.effective}</td>
                      <td className="td">
                        <Tag variant={m.tag}>{m.flag}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="sr" className="card">
            <h2 id="sr" className="section-title">
              Service requests
            </h2>
            <div className="overflow-x-auto">
              <table className="table min-w-[560px]">
                <thead>
                  <tr>
                    <th scope="col" className="th">Request</th>
                    <th scope="col" className="th">Assigned</th>
                    <th scope="col" className="th">Due</th>
                    <th scope="col" className="th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td font-semibold">Replacement ID card for Samuel</td>
                    <td className="td">Marcus Lee</td>
                    <td className="td">Feb 18</td>
                    <td className="td">
                      <Tag variant="info">In progress</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Compare Medicare Advantage options for Grace</td>
                    <td className="td">Dana Whitfield</td>
                    <td className="td">Mar 15</td>
                    <td className="td">
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
            <h2 id="tl" className="section-title mb-1">
              Activity
            </h2>
            <div className="divided">
              <ActivityLine title="Text received from Grace" body={"“¿Me pueden llamar sobre Medicare?”"} time="Today 8:41 AM" />
              <ActivityLine title="Task created: Medicare window" time="Nightly check · Today 2:00 AM" />
              <ActivityLine title="Document added: Samuel Part D letter" time="Marcus Lee · Feb 12" />
            </div>
          </section>
          <section aria-labelledby="docs" className="card gap-1">
            <h2 id="docs" className="section-title mb-1">
              Documents and notes
            </h2>
            <div className="divided">
              <DocLink label="2026 individual application (signed)" />
              <DocLink label="Part D annual notice" />
              <DocLink label="3 notes" />
            </div>
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}

function ActivityLine({ title, body, time }: { title: string; body?: string; time: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-3">
      <span className="font-semibold">{title}</span>
      {body ? <span className="text-[14px] italic text-ink-soft">{body}</span> : null}
      <span className="text-[13px] text-muted">{time}</span>
    </div>
  );
}

function DocLink({ label }: { label: string }) {
  return (
    <Link href="#" className="flex items-center gap-2.5 py-3 font-medium text-ink no-underline hover:text-gold-deep">
      <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </svg>
      {label}
    </Link>
  );
}
