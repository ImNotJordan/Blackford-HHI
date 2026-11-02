"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
} from "lucide-react";
import { ActionButton } from "@/components/interactive";
import { Button, Card, StatusChip } from "@/components/ui";
import { SignaturePad } from "@/components/interactive";

/** Module F — staff-entered change or termination */
export function StaffChangeForm() {
  const [kind, setKind] = useState<"change" | "term">("change");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-4" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="mt-2 font-display text-xl text-ink">
          {kind === "term" ? "Termination queued" : "Change queued"}
        </p>
        <p className="mt-1 text-sm text-ink">
          Logged on the client record. Weekly change-day automation will draft
          the carrier file for approval (Automation 15).
        </p>
        <Button href="/manager/carriers" variant="secondary" className="mt-4">
          View carrier drafts
        </Button>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div
        className="inline-flex rounded-[10px] border border-hairline bg-ivory p-1"
        role="group"
        aria-label="Change type"
      >
        {(
          [
            ["change", "Coverage change"],
            ["term", "Termination"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            className={`ui-press min-h-9 rounded-[8px] px-3 text-sm font-medium ${
              kind === value ? "bg-ink text-ivory" : "text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-sm">
        <span className="label-mono mb-2 block">Employee / client</span>
        <select className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink">
          <option>Aisha Patel · Harbor Light</option>
          <option>Marcus Lee · Harbor Light</option>
          <option>James Ortega · Individual</option>
        </select>
      </label>

      {kind === "change" ? (
        <>
          <label className="block text-sm">
            <span className="label-mono mb-2 block">Change</span>
            <select className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink">
              <option>Plan change · Medical</option>
              <option>Add dependent</option>
              <option>Remove dependent</option>
              <option>Address / contact update</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="label-mono mb-2 block">Effective date</span>
            <input
              type="date"
              defaultValue="2027-03-15"
              className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
            />
          </label>
        </>
      ) : (
        <>
          <label className="block text-sm">
            <span className="label-mono mb-2 block">Termination reason</span>
            <select className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink">
              <option>Employment ended</option>
              <option>Loss of eligibility</option>
              <option>Voluntary cancel</option>
              <option>Deceased</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="label-mono mb-2 block">Last day of coverage</span>
            <input
              type="date"
              defaultValue="2027-03-31"
              className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
            />
          </label>
        </>
      )}

      <label className="block text-sm">
        <span className="label-mono mb-2 block">Staff note</span>
        <textarea
          className="min-h-24 w-full rounded-[10px] border border-hairline bg-surface px-3 py-2 text-sm text-ink"
          placeholder="Reason and any carrier caveats…"
          defaultValue={
            kind === "term"
              ? "Employment ended Mar 15 · COBRA packet separate"
              : "Plan upgrade requested by HR · mid-year exception"
          }
        />
      </label>

      <button
        type="button"
        className="ui-press inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-ruby px-4 text-[15px] font-medium text-ivory"
        onClick={() => setDone(true)}
      >
        {kind === "term" ? "Submit termination" : "Submit staff change"}
      </button>
    </Card>
  );
}

type DeliveryRow = {
  id: string;
  audience: string;
  channel: string;
  status: "Queued" | "Sent" | "Delivered" | "Opened" | "Failed" | "Bounced" | "Fallback";
  at: string;
  fallback?: string;
};

const deliverySeed: DeliveryRow[] = [
  {
    id: "d1",
    audience: "Harbor Light · not enrolled",
    channel: "Text",
    status: "Delivered",
    at: "10:02 AM",
  },
  {
    id: "d2",
    audience: "Harbor Light · not enrolled",
    channel: "Email",
    status: "Opened",
    at: "10:14 AM",
  },
  {
    id: "d3",
    audience: "M. Alvarez",
    channel: "Text",
    status: "Failed",
    at: "9:58 AM",
    fallback: "Email queued",
  },
  {
    id: "d4",
    audience: "M. Alvarez",
    channel: "Email",
    status: "Bounced",
    at: "10:01 AM",
    fallback: "Call task created (Automation 12)",
  },
  {
    id: "d5",
    audience: "Rivers & Reed · OE digest",
    channel: "Email",
    status: "Sent",
    at: "Mon 8:00 AM",
  },
];

export function DeliveryTrackingBoard() {
  const [rows, setRows] = useState(deliverySeed);
  const failed = rows.filter(
    (r) => r.status === "Failed" || r.status === "Bounced",
  ).length;

  return (
    <div className="panel-fit space-y-3">
      <div className="stagger grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="label-mono">Sends today</p>
          <p className="mt-1 font-display text-2xl text-ink">{rows.length}</p>
        </Card>
        <Card className="p-4">
          <p className="label-mono">Failed / bounce</p>
          <p className="mt-1 font-display text-2xl text-ink">{failed}</p>
        </Card>
        <Card className="border-gold bg-parchment p-4">
          <p className="label-mono">Automation 12</p>
          <p className="mt-1 text-sm text-ink">
            Other channel on fail · both fail → call task
          </p>
        </Card>
      </div>

      <Card className="divide-y divide-hairline overflow-hidden">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-start justify-between gap-2 px-3 py-3 sm:px-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {r.channel === "Text" ? (
                  <MessageSquare className="h-4 w-4 shrink-0 text-gold-deep" />
                ) : r.channel === "Email" ? (
                  <Mail className="h-4 w-4 shrink-0 text-gold-deep" />
                ) : (
                  <Phone className="h-4 w-4 shrink-0 text-gold-deep" />
                )}
                <p className="break-safe font-medium text-ink">{r.audience}</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {r.channel} · {r.at}
                {r.fallback ? ` · ${r.fallback}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                tone={
                  r.status === "Failed" || r.status === "Bounced"
                    ? "danger"
                    : r.status === "Fallback"
                      ? "warning"
                      : "success"
                }
              >
                {r.status}
              </StatusChip>
              {(r.status === "Failed" || r.status === "Bounced") && (
                <button
                  type="button"
                  className="ui-press min-h-9 rounded-[10px] border border-hairline bg-surface px-3 text-xs font-medium text-ink"
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === r.id
                          ? {
                              ...x,
                              status: "Fallback",
                              fallback: "Retried · call task open",
                            }
                          : x,
                      ),
                    )
                  }
                >
                  Retry / escalate
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

const filters = [
  { id: "f1", label: "Not yet enrolled · Harbor Light", count: 44 },
  { id: "f2", label: "Groups · Onboarding", count: 3 },
  { id: "f3", label: "Turning 65 · 6 months", count: 7 },
  { id: "f4", label: "Open service requests", count: 5 },
  { id: "f5", label: "My book · Active", count: 28 },
];

export function SavedSearchFilters({
  query: initial = "Harbor",
}: {
  query?: string;
}) {
  const [q, setQ] = useState(initial);
  const [active, setActive] = useState("f1");
  const results = useMemo(() => {
    const map: Record<string, { name: string; meta: string; href: string }[]> = {
      f1: [
        {
          name: "Sofia Nguyen",
          meta: "Harbor Light · Not started",
          href: "/manager/clients/cl-1042",
        },
        {
          name: "Noah Grant",
          meta: "Harbor Light · In progress",
          href: "/manager/clients/cl-1042",
        },
      ],
      f2: [
        {
          name: "Rivers & Reed LLP",
          meta: "Onboarding · census errors",
          href: "/manager/onboarding/cl-1088",
        },
      ],
      f3: [
        {
          name: "James Ortega",
          meta: "Individual · Medicare flag",
          href: "/manager/clients/cl-2210",
        },
      ],
      f4: [
        {
          name: "ID card · Aisha Patel",
          meta: "Due today",
          href: "/manager/service-requests",
        },
      ],
      f5: [
        {
          name: "Palm Coast Logistics",
          meta: "Active · renewal soon",
          href: "/manager/groups/cl-0901",
        },
      ],
    };
    return map[active] ?? [];
  }, [active]);

  return (
    <div className="panel-fit space-y-3">
      <Card className="p-3 sm:p-4">
        <label className="block">
          <span className="sr-only">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm text-ink"
            placeholder="Clients, groups, policies, EIN…"
            aria-label="Global search"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Filter className="h-3.5 w-3.5" /> Saved filters
          </span>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`ui-press rounded-full border px-2.5 py-1 text-xs font-medium ${
                active === f.id
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline bg-surface text-ink"
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-70">({f.count})</span>
            </button>
          ))}
        </div>
      </Card>
      <Card className="divide-y divide-hairline">
        {results.map((r) => (
          <Link
            key={r.name}
            href={r.href}
            className="block px-3 py-3 no-underline hover:bg-ivory sm:px-4"
          >
            <p className="font-medium text-ink">{r.name}</p>
            <p className="text-sm text-muted">
              {r.meta}
              {q ? ` · match “${q}”` : ""}
            </p>
          </Link>
        ))}
      </Card>
    </div>
  );
}

type RateRow = {
  plan: string;
  ee: string;
  es: string;
  ec: string;
  fam: string;
  status: "Current" | "Proposed" | "Accepted";
};

export function RenewalRatesBoard() {
  const [rows, setRows] = useState<RateRow[]>([
    {
      plan: "Florida Blue Gold PPO 1500",
      ee: "186.40",
      es: "372.80",
      ec: "335.50",
      fam: "520.10",
      status: "Current",
    },
    {
      plan: "Florida Blue Gold PPO 1500",
      ee: "198.20",
      es: "396.40",
      ec: "356.00",
      fam: "552.80",
      status: "Proposed",
    },
    {
      plan: "Guardian Dental PPO",
      ee: "18.50",
      es: "36.00",
      ec: "42.00",
      fam: "58.00",
      status: "Proposed",
    },
  ]);
  const [windowOpen, setWindowOpen] = useState(false);

  return (
    <div className="panel-fit space-y-3">
      <Card className="border-gold bg-parchment p-4">
        <p className="label-mono">Automation 14 · 120-day renewal</p>
        <p className="mt-1 font-display text-xl text-ink">
          Palm Coast Logistics · May 1, 2027
        </p>
        <p className="mt-1 text-sm text-ink">
          Collect rates → confirm contributions → open re-enrollment window.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-hairline bg-ivory px-3 py-2.5">
          <h3 className="text-ink">Rate updates by tier</h3>
        </div>
        <ul className="divide-y divide-hairline">
          {rows.map((r, i) => (
            <li
              key={`${r.plan}-${r.status}-${i}`}
              className="grid gap-2 px-3 py-3 text-sm sm:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="break-safe font-medium text-ink">{r.plan}</p>
                <StatusChip
                  tone={
                    r.status === "Proposed"
                      ? "warning"
                      : r.status === "Accepted"
                        ? "success"
                        : "neutral"
                  }
                >
                  {r.status}
                </StatusChip>
              </div>
              {(
                [
                  ["EE", "ee"],
                  ["ES", "es"],
                  ["EC", "ec"],
                  ["Fam", "fam"],
                ] as const
              ).map(([label, key]) => (
                <label key={key} className="block">
                  <span className="label-mono !text-[9px]">{label} / pay</span>
                  <input
                    className="mt-1 min-h-9 w-full rounded-[8px] border border-hairline bg-surface px-2 font-mono text-xs text-ink"
                    value={r[key]}
                    disabled={r.status === "Current"}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, [key]: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </label>
              ))}
              {r.status === "Proposed" ? (
                <button
                  type="button"
                  className="ui-press min-h-9 rounded-[10px] bg-ink px-3 text-xs font-medium text-ivory"
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((x, idx) =>
                        idx === i ? { ...x, status: "Accepted" } : x,
                      ),
                    )
                  }
                >
                  Accept
                </button>
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="label-mono">Re-enrollment window</p>
            <p className="text-sm text-ink">
              {windowOpen
                ? "Open · Apr 1 – Apr 21, 2027 · invites scheduling"
                : "Not opened · accept proposed rates first"}
            </p>
          </div>
          <StatusChip tone={windowOpen ? "success" : "warning"}>
            {windowOpen ? "Window open" : "Pending rates"}
          </StatusChip>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            success="Rates saved"
          >
            Save rate sheet
          </ActionButton>
          <button
            type="button"
            className="ui-press inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-ruby px-4 text-sm font-medium text-ivory disabled:opacity-45"
            disabled={
              windowOpen || rows.some((r) => r.status === "Proposed")
            }
            onClick={() => setWindowOpen(true)}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Open re-enrollment window
          </button>
        </div>
      </Card>
    </div>
  );
}

export function NewHireIntakeForm() {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-4" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="mt-2 font-display text-xl text-ink">New hire added</p>
        <p className="mt-1 text-sm text-ink">
          Eligibility date computed · invite scheduled (Automation 6). Shows on
          enrollment progress when the window opens.
        </p>
        <Button href="/employer" variant="accent" className="mt-4">
          Back to progress
        </Button>
      </Card>
    );
  }
  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Legal name</span>
        <input
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          defaultValue="Casey Nguyen"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Hire date</span>
          <input
            type="date"
            defaultValue="2027-03-10"
            className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          />
        </label>
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Class</span>
          <select className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink">
            <option>Full-time</option>
            <option>Part-time</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Hours / week</span>
          <input
            defaultValue="40"
            inputMode="numeric"
            className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          />
        </label>
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Mobile</span>
          <input
            defaultValue="(904) 555-0199"
            className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          />
        </label>
      </div>
      <Card className="border-gold bg-parchment p-3">
        <p className="label-mono">Computed eligibility</p>
        <p className="mt-1 text-sm font-medium text-ink">
          First of month after 30 days · Apr 1, 2027
        </p>
        <p className="mt-1 text-xs text-muted">
          New-hire window · invite scheduled for Mar 25
        </p>
      </Card>
      <button
        type="button"
        className="ui-press inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-ruby px-4 text-[15px] font-medium text-ivory"
        onClick={() => setDone(true)}
      >
        Add new hire & schedule invite
      </button>
    </Card>
  );
}

export function EmployerAgreementSign() {
  return (
    <div className="panel-fit space-y-3">
      <Card className="p-4">
        <p className="label-mono">Module E · Employer agreement</p>
        <h2 className="mt-1 font-display text-xl text-ink">
          Broker of record & portal agreement
        </h2>
        <p className="mt-2 text-sm text-muted">
          Same e-sign path as employee elections — electronic-records consent
          first, then signature. Audit trail stored on the group.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-ink">
          <li>· Authorize Blackford as broker of record</li>
          <li>· Confirm census accuracy responsibility</li>
          <li>· Agree to electronic records and notices</li>
        </ul>
      </Card>
      <SignaturePad
        continueHref="/employer/setup"
        defaultName="Jordan Miles"
        continueLabel="Continue to setup approval"
        successBody="Employer agreement signed · audit trail on the group record. Setup can proceed."
      />
    </div>
  );
}

const reportBlocks = {
  enrollment: {
    title: "Enrollment status",
    rows: [
      ["Harbor Light", "76%", "3 days left", "Below 70% cleared"],
      ["Rivers & Reed", "43%", "Window open", "Setup locked"],
      ["Palm Coast", "93%", "Closed", "Change files drafting"],
    ],
  },
  carrier: {
    title: "Carrier submission",
    rows: [
      ["Florida Blue · cf-88", "Pending approval", "2 errors", "Maya"],
      ["Guardian · cf-87", "Delivered", "0 errors", "Confirmed"],
      ["MetLife · cf-80", "Awaiting confirm", "0 errors", "Auto 17"],
    ],
  },
  onboarding: {
    title: "Onboarding SLA",
    rows: [
      ["Rivers & Reed", "5/8 steps", "Census overdue", "Jordan Miles"],
      ["Coastal Clinics", "8/8 steps", "Ready to enroll", "Sam Ortiz"],
    ],
  },
  quality: {
    title: "Data quality",
    rows: [
      ["Age 26 in 60d", "Nora Patel", "Harbor Light", "Open"],
      ["Missing SSN", "Omar Patel", "Harbor Light", "Blocking"],
      ["Turning 65", "James Ortega", "Individual", "Flagged"],
    ],
  },
} as const;

export function ReportsWorkspace({
  audience = "manager",
}: {
  audience?: "manager" | "admin";
}) {
  const [tab, setTab] =
    useState<keyof typeof reportBlocks>("enrollment");
  const block = reportBlocks[tab];

  return (
    <div className="panel-fit space-y-3">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(reportBlocks) as (keyof typeof reportBlocks)[]).map(
          (key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`ui-press rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                tab === key
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline bg-surface text-ink"
              }`}
            >
              {reportBlocks[key].title}
            </button>
          ),
        )}
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-hairline bg-ivory px-3 py-2.5">
          <p className="label-mono">
            {audience === "admin" ? "All books" : "My book"}
          </p>
          <h2 className="font-display text-lg text-ink">{block.title}</h2>
        </div>
        <ul className="divide-y divide-hairline">
          {block.rows.map((row) => (
            <li
              key={row.join("-")}
              className="grid grid-cols-2 gap-2 px-3 py-3 text-sm sm:grid-cols-4"
            >
              {row.map((cell, i) => (
                <span
                  key={i}
                  className={`break-safe ${i === 0 ? "font-medium text-ink" : "text-muted"}`}
                >
                  {cell}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </Card>
      <div className="flex flex-wrap gap-2">
        <ActionButton variant="secondary" success="CSV ready">
          Export CSV
        </ActionButton>
        <Button href="/manager/data-quality" variant="ghost">
          Open data quality
        </Button>
      </div>
    </div>
  );
}
