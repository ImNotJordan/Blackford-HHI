import { ModuleTag } from "@/components/features";
import { EmployerAgreementSign } from "@/components/gap-features";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Employer agreement" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module E · Employer signing"
        title="Sign employer agreement"
        description="Broker and portal agreements signed the same way as employee elections — with an audit trail."
      />
      <div className="mb-4">
        <ModuleTag code="E" name="Employer e-sign" />
      </div>
      <EmployerAgreementSign />
    </div>
  );
}
