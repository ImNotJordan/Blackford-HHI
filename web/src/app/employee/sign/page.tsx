import {
  EnrollmentStepper,
  ModuleTag,
  SignatureAudit,
} from "@/components/features";
import { SignaturePad } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Sign" };

export default function SignPage() {
  return (
    <EmployeeShell step={7}>
      <PageHeader
        eyebrow="Module E · Signing by text"
        title="Sign your elections"
        description="Consent to electronic records first, then sign on screen."
      />
      <ModuleTag code="E" name="E-signature" />
      <div className="mt-4">
        <EnrollmentStepper current={7} />
      </div>
      <div className="mt-4">
        <SignaturePad />
      </div>
      <div className="mt-4">
        <SignatureAudit />
      </div>
    </EmployeeShell>
  );
}
