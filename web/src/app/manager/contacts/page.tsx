import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Contacts & roster" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Linked records"
        title="Contacts & roster"
        description="Employees, dependents, and HR contacts linked to groups and individuals."
      />
      <ModuleTag code="A" name="Contacts" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Name", "Type", "Group / household", "Status", ""]}
          rows={[
            ["Aisha Patel", "Employee", "Harbor Light", <StatusChip key="1" tone="success">Enrolled</StatusChip>, <Button key="1a" href="/manager/clients/cl-1042" variant="secondary" className="!min-h-9 !text-sm">Record</Button>],
            ["Omar Patel", "Dependent", "Harbor Light · Aisha", <StatusChip key="2" tone="warning">Proof review</StatusChip>, <Button key="2a" href="/manager/verifications/vr-101" variant="secondary" className="!min-h-9 !text-sm">Verify</Button>],
            ["Jordan Miles", "HR contact", "Rivers & Reed", <StatusChip key="3" tone="auto">Active</StatusChip>, <Button key="3a" href="/manager/compose" variant="secondary" className="!min-h-9 !text-sm">Message</Button>],
            ["James Ortega", "Individual", "Household primary", <StatusChip key="4" tone="active">Medicare</StatusChip>, <Button key="4a" href="/manager/clients/cl-2210" variant="secondary" className="!min-h-9 !text-sm">Record</Button>],
            ["Elena Ortega", "Dependent", "James Ortega", <StatusChip key="5" tone="neutral">Separate policy</StatusChip>, "—"],
          ]}
        />
      </Card>
    </div>
  );
}
