import { ModuleTag } from "@/components/features";
import { LifeEventForm } from "@/components/interactive";
import { VerificationBanner } from "@/components/verification";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Life event" };

export default function LifeEventPage() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Module F"
        title="Report a life event"
        description="Birth, marriage, address, or lost coverage — within 30 days of the event."
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Life events" />
      </div>
      <VerificationBanner>
        Upload a clear photo or scan of your official document. Blackford staff
        will manually verify the image before coverage changes.
      </VerificationBanner>
      <LifeEventForm audience="employee" />
    </EmployeeShell>
  );
}
