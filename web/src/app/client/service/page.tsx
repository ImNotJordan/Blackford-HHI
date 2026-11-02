import { ModuleTag } from "@/components/features";
import { ServiceRequestForm } from "@/components/interactive";
import { VerificationBanner } from "@/components/verification";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Service request" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A"
        title="Service request"
        description="ID card, claim help, or a change — routed to your account manager with a due date."
      />
      <div className="mb-4">
        <ModuleTag code="A" name="Service requests" />
      </div>
      <VerificationBanner>
        ID card and policy-change requests ask for image proof. Staff manually
        verify before completing the request.
      </VerificationBanner>
      <ServiceRequestForm />
    </div>
  );
}
