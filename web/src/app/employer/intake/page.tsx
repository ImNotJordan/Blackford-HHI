import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Individual intake" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C · Individual intake"
        title="Individual intake"
        description="Add someone outside the census file — eligibility and invite follow group rules."
      />
      <ModuleTag code="C" name="Intake" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Legal name"><Input placeholder="Full legal name" /></Field>
        <Field label="Relationship to group"><Select defaultValue="employee"><option value="employee">Employee</option><option value="owner">Owner</option><option value="cobra">COBRA</option></Select></Field>
        <Field label="Email"><Input type="email" /></Field>
        <Field label="Mobile"><Input /></Field>
        <ActionButton success="Intake saved · invite eligible">Save intake</ActionButton>
      </Card>
    </div>
  );
}
