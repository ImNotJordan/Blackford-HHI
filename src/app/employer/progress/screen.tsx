"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { Initials, Tag, btn, cx } from "@/components/ui";
import {
  CONTACT,
  GROUP,
  OUTSTANDING,
  PROGRESS,
  WINDOW_CLOSES,
  daysUntil,
  downloadCsv,
  type OutstandingRow,
} from "@/lib/demo-data";

const statusLabel: Record<OutstandingRow["status"], string> = {
  readyToSign: "Ready to sign",
  notStarted: "Not started",
  started: "Started",
};

const th = "px-2 py-2.5 text-left text-xs font-semibold tracking-[0.06em] text-muted uppercase border-b border-line";
const td = "px-2 py-3 border-b border-line-soft";

const SERIES = [
  { key: "enrolled", label: "Enrolled", swatch: "bg-series-enrolled" },
  { key: "waived", label: "Waived", swatch: "bg-series-waived" },
  { key: "started", label: "Started", swatch: "bg-series-started" },
  { key: "notStarted", label: "Not started", swatch: "bg-sunken border border-line-strong" },
] as const;

export function ProgressScreen() {
  const [toastNode, toast] = useToast();
  const [query, setQuery] = useState("");
  const finished = PROGRESS.enrolled + PROGRESS.waived;
  const outstanding = PROGRESS.total - finished;
  const pct = Math.round((finished / PROGRESS.total) * 100);
  const daysLeft = daysUntil(WINDOW_CLOSES);
  const closes = WINDOW_CLOSES.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const rows = OUTSTANDING.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));

  function downloadList() {
    downloadCsv("riverside-outstanding.csv", [
      ["Employee", "Department", "Status", "Last reminder"],
      ...OUTSTANDING.map((r) => [r.name, r.department, statusLabel[r.status], r.lastReminder]),
    ]);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-[13px] text-muted">{GROUP.name} · plan year starting Mar 1, 2027</p>
          <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight">Open enrollment progress</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.smSecondary} onClick={downloadList}>
            Download outstanding list
          </button>
          <button type="button" className={btn.smPrimary} onClick={() => toast("New-hire form opens under Employees.")}>
            Add a new hire
          </button>
        </div>
      </div>

      {pct < 70 ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-warn-tint px-4 py-3.5 text-warn-ink">
          <span>
            <b>
              {daysLeft} days left and {pct}% done.
            </b>{" "}
            {PROGRESS.notStarted} employees haven&rsquo;t started. A list was emailed to you and {CONTACT.firstName} this morning.
          </span>
          <button
            type="button"
            className={btn.smSecondary}
            onClick={() => toast(`Request sent. ${CONTACT.firstName} will send the reminder from Blackford.`)}
          >
            Ask Blackford to send a reminder
          </button>
        </div>
      ) : null}

      <section aria-labelledby="sum" className="flex flex-wrap items-center gap-8 rounded-[14px] border border-line bg-surface p-6">
        <h2 id="sum" className="sr-only">
          Summary
        </h2>
        <div className="flex flex-[1_1_260px] flex-col gap-1.5">
          <span className="font-display text-[56px] leading-none font-extrabold">{pct}%</span>
          <span className="text-muted">
            {finished} of {PROGRESS.total} employees have finished (enrolled or waived)
          </span>
          <span className="mt-1.5 self-start rounded-full bg-warn-tint px-2.5 py-1 text-[13px] font-bold text-warn">
            Window closes {closes} · {daysLeft} days left
          </span>
        </div>
        <div className="flex flex-[2_1_420px] flex-col gap-3.5">
          <div
            role="img"
            aria-label={`${PROGRESS.enrolled} enrolled, ${PROGRESS.waived} waived, ${PROGRESS.started} started, ${PROGRESS.notStarted} not started, of ${PROGRESS.total}`}
            className="flex h-3.5 overflow-hidden rounded-full bg-sunken"
          >
            <div className="bg-series-enrolled" style={{ width: `${(PROGRESS.enrolled / PROGRESS.total) * 100}%` }} />
            <div className="bg-series-waived" style={{ width: `${(PROGRESS.waived / PROGRESS.total) * 100}%` }} />
            <div className="bg-series-started" style={{ width: `${(PROGRESS.started / PROGRESS.total) * 100}%` }} />
          </div>
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
            {SERIES.map((s) => (
              <div key={s.key} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-1.5 text-[13px] text-muted">
                  <span aria-hidden="true" className={cx("h-2.5 w-2.5 rounded-[3px]", s.swatch)} />
                  {s.label}
                </dt>
                <dd className="m-0 font-display text-[22px] font-extrabold">{PROGRESS[s.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="out" className="flex min-w-0 flex-[3_1_560px] flex-col gap-3 rounded-[14px] border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="out" className="m-0 font-display text-lg font-bold">
              Still to finish · {outstanding}
            </h2>
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-canvas px-2.5">
              <Search aria-hidden="true" size={16} className="text-muted" />
              <span className="sr-only">Find an employee</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find an employee"
                className="w-44 border-0 bg-transparent text-ink outline-none"
              />
            </label>
          </div>
          <p className="m-0 text-[13px] text-muted">
            Blackford sends reminders automatically by text and email. You only see progress here — never anyone&rsquo;s plan
            choices.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  {["Employee", "Department", "Status", "Last reminder"].map((h) => (
                    <th key={h} scope="col" className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className={cx(td, "font-semibold")}>{r.name}</td>
                    <td className={td}>{r.department}</td>
                    <td className={td}>
                      <Tag tone={r.status === "notStarted" ? "mute" : "warn"}>{statusLabel[r.status]}</Tag>
                    </td>
                    <td className={cx(td, "text-muted")}>{r.lastReminder}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-2 py-6 text-center text-muted">
                      No one matches &ldquo;{query}&rdquo;.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-[13px] text-muted">
            Showing {rows.length} sample {rows.length === 1 ? "row" : "rows"} of {outstanding}.
          </p>
        </section>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="next" className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface p-5">
            <h2 id="next" className="m-0 font-display text-lg font-bold">
              What happens next
            </h2>
            <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5 text-ink-2">
              <li>
                <strong className="text-ink">Feb 27</strong> — last reminder goes to everyone outstanding
              </li>
              <li>
                <strong className="text-ink">Feb 28</strong> — window closes; Blackford follows up on each person
              </li>
              <li>
                <strong className="text-ink">Mar 1</strong> — coverage starts; elections go to the carriers
              </li>
              <li>
                <strong className="text-ink">Mar 6</strong> — first paycheck with the new deductions (see Payroll)
              </li>
            </ol>
          </section>

          <section aria-labelledby="help" className="flex flex-col gap-3 rounded-[14px] bg-navy p-5 text-white">
            <h2 id="help" className="m-0 font-display text-lg font-bold">
              Your Blackford contact
            </h2>
            <div className="flex items-center gap-3">
              <Initials text="DW" />
              <div className="flex flex-col">
                <span className="font-semibold">{CONTACT.name}</span>
                <span className="text-[13px] text-on-navy">{CONTACT.role}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toast(`Message to ${CONTACT.firstName} started.`)}
                className="min-h-11 rounded-lg bg-surface px-3.5 font-semibold text-navy hover:bg-canvas"
              >
                Send a message
              </button>
              <a
                href={CONTACT.phoneHref}
                className="flex min-h-11 items-center rounded-lg border border-navy-border px-3.5 font-semibold text-white no-underline hover:bg-navy-active hover:text-white"
              >
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </section>
        </aside>
      </div>
      {toastNode}
    </>
  );
}
