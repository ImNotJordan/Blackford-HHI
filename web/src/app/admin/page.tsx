import Link from "next/link";
import {
  AutomationStrip,
  ModuleFeatureGrid,
  ModuleTag,
} from "@/components/features";
import { Button, Card, PageHeader, Stat } from "@/components/ui";

export const metadata = { title: "Blackford admin" };

export default function AdminHomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Blackford admin · Module H"
        title="Platform overview"
        description="One Blackford-branded platform — staff, employers, and employees. You oversee access, audit, weekly reports, and carrier approvals."
        actions={
          <Button href="/admin/users" variant="accent">
            Review user access
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="H" name="Audit & platform" />
        <ModuleTag code="G" name="Carrier approvals" />
      </div>

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="ui-card p-5">
          <Stat label="Active groups" value="48" note="All books" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Files awaiting approval" value="3" note="Gateway" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Overdue tasks" value="11" note="Escalated" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Staff with MFA" value="100%" note="Required" />
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise p-6">
          <h2 className="font-display text-xl text-ink">This week’s review</h2>
          <ul className="mt-4">
            {[
              ["Enrollment status", "/admin/reports"],
              ["Carrier file log", "/admin/carriers"],
              ["ACA data capture", "/admin/aca"],
              ["Automations", "/admin/automations"],
              ["Audit log", "/admin/audit"],
            ].map(([label, href]) => (
              <li
                key={label}
                className="flex items-center justify-between border-b border-hairline py-3 text-sm last:border-0"
              >
                <span className="text-ink">{label}</span>
                <Link href={href} className="text-link text-sm">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="animate-rise border-gold bg-parchment p-6">
          <p className="label-mono">Quarterly · Module H</p>
          <h3 className="mt-2 text-ink">User access review due</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Confirm roles: Blackford admin, account manager, employer HR,
            employee, and individual client. Remove people who have left.
          </p>
          <Button href="/admin/users" variant="primary" className="mt-5">
            Open users & roles
          </Button>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-4 font-display text-xl text-ink">MVP modules in scope</h2>
        <ModuleFeatureGrid codes={["A", "B", "C", "D", "E", "F", "G", "H"]} />
      </div>

      <AutomationStrip limit={5} />
    </div>
  );
}
