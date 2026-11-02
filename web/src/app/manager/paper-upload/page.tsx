import { ModuleTag, SignatureAudit } from "@/components/features";
import { ProofUploader } from "@/components/verification";
import { ActionButton } from "@/components/interactive";
import { Card, Field, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Paper upload" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module E · Paper fallback"
        title="Upload paper document"
        description="Scan wet-ink elections or agreements. Queues for manual verification and audit trail."
      />
      <ModuleTag code="E" name="Paper fallback" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Document type">
          <Select defaultValue="election">
            <option value="election">Employee election form</option>
            <option value="carrier">Carrier application</option>
            <option value="agreement">Employer agreement</option>
          </Select>
        </Field>
        <Field label="Person / group">
          <Select defaultValue="elena">
            <option value="elena">Elena Brooks · Rivers & Reed</option>
            <option value="hr">Rivers & Reed HR · Broker agreement</option>
          </Select>
        </Field>
        <ProofUploader
          requiredTypes={["Scanned PDF or photo of signed pages"]}
        />
        <ActionButton success="Queued for verification">Submit for verification</ActionButton>
      </Card>
      <div className="mt-4">
        <SignatureAudit />
      </div>
    </div>
  );
}
