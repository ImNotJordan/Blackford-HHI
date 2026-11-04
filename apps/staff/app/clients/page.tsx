import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";

export default function ClientsPage() {
  return (
    <StaffShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
            74 groups · 186 individual and Medicare households
          </p>
          <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
            Clients and groups
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/import" className="btn btn-secondary no-underline">
            Import spreadsheet
          </Link>
          <Link href="/clients/new" className="btn btn-primary no-underline">
            New client
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F3D3AE] bg-[#FDF3E7] px-4 py-3.5">
        <div className="flex min-w-[360px] flex-1 items-start gap-3">
          <WarningIcon />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">
              Import of current_book.xlsx: 6 possible duplicates
            </span>
            <span className="text-[13px] text-[#5C3204]">
              412 records imported. 6 match an existing client by EIN, email or
              phone and are waiting for you to merge or keep separate.
            </span>
          </div>
        </div>
        <Link href="/import" className="btn min-h-10 border-0 bg-[var(--color-text)] text-white no-underline">
          Review duplicates
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active>All</FilterPill>
          <FilterPill>Employer groups</FilterPill>
          <FilterPill>Individuals</FilterPill>
          <FilterPill>Medicare</FilterPill>
          <FilterPill>My clients</FilterPill>
          <button
            type="button"
            className="min-h-[38px] rounded-full border border-dashed border-[#8A97A6] bg-transparent px-3.5 text-[13px] text-[#3A4756]"
          >
            + Save filter
          </button>
        </div>
        <div
          role="group"
          aria-label="View"
          className="flex gap-1 rounded-[10px] bg-[#E9EDF2] p-0.5"
        >
          <button type="button" className="min-h-9 rounded-lg px-3.5 text-[13px] text-[#3A4756]">
            List
          </button>
          <button
            type="button"
            aria-pressed
            className="min-h-9 rounded-lg bg-white px-3.5 text-[13px] font-semibold"
          >
            Pipeline
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1150px] grid-cols-5 gap-3.5">
          <PipelineColumn title="Prospect" count={12}>
            <PipelineCard title="Mayport Auto Body" sub="Group · ~22 employees · referral" meta="Follow up Feb 18" owner="DW" />
            <PipelineCard title="Helen and Roy Carter" sub="Medicare household · turns 65 Jun" meta="Call scheduled" owner="ML" />
            <PipelineCard title="San Marco Bakery" sub="Group · ~9 employees · web form" meta="New today" owner="DW" />
          </PipelineColumn>
          <PipelineColumn title="Quoting" count={4}>
            <PipelineCard title="Ponte Vedra Title Co." sub="Group · 31 employees · proposal sent" meta="Decision by Feb 25" owner="DW" />
            <PipelineCard title="Ortiz Landscaping" sub="Group · 18 employees · census in" meta="Rates due Feb 20" owner="ML" />
          </PipelineColumn>
          <PipelineColumn title="Onboarding" count={3}>
            <PipelineCard
              href="/onboarding"
              title="Bartram Logistics"
              sub="Group · effective Apr 1"
              progress={56}
              progressLabel="5/9"
            />
            <PipelineCard
              title="Atlantic Beach Fitness"
              sub="Census errors returned to HR"
              subWarn
              progress={33}
              progressLabel="3/9"
              warnBorder
            />
          </PipelineColumn>
          <PipelineColumn title="Enrolling" count={4}>
            <PipelineCard
              href="/groups/riverside-dental"
              title="Riverside Dental Group"
              sub="Closes Feb 19"
              progress={58}
              progressLabel="58%"
              progressWarn
            />
            <PipelineCard title="Coastal Marine Supply" sub="Closes Feb 22" progress={71} progressLabel="71%" />
          </PipelineColumn>
          <PipelineColumn title="Renewal" count={7}>
            <PipelineCard href="/renewals" title="Southside Pediatrics" sub="Renews May 1 · rates received" meta="Options to HR" owner="DW" />
            <PipelineCard title="Bartram Logistics" sub="Renews Jun 1 · waiting on rates" meta="120-day task list open" owner="DW" />
          </PipelineColumn>
        </div>
      </div>

      <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
        Active clients (48) are in List view. Drag a card to move it to the next
        stage; marking a group Signed starts its onboarding checklist.
      </p>
    </StaffShell>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#A1540A" strokeWidth={2} className="mt-px shrink-0">
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function FilterPill({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-[38px] rounded-full px-3.5 text-[13px] ${
        active
          ? "border border-[var(--color-text)] bg-[var(--color-text)] font-semibold text-white"
          : "border border-[var(--color-border)] bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function PipelineColumn({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-2.5 rounded-xl bg-[#E9EDF2] p-3">
      <div className="flex justify-between px-1 py-0.5">
        <h2 className="m-0 text-[13px] font-bold uppercase tracking-wider text-[#3A4756]">
          {title}
        </h2>
        <span className="text-[13px] text-[var(--color-text-muted)]">{count}</span>
      </div>
      {children}
    </section>
  );
}

function PipelineCard({
  href,
  title,
  sub,
  subWarn,
  meta,
  owner,
  progress,
  progressLabel,
  progressWarn,
  warnBorder,
}: {
  href?: string;
  title: string;
  sub: string;
  subWarn?: boolean;
  meta?: string;
  owner?: string;
  progress?: number;
  progressLabel?: string;
  progressWarn?: boolean;
  warnBorder?: boolean;
}) {
  const inner = (
    <>
      <span className="font-semibold">{title}</span>
      <span className={`text-xs ${subWarn ? "font-semibold text-[var(--color-amber-dark)]" : "text-[var(--color-text-muted)]"}`}>
        {sub}
      </span>
      {progress != null ? (
        <span className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF1F5]">
            <span
              className="block h-full"
              style={{
                width: `${progress}%`,
                background: progressWarn ? "#D97A0B" : "var(--color-teal)",
              }}
            />
          </span>
          {progressLabel}
        </span>
      ) : (
        <span className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>{meta}</span>
          {owner ? (
            <span className="font-bold text-[var(--color-teal)]">{owner}</span>
          ) : null}
        </span>
      )}
    </>
  );
  const className = `flex flex-col gap-1.5 rounded-[10px] border bg-white p-3 no-underline text-[var(--color-text)] ${
    warnBorder ? "border-[#F3D3AE]" : "border-[var(--color-border)]"
  }`;
  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
