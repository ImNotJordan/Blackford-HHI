"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { Tag, btn, cx } from "@/components/ui";
import { ENROLLMENTS, ENROLLMENT_COUNTS, type EnrollmentRow, type EnrollmentStatus } from "@/lib/demo-data";

const FILTERS: { id: "all" | EnrollmentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "notStarted", label: "Not started" },
  { id: "started", label: "Started" },
  { id: "readyToSign", label: "Ready to sign" },
  { id: "done", label: "Done" },
  { id: "waived", label: "Waived" },
];

const WINDOWS = [
  { id: "all", label: "All windows" },
  { id: "open", label: "Open enrollment" },
  { id: "newHire", label: "New hire" },
  { id: "lifeEvent", label: "Life event" },
  { id: "individual", label: "Individual" },
] as const;

const statusTone: Record<EnrollmentStatus, "ok" | "warn" | "info" | "mute"> = {
  done: "ok",
  started: "warn",
  readyToSign: "info",
  notStarted: "mute",
  invite: "mute",
  waived: "mute",
};

const th = "px-2 py-2.5 text-left text-xs font-semibold tracking-[0.06em] text-muted uppercase border-b border-line";
const td = "px-2 py-[11px] border-b border-line-soft align-middle";

function matchesStatus(row: EnrollmentRow, filter: "all" | EnrollmentStatus) {
  if (filter === "all") return true;
  if (filter === "notStarted") return row.status === "notStarted" || row.status === "invite";
  return row.status === filter;
}

function PersonPanel({ row, onClose, toast }: { row: EnrollmentRow; onClose: () => void; toast: (m: string) => void }) {
  const first = row.person.split(" ")[0];
  return (
    <aside
      aria-labelledby="panel-title"
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 lg:w-[360px] lg:flex-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <h2 id="panel-title" className="m-0 font-display text-xl font-extrabold">
            {row.person}
          </h2>
          <span>
            <Tag tone={statusTone[row.status]}>{row.statusLabel}</Tag>
          </span>
        </div>
        <button type="button" aria-label="Close panel" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-[10px] hover:bg-canvas">
          <X aria-hidden="true" size={18} />
        </button>
      </div>
      <dl className="m-0 flex flex-col text-[13px]">
        <div className="flex justify-between gap-3 border-b border-line-soft py-2">
          <dt className="text-muted">Window</dt>
          <dd className="m-0 text-right">
            {row.window} · closes {row.closes}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-line-soft py-2">
          <dt className="text-muted">Contact</dt>
          <dd className="m-0 text-right">{row.contact}</dd>
        </div>
      </dl>
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0 text-[13px]">
        {row.timeline.map((e) => (
          <li key={e.at} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-1.5 h-2 w-2 flex-none rounded-full bg-brand" />
            <span>
              <b>{e.at}</b> · {e.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="m-0 text-xs leading-normal text-muted">
        You see progress and timestamps only. Plan choices appear after {first} signs.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn.smSecondary} onClick={() => toast(`New link sent to ${first}. The old link no longer works.`)}>
          Resend link
        </button>
        <button type="button" className={btn.smSecondary} onClick={() => toast(`Text to ${first} opened in the shared inbox.`)}>
          Text {first}
        </button>
        {row.status !== "done" ? (
          <Link href="/staff/assist" className={btn.smPrimary}>
            Enroll in person
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export function EnrollmentsScreen() {
  const [toastNode, toast] = useToast();
  const [filter, setFilter] = useState<"all" | EnrollmentStatus>("all");
  const [windowKind, setWindowKind] = useState<(typeof WINDOWS)[number]["id"]>("all");
  const [owner, setOwner] = useState("me");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = ENROLLMENTS.filter(
    (r) => matchesStatus(r, filter) && (windowKind === "all" || r.windowKind === windowKind),
  );
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const open = ENROLLMENTS.find((r) => r.id === openId) ?? null;

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight">Enrollments</h1>
          <p className="m-0 text-muted">
            Everyone with an open window: open enrollment, new hires, life events and individual clients.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btn.smSecondary}
            disabled={selected.size === 0}
            onClick={() => toast(`Bulk send drafted for ${selected.size} ${selected.size === 1 ? "person" : "people"}.`)}
          >
            Message selected{selected.size ? ` (${selected.size})` : ""}
          </button>
          <Link href="/staff/assist" className={btn.smPrimary}>
            Start in-person session
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={cx(
                  "min-h-11 rounded-full border px-3.5 font-semibold",
                  on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-2 hover:bg-canvas",
                )}
              >
                {f.label} · {ENROLLMENT_COUNTS[f.id]}
              </button>
            );
          })}
        </div>
        <span className="flex-1" />
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Window
          <select
            value={windowKind}
            onChange={(e) => setWindowKind(e.target.value as typeof windowKind)}
            className="min-h-11 rounded-lg border border-line-strong bg-surface px-2.5 text-ink"
          >
            {WINDOWS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Owner
          <select value={owner} onChange={(e) => setOwner(e.target.value)} className="min-h-11 rounded-lg border border-line-strong bg-surface px-2.5 text-ink">
            <option value="me">Me</option>
            <option value="team">Team</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <section aria-label="Enrollment list" className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-5 pt-2 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className={cx(th, "w-8")}>
                    <input
                      type="checkbox"
                      aria-label="Select all shown"
                      checked={allSelected}
                      onChange={() =>
                        setSelected((s) => {
                          const n = new Set(s);
                          rows.forEach((r) => (allSelected ? n.delete(r.id) : n.add(r.id)));
                          return n;
                        })
                      }
                      className="h-[18px] w-[18px] accent-brand"
                    />
                  </th>
                  {["Person", "Group", "Window", "Closes", "Status", "Last reminder", "Channel"].map((h) => (
                    <th key={h} scope="col" className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={cx(openId === r.id && "bg-brand-tint/40")}>
                    <td className={td}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${r.person}`}
                        checked={selected.has(r.id)}
                        onChange={() => toggle(r.id)}
                        className="h-[18px] w-[18px] accent-brand"
                      />
                    </td>
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => setOpenId(r.id)}
                        aria-expanded={openId === r.id}
                        className="min-h-11 text-left font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                      >
                        {r.person}
                      </button>
                    </td>
                    <td className={td}>{r.group}</td>
                    <td className={td}>{r.window}</td>
                    <td className={td}>{r.closes}</td>
                    <td className={td}>
                      <Tag tone={statusTone[r.status]}>{r.statusLabel}</Tag>
                    </td>
                    <td className={td}>{r.lastReminder}</td>
                    <td className={td}>{r.channel}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-2 py-8 text-center text-muted">
                      No one in this view.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="mt-3 mb-0 text-xs text-muted">
            Showing {rows.length} sample {rows.length === 1 ? "row" : "rows"} of {ENROLLMENT_COUNTS.all}.
          </p>
        </section>

        {open ? <PersonPanel row={open} onClose={() => setOpenId(null)} toast={toast} /> : null}
      </div>
      {toastNode}
    </>
  );
}
