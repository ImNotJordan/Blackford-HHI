import { ModuleTag, SignatureAudit } from "@/components/features";
import { SignaturePad } from "@/components/interactive";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Sign" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module E" title="Sign your application" description="Electronic-records consent first, then sign." />
      <ModuleTag code="E" name="E-sign" />
      <div className="mt-4">
        <SignaturePad
          continueHref="/client/confirmation"
          defaultName="James Ortega"
          continueLabel="View confirmation"
          successBody="Application signed · confirmation PDF on your record."
        />
      </div>
      <div className="mt-4"><SignatureAudit /></div>
    </div>
  );
}
