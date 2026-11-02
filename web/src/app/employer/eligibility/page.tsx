import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Eligibility & windows" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C · Employer onboarding"
        title="Eligibility & windows"
        description="Classes, waiting periods, minimum hours, dependent age limits, OE and new-hire windows."
      />
      <ModuleTag code="C" name="Eligibility" />
      <Card className="mt-4 animate-rise space-y-4 p-6">
        <Field label="Eligibility class">
          <Select defaultValue="ft"><option value="ft">Full-time</option><option value="pt">Part-time</option></Select>
        </Field>
        <Field label="Waiting period">
          <Select defaultValue="30"><option value="0">Date of hire</option><option value="30">First of month after 30 days</option><option value="60">60 days</option></Select>
        </Field>
        <Field label="Minimum hours / week">
          <Input defaultValue="30" inputMode="numeric" />
        </Field>
        <Field label="Dependent age limit">
          <Input defaultValue="26" inputMode="numeric" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Open enrollment start"><Input type="date" defaultValue="2027-02-01" /></Field>
          <Field label="Open enrollment end"><Input type="date" defaultValue="2027-02-28" /></Field>
        </div>
        <ActionButton success="Eligibility saved">Save rules</ActionButton>
      </Card>
    </div>
  );
}
