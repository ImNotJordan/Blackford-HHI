import { ModuleTag } from "@/components/features";
import { BeneficiaryForm } from "@/components/working";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Beneficiaries" };

export default function BeneficiariesPage() {
  return (
    <EmployeeShell step={5}>
      <PageHeader
        title="Beneficiaries"
        description="Required for life coverage elections."
      />
      <ModuleTag code="D" name="Beneficiaries" />
      <div className="mt-4">
        <BeneficiaryForm />
      </div>
    </EmployeeShell>
  );
}
