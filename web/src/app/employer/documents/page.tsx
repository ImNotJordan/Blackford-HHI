import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Documents" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module C · E" title="Group documents" description="Signed agreements, census files, and setup summaries for your group." />
      <ModuleTag code="C" name="Documents" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Document", "Type", "Status", ""]}
          rows={[
            ["Broker agreement", "E-sign", <StatusChip key="1" tone="warning">Awaiting signature</StatusChip>, <Button key="1a" href="/employer/agreement" variant="accent" className="!min-h-9 !text-sm">Sign</Button>],
            ["Census · Feb upload", "Census", <StatusChip key="2" tone="danger">3 errors</StatusChip>, <Button key="2a" href="/employer/census" variant="secondary" className="!min-h-9 !text-sm">Fix</Button>],
            ["Setup summary", "Setup", <StatusChip key="3" tone="warning">Needs approval</StatusChip>, <Button key="3a" href="/employer/setup" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
          ]}
        />
      </Card>
    </div>
  );
}
