import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Export log" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module G · Carrier"
        title="Export & confirmation log"
        description="Every carrier file delivery, resend, and confirmation — never plain email."
      />
      <ModuleTag code="G" name="Export log" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["File", "Carrier", "Delivered", "Confirm", ""]}
          rows={[
            ["cf-88", "Florida Blue", "Pending approve", <StatusChip key="1" tone="warning">Awaiting</StatusChip>, "—"],
            ["cf-87", "Guardian", "Feb 24 · SFTP", <StatusChip key="2" tone="success">Confirmed</StatusChip>, <ActionButton key="2a" variant="secondary" success="Resent">Resend</ActionButton>],
            ["cf-80", "MetLife", "Feb 10 · encrypted DL", <StatusChip key="3" tone="danger">No confirm</StatusChip>, <ActionButton key="3a" success="Follow-up tasked">Follow up</ActionButton>],
          ]}
        />
      </Card>
    </div>
  );
}
