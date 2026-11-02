import { ModuleTag } from "@/components/features";
import { NewHireIntakeForm } from "@/components/gap-features";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "New hire" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C · D · Automation 6"
        title="Add a new hire"
        description="Enter hire details. The system computes eligibility and schedules the enrollment invite."
      />
      <div className="mb-4">
        <ModuleTag code="C" name="New-hire intake" />
      </div>
      <NewHireIntakeForm />
    </div>
  );
}
