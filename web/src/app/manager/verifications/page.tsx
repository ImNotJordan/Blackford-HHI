import { ModuleTag } from "@/components/features";
import {
  VerificationBanner,
  VerificationQueue,
} from "@/components/verification";
import { PageHeader, Stat, Card } from "@/components/ui";
import { verificationCases } from "@/lib/verification";

export const metadata = { title: "Verifications" };

export default function VerificationsPage() {
  const ready = verificationCases.filter(
    (c) => c.status === "ready_for_review",
  ).length;
  const awaiting = verificationCases.filter(
    (c) => c.status === "awaiting_proof",
  ).length;
  const exceptions = verificationCases.filter(
    (c) => c.status === "needs_more_info",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Module F · E · A"
        title="Proof & verification"
        description="Open cases with image proof for manual verification before carrier files or coverage changes."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="F" name="Life events" />
        <ModuleTag code="E" name="Paper sign" />
        <ModuleTag code="A" name="Service proof" />
      </div>
      <VerificationBanner>
        Life events, paper elections, and some service requests require
        document proof. Review the scan, complete the checklist, then approve
        or return.
      </VerificationBanner>
      <div className="stagger mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="ui-card p-4">
          <Stat label="Ready for review" value={String(ready)} />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Awaiting proof" value={String(awaiting)} />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Exceptions" value={String(exceptions)} />
        </Card>
      </div>
      <VerificationQueue cases={verificationCases} />
    </div>
  );
}
