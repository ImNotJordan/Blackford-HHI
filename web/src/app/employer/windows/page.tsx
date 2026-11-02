import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Enrollment windows" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module C · D" title="OE & new-hire windows" description="Open enrollment and new-hire enrollment windows for your group." />
      <ModuleTag code="C" name="Windows" />
      <Card className="mt-4 space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="active">OE open</StatusChip>
          <StatusChip tone="auto">New-hire rolling</StatusChip>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="OE start"><Input type="date" defaultValue="2027-02-01" /></Field>
          <Field label="OE end"><Input type="date" defaultValue="2027-02-28" /></Field>
        </div>
        <Field label="New-hire window length" hint="Days after eligibility date">
          <Input defaultValue="30" inputMode="numeric" />
        </Field>
        <ActionButton success="Windows saved">Save windows</ActionButton>
      </Card>
    </div>
  );
}
