import {
  AcaCaptureNote,
  ModuleTag,
  SignatureAudit,
} from "@/components/features";
import { DownloadButton } from "@/components/working";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Confirmation" };

export default function ConfirmationPage() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Modules D · E · Automation 3"
        title="You’re enrolled"
        description="Reminders stopped. Confirmation PDF is on your record and emailed to you. Employer view updated."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="D" name="Portal" />
        <ModuleTag code="E" name="Signed" />
      </div>
      <Card className="animate-scale mb-4 p-6 text-center">
        <StatusChip tone="success">Complete</StatusChip>
        <p className="mt-4 font-display text-3xl text-ink">$204.90</p>
        <p className="text-sm text-muted">Per paycheck starting March 2027</p>
        <div className="mt-6 flex flex-col gap-2">
          <DownloadButton
            label="Download confirmation PDF"
            success="Confirmation PDF ready"
            className="!min-h-11 w-full !text-[15px]"
          />
          <Button href="/employee/documents" variant="secondary" className="w-full">
            Open documents
          </Button>
          <Button href="/employee" variant="primary" className="w-full">
            Back to portal
          </Button>
        </div>
      </Card>
      <div className="stagger space-y-4">
        <SignatureAudit />
        <AcaCaptureNote />
      </div>
    </EmployeeShell>
  );
}
