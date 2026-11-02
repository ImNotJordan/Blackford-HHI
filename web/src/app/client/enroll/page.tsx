import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Enrollment" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module D"
        title="Enrollment"
        description="Individual / Medicare intake when a window is open for you."
      />
      <div className="mb-4">
        <ModuleTag code="D" name="Individual intake" />
      </div>
      <Card className="animate-rise p-5">
        <StatusChip tone="active">Demo window open</StatusChip>
        <p className="mt-3 text-sm text-muted">
          Start the guided individual enrollment — details, household, plans, review, and sign.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/client/enroll/details" variant="accent">
            Start enrollment
          </Button>
          <Button href="/client/messages" variant="secondary">
            Check messages
          </Button>
          <Button href="/employee/sign-in" variant="ghost">
            I'm a group employee
          </Button>
        </div>
      </Card>
    </div>
  );
}
