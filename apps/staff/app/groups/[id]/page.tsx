import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

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
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/clients" className="no-underline">
          Clients and groups
        </Link>{" "}
        <span aria-hidden>/</span> {name}
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
              {name}
            </h1>
            <Tag variant="ok">Enrolling</Tag>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--color-text-muted)]">
            <span>Employer group · 64 eligible</span>
            <span>Effective Mar 1, 2027</span>
            <span>Window Feb 1 – Feb 19</span>
            <span>Owner: Dana Whitfield</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Add task
          </button>
          <Link href="/agent-assist" className="btn btn-secondary no-underline">
            Start in-person session
          </Link>
          <button type="button" className="btn btn-primary">
            Message group
          </button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Record sections"
        className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)]"
      >
        {[
          "Overview",
          "Employees 64",
          "Plans and rates",
          "Eligibility",
          "Onboarding",
          "Messages",
          "Documents",
          "Service requests",
        ].map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className={`min-h-11 shrink-0 border-0 bg-transparent px-3.5 whitespace-nowrap ${
              i === 0
                ? "border-b-2 border-[var(--color-teal)] font-bold text-[var(--color-text)]"
                : "border-b-2 border-transparent text-[var(--color-text-muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-6">
          <section aria-labelledby="enr" className="card gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="enr" className="heading m-0 text-lg font-bold">
                Open enrollment
              </h2>
              <span className="text-[13px] font-semibold text-[var(--color-amber-dark)]">
                Closes in 3 days · reminders on
              </span>
            </div>
            <div aria-hidden className="flex h-3 overflow-hidden rounded-full bg-[#EEF1F5]">
              <div className="w-[45%] bg-[var(--color-teal)]" />
              <div className="w-[13%] bg-[#6BB3AD]" />
              <div className="w-[17%] bg-[#D97A0B]" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
              <EnrollStat color="var(--color-teal)" label="Enrolled and signed" value="29" />
              <EnrollStat color="#6BB3AD" label="Waived" value="8" />
              <EnrollStat color="#D97A0B" label="Started" value="11" />
              <EnrollStat color="#EEF1F5" label="Not started" value="16" outline />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse">
                <thead>
                  <tr>
                    <th className="th">Employee</th>
                    <th className="th">Status</th>
                    <th className="th">Last contact</th>
                    <th className="th">Language</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td font-semibold">Luis Ortega</td>
                    <td className="td">
                      <Tag variant="warn">Unreachable</Tag>
                    </td>
                    <td className="td text-[var(--color-text-muted)]">
                      Text and email bounced · call task
                    </td>
                    <td className="td">Spanish</td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Ashley Kim</td>
                    <td className="td">
                      <Tag variant="warn">Ready to sign</Tag>
                    </td>
                    <td className="td text-[var(--color-text-muted)]">
                      Reminder sent today 8:00
                    </td>
                    <td className="td">English</td>
                  </tr>
                  <tr>
                    <td className="td font-semibold">Marcus Bell</td>
                    <td className="td">
                      <Tag variant="mute">Not started</Tag>
                    </td>
                    <td className="td text-[var(--color-text-muted)]">
                      Invite opened Feb 2
                    </td>
                    <td className="td">English</td>
                  </tr>
                  <tr>
                    <td className="td border-0 font-semibold">Maria Delgado</td>
                    <td className="td border-0">
                      <Tag variant="ok">Enrolled</Tag>
                    </td>
                    <td className="td border-0 text-[var(--color-text-muted)]">
                      Replied by text 9:12
                    </td>
                    <td className="td border-0">Spanish</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link href="#" className="text-[13px] font-semibold">
              View all 64 employees
            </Link>
          </section>

          <section aria-labelledby="act" className="card gap-1">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 id="act" className="heading m-0 text-lg font-bold">
                Activity
              </h2>
              <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                Add note
              </button>
            </div>
            <ActivityItem color="var(--color-teal)">
              <strong>Maria Delgado</strong> signed her election form by text
              <span className="text-xs text-[var(--color-text-muted)]">
                Today 9:05 · iPhone · audit trail saved
              </span>
            </ActivityItem>
            <ActivityItem color="#D97A0B">
              <strong>Automation</strong> sent the outstanding list to Kevin Brooks
              (HR) — group below 70%
              <span className="text-xs text-[var(--color-text-muted)]">
                Today 8:00 · Automation 4
              </span>
            </ActivityItem>
            <ActivityItem color="#8A97A6">
              <strong>Automation</strong> sent 3-day reminders to 27 employees
              <span className="text-xs text-[var(--color-text-muted)]">
                Today 8:00 · 24 delivered by text, 3 by email
              </span>
            </ActivityItem>
            <ActivityItem color="#8A97A6" last>
              <strong>Dana Whitfield</strong> logged a call with Kevin Brooks
              <span className="text-xs text-[var(--color-text-muted)]">
                Yesterday 3:40 PM · “HR will remind staff at Thursday huddle”
              </span>
            </ActivityItem>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="plans" className="card gap-3">
            <div className="flex items-baseline justify-between">
              <h2 id="plans" className="heading m-0 text-lg font-bold">
                Plans offered
              </h2>
              <Link href="#" className="text-[13px] font-semibold">
                Edit
              </Link>
            </div>
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
            <PlanBlock label="Life" value="Basic life $25,000" hint="Employer paid · beneficiary required" last />
          </section>

          <section aria-labelledby="contacts" className="card gap-3">
            <h2 id="contacts" className="heading m-0 text-lg font-bold">
              Contacts
            </h2>
            <ContactRow initials="KB" bg="#EAF0FD" color="#1D4ED8" name="Kevin Brooks" sub="HR contact · employer portal" />
            <ContactRow initials="RS" bg="#E6F2F1" color="var(--color-teal)" name="Dr. Rachel Stone" sub="Owner · signs agreements" />
          </section>

          <section
            aria-labelledby="flags"
            className="card gap-2 border-[#F3D3AE] bg-[#FDF3E7]"
          >
            <h2 id="flags" className="heading m-0 text-base font-bold text-[#7A3F06]">
              Data checks
            </h2>
            <p className="m-0 text-[#5C3204]">
              2 dependents turn 26 within 90 days. 1 dependent is missing a date
              of birth.
            </p>
            <Link href="/exceptions" className="text-[13px] font-semibold text-[#7A3F06]">
              Review flags
            </Link>
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}

function EnrollStat({
  color,
  label,
  value,
  outline,
}: {
  color: string;
  label: string;
  value: string;
  outline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)]">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{
            background: color,
            border: outline ? "1px solid #C5CED8" : undefined,
          }}
        />
        {label}
      </span>
      <span className="heading text-[22px] font-extrabold">{value}</span>
    </div>
  );
}

function ActivityItem({
  color,
  children,
  last,
}: {
  color: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex gap-3.5 py-2.5 ${last ? "" : ""}`}>
      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function PlanBlock({
  label,
  value,
  hint,
  last,
}: {
  label: string;
  value: string;
  hint: string;
  last?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 pb-3 ${last ? "" : "border-b border-[#EEF1F5]"}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="font-semibold">{value}</span>
      <span className="text-[13px] text-[var(--color-text-muted)]">{hint}</span>
    </div>
  );
}

function ContactRow({
  initials,
  bg,
  color,
  name,
  sub,
}: {
  initials: string;
  bg: string;
  color: string;
  name: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
        style={{ background: bg, color }}
      >
        {initials}
      </span>
      <div className="flex flex-1 flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-[13px] text-[var(--color-text-muted)]">{sub}</span>
      </div>
      <button
        type="button"
        aria-label={`Text ${name}`}
        className="btn btn-secondary h-11 w-11 min-h-0 p-0"
      >
        <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
      </button>
    </div>
  );
}
