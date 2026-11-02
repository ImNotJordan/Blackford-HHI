import { ModuleTag, SignatureAudit } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Confirmation" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Modules D · E" title="You're covered" description="Confirmation PDF is on your record. Your account manager can produce the audit trail anytime." />
      <ModuleTag code="E" name="Complete" />
      <Card className="mt-4 p-6 text-center">
        <StatusChip tone="success">Complete</StatusChip>
        <p className="mt-4 font-display text-2xl text-ink">Plan G on file</p>
        <Button href="/client/documents" variant="secondary" className="mt-4 w-full">View documents</Button>
        <Button href="/client" variant="primary" className="mt-2 w-full">Back to coverage</Button>
      </Card>
      <div className="mt-4"><SignatureAudit /></div>
    </div>
  );
}
