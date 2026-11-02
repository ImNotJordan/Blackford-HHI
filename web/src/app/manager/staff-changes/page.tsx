import { ModuleTag } from "@/components/features";
import { StaffChangeForm } from "@/components/gap-features";
import { Button, PageHeader } from "@/components/ui";

export const metadata = { title: "Staff changes" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module F · Staff-entered"
        title="Changes & terminations"
        description="Enter a coverage change or termination on behalf of a client. Drafts feed the next carrier change file."
        actions={
          <Button href="/manager/changes" variant="secondary">
            Life event queue
          </Button>
        }
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Staff changes" />
      </div>
      <StaffChangeForm />
    </div>
  );
}
