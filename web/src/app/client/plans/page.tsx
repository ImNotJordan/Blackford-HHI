import { ModuleTag } from "@/components/features";
import { DownloadButton } from "@/components/working";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Plans & IDs" };

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Plans & ID cards"
        description="Carriers, policy numbers, and effective dates on your record."
        actions={
          <Button href="/client/id-cards" variant="accent">
            ID cards
          </Button>
        }
      />
      <ModuleTag code="A" name="Plans" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Plan", "Carrier", "Policy #", "Effective", ""]}
          rows={[
            [
              "Medicare Supplement G",
              "Florida Blue",
              "MS-441902",
              "2026-06-01",
              <StatusChip key="1" tone="active">
                Active
              </StatusChip>,
            ],
            [
              "Part D Rx",
              "Wellcare",
              "PD-22910",
              "2026-06-01",
              <StatusChip key="2" tone="success">
                Active
              </StatusChip>,
            ],
          ]}
        />
      </Card>
      <div className="mt-4 flex flex-wrap gap-2">
        <DownloadButton
          label="Download ID card PDF"
          success="ID card PDF ready"
        />
        <Button href="/client/documents" variant="secondary">
          All documents
        </Button>
      </div>
    </div>
  );
}
