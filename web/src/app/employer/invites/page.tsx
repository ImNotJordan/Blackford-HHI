import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Invites" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module D · Automations 1–3"
        title="Enrollment invites"
        description="Secure link invites scheduled when setup is locked and windows open."
      />
      <ModuleTag code="D" name="Invites" />
      <Card className="mt-4 mb-4 border-gold bg-parchment p-4">
        <p className="label-mono">Automation 1</p>
        <p className="mt-1 text-sm text-ink">15 not-started employees queued for invite · Mar 4 · 8:00 AM</p>
        <ActionButton className="mt-3" success="Invites scheduled">Schedule outstanding invites</ActionButton>
      </Card>
      <Card className="overflow-hidden">
        <Table
          headers={["Employee", "Channel", "Status", "Next"]}
          rows={[
            ["Sofia Nguyen", "Text + email", <StatusChip key="1" tone="auto">Queued</StatusChip>, "Mar 4"],
            ["Noah Grant", "Text", <StatusChip key="2" tone="success">Opened</StatusChip>, "Reminder · 3 days"],
            ["Elena Brooks", "Email", <StatusChip key="3" tone="success">Complete</StatusChip>, "—"],
          ]}
        />
      </Card>
    </div>
  );
}
