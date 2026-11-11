import Link from "next/link";
import { GroupSchema } from "@blackford/core";
import { SearchToolbar } from "@/components/search-toolbar";
import { StaffShell } from "@/components/staff-shell";
import { StatCard } from "@/components/ui/stat-card";

void GroupSchema;

export default function MyWorkTodayPage() {
  return (
    <StaffShell>
      <SearchToolbar />

      <div className="flex flex-col gap-2">
        <p className="eyebrow">
          Tuesday, February 16 · Open enrollment for 4 of your groups
        </p>
        <h1 className="page-title">Good morning, Dana</h1>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard label="Tasks due today" value="9" hint="2 overdue" hintAccent />
        <StatCard label="Replies waiting" value="5" hint="Oldest 3 h ago" />
        <StatCard
          label="Employees not yet enrolled"
          value="142"
          hint="Across 4 open windows"
        />
        <StatCard
          label="Carrier files to approve"
          value="2"
          hint="1 has errors"
          hintAccent
        />
      </div>

      <section aria-labelledby="closing" className="card">
        <div className="card-head">
          <h2 id="closing" className="section-title">
            Enrollment windows closing soon
          </h2>
          <Link href="/enrollments" className="link-action">
            All enrollments
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table min-w-[760px]">
            <thead>
              <tr>
                <th scope="col" className="th">Group</th>
                <th scope="col" className="th">Window closes</th>
                <th scope="col" className="th w-[30%]">Progress</th>
                <th scope="col" className="th">Outstanding</th>
                <th scope="col" className="th">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <EnrollmentRow
                group="Riverside Dental Group"
                groupHref="/groups/riverside-dental"
                sub="Open enrollment · 64 eligible"
                closes="Feb 19"
                closesAccent="3 days"
                pct={58}
                warn
                note="Below 70% — HR sent the outstanding list"
                outstanding="27"
              />
              <EnrollmentRow
                group="Coastal Marine Supply"
                sub="Open enrollment · 112 eligible"
                closes="Feb 22"
                closesIn="6 days"
                pct={71}
                outstanding="32"
              />
              <EnrollmentRow
                group="St. Johns Family Clinic"
                sub="Open enrollment · 41 eligible"
                closes="Feb 26"
                closesIn="10 days"
                pct={83}
                outstanding="7"
              />
              <EnrollmentRow
                group="Bartram Logistics"
                sub="New hire window · 3 eligible"
                closes="Mar 4"
                closesIn="16 days"
                pct={33}
                outstanding="2"
              />
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="tasks" className="card min-w-0 flex-[3_1_420px] gap-2">
          <div className="card-head items-center">
            <h2 id="tasks" className="section-title">
              My tasks
            </h2>
            <div role="group" aria-label="Filter tasks" className="segmented">
              <button type="button" aria-pressed="true">
                Today
              </button>
              <button type="button" aria-pressed="false">
                Team queue
              </button>
            </div>
          </div>
          <div className="divided">
            <TaskRow
              title="Call Luis Ortega — text and email both bounced"
              sub="Riverside Dental Group · Automation 12"
              badge="Overdue"
              overdue
            />
            <TaskRow
              title="Approve birth life event — Priya Nair"
              sub="Coastal Marine Supply · proof uploaded"
              badge="Overdue"
              overdue
            />
            <TaskRow
              title="Review census errors returned to HR"
              sub="Ponte Vedra Title Co. · Onboarding"
              badge="Today"
            />
            <TaskRow
              title="Approve dental change file"
              sub="Carrier files · 14 records"
              badge="Today"
            />
            <TaskRow
              title="Send renewal options to HR"
              sub="Bartram Logistics · renews Jun 1"
              badge="Today"
            />
          </div>
        </section>

        <section aria-labelledby="inbox" className="card min-w-0 flex-[2_1_320px] gap-2">
          <div className="card-head">
            <h2 id="inbox" className="section-title">
              Shared inbox
            </h2>
            <Link href="/inbox" className="link-action">
              Open inbox
            </Link>
          </div>
          <div className="divided">
            <InboxPreview
              initials="MD"
              tone="gold"
              name="Maria Delgado"
              time="Text · 9:12"
              preview="Can I add my husband after the window closes?"
            />
            <InboxPreview
              initials="KB"
              tone="ink"
              name="Kevin Brooks · HR"
              time="Email · 8:40"
              preview="Two new hires start Monday — census attached"
            />
            <InboxPreview
              initials="TN"
              name="Tuan Nguyen"
              time="Text · Yesterday"
              preview="Gracias, ya firmé. ¿Cuándo llega la tarjeta?"
            />
          </div>
        </section>
      </div>

      <section aria-labelledby="pipe" className="card">
        <h2 id="pipe" className="section-title">
          My book by stage
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
          <StageCard label="Prospect" value="12" href="/clients" />
          <StageCard label="Quoting" value="4" href="/clients" />
          <StageCard label="Onboarding" value="3" href="/onboarding" />
          <StageCard label="Enrolling" value="4" href="/groups/riverside-dental" active />
          <StageCard label="Active" value="48" href="/clients" />
          <StageCard label="Renewal" value="7" href="/renewals" />
        </div>
      </section>
    </StaffShell>
  );
}

