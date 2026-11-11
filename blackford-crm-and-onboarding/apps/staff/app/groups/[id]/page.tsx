import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

const TABS: { label: string; count?: number }[] = [
  { label: "Overview" },
  { label: "Employees", count: 64 },
  { label: "Plans and rates" },
  { label: "Eligibility" },
  { label: "Onboarding" },
  { label: "Messages" },
  { label: "Documents" },
  { label: "Service requests" },
];

export default async function GroupRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isRiverside = id === "riverside-dental";
  const name = isRiverside ? "Riverside Dental Group" : id.replace(/-/g, " ");

  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Clients and groups", href: "/clients" }, { label: name }]}
        title={name}
        tags={<Tag variant="ok">Enrolling</Tag>}
        meta={[
          "Employer group · 64 eligible",
          "Effective Mar 1, 2027",
          "Window Feb 1 – Feb 19",
          "Owner: Dana Whitfield",
        ]}
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Add task
            </button>
            <Link href="/agent-assist" className="btn btn-secondary">
              Start in-person session
            </Link>
            <button type="button" className="btn btn-primary">
              Message group
            </button>
          </>
        }
      />

      <div role="tablist" aria-label="Record sections" className="tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className="tab"
          >
            {tab.label}
            {tab.count != null ? <span className="tab-count">{tab.count}</span> : null}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-6">
          <section aria-labelledby="enr" className="card gap-5">
            <div className="card-head">
              <h2 id="enr" className="section-title">
                Open enrollment
              </h2>
              <span className="tag tag-warn">Closes in 3 days · reminders on</span>
            </div>
            <div
              role="img"
              aria-label="29 enrolled, 8 waived, 11 started, 16 not started of 64"
              className="progress progress-lg"
            >
              <span className="bg-ink" style={{ width: "45%" }} />
              <span className="bg-gray" style={{ width: "13%" }} />
              <span className="bg-gold" style={{ width: "17%" }} />
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
              <EnrollStat dot="dot-ink" label="Enrolled and signed" value="29" />
              <EnrollStat dot="dot-gray" label="Waived" value="8" />
              <EnrollStat dot="dot-gold" label="Started" value="11" />
              <EnrollStat dot="dot-empty" label="Not started" value="16" />
            </div>
            <div className="overflow-x-auto">
              <table className="table min-w-[620px]">
                <thead>
                  <tr>
                    <th scope="col" className="th">Employee</th>
                    <th scope="col" className="th">Status</th>
                    <th scope="col" className="th">Last contact</th>
                    <th scope="col" className="th">Language</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td font-semibold">Luis Ortega</td>
                    <td className="td">
                      <Tag variant="bad">Unreachable</Tag>
                    </td>
                    <td className="td text-muted">Text and email bounced · call task</td>
                    <td className="td">Spanish</td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Ashley Kim</td>
                    <td className="td">
                      <Tag variant="warn">Ready to sign</Tag>
                    </td>
                    <td className="td text-muted">Reminder sent today 8:00</td>
                    <td className="td">English</td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Marcus Bell</td>
                    <td className="td">
                      <Tag variant="mute">Not started</Tag>
                    </td>
                    <td className="td text-muted">Invite opened Feb 2</td>
                    <td className="td">English</td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Maria Delgado</td>
                    <td className="td">
                      <Tag variant="ok">Enrolled</Tag>
                    </td>
                    <td className="td text-muted">Replied by text 9:12</td>
                    <td className="td">Spanish</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link href="#" className="link-action self-start">
              View all 64 employees
            </Link>
          </section>

          <section aria-labelledby="act" className="card gap-3">
            <div className="card-head items-center">
              <h2 id="act" className="section-title">
                Activity
              </h2>
              <button type="button" className="btn btn-secondary btn-sm">
                Add note
              </button>
            </div>
            <ol className="m-0 flex list-none flex-col p-0">
              <ActivityItem dot="dot-gold-deep" when="Today 9:05 · iPhone · audit trail saved">
                <strong>Maria Delgado</strong> signed her election form by text
              </ActivityItem>
              <ActivityItem dot="dot-gold" when="Today 8:00 · Automation 4">
                <strong>Automation</strong> sent the outstanding list to Kevin
                Brooks (HR) — group below 70%
              </ActivityItem>
              <ActivityItem dot="dot-gray" when="Today 8:00 · 24 delivered by text, 3 by email">
                <strong>Automation</strong> sent 3-day reminders to 27 employees
              </ActivityItem>
              <ActivityItem
                dot="dot-gray"
                when="Yesterday 3:40 PM · “HR will remind staff at Thursday huddle”"
                last
              >
                <strong>Dana Whitfield</strong> logged a call with Kevin Brooks
              </ActivityItem>
            </ol>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="plans" className="card gap-1">
            <div className="card-head mb-2">
              <h2 id="plans" className="section-title">
                Plans offered
              </h2>
              <Link href="#" className="link-action no-arrow">
                Edit
              </Link>
            </div>
            <div className="divided">
              <PlanBlock
                label="Medical"
                value="[Carrier] PPO 1500 · [Carrier] HMO 3000"
                hint="Employer pays 75% employee-only"
              />
              <PlanBlock
                label="Dental and vision"
                value="[Carrier] Dental PPO · [Carrier] Vision"
                hint="Voluntary"
              />
              <PlanBlock
                label="Life"
                value="Basic life $25,000"
                hint="Employer paid · beneficiary required"
              />
            </div>
          </section>

          <section aria-labelledby="contacts" className="card gap-1">
            <h2 id="contacts" className="section-title mb-2">
              Contacts
            </h2>
            <div className="divided">
              <ContactRow initials="KB" tone="ink" name="Kevin Brooks" sub="HR contact · employer portal" />
              <ContactRow initials="RS" tone="gold" name="Dr. Rachel Stone" sub="Owner · signs agreements" />
            </div>
          </section>

          <Callout
            tone="warn"
            title="Data checks"
            action={
              <Link href="/exceptions" className="link-action">
                Review flags
              </Link>
            }
          >
            2 dependents turn 26 within 90 days. 1 dependent is missing a date
            of birth.
          </Callout>
        </aside>
      </div>
    </StaffShell>
  );
}

function EnrollStat({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 text-[13px] text-muted">
        <span aria-hidden className={`dot ${dot}`} />
        {label}
      </span>
      <span className="stat-figure text-[26px]">{value}</span>
    </div>
  );
}

function ActivityItem({
  dot,
  when,
  children,
  last,
}: {
  dot: string;
  when: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <li className="flex gap-3.5">
      <span aria-hidden className="flex flex-col items-center">
        <span className={`dot ${dot} mt-1.5`} />
        {last ? null : <span className="w-px flex-1 bg-hairline" />}
      </span>
      <div className="flex flex-col gap-0.5 pb-4">
        <span className="leading-snug">{children}</span>
        <span className="text-[13px] text-muted">{when}</span>
      </div>
    </li>
  );
}

function PlanBlock({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex flex-col gap-1 py-3">
      <span className="label">{label}</span>
      <span className="font-semibold leading-snug">{value}</span>
      <span className="text-[13px] text-muted">{hint}</span>
    </div>
  );
}

function ContactRow({
  initials,
  tone,
  name,
  sub,
}: {
  initials: string;
  tone: "gold" | "ink";
  name: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className={`avatar avatar-${tone}`}>{initials}</span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-[13px] text-muted">{sub}</span>
      </div>
      <button type="button" aria-label={`Text ${name}`} className="btn btn-secondary btn-icon">
        <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
      </button>
    </div>
  );
}
