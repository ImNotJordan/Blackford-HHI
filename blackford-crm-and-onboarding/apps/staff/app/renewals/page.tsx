import { StaffShell } from "@/components/staff-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

type StepState = "done" | "current" | "upcoming";

const STEPS: { title: string; sub: string; state: StepState }[] = [
  { title: "Renewal started", sub: "Mar 3 · done", state: "done" },
  { title: "Carrier rates in", sub: "Apr 2 · done", state: "done" },
  { title: "Employer sign-off", sub: "Due Apr 30", state: "current" },
  { title: "Re-enrollment window", sub: "May 15 – May 31", state: "upcoming" },
  { title: "Carrier files", sub: "By Jun 7", state: "upcoming" },
  { title: "Effective", sub: "Jul 1", state: "upcoming" },
];

const STEP_BORDER: Record<StepState, string> = {
  done: "border-ink",
  current: "border-gold",
  upcoming: "border-hairline",
};

export default function RenewalPage() {
  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Renewals", href: "/changes" }, { label: "Bartram Logistics renewal" }]}
        title="Bartram Logistics · 2027 renewal"
        tags={<Tag variant="info">Rates entered</Tag>}
        meta={[
          "Renews Jul 1, 2027",
          "Started by Automation 14 on Mar 3 (120 days out)",
          "48 enrolled employees",
        ]}
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Send to employer for sign-off
            </button>
            <button type="button" className="btn btn-primary">
              Open re-enrollment window
            </button>
          </>
        }
      />

      <section aria-labelledby="cal" className="card">
        <h2 id="cal" className="section-title">
          Renewal calendar
        </h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 p-0">
          {STEPS.map((s) => (
            <li
              key={s.title}
              aria-current={s.state === "current" ? "step" : undefined}
              className={`flex flex-col gap-0.5 border-t-4 pt-3 ${STEP_BORDER[s.state]}`}
            >
              <span className={`font-semibold ${s.state === "upcoming" ? "text-ink-soft" : ""}`}>
                {s.title}
              </span>
              <span className={`text-[13px] ${s.state === "current" ? "font-semibold text-gold-deep" : "text-muted"}`}>
                {s.sub}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="rates" className="card min-w-0 flex-[3_1_560px]">
          <div className="card-head">
            <h2 id="rates" className="section-title">
              Monthly rates by tier
            </h2>
            <span className="text-[13px] text-muted">
              Current → 2027 · employer pays 75% employee, 50% dependents
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table min-w-[680px]">
              <thead>
                <tr>
                  <th scope="col" className="th">Plan</th>
                  <th scope="col" className="th">Employee</th>
                  <th scope="col" className="th">+ Spouse</th>
                  <th scope="col" className="th">+ Children</th>
                  <th scope="col" className="th">Family</th>
                  <th scope="col" className="th">Change</th>
                </tr>
              </thead>
              <tbody>
                <RateRow plan="Medical PPO 1500" rates={["612.40", "1,286.04", "1,102.32", "1,775.96"]} change="warn" changeLabel="+6.8%" />
                <RateRow plan="Medical HDHP 3500" rates={["471.15", "989.42", "848.07", "1,366.34"]} change="warn" changeLabel="+4.1%" />
                <RateRow plan="Dental PPO" rates={["38.20", "76.40", "84.04", "122.24"]} change="ok" changeLabel="No change" />
              </tbody>
            </table>
          </div>
          <label className="check-row border-t border-divider pt-4">
            <input type="checkbox" defaultChecked />
            Passive renewal: people who do nothing keep their current plan at the
            new rate
          </label>
        </section>

        <aside className="card min-w-0 flex-[2_1_300px] gap-1">
          <h2 className="section-title mb-1">Renewal tasks</h2>
          <div className="divided">
            <RenewalTask done label="Request renewal rates from carriers" date="Mar 10" />
            <RenewalTask done label="Enter 2027 rates" date="Apr 2" />
            <RenewalTask label="Employer signs renewal and contributions" date="Apr 30" warn />
            <RenewalTask label="Refresh census and eligibility" date="May 8" />
            <RenewalTask label="Open re-enrollment window" date="May 15" />
          </div>
        </aside>
      </div>
    </StaffShell>
  );
}

function RateRow({
  plan,
  rates,
  change,
  changeLabel,
}: {
  plan: string;
  rates: string[];
  change: "warn" | "ok";
  changeLabel: string;
}) {
  return (
    <tr>
      <td className="td">
        <span className="font-semibold">{plan}</span>
        <div className="td-sub">[Carrier]</div>
      </td>
      {rates.map((r) => (
        <td key={r} className="td">
          <input
            className="field-in min-h-9 w-[96px] text-right font-mono text-[13px]"
            aria-label={`${plan} rate`}
            defaultValue={r}
            readOnly
          />
        </td>
      ))}
      <td className="td">
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
}: {
  label: string;
  date: string;
  done?: boolean;
  warn?: boolean;
}) {
  return (
    <label className="check-row items-center py-3">
      <input type="checkbox" defaultChecked={done} />
      <span className={`flex-1 ${done ? "text-muted line-through decoration-hairline" : ""}`}>{label}</span>
      <span className={`font-mono text-xs ${warn ? "font-medium text-gold-deep" : "text-muted"}`}>
        {date}
      </span>
    </label>
  );
}
