import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, Field, PageHeader, Select, Textarea } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Waive reason" };

export default function Page() {
  return (
    <EmployeeShell step={4}>
      <PageHeader
        eyebrow="Module D · H · ACA"
        title="Waive reason"
        description="Required when you waive a benefit — kept for ACA reporting."
      />
      <ModuleTag code="D" name="Waive" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Benefit"><Select defaultValue="vision"><option value="vision">Vision</option><option value="medical">Medical</option><option value="dental">Dental</option></Select></Field>
        <Field label="Reason"><Select defaultValue="elsewhere"><option value="elsewhere">Covered elsewhere</option><option value="cost">Cost</option><option value="none">Do not want coverage</option><option value="other">Other</option></Select></Field>
        <Field label="Details (optional)"><Textarea placeholder="Other coverage carrier…" /></Field>
        <ActionButton success="Waive reason saved">Save waive reason</ActionButton>
        <Button href="/employee/elect" variant="secondary" className="w-full">Back to elections</Button>
      </Card>
    </EmployeeShell>
  );
}
