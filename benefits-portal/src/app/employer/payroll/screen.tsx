"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";
import { Tag, btn, cx } from "@/components/ui";
import { EMPLOYER, GROUP, PAYROLL_HISTORY, PAYROLL_ROWS, downloadCsv, money, type PayrollRow } from "@/lib/demo-data";

const th = "px-2 py-2.5 text-left text-xs font-semibold tracking-[0.06em] text-muted uppercase border-b border-line";
const td = "px-2 py-[11px] border-b border-line-soft align-middle";
const mono = "font-mono text-[13px]";

const statusText: Record<PayrollRow["status"], string> = {
  toEnter: "To enter",
  noChange: "No change",
  entered: "Entered",
};

const statusTag: Record<PayrollRow["status"], React.ReactNode> = {
  toEnter: <Tag tone="warn">{statusText.toEnter}</Tag>,
  noChange: <Tag tone="mute">{statusText.noChange}</Tag>,
  entered: <Tag tone="ok">{statusText.entered}</Tag>,
};

export function PayrollScreen() {
  const [toastNode, toast] = useToast();
  const [rows, setRows] = useState(PAYROLL_ROWS);
  const [history, setHistory] = useState(PAYROLL_HISTORY);

  const toEnter = rows.filter((r) => r.status === "toEnter");
  const netChange = toEnter.reduce((acc, r) => acc + (r.newAmount - r.oldAmount), 0);
  const enteredThisYear = 31 + rows.filter((r) => r.status === "entered").length;

  function markEntered() {
    const count = toEnter.length;
    if (!count) return;
    setRows((rs) => rs.map((r) => (r.status === "toEnter" ? { ...r, status: "entered" } : r)));
    setHistory((h) => [{ paycheck: "Mar 6 paycheck", changes: count, by: EMPLOYER.hrName, on: "today" }, ...h]);
    toast(`${count} changes marked as entered in payroll.`);
  }

  function download() {
    downloadCsv("riverside-payroll-changes.csv", [
      ["Employee", "Why", "Benefit", "Old per paycheck", "New per paycheck", "From paycheck", "Status"],
      ...rows.map((r) => [r.employee, r.why, r.benefit, r.oldAmount.toFixed(2), r.newAmount.toFixed(2), r.fromPaycheck, statusText[r.status]]),
    ]);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight">Payroll deduction updates</h1>
          <p className="m-0 text-muted">
            {GROUP.name} · paid every two weeks · only changes Blackford has approved appear here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.smSecondary} onClick={download}>
            Download CSV for payroll
          </button>
          <button type="button" className={btn.smPrimary} onClick={markEntered} disabled={toEnter.length === 0}>
            {toEnter.length ? `Mark ${toEnter.length} as entered in payroll` : "All entered"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1 rounded-xl border border-warn-line bg-warn-tint p-5">
          <span className="text-[13px] text-warn-deep">To enter before Mar 6 paycheck</span>
          <span className="font-display text-[26px] font-extrabold text-warn-deep">{toEnter.length}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-5">
          <span className="text-[13px] text-muted">Net change per paycheck</span>
          <span className="font-display text-[26px] font-extrabold">
            {netChange >= 0 ? "+" : "−"}
            {money(Math.abs(netChange))}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-5">
          <span className="text-[13px] text-muted">Entered this year</span>
          <span className="font-display text-[26px] font-extrabold">{enteredThisYear}</span>
        </div>
      </div>

      <section aria-labelledby="new" className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
        <h2 id="new" className="m-0 font-display text-lg font-bold">
          Waiting for payroll
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr>
                {["Employee", "Why", "Benefit", "Old per paycheck", "New per paycheck", "From paycheck", "Status"].map((h) => (
                  <th key={h} scope="col" className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={cx(td, "font-semibold")}>{r.employee}</td>
                  <td className={td}>{r.why}</td>
                  <td className={td}>{r.benefit}</td>
                  <td className={cx(td, mono)}>{money(r.oldAmount)}</td>
                  <td className={cx(td, mono)}>{money(r.newAmount)}</td>
                  <td className={cx(td, mono)}>{r.fromPaycheck}</td>
                  <td className={td}>{statusTag[r.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-[13px] text-muted">
          Amounts are the employee&rsquo;s share after {GROUP.shortName}&rsquo;s contribution. Full Social Security numbers are never
          shown here.
        </p>
      </section>

      <section aria-labelledby="hist" className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-5">
        <h2 id="hist" className="m-0 mb-2 font-display text-lg font-bold">
          Recently entered
        </h2>
        {history.map((h, i) => (
          <div key={`${h.paycheck}-${i}`} className="flex flex-wrap justify-between gap-3 border-b border-line-soft py-2 last:border-b-0">
            <span>
              <b>{h.paycheck}</b> · {h.changes} changes
            </span>
            <span className="text-[13px] text-muted">
              Marked entered by {h.by}, {h.on}
            </span>
          </div>
        ))}
      </section>
      {toastNode}
    </>
  );
}
