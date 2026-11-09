import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Card, DetailList, PageHeader, SecurityNote, Tag } from "@/components/ui";

const PLANS = [
  { plan: "Medical PPO 1500", ee: "$612.40", es: "$1,286.04", ec: "$1,102.32", fam: "$1,775.96", share: "75% employee · 50% dependents" },
  { plan: "Medical HDHP 3500", ee: "$471.15", es: "$989.42", ec: "$848.07", fam: "$1,366.34", share: "75% employee · 50% dependents" },
  { plan: "Dental PPO", ee: "$38.20", es: "$76.40", ec: "$84.04", fam: "$122.24", share: "100% employee only" },
  { plan: "Basic life $25,000", ee: "$4.25", es: "—", ec: "—", fam: "—", share: "100%" },
];

export default function EmployerSetupPage() {
  return (
    <PortalShell activeNav="plans" userName="Tom Brooks" userInitials="TB">
      <PageHeader
        context="Step 2 of 4 · Bartram Logistics · effective Jul 1, 2027"
        title="Check your 2027 plan setup"
        description="Dana Whitfield set this up for you. Confirm it, or tell us what to fix, before enrollment opens."
        actions={<Tag tone="warning">Your sign-off due Apr 30</Tag>}
      />

      <Card
        title="Plans offered and monthly cost"
        id="plans-offered"
        description="Total monthly premium per coverage tier, and the share your company pays."
      >
        <div className="table-wrap">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th scope="col">Plan</th>
                <th scope="col" className="num">Employee</th>
                <th scope="col" className="num">+ Spouse</th>
                <th scope="col" className="num">+ Children</th>
                <th scope="col" className="num">Family</th>
                <th scope="col">You pay</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((p) => (
                <tr key={p.plan}>
                  <th scope="row">{p.plan}</th>
                  <td className="num">{p.ee}</td>
                  <td className="num">{p.es}</td>
                  <td className="num">{p.ec}</td>
                  <td className="num">{p.fam}</td>
                  <td className="cell-muted">{p.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Who is eligible" id="eligibility">
          <DetailList
            items={[
              ["Classes", "Office, Drivers"],
              ["Minimum hours", "30 a week"],
              ["Waiting period", "1st of the month after 60 days"],
              ["Dependent children", "Up to age 26"],
            ]}
          />
        </Card>

        <Card title="Enrollment windows" id="windows">
          <DetailList
            items={[
              ["Open enrollment", "May 15 – May 31"],
              ["New hires", "30 days from eligibility"],
              ["Life events", "30 days from the event"],
            ]}
          />
        </Card>
      </div>

      <Card
        title="Employer agreement"
        id="agreement"
        description="Signing confirms the plans, contributions and eligibility above. It's signed electronically and kept with its audit trail on your group's record."
        footer={
          <>
            <button type="button" className="btn btn-secondary">
              Something&apos;s wrong — tell Dana
            </button>
            <button type="button" className="btn btn-primary">
              Review and sign agreement
            </button>
          </>
        }
      >
        <label className="checkbox-row">
          <input type="checkbox" />
          <span>
            I agree to sign electronically.{" "}
            <Link href="#" className="font-semibold">
              Read the consent
            </Link>
          </span>
        </label>
      </Card>

      <SecurityNote>
        Employee SSNs are stored securely; full SSNs are never shown here.
      </SecurityNote>
    </PortalShell>
  );
}
