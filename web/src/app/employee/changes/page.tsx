import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "My changes" };

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Module F"
        title="My life event status"
        description="Track proof review after you report a life event."
        actions={<Button href="/employee/life-event" variant="accent">Report new</Button>}
      />
      <ModuleTag code="F" name="QLE status" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <StatusChip tone="warning">Proof in review</StatusChip>
            <StatusChip tone="neutral">Inside 30 days</StatusChip>
          </div>
          <p className="mt-3 font-medium text-ink">Birth · Feb 28, 2027</p>
          <p className="mt-1 text-sm text-muted">Staff verifying birth certificate · usually 1–2 business days.</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Approved</StatusChip>
          <p className="mt-3 font-medium text-ink">Address change · Jan 2027</p>
          <p className="mt-1 text-sm text-muted">Carrier file included on next change day.</p>
        </Card>
      </div>
    </EmployeeShell>
  );
}
