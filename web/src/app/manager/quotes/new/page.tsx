import { ModuleTag, PipelineBar } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "New quote" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A · Pipeline" title="New quote" description="Move a prospect into quoting with carrier and effective date." />
      <ModuleTag code="A" name="Quoting" />
      <div className="my-4"><PipelineBar active="Quoting" /></div>
      <Card className="space-y-4 p-4">
        <Field label="Prospect"><Select defaultValue="p1"><option value="p1">Bay Street Cafe (new)</option><option value="p2">Harbor Light Manufacturing</option></Select></Field>
        <Field label="Primary carrier"><Input defaultValue="Florida Blue" /></Field>
        <Field label="Proposed effective"><Input type="date" defaultValue="2027-07-01" /></Field>
        <Field label="Lives"><Input defaultValue="24" inputMode="numeric" /></Field>
        <ActionButton success="Quote started · pipeline updated">Save quote</ActionButton>
      </Card>
    </div>
  );
}
