import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Claim help" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Service"
        title="Claim help status"
        description="Open claim questions routed to your account manager."
        actions={<Button href="/client/service" variant="accent">New request</Button>}
      />
      <ModuleTag code="A" name="Claims" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <StatusChip tone="warning">In progress</StatusChip>
          <p className="mt-2 font-medium text-ink">Claim · dental EOB question</p>
          <p className="mt-1 text-sm text-muted">Assigned to Sam Ortiz · due in 2 days</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Resolved</StatusChip>
          <p className="mt-2 font-medium text-ink">Claim · provider billed wrong plan</p>
          <p className="mt-1 text-sm text-muted">Closed Feb 12, 2027</p>
        </Card>
      </div>
    </div>
  );
}
