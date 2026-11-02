import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Enrollment details" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 1" title="Confirm your details" description="Passwordless session from your secure link." />
      <ModuleTag code="D" name="Individual enroll" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Legal name"><Input defaultValue="James Ortega" /></Field>
        <Field label="Mobile"><Input defaultValue="(904) 555-0177" /></Field>
        <Field label="Email"><Input type="email" defaultValue="james.ortega@email.com" /></Field>
        <Button href="/client/enroll/household" variant="accent" className="w-full">Continue</Button>
      </Card>
    </div>
  );
}
