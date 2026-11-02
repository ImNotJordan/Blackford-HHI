import Link from "next/link";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Groups" };

export default function GroupsPage() {
  const groups = clients.filter((c) => c.type === "Group");
  return (
    <div>
      <PageHeader
        title="Groups"
        description="Employer groups from prospect through renewal."
        actions={<Button variant="accent">New group</Button>}
      />
      <Card>
        <Table
          headers={["Group", "Pipeline", "Effective", "Enrollment", ""]}
          rows={groups.map((g) => [
            <Link key={g.id} href={`/manager/groups/${g.id}`} className="font-medium text-ink no-underline">
              {g.name}
            </Link>,
            <StatusChip key={`${g.id}-p`}>{g.pipeline}</StatusChip>,
            <span key={`${g.id}-e`} className="font-mono text-xs">
              {g.effective}
            </span>,
            <span key={`${g.id}-n`} className="font-mono text-xs">
              {g.enrolled}/{g.employees}
            </span>,
            <Link key={`${g.id}-l`} href={`/manager/groups/${g.id}`} className="text-sm">
              Open
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
