import { ModuleTag } from "@/components/features";
import { LifeEventForm } from "@/components/interactive";
import { VerificationBanner } from "@/components/verification";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Life event" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module F"
        title="Report a life event"
        description="Address or coverage changes — staff approve with image proof before the carrier file."
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Policy changes" />
      </div>
      <VerificationBanner>
        Attach image proof (license, bill, or certificate). Your account manager
        completes manual verification before anything is sent to the carrier.
      </VerificationBanner>
      <LifeEventForm audience="client" />
    </div>
  );
}
