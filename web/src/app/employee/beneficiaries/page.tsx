import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Beneficiaries" };

export default function BeneficiariesPage() {
  return (
    <EmployeeShell step={5}>
      <PageHeader title="Beneficiaries" description="Required for life coverage elections." />
      <Card className="space-y-4 p-5">
        <Field label="Primary beneficiary">
          <Input defaultValue="Omar Patel" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Relationship">
            <Select defaultValue="spouse">
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Share">
            <Input defaultValue="100%" />
          </Field>
        </div>
        <Button href="/employee/review" variant="accent" className="w-full">
          Continue to review
        </Button>
      </Card>
    </EmployeeShell>
  );
}
