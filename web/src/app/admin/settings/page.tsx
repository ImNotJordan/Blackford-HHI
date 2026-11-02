import { Button, Card, Field, PageHeader, Select } from "@/components/ui";
export const metadata = { title: "Security settings" };
export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Security settings" description="MFA for staff, session timeouts, HIPAA hosting under a BAA." />
      <Card className="space-y-4 p-6">
        <Field label="Staff MFA policy">
          <Select defaultValue="required"><option value="required">Required for all staff</option></Select>
        </Field>
        <Field label="Idle sign-out">
          <Select defaultValue="30"><option value="15">15 minutes</option><option value="30">30 minutes</option></Select>
        </Field>
        <Field label="Quiet hours default">
          <Select defaultValue="8-20"><option value="8-20">8 a.m. – 8 p.m. recipient TZ</option></Select>
        </Field>
        <Button variant="accent">Save settings</Button>
      </Card>
    </div>
  );
}
