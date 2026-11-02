import { ModuleTag } from "@/components/features";
import { DocumentList } from "@/components/working";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Documents" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · E"
        title="Documents"
        description="Applications, confirmations, and ID-related files on your record."
      />
      <ModuleTag code="A" name="Documents" />
      <div className="mt-4">
        <DocumentList
          items={[
            {
              name: "Medicare Supplement confirmation.pdf",
              meta: "Signed May 20, 2026",
            },
            { name: "Application · Plan G", meta: "On file" },
            { name: "ID card request receipt", meta: "Service · Mar 2" },
          ]}
        />
      </div>
    </div>
  );
}
