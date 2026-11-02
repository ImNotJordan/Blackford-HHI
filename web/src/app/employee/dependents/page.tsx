import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Dependents" };

export default function DependentsPage() {
  return (
    <EmployeeShell step={2}>
      <PageHeader title="Dependents" description="Add anyone you want to cover." />
      <div className="space-y-3">
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Omar Patel</p>
            <p className="text-sm text-muted">Spouse · DOB 03/12/1990</p>
          </div>
          <StatusChip tone="success">On file</StatusChip>
        </Card>
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Nora Patel</p>
            <p className="text-sm text-muted">Child · DOB 08/02/2022</p>
          </div>
          <StatusChip tone="success">On file</StatusChip>
        </Card>
        <Button variant="secondary" className="w-full">
          Add dependent
        </Button>
        <Button href="/employee/compare" variant="accent" className="w-full">
          Continue
        </Button>
      </div>
    </EmployeeShell>
  );
}
