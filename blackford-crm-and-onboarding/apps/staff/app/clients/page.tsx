import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";

export default function ClientsPage() {
  return (
    <StaffShell>
      <PageHeader
        eyebrow="74 groups · 186 individual and Medicare households"
        title="Clients and groups"
        actions={
          <>
            <Link href="/import" className="btn btn-secondary">
              Import spreadsheet
            </Link>
            <Link href="/clients/new" className="btn btn-primary">
              New client
            </Link>
          </>
        }
      />

      <Callout
        tone="warn"
        title="Import of current_book.xlsx: 6 possible duplicates"
        action={
          <Link href="/import" className="btn btn-primary btn-sm">
            Review duplicates
          </Link>
        }
      >
        412 records imported. 6 match an existing client by EIN, email or phone
        and are waiting for you to merge or keep separate.
      </Callout>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Client filter" className="flex flex-wrap gap-2">
          <FilterPill active>All</FilterPill>
          <FilterPill>Employer groups</FilterPill>
          <FilterPill>Individuals</FilterPill>
          <FilterPill>Medicare</FilterPill>
          <FilterPill>My clients</FilterPill>
          <button type="button" className="pill pill-dashed">
            + Save filter
          </button>
        </div>
        <div role="group" aria-label="View" className="segmented">
          <button type="button" aria-pressed="false">
            List
          </button>
          <button type="button" aria-pressed="true">
            Pipeline
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1150px] grid-cols-5 gap-4">
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
              warn
              progress={33}
              progressLabel="3/9"
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

      <p className="m-0 text-[13px] text-muted">
        Active clients (48) are in List view. Drag a card to move it to the next
        stage; marking a group Signed starts its onboarding checklist.
      </p>
    </StaffShell>
  );
}

function FilterPill({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <button type="button" aria-pressed={active ? "true" : "false"} className="pill">
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
    <section aria-label={title} className="flex flex-col gap-2.5 rounded-lg bg-sand p-3">
      <div className="flex items-center justify-between px-1 py-0.5">
        <h2 className="label m-0 text-ink-soft">{title}</h2>
        <span className="rounded-full bg-surface px-2 font-mono text-[11px] text-muted">{count}</span>
      </div>
      {children}
    </section>
  );
}

function PipelineCard({
  href,
  title,
  sub,
  warn,
  meta,
  owner,
  progress,
  progressLabel,
  progressWarn,
}: {
  href?: string;
  title: string;
  sub: string;
  warn?: boolean;
  meta?: string;
  owner?: string;
  progress?: number;
  progressLabel?: string;
  progressWarn?: boolean;
}) {
  const inner = (
    <>
      <span className="font-semibold leading-snug">{title}</span>
      <span className={`text-[13px] ${warn ? "font-semibold text-gold-deep" : "text-muted"}`}>
        {sub}
      </span>
      {progress != null ? (
        <span className="mt-1 flex items-center gap-2 text-xs text-muted">
          <span className={`progress progress-sm ${progressWarn ? "progress-warn" : ""}`}>
            <span style={{ width: `${progress}%` }} />
          </span>
          <span className="font-mono">{progressLabel}</span>
        </span>
      ) : (
        <span className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>{meta}</span>
          {owner ? <span className="avatar avatar-sm avatar-gold h-6 w-6 text-[10px]">{owner}</span> : null}
        </span>
      )}
    </>
  );
  const className = `flex flex-col gap-1 rounded-lg border bg-surface p-3.5 text-ink no-underline shadow-[var(--shadow-card)] transition-[border-color,box-shadow] ${
    warn ? "border-gold" : "border-hairline"
  } ${href ? "hover:border-ink hover:text-ink hover:shadow-[var(--shadow-raised)]" : ""}`;
  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
