import { ModuleTag } from "@/components/features";
import { DetailsForm } from "@/components/working";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your details" };

export default function DetailsPage() {
  return (
    <EmployeeShell step={1}>
      <PageHeader
        title="Confirm your details"
        description="Make sure we have the right contact info."
      />
      <ModuleTag code="D" name="Details" />
      <div className="mt-4">
        <DetailsForm />
      </div>
    </EmployeeShell>
  );
}
