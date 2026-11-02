import { ModuleTag } from "@/components/features";
import {
  VerificationBanner,
  VerificationQueue,
} from "@/components/verification";
import { Button, PageHeader } from "@/components/ui";
import { verificationCases } from "@/lib/verification";

export const metadata = { title: "Life events" };

const lifeEvents = verificationCases.filter((c) => c.type === "life_event");

export default function ChangesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module F · Policy changes"
        title="Life event approvals"
        description="Staff approve with image proof before a change reaches the carrier file."
        actions={
          <Button href="/manager/verifications" variant="accent">
            All verifications
          </Button>
        }
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Life events" />
      </div>
      <VerificationBanner>
        Open a case to view mock image proof, run the manual checklist, and
        approve or request more documents.
      </VerificationBanner>
      <VerificationQueue cases={lifeEvents} />
    </div>
  );
}
