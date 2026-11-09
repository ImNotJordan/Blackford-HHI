"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";

const ROWS: {
  name: string;
  why: string;
  benefit: string;
  oldAmt: string;
  newAmt: string;
  from: string;
  change: boolean;
}[] = [
  { name: "Maria Delgado", why: "Open enrollment", benefit: "Medical PPO 1500 · EE + spouse", oldAmt: "$118.20", newAmt: "$142.50", from: "Mar 6", change: true },
  { name: "Maria Delgado", why: "Open enrollment", benefit: "Dental PPO · EE + spouse", oldAmt: "$18.40", newAmt: "$18.40", from: "—", change: false },
  { name: "Tuan Nguyen", why: "Open enrollment", benefit: "Medical PPO 1500 · Family", oldAmt: "$0.00", newAmt: "$212.75", from: "Mar 6", change: true },
  { name: "Priya Nair", why: "Life event · birth (approved Feb 16)", benefit: "Medical · EE → EE + child", oldAmt: "$96.10", newAmt: "$122.40", from: "Mar 6", change: true },
  { name: "James Porter", why: "Termination", benefit: "All benefits end Feb 28", oldAmt: "$146.30", newAmt: "$0.00", from: "Mar 6", change: true },
];

export default function EmployerPayrollPage() {
  const [entered, setEntered] = useState(false);

  return (
    <PortalShell activeNav="payroll" userName="Kevin Brooks" userInitials="KB">

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1
              className="m-0 text-[30px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Payroll deduction updates
            </h1>
            <p className="m-0 text-[var(--color-text-muted)]">
              Riverside Dental Group · paid every two weeks · only changes
              Blackford has approved appear here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary">
              Download CSV for payroll
            </button>
            <button
              type="button"
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={entered}
              onClick={() => setEntered(true)}
            >
              {entered ? "4 marked as entered" : "Mark 4 as entered in payroll"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Figure label="To enter before Mar 6 paycheck" value={entered ? "0" : "4"} />
          <Figure label="Net change per paycheck" value="+$214.85" />
          <Figure label="Entered this year" value={entered ? "35" : "31"} />
        </div>

        <section aria-labelledby="new" className="card flex flex-col gap-3">
          <h2 id="new" className="m-0 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Waiting for payroll
          </h2>
          <div className="overflow-x-auto">
            <table className="portal-table w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Why</th>
                  <th scope="col">Benefit</th>
                  <th scope="col">Old per paycheck</th>
                  <th scope="col">New per paycheck</th>
                  <th scope="col">From paycheck</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={`${r.name}-${r.benefit}`}>
                    <td className="font-semibold">{r.name}</td>
                    <td>{r.why}</td>
                    <td>{r.benefit}</td>
                    <td className="font-[family-name:var(--font-mono)] text-[13px]">{r.oldAmt}</td>
                    <td className="font-[family-name:var(--font-mono)] text-[13px]">{r.newAmt}</td>
                    <td className="font-[family-name:var(--font-mono)] text-[13px]">{r.from}</td>
                    <td>
                      {!r.change ? (
                        <span className="tag tag-mute">No change</span>
                      ) : entered ? (
                        <span className="tag tag-ok">Entered</span>
                      ) : (
                        <span className="tag tag-warn">To enter</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-[13px] text-[var(--color-text-muted)]">
            Amounts are the employee&apos;s share after Riverside&apos;s
            contribution. Full Social Security numbers are never shown here.
          </p>
        </section>

        <section aria-labelledby="hist" className="card flex flex-col gap-1">
          <h2 id="hist" className="m-0 mb-2 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Recently entered
          </h2>
          {entered ? (
            <div className="detail-row">
              <span>
                <b>Mar 6 paycheck</b> · 4 changes
              </span>
              <span className="text-[13px] text-[var(--color-text-muted)]">Marked entered by Kevin Brooks, just now</span>
            </div>
          ) : null}
          <div className="detail-row">
            <span>
              <b>Feb 20 paycheck</b> · 6 changes
            </span>
            <span className="text-[13px] text-[var(--color-text-muted)]">Marked entered by Kevin Brooks, Feb 18</span>
          </div>
          <div className="detail-row border-b-0">
            <span>
              <b>Feb 6 paycheck</b> · 3 changes
            </span>
            <span className="text-[13px] text-[var(--color-text-muted)]">Marked entered by Kevin Brooks, Feb 4</span>
          </div>
        </section>
      </main>
    </PortalShell>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="eyebrow m-0">{label}</span>
      <span className="text-[32px] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </span>
    </div>
  );
}