function EnrollmentRow({
  group,
  groupHref,
  sub,
  closes,
  closesAccent,
  closesIn,
  pct,
  warn,
  note,
  outstanding,
}: {
  group: string;
  groupHref?: string;
  sub: string;
  closes: string;
  closesAccent?: string;
  closesIn?: string;
  pct: number;
  warn?: boolean;
  note?: string;
  outstanding: string;
}) {
  return (
    <tr>
      <td className="td">
        {groupHref ? (
          <Link href={groupHref} className="font-semibold text-ink no-underline hover:underline">
            {group}
          </Link>
        ) : (
          <span className="font-semibold">{group}</span>
        )}
        <div className="td-sub">{sub}</div>
      </td>
      <td className="td">
        {closes}
        {closesAccent ? (
          <span className="ml-2 font-semibold text-gold-deep">· {closesAccent}</span>
        ) : closesIn ? (
          <span className="ml-2 text-muted">· {closesIn}</span>
        ) : null}
      </td>
      <td className="td">
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-label={`${group} enrollment progress`}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`progress ${warn ? "progress-warn" : ""}`}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="w-10 text-right font-mono text-[13px] font-medium">{pct}%</span>
        </div>
        {note ? <div className="td-sub text-gold-deep">{note}</div> : null}
      </td>
      <td className="td font-mono text-[13px]">{outstanding}</td>
      <td className="td text-right">
        <button type="button" className="btn btn-secondary btn-sm">
          Text outstanding
        </button>
      </td>
    </tr>
  );
}

function TaskRow({
  title,
  sub,
  badge,
  overdue,
}: {
  title: string;
  sub: string;
  badge: string;
  overdue?: boolean;
}) {
  return (
    <label className="-mx-2 flex cursor-pointer items-start gap-3 rounded-md px-2 py-3 transition-colors hover:bg-ivory">
      <input type="checkbox" className="mt-0.5 h-[18px] w-[18px] shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold leading-snug">{title}</span>
        <span className="text-[13px] text-muted">{sub}</span>
      </span>
      {overdue ? (
        <span className="tag tag-bad">{badge}</span>
      ) : (
        <span className="text-[13px] text-muted">{badge}</span>
      )}
    </label>
  );
}

function InboxPreview({
  initials,
  tone,
  name,
  time,
  preview,
}: {
  initials: string;
  tone?: "gold" | "ink";
  name: string;
  time: string;
  preview: string;
}) {
  return (
    <Link
      href="/inbox"
      className="-mx-2 flex gap-3 rounded-md px-2 py-3 text-ink no-underline transition-colors hover:bg-ivory hover:text-ink"
    >
      <span className={`avatar ${tone ? `avatar-${tone}` : ""}`}>{initials}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex justify-between gap-2">
          <span className="font-semibold">{name}</span>
          <span className="shrink-0 text-xs text-muted">{time}</span>
        </span>
        <span className="truncate text-[14px] text-ink-soft">{preview}</span>
      </span>
    </Link>
  );
}

function StageCard({
  label,
  value,
  href,
  active,
}: {
  label: string;
  value: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`flex flex-col gap-1 rounded-lg border px-4 py-3.5 no-underline transition-colors ${
        active
          ? "border-ink bg-ink text-ivory hover:text-ivory"
          : "border-hairline bg-surface text-ink hover:border-ink hover:text-ink"
      }`}
    >
      <span className={`label ${active ? "text-pale-gold" : ""}`}>{label}</span>
      <span className={`stat-figure text-[28px] ${active ? "stat-figure-on-ink" : ""}`}>
        {value}
      </span>
    </Link>
  );
}
