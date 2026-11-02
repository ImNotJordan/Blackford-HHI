import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "MFA setup" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module H · Security"
        title="Staff MFA setup"
        description="Enroll or reset multi-factor authentication. MFA is required for all Blackford staff."
      />
      <ModuleTag code="H" name="MFA" />
      <Card className="mt-4 space-y-4 p-4 sm:p-5">
        <StatusChip tone="warning">Enrollment required</StatusChip>
        <Field label="Staff email">
          <Input type="email" defaultValue="maya.chen@blackford.com" />
        </Field>
        <Field label="Authenticator app code" hint="Scan QR in your authenticator, then enter the 6-digit code.">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-[0.3em]" />
        </Field>
        <div className="flex aspect-video items-center justify-center rounded-[10px] border border-dashed border-hairline bg-ivory text-sm text-muted">
          Mock QR · Blackford MFA enrollment
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="secondary" success="Recovery codes downloaded">
            Download recovery codes
          </ActionButton>
          <ActionButton success="MFA enrolled">Complete MFA setup</ActionButton>
        </div>
      </Card>
    </div>
  );
}
