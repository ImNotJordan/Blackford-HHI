import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default function RenewalPage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/changes" className="no-underline">
          Renewals
        </Link>{" "}
        <span aria-hidden>/</span> Bartram Logistics renewal
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
              Bartram Logistics · 2027 renewal
            </h1>
            <Tag variant="info">Rates entered</Tag>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[var(--color-text-muted)]">
            <span>Renews Jul 1, 2027</span>
            <span>Started by Automation 14 on Mar 3 (120 days out)</span>
            <span>48 enrolled employees</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Send to employer for sign-off
          </button>
          <button type="button" className="btn btn-primary">
            Open re-enrollment window
          </button>
        </div>
      </header>

      <section aria-labelledby="cal" className="card gap-3.5">
        <h2 id="cal" className="heading m-0 text-lg font-bold">
          Renewal calendar
        </h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 p-0">
          <CalStep color="var(--color-teal)" title="Renewal started" sub="Mar 3 · done" />
          <CalStep color="var(--color-teal)" title="Carrier rates in" sub="Apr 2 · done" />
          <CalStep color="#1D4ED8" title="Employer sign-off" sub="Due Apr 30" />
          <CalStep color="#C5CED8" title="Re-enrollment window" sub="May 15 – May 31" />
          <CalStep color="#C5CED8" title="Carrier files" sub="By Jun 7" />
          <CalStep color="#C5CED8" title="Effective" sub="Jul 1" />
        </ol>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="rates" className="card min-w-0 flex-[3_1_560px] gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="rates" className="heading m-0 text-lg font-bold">
              Monthly rates by tier
            </h2>
            <span className="text-[13px] text-[var(--color-text-muted)]">
              Current → 2027 · employer pays 75% employee, 50% dependents
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr>
                  <th className="th">Plan</th>
                  <th className="th">Employee</th>
                  <th className="th">+ Spouse</th>
                  <th className="th">+ Children</th>
                  <th className="th">Family</th>
                  <th className="th">Change</th>
                </tr>
              </thead>
              <tbody>
                <RateRow plan="Medical PPO 1500" rates={["612.40", "1,286.04", "1,102.32", "1,775.96"]} change="warn" changeLabel="+6.8%" />
                <RateRow plan="Medical HDHP 3500" rates={["471.15", "989.42", "848.07", "1,366.34"]} change="warn" changeLabel="+4.1%" />
                <RateRow plan="Dental PPO" rates={["38.20", "76.40", "84.04", "122.24"]} change="ok" changeLabel="No change" last />
              </tbody>
            </table>
          </div>
          <label className="flex min-h-11 items-center gap-2.5">
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-[var(--color-teal)]" />
            Passive renewal: people who do nothing keep their current plan at the
            new rate
          </label>
        </section>

        <aside className="card min-w-0 flex-[2_1_300px]">
          <h2 className="heading mb-1.5 m-0 text-lg font-bold">Renewal tasks</h2>
          <RenewalTask done label="Request renewal rates from carriers" date="Mar 10" />
          <RenewalTask done label="Enter 2027 rates" date="Apr 2" />
          <RenewalTask label="Employer signs renewal and contributions" date="Apr 30" warn />
          <RenewalTask label="Refresh census and eligibility" date="May 8" />
          <RenewalTask label="Open re-enrollment window" date="May 15" last />
        </aside>
      </div>
    </StaffShell>
  );
}

function CalStep({ color, title, sub }: { color: string; title: string; sub: string }) {
  return (
    <li className="flex flex-col gap-0.5 border-t-4 pt-2.5" style={{ borderColor: color }}>
      <span className="font-semibold">{title}</span>
      <span className="text-[13px] text-[var(--color-text-muted)]">{sub}</span>
    </li>
  );
}

function RateRow({
  plan,
  rates,
  change,
  changeLabel,
  last,
}: {
  plan: string;
  rates: string[];
  change: "warn" | "ok";
  changeLabel: string;
  last?: boolean;
}) {
  return (
    <tr>
      <td className={last ? "td border-0" : "td"}>
        <b>{plan}</b>
        <div className="text-xs text-[var(--color-text-muted)]">[Carrier]</div>
      </td>
      {rates.map((r) => (
        <td key={r} className={last ? "td border-0" : "td"}>
          <input
            className="field-in w-[84px] min-h-9 text-right font-mono text-[13px]"
            aria-label={`${plan} rate`}
            defaultValue={r}
            readOnly
          />
        </td>
      ))}
      <td className={last ? "td border-0" : "td"}>
        <Tag variant={change}>{changeLabel}</Tag>
      </td>
    </tr>
  );
}

function RenewalTask({
  label,
  date,
  done,
  warn,
  last,
}: {
  label: string;
  date: string;
  done?: boolean;
  warn?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 py-2.5 ${last ? "" : "border-b border-[#EEF1F5]"}`}>
      <input
        type="checkbox"
        defaultChecked={done}
        aria-label={done ? "Done" : "Not done"}
        className="mt-0.5 h-5 w-5 accent-[var(--color-teal)]"
      />
      <span className="flex-1">{label}</span>
      <span className={`text-xs ${warn ? "font-semibold text-[var(--color-amber-dark)]" : "text-[var(--color-text-muted)]"}`}>
        {date}
      </span>
    </div>
  );
}
