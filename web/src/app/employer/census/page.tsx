import { ModuleTag, ValidationErrors } from "@/components/features";
import { CensusUploader } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Census" };

export default function CensusPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module C · Employer onboarding"
        title="Census upload"
        description="Upload from the Blackford template. Errors return with a link to fix and upload again."
      />
      <div className="mb-4">
        <ModuleTag code="C" name="Census validation" />
      </div>
      <div className="mb-4">
        <CensusUploader />
      </div>
      <div className="mb-4">
        <ValidationErrors
          errors={[
            { row: "12", name: "Chris Alvarez", issue: "Missing hire date" },
            {
              row: "19",
              name: "Lee Morgan",
              issue: "Class code “PT-FLEX” unknown",
            },
            {
              row: "27",
              name: "Dependent of Kim Park",
              issue: "Age required for dependent",
            },
          ]}
        />
      </div>
      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["Row", "Name", "Issue", "Status"]}
          rows={[
            [
              "12",
              "Chris Alvarez",
              "Missing hire date",
              <StatusChip key="e1" tone="danger">
                Error
              </StatusChip>,
            ],
            [
              "19",
              "Lee Morgan",
              "Class code unknown",
              <StatusChip key="e2" tone="danger">
                Error
              </StatusChip>,
            ],
            [
              "27",
              "Dependent of Kim Park",
              "Age required",
              <StatusChip key="e3" tone="danger">
                Error
              </StatusChip>,
            ],
          ]}
        />
      </Card>
    </div>
  );
}
