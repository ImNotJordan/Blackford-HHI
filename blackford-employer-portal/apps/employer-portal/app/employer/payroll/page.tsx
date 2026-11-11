"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal-shell";
import { Card, PageHeader, Stat, Tag } from "@/components/ui";

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

const HISTORY = [
  { paycheck: "Feb 20 paycheck", count: 6, by: "Kevin Brooks, Feb 18" },
  { paycheck: "Feb 6 paycheck", count: 3, by: "Kevin Brooks, Feb 4" },
];

const pending = ROWS.filter((r) => r.change).length;

export default function EmployerPayrollPage() {
  const [entered, setEntered] = useState(false);
  const history = entered
    ? [{ paycheck: "Mar 6 paycheck", count: pending, by: "Kevin Brooks, just now" }, ...HISTORY]
    : HISTORY;

  return (
    <PortalShell activeNav="payroll" userName="Kevin Brooks" userInitials="KB">
      <PageHeader
        context="Riverside Dental Group · paid every two weeks"
        title="Payroll deduction updates"
        description="Only changes Blackford has approved appear here. Enter them in your payroll system, then mark them as entered."
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Download CSV for payroll
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={entered}
              onClick={() => setEntered(true)}
            >
              {entered ? `✓ ${pending} marked as entered` : `Mark ${pending} as entered`}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <Stat
          label="To enter before Mar 6"
          value={entered ? "0" : String(pending)}
          hint={entered ? "All caught up" : "Changes waiting for payroll"}
        />
        <Stat label="Net change per paycheck" value="+$214.85" hint="Across all employees" />
        <Stat
          label="Entered this year"
          value={entered ? "35" : "31"}
          hint="Deduction changes"
        />
      </div>

      <Card
        title="Waiting for payroll"
        id="waiting"
        description="Amounts are the employee's share after Riverside's contribution. Full Social Security numbers are never shown here."
      >
        <div className="table-wrap">
          <table className="data-table min-w-[920px]">
            <thead>
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Benefit</th>
                <th scope="col" className="num">Old / paycheck</th>
                <th scope="col" className="num">New / paycheck</th>
                <th scope="col" className="num">From</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={`${r.name}-${r.benefit}`}>
                  <td className="cell-strong">
                    {r.name}
                    <span className="cell-sub">{r.why}</span>
                  </td>
                  <td>{r.benefit}</td>
                  <td className="num cell-muted">{r.oldAmt}</td>
                  <td className={`num ${r.change ? "font-semibold" : "cell-muted"}`}>{r.newAmt}</td>
                  <td className="num cell-muted">{r.from}</td>
                  <td>
                    {!r.change ? (
                      <Tag tone="neutral">No change</Tag>
                    ) : entered ? (
                      <Tag tone="success">Entered</Tag>
                    ) : (
                      <Tag tone="warning">To enter</Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Recently entered" id="history">
        <dl className="detail-list">
          {history.map((h) => (
            <div key={h.paycheck} className="detail-row">
              <dt className="!text-[var(--color-text)]">
                <strong>{h.paycheck}</strong>
                <span className="text-secondary"> · {h.count} changes</span>
              </dt>
              <dd className="text-caption !font-normal text-sm">Marked entered by {h.by}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </PortalShell>
  );
}
