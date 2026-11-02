import { ModuleTag } from "@/components/features";
import { DocumentList } from "@/components/working";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your documents" };

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Module D · E"
        title="Your documents"
        description="Confirmation PDFs and signed elections on your record."
      />
      <ModuleTag code="E" name="Documents" />
      <div className="mt-4">
        <DocumentList
          items={[
            { name: "Election confirmation.pdf", meta: "Signed Mar 3" },
            { name: "Medical election form", meta: "Signed" },
            { name: "Dental election form", meta: "Signed" },
          ]}
        />
      </div>
    </EmployeeShell>
  );
}
