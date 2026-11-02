import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Service requests" };

const rows = [
  ["ID card", "Harbor Light · Aisha Patel", "Due today", "Open"],
  ["Claim help", "Palm Coast · Marcus Lee", "Due in 2 days", "In progress"],
  ["Address change", "James Ortega", "Overdue", "Escalated"],
];

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Service"
        title="Service requests"
        description="ID cards, claim help, and changes — routed to the owner with due dates by type."
        actions={<ActionButton success="Request drafted">New request</ActionButton>}
      />
      <ModuleTag code="A" name="Service requests" />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Type", "Client", "Due", "Status", ""]}
          rows={rows.map((r) => [
            r[0],
            r[1],
            <span key={r[0]} className="font-mono text-xs">{r[2]}</span>,
            <StatusChip key={r[0] + "s"} tone={r[3] === "Escalated" ? "danger" : r[3] === "Open" ? "warning" : "auto"}>
              {r[3]}
            </StatusChip>,
            <ActionButton key={r[0] + "a"} variant="secondary" success="Resolved">
              Resolve
            </ActionButton>,
          ])}
        />
      </Card>
    </div>
  );
}
