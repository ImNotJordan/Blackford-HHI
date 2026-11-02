import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Team queue" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Team"
        title="Team queue"
        description="Shared work across account managers — claim or reassign tasks."
        actions={<Button href="/manager" variant="secondary">My work today</Button>}
      />
      <ModuleTag code="A" name="Team queues" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Task", "Client", "Owner", "Due", ""]}
          rows={[
            ["Life event proof", "Harbor Light", "Unassigned", "Today", <Button key="1" href="/manager/verifications/vr-101" variant="accent" className="!min-h-9 !text-sm">Claim</Button>],
            ["Carrier confirm overdue", "Palm Coast", "Sam Ortiz", "Overdue", <StatusChip key="2" tone="danger">Escalated</StatusChip>],
            ["Census follow-up", "Rivers & Reed", "Maya Chen", "Today", <Button key="3" href="/manager/onboarding/cl-1088" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
            ["Undeliverable text", "Palm Coast", "Unassigned", "Today", <Button key="4" href="/manager/delivery" variant="secondary" className="!min-h-9 !text-sm">Claim</Button>],
          ]}
        />
      </Card>
    </div>
  );
}
