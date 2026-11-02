import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Verification status" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module F"
        title="Proof verification status"
        description="See whether staff has approved your uploaded documents."
        actions={<Button href="/client/life-event" variant="secondary">Submit another</Button>}
      />
      <ModuleTag code="F" name="Verification" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <StatusChip tone="warning">Ready for review</StatusChip>
          <p className="mt-2 font-medium text-ink">Address proof · utility bill</p>
          <p className="mt-1 text-sm text-muted">Uploaded Mar 2 · waiting on manual verification</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Approved</StatusChip>
          <p className="mt-2 font-medium text-ink">Photo ID</p>
          <p className="mt-1 text-sm text-muted">Verified Mar 2 · used for ID card request</p>
        </Card>
      </div>
    </div>
  );
}
