import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Enrollment" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module D"
        title="Enrollment"
        description="When a window is open for your individual intake, start here."
      />
      <div className="mb-4">
        <ModuleTag code="D" name="Individual intake" />
      </div>
      <Card className="animate-rise p-5">
        <StatusChip tone="neutral">No open window</StatusChip>
        <p className="mt-3 text-sm text-muted">
          Your account manager will send a secure link when it’s time to enroll
          or renew. Group employees use the Employee portal instead.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/client/messages" variant="secondary">
            Check messages
          </Button>
          <Button href="/employee/sign-in" variant="accent">
            I’m a group employee
          </Button>
        </div>
      </Card>
    </div>
  );
}
