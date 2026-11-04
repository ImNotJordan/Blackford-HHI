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
        <p className="eyebrow m-0">
          Tuesday, February 16 · Open enrollment for 4 of your groups
        </p>
        <h1
          className="m-0 text-[clamp(28px,4vw,40px)] leading-[1.15] text-[var(--brand-ink)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          Good morning, Dana
        </h1>
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

      <section aria-labelledby="closing" className="card gap-3 pb-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="closing" className="heading m-0 text-lg font-bold">
            Enrollment windows closing soon
          </h2>
          <Link href="/onboarding" className="text-[13px] font-semibold">
            All enrollments
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className="th">
                  Group
                </th>
                <th scope="col" className="th">
                  Window closes
                </th>
                <th scope="col" className="th w-[30%]">
                  Progress
                </th>
                <th scope="col" className="th">
                  Outstanding
                </th>
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
                closesAccent="· 3 days"
                pct={58}
                pctColor="#D97A0B"
                note="Below 70% — HR sent the outstanding list"
                outstanding="27"
              />
              <EnrollmentRow
                group="Coastal Marine Supply"
                sub="Open enrollment · 112 eligible"
                closes="Feb 22 · 6 days"
                pct={71}
                pctColor="var(--color-teal)"
                outstanding="32"
              />
              <EnrollmentRow
                group="St. Johns Family Clinic"
                sub="Open enrollment · 41 eligible"
                closes="Feb 26 · 10 days"
                pct={83}
                pctColor="var(--color-teal)"
                outstanding="7"
              />
              <EnrollmentRow
                group="Bartram Logistics"
                sub="New hire window · 3 eligible"
                closes="Mar 4 · 16 days"
                pct={33}
                pctColor="var(--color-teal)"
                outstanding="2"
                last
              />
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="tasks" className="card min-w-0 flex-[3_1_420px] gap-1">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="tasks" className="heading m-0 text-lg font-bold">
              My tasks
            </h2>
            <div
              role="group"
              aria-label="Filter tasks"
              className="flex gap-1 rounded-lg bg-[var(--color-bg)] p-0.5"
            >
              <button
                type="button"
                aria-pressed
                className="min-h-8 rounded-md bg-white px-3 text-[13px] font-semibold"
              >
                Today
              </button>
              <button
                type="button"
                aria-pressed={false}
                className="min-h-8 rounded-md px-3 text-[13px] text-[var(--color-text-muted)]"
              >
                Team queue
              </button>
            </div>
          </div>
          <TaskRow
            title="Call Luis Ortega — text and email both bounced"
            sub="Riverside Dental Group · Automation 12"
            badge="Overdue"
            badgeWarn
          />
          <TaskRow
            title="Approve birth life event — Priya Nair"
            sub="Coastal Marine Supply · proof uploaded"
            badge="Overdue"
            badgeWarn
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
            last
          />
        </section>

        <section aria-labelledby="inbox" className="card min-w-0 flex-[2_1_320px] gap-1">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="inbox" className="heading m-0 text-lg font-bold">
              Shared inbox
            </h2>
            <Link href="/inbox" className="text-[13px] font-semibold">
              Open inbox
            </Link>
          </div>
          <InboxPreview
            initials="MD"
            bg="#EAF0FD"
            color="#1D4ED8"
            name="Maria Delgado"
            time="Text · 9:12"
            preview="Can I add my husband after the window closes?"
          />
          <InboxPreview
            initials="KB"
            bg="#E6F2F1"
            color="var(--color-teal)"
            name="Kevin Brooks · HR"
            time="Email · 8:40"
            preview="Two new hires start Monday — census attached"
          />
          <InboxPreview
            initials="TN"
            bg="#FDF3E7"
            color="var(--color-amber-dark)"
            name="Tuan Nguyen"
            time="Text · Yesterday"
            preview="Gracias, ya firmé. ¿Cuándo llega la tarjeta?"
            last
          />
        </section>
      </div>

      <section aria-labelledby="pipe" className="card gap-3.5">
        <h2 id="pipe" className="heading m-0 text-lg font-bold">
          My book by stage
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
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
  pct,
  pctColor,
  note,
  outstanding,
  last,
}: {
  group: string;
  groupHref?: string;
  sub: string;
  closes: string;
  closesAccent?: string;
  pct: number;
  pctColor: string;
  note?: string;
  outstanding: string;
  last?: boolean;
}) {
  const name = groupHref ? (
    <Link href={groupHref} className="font-semibold text-[var(--color-text)] no-underline">
      {group}
    </Link>
  ) : (
    <span className="font-semibold">{group}</span>
  );
  return (
    <tr>
      <td className={last ? "py-3.5 px-2" : "td"}>
        {name}
        <div className="text-xs text-[var(--color-text-muted)]">{sub}</div>
      </td>
      <td className={last ? "py-3.5 px-2" : "td"}>
        {closes}{" "}
        {closesAccent ? (
          <span className="font-semibold text-[var(--color-amber-dark)]">
            {closesAccent}
          </span>
        ) : null}
      </td>
      <td className={last ? "py-3.5 px-2" : "td"}>
        <div className="flex items-center gap-2.5">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF1F5]">
            <div
              className="h-full"
              style={{ width: `${pct}%`, background: pctColor }}
            />
          </div>
          <span className="w-10 font-semibold">{pct}%</span>
        </div>
        {note ? (
          <div className="mt-1 text-xs text-[var(--color-amber-dark)]">{note}</div>
        ) : null}
      </td>
      <td className={last ? "py-3.5 px-2" : "td"}>{outstanding}</td>
      <td className={`${last ? "py-3.5 px-2" : "td"} text-right`}>
        <button type="button" className="btn btn-secondary min-h-9 px-3 text-sm">
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
  badgeWarn,
  last,
}: {
  title: string;
  sub: string;
  badge: string;
  badgeWarn?: boolean;
  last?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 py-3 ${last ? "" : "border-b border-[#EEF1F5]"}`}
    >
      <input type="checkbox" className="mt-0.5 h-[18px] w-[18px] accent-[var(--color-teal)]" />
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-[var(--color-text-muted)]">{sub}</span>
      </span>
      <span
        className={`text-xs font-bold ${badgeWarn ? "tag tag-warn" : "text-[var(--color-text-muted)]"}`}
      >
        {badge}
      </span>
    </label>
  );
}

function InboxPreview({
  initials,
  bg,
  color,
  name,
  time,
  preview,
  last,
}: {
  initials: string;
  bg: string;
  color: string;
  name: string;
  time: string;
  preview: string;
  last?: boolean;
}) {
  return (
    <Link
      href="/inbox"
      className={`flex gap-3 py-3 text-[var(--color-text)] no-underline ${last ? "" : "border-b border-[#EEF1F5]"}`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
        style={{ background: bg, color }}
      >
        {initials}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex justify-between gap-2">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{time}</span>
        </span>
        <span className="truncate text-[13px] text-[#3A4756]">{preview}</span>
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
      className={`flex flex-col gap-0.5 rounded-[10px] border px-3.5 py-3 no-underline ${
        active
          ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
          : "border-[var(--color-border)] text-[var(--color-text)]"
      }`}
    >
      <span className={`text-xs ${active ? "text-[#D5ECEA]" : "text-[var(--color-text-muted)]"}`}>
        {label}
      </span>
      <span className="heading text-[22px] font-extrabold">{value}</span>
    </Link>
  );
}
