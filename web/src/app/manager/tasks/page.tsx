import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { tasks } from "@/lib/mock-data";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks & service requests"
        description="Team queues, due dates by request type, and escalations when overdue."
      />
      <Card>
        <Table
          headers={["Task", "Type", "Client", "Due", "Priority"]}
          rows={tasks.map((t) => [
            <Link key={t.id} href="/manager/changes" className="font-medium text-ink no-underline">
              {t.title}
            </Link>,
            t.type,
            t.client,
            <span key={`${t.id}-d`} className="font-mono text-xs">
              {t.due}
            </span>,
            <StatusChip key={`${t.id}-p`} tone={t.priority === "high" ? "danger" : "warning"}>
              {t.priority}
            </StatusChip>,
          ])}
        />
      </Card>
    </div>
  );
}
