import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Contributions" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module C" title="Employer contributions" description="Set employer share by plan type before setup approval." />
      <ModuleTag code="C" name="Contributions" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Medical employer share"><Input defaultValue="70%" /></Field>
        <Field label="Dental employer share"><Input defaultValue="50%" /></Field>
        <Field label="Vision employer share"><Input defaultValue="0%" /></Field>
        <Field label="Contribution basis"><Select defaultValue="pct"><option value="pct">Percent of premium</option><option value="flat">Flat dollar</option></Select></Field>
        <ActionButton success="Contributions saved">Save contributions</ActionButton>
      </Card>
    </div>
  );
}
