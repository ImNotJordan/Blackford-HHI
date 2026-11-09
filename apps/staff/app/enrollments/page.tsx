"use client";

import Link from "next/link";
import { useState } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

type Status = "not-started" | "started" | "ready" | "done" | "waived";

const STATUS_FILTERS: { key: Status | "all"; label: string; count: number }[] = [
  { key: "all", label: "All", count: 84 },
  { key: "not-started", label: "Not started", count: 25 },
  { key: "started", label: "Started", count: 31 },
  { key: "ready", label: "Ready to sign", count: 6 },
  { key: "done", label: "Done", count: 14 },
  { key: "waived", label: "Waived", count: 8 },
];

const ROWS: {
  name: string;
  group: string;
  groupHref?: string;
  window: string;
  closes: string;
  status: Status;
  statusLabel: string;
  tag: "ok" | "warn" | "info" | "mute";
  reminder: string;
  channel: string;
}[] = [
  { name: "Tuan Nguyen", group: "Riverside Dental", groupHref: "/groups/riverside-dental", window: "Open enrollment", closes: "Feb 28", status: "started", statusLabel: "Started · step 3", tag: "warn", reminder: "Today 8:00", channel: "Text" },
  { name: "Leah Morgan", group: "Riverside Dental", groupHref: "/groups/riverside-dental", window: "Open enrollment", closes: "Feb 28", status: "not-started", statusLabel: "Not started", tag: "mute", reminder: "Today 8:00", channel: "Text" },
  { name: "Priya Nair", group: "Coastal Marine", window: "Life event · birth", closes: "Mar 5", status: "ready", statusLabel: "Ready to sign", tag: "info", reminder: "Feb 14", channel: "Email" },
  { name: "Jordan Price", group: "Riverside Dental", groupHref: "/groups/riverside-dental", window: "New hire", closes: "May 1", status: "not-started", statusLabel: "Invite Apr 1", tag: "mute", reminder: "—", channel: "Text" },
  { name: "Grace Okafor", group: "Individual", window: "Medicare", closes: "Oct 31", status: "not-started", statusLabel: "Not started", tag: "mute", reminder: "—", channel: "Text · Spanish" },
  { name: "Maria Delgado", group: "Riverside Dental", groupHref: "/groups/riverside-dental", window: "Open enrollment", closes: "Feb 28", status: "done", statusLabel: "Done · signed", tag: "ok", reminder: "Stopped", channel: "Text" },
];

export default function EnrollmentsPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const rows = filter === "all" ? ROWS : ROWS.filter((r) => r.status === filter);

  return (
    <StaffShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
            Enrollments
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            Everyone with an open window: open enrollment, new hires, life
            events and individual clients.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/bulk-send" className="btn btn-secondary no-underline">
            Message selected
          </Link>
          <Link href="/agent-assist" className="btn btn-primary no-underline">
            Start in-person session
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Status filter" className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.key)}
                className={`min-h-10 rounded-full border px-3.5 text-[14px] font-semibold ${
                  on
                    ? "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-[var(--brand-ivory)]"
                    : "border-[var(--brand-hairline)] bg-[var(--brand-surface)] text-[var(--brand-ink)] hover:border-[var(--brand-ink)]"
                }`}
              >
                {f.label} · {f.count}
              </button>
            );
          })}
        </div>
        <span className="flex-1" />
        <label className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
          Window
          <select className="field-in !w-auto min-h-10">
            <option>All windows</option>
            <option>Open enrollment</option>
            <option>New hire</option>
            <option>Life event</option>
            <option>Individual</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)]">
          Owner
          <select className="field-in !w-auto min-h-10">
            <option>Me</option>
            <option>Team</option>
          </select>
        </label>
      </div>

      <section aria-label="Enrollment list" className="card px-5 pb-4 pt-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className="th w-8">
                  <input type="checkbox" aria-label="Select all" className="h-[18px] w-[18px] accent-[var(--brand-ink)]" />
                </th>
                <th scope="col" className="th">Person</th>
                <th scope="col" className="th">Group</th>
                <th scope="col" className="th">Window</th>
                <th scope="col" className="th">Closes</th>
                <th scope="col" className="th">Status</th>
                <th scope="col" className="th">Last reminder</th>
                <th scope="col" className="th">Channel</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="td">
                    <input type="checkbox" aria-label={`Select ${r.name}`} className="h-[18px] w-[18px] accent-[var(--brand-ink)]" />
                  </td>
                  <td className="td font-semibold">{r.name}</td>
                  <td className="td">
                    {r.groupHref ? <Link href={r.groupHref}>{r.group}</Link> : r.group}
                  </td>
                  <td className="td">{r.window}</td>
                  <td className="td">{r.closes}</td>
                  <td className="td">
                    <Tag variant={r.tag}>{r.statusLabel}</Tag>
                  </td>
                  <td className="td">{r.reminder}</td>
                  <td className="td">{r.channel}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="td text-center text-[var(--color-text-muted)]">
                    No one in this view on this page.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </StaffShell>
  );
}
