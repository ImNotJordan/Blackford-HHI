import { ModuleTag, PipelineBar } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "New prospect" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A · Pipeline" title="New prospect" description="Start a group or individual in Prospect." />
      <ModuleTag code="A" name="Prospect" />
      <div className="my-4"><PipelineBar active="Prospect" /></div>
      <Card className="space-y-4 p-4">
        <Field label="Type"><Select defaultValue="group"><option value="group">Group</option><option value="individual">Individual</option></Select></Field>
        <Field label="Name"><Input placeholder="Company or person name" /></Field>
        <Field label="City"><Input defaultValue="Jacksonville, FL" /></Field>
        <Field label="Owner"><Select defaultValue="maya"><option value="maya">Maya Chen</option><option value="sam">Sam Ortiz</option></Select></Field>
        <ActionButton success="Prospect created">Create prospect</ActionButton>
      </Card>
    </div>
  );
}
