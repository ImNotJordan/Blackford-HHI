import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Life events" };

const changes = [
  {
    id: "le-1",
    employee: "Aisha Patel",
    event: "Birth",
    reported: "Mar 1, 2027",
    window: "Inside 30 days",
    status: "Needs approval",
  },
  {
    id: "le-2",
    employee: "Marcus Lee",
    event: "Address",
    reported: "Feb 28, 2027",
    window: "Inside 30 days",
    status: "Proof missing",
  },
  {
    id: "le-3",
    employee: "Priya Shah",
    event: "Marriage",
    reported: "Feb 12, 2027",
    window: "Outside window",
    status: "Exception review",
  },
];

export default function ChangesPage() {
  return (
    <div>
      <PageHeader
        title="Life event approvals"
        description="Staff approve before a change reaches the carrier file (module F)."
      />
      <Card>
        <Table
          headers={["Employee", "Event", "Reported", "Window", "Status", ""]}
          rows={changes.map((c) => [
            c.employee,
            c.event,
            c.reported,
            c.window,
            <StatusChip
              key={c.id}
              tone={c.status.includes("approval") ? "warning" : c.status.includes("missing") ? "danger" : "neutral"}
            >
              {c.status}
            </StatusChip>,
            <Button key={`${c.id}-a`} variant="secondary" className="!min-h-9 !px-3 !text-sm">
              Review
            </Button>,
          ])}
        />
      </Card>
    </div>
  );
}
