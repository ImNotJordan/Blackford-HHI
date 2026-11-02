import { Suspense } from "react";
import { ModuleTag } from "@/components/features";
import { InteractiveChecklist } from "@/components/interactive";
import { RouteFallback } from "@/components/route-fallback";
import { Button, PageHeader } from "@/components/ui";
import { clients, onboardingChecklist } from "@/lib/mock-data";

export default function OnboardingDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <OnboardingDetailContent params={params} />
    </Suspense>
  );
}

async function OnboardingDetailContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = clients.find((c) => c.id === groupId) ?? clients[1];
  const done = onboardingChecklist.filter((c) => c.done).length;

  return (
    <div>
      <PageHeader
        eyebrow="Module C · Employer onboarding"
        title={`Onboarding · ${group.name}`}
        description={`${done} of ${onboardingChecklist.length} steps · Due dates counted back from ${group.effective}`}
        actions={
          <Button href="/employer/census" variant="secondary">
            Open employer portal view
          </Button>
        }
      />
      <div className="mb-4">
        <ModuleTag code="C" name="Checklist" />
      </div>
      <InteractiveChecklist initial={onboardingChecklist} />
    </div>
  );
}
