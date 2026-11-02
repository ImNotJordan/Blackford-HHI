import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your details" };

export default function DetailsPage() {
  return (
    <EmployeeShell step={1}>
      <PageHeader title="Confirm your details" description="Make sure we have the right contact info." />
      <Card className="space-y-4 p-5">
        <Field label="Legal name">
          <Input defaultValue="Aisha Patel" />
        </Field>
        <Field label="Mobile">
          <Input defaultValue="(904) 555-0142" />
        </Field>
        <Field label="Email">
          <Input type="email" defaultValue="aisha.patel@harborlight.com" />
        </Field>
        <Field label="Home address">
          <Input defaultValue="1840 Riverside Ave, Jacksonville, FL" />
        </Field>
        <Button href="/employee/dependents" variant="accent" className="w-full">
          Save & continue
        </Button>
      </Card>
    </EmployeeShell>
  );
}
