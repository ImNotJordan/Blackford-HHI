import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Carrier export log" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module G"
        title="Carrier export log"
        description="Deliveries for your book — resend and confirmation tracking."
        actions={<Button href="/manager/carriers" variant="secondary">Drafts</Button>}
      />
      <ModuleTag code="G" name="Export log" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["File", "Group", "Method", "Status", ""]}
          rows={[
            ["cf-88", "Harbor Light", "—", <StatusChip key="1" tone="warning">Pending approval</StatusChip>, <Button key="1a" href="/manager/carriers/cf-88" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
            ["cf-87", "Harbor Light", "SFTP", <StatusChip key="2" tone="success">Confirmed</StatusChip>, <ActionButton key="2a" variant="secondary" success="Resent">Resend</ActionButton>],
            ["cf-80", "Palm Coast", "Encrypted download", <StatusChip key="3" tone="danger">No confirm</StatusChip>, <ActionButton key="3a" success="Task created">Create follow-up</ActionButton>],
          ]}
        />
      </Card>
    </div>
  );
}
