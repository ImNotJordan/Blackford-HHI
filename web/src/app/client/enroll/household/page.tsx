import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Household" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 2" title="Household" description="Who should be on this application." />
      <ModuleTag code="D" name="Household" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Spouse / partner (optional)"><Input placeholder="Full name" /></Field>
        <Field label="Dependent (optional)"><Input placeholder="Full name" /></Field>
        <Button href="/client/enroll/plans" variant="accent" className="w-full">Continue to plans</Button>
      </Card>
    </div>
  );
}
