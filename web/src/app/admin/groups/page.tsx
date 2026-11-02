import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";
export const metadata = { title: "All groups" };
export default function Page() {
  return (
    <div>
      <PageHeader title="All groups" description="Admin sees every group — not limited to one account manager’s book." />
      <Card>
        <Table
          headers={["Group", "Owner", "Pipeline", "Enrollment"]}
          rows={clients.filter((c) => c.type === "Group").map((g) => [
            g.name,
            g.owner,
            <StatusChip key={g.id}>{g.pipeline}</StatusChip>,
            <span key={`${g.id}-e`} className="font-mono text-xs">{g.enrolled}/{g.employees}</span>,
          ])}
        />
      </Card>
    </div>
  );
}
