import { ModuleTag } from "@/components/features";
import { DependentBoard } from "@/components/working";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Dependents" };

export default function DependentsPage() {
  return (
    <EmployeeShell step={2}>
      <PageHeader
        title="Dependents"
        description="Add anyone you want to cover. Ages are checked against plan rules."
      />
      <ModuleTag code="D" name="Dependents" />
      <div className="mt-4">
        <DependentBoard />
      </div>
    </EmployeeShell>
  );
}
