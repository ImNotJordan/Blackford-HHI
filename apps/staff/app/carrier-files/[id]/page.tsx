"use client";

import Link from "next/link";
import { useState } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

const RECORDS: {
  person: string;
  group: string;
  type: string;
  coverage: string;
  effective: string;
  error?: boolean;
}[] = [
  { person: "Priya Nair + newborn", group: "Coastal Marine", type: "Change", coverage: "Employee + child", effective: "2027-02-03", error: true },
  { person: "Maria Delgado", group: "Riverside Dental", type: "Add", coverage: "Employee + spouse", effective: "2027-03-01" },
  { person: "Tuan Nguyen", group: "Riverside Dental", type: "Add", coverage: "Family", effective: "2027-03-01" },
  { person: "James Porter", group: "Bartram Logistics", type: "Termination", coverage: "Employee only", effective: "2027-02-28" },
  { person: "Ashley Kim", group: "Riverside Dental", type: "Add", coverage: "Employee only", effective: "2027-03-01" },
];

const EXPORT_LOG = [
  { title: "Feb 9 file · 21 records", sub: "Sent by Dana Whitfield 10:14 AM", status: "Confirmed", tag: "ok" as const },
  { title: "Feb 2 file · 8 records", sub: "1 rejected — returned to staff", status: "Partial", tag: "warn" as const },
  { title: "Jan 26 file · 5 records", sub: "Sent by Marcus Lee 9:02 AM", status: "Confirmed", tag: "ok" as const },
];

export default function CarrierFilePage() {
  const [held, setHeld] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/carrier-files" className="no-underline">
          Carrier files
        </Link>{" "}
        <span aria-hidden>/</span> Dental change file
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
              [Carrier] Dental — weekly change file
            </h1>
            {sent ? (
              <Tag variant="info">Sent · waiting for confirmation</Tag>
            ) : (
              <Tag variant="warn">Waiting for approval</Tag>
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--color-text-muted)]">
            <span>Built Feb 16, 6:00 AM by Automation 15</span>
            <span>Changes since Feb 9 file</span>
            <span>Delivery: SFTP</span>
            <span>3 groups</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Download preview
          </button>
          <button
            type="button"
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!held || sent}
            onClick={() => setSent(true)}
            title={held ? undefined : "Hold or fix the record with an error first"}
          >
            {sent ? "13 records sent" : "Approve and send 13 records"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <Figure label="Adds" value="9" />
        <Figure label="Changes" value="3" />
        <Figure label="Terminations" value="2" />
        <Figure label="Errors" value={held ? "0" : "1"} warn={!held} />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-6">
          <section aria-labelledby="err" className="card flex flex-col gap-3.5 border-[var(--brand-gold)]">
            <h2 id="err" className="heading m-0 text-lg">
              Fix before sending
            </h2>
            {held ? (
              <p className="m-0 text-[14px]">
                Priya Nair&apos;s change is held for the next file. A task to add
                the newborn&apos;s date of birth is on her record.
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-[var(--brand-parchment)] px-4 py-3.5">
                <div className="flex flex-[1_1_300px] items-start gap-3">
                  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--brand-ruby)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0">
                    <path d="M12 3 2 20h20L12 3z" />
                    <path d="M12 10v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Priya Nair · Coastal Marine Supply</span>
                    <span className="text-[13px]">
                      Add dependent (newborn): date of birth is missing. The
                      carrier template requires it.
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-secondary min-h-10" onClick={() => setHeld(true)}>
                    Hold and send the rest
                  </button>
                  <Link href="/exceptions" className="btn btn-primary min-h-10 no-underline">
                    Fix record
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section aria-labelledby="recs" className="card flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="recs" className="heading m-0 text-lg">
                Records in this file
              </h2>
              <label className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
                Show
                <select className="field-in !w-auto min-h-9">
                  <option>All 14</option>
                  <option>Adds</option>
                  <option>Changes</option>
                  <option>Terminations</option>
                  <option>Errors</option>
                </select>
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr>
                    <th scope="col" className="th">Person</th>
                    <th scope="col" className="th">Group</th>
                    <th scope="col" className="th">Type</th>
                    <th scope="col" className="th">Coverage</th>
                    <th scope="col" className="th">Effective</th>
                    <th scope="col" className="th">Check</th>
                  </tr>
                </thead>
                <tbody>
                  {RECORDS.map((r) => (
                    <tr key={r.person} className={r.error && !held ? "bg-[var(--brand-ivory)]" : undefined}>
                      <td className="td font-semibold">{r.person}</td>
                      <td className="td">{r.group}</td>
                      <td className="td">{r.type}</td>
                      <td className="td">{r.coverage}</td>
                      <td className="td font-[family-name:var(--font-mono)] text-[13px]">{r.effective}</td>
                      <td className="td">
                        {r.error ? (
                          held ? <Tag variant="mute">Held</Tag> : <Tag variant="bad">1 error</Tag>
                        ) : (
                          <Tag variant="ok">Valid</Tag>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="self-start cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]">
              Show 9 more
            </button>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="deliv" className="card flex flex-col gap-3">
            <h2 id="deliv" className="heading m-0 text-lg">
              Delivery
            </h2>
            <Row label="Method" value="SFTP · encrypted" />
            <Row label="Template" value="[Carrier] Dental CSV v3" />
            <Row label="Confirmation expected" value="Within 5 business days" />
            <Row label="Approver" value="Dana Whitfield" last />
          </section>

          <section aria-labelledby="log" className="card flex flex-col gap-1">
            <h2 id="log" className="heading m-0 mb-2 text-lg">
              Export log
            </h2>
            {sent ? (
              <LogRow title="Feb 16 file · 13 records" sub="Sent by Dana Whitfield just now" status="Sent" tag="info" />
            ) : null}
            {EXPORT_LOG.map((l, i) => (
              <LogRow key={l.title} {...l} last={i === EXPORT_LOG.length - 1} />
            ))}
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}

function Figure({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={`card flex flex-col gap-1 px-5 py-4 ${
        warn ? "border-[var(--brand-gold)] bg-[var(--brand-parchment)]" : ""
      }`}
    >
      <span className="text-[13px] text-[var(--brand-ink)]">{label}</span>
      <span className="stat-figure !text-[26px]">{value}</span>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 text-[14px] ${last ? "" : "border-b border-[var(--brand-hairline)] pb-2.5"}`}>
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function LogRow({
  title,
  sub,
  status,
  tag,
  last,
}: {
  title: string;
  sub: string;
  status: string;
  tag: "ok" | "warn" | "info";
  last?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 py-2.5 ${last ? "" : "border-b border-[var(--brand-hairline)]"}`}>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-[var(--color-text-muted)]">{sub}</span>
      </div>
      <span className="self-start">
        <Tag variant={tag}>{status}</Tag>
      </span>
    </div>
  );
}
