import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Avatar, Callout, Card, Field, PageHeader, SecurityNote } from "@/components/ui";

export default function EmployerCompanyPage() {
  return (
    <PortalShell activeNav="company" userName="Tom Brooks" userInitials="TB">
      <PageHeader
        context="Step 1 of 4 · Bartram Logistics"
        title="Company, contacts, and payroll"
        description="These details set the cost per paycheck your employees see during enrollment, and tell Blackford who to reach."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Company details" id="company-details">
          <Field label="Legal name">
            <input className="field-input" defaultValue="Bartram Logistics LLC" />
          </Field>
          <Field label="Doing business as">
            <input className="field-input" defaultValue="Bartram Logistics" />
          </Field>
          <Field
            label="EIN"
            hintId="ein-note"
            hint="Masked for security. Only Blackford staff with access can see the full number."
          >
            <input
              className="field-input is-locked"
              defaultValue="••-•••6789"
              readOnly
              aria-describedby="ein-note"
            />
          </Field>
          <Field label="Primary address">
            <input
              className="field-input"
              defaultValue="1840 Industrial Park Dr, Tampa, FL 33619"
            />
          </Field>
        </Card>

        <Card title="HR and payroll contacts" id="contacts">
          <div className="panel panel-sunken">
            <span className="eyebrow">HR contact · you</span>
            <div className="flex items-center gap-3">
              <Avatar initials="TB" size="lg" />
              <div className="flex min-w-0 flex-col">
                <strong>Tom Brooks</strong>
                <span className="text-secondary text-sm">Owner</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a href="mailto:tom.brooks@example.com">tom.brooks@example.com</a>
              <span className="font-data text-secondary">(555) 010-0001</span>
            </div>
          </div>

          <div className="panel">
            <span className="eyebrow">Payroll contact</span>
            <Field label="Name">
              <input className="field-input" defaultValue="Alicia Ng" />
            </Field>
            <div className="field-grid">
              <Field label="Work email">
                <input
                  className="field-input"
                  type="email"
                  defaultValue="alicia.ng@example.com"
                />
              </Field>
              <Field label="Mobile">
                <input className="field-input" type="tel" defaultValue="(555) 010-0004" />
              </Field>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Payroll schedule"
        id="payroll"
        description="Pay frequency drives the per-paycheck cost shown on enrollment screens."
        footer={
          <>
            <span className="text-caption text-sm">Changes save to your group record.</span>
            <div className="page-actions">
              <button type="button" className="btn btn-secondary">
                Save company details
              </button>
              <Link href="/employer/setup" className="btn btn-primary">
                Continue to plans →
              </Link>
            </div>
          </>
        }
      >
        <div className="field-grid">
          <Field label="Pay frequency">
            <select className="field-input" defaultValue="biweekly">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly (26 / year)</option>
              <option value="semimonthly">Semimonthly (24 / year)</option>
              <option value="monthly">Monthly</option>
            </select>
          </Field>
          <Field label="Next payday">
            <input className="field-input" type="date" defaultValue="2027-03-13" />
          </Field>
          <Field label="Deduction start">
            <input className="field-input" type="date" defaultValue="2027-07-01" />
          </Field>
        </div>
        <Callout tone="neutral" title="How this shows up for employees">
          Medical PPO employee-only at <span className="font-data">$612.40</span> / month ≈{" "}
          <strong className="font-data">$235.54</strong> per biweekly paycheck, before
          employer contribution.
        </Callout>
      </Card>

      <SecurityNote />
    </PortalShell>
  );
}
