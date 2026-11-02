import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Company details" };

export default function CompanyPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Company details"
        description="Confirm legal name, contacts, and payroll schedule before census upload."
      />
      <Card className="space-y-4 p-6">
        <Field label="Legal name">
          <Input defaultValue="Rivers & Reed LLP" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="EIN">
            <Input defaultValue="59-1234567" className="font-mono" />
          </Field>
          <Field label="Payroll schedule">
            <Select defaultValue="biweekly">
              <option value="biweekly">Biweekly</option>
              <option value="semimonthly">Semi-monthly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </Field>
        </div>
        <Field label="Primary HR contact">
          <Input defaultValue="Jordan Miles · jordan.miles@riversreed.com" />
        </Field>
        <Button variant="accent">Save details</Button>
      </Card>
    </div>
  );
}
