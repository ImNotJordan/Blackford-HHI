import { Card, Input, PageHeader, Table } from "@/components/ui";
import { auditEntries } from "@/lib/mock-data";

export const metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Immutable trail of every sign-in, view, change, export, message, and signature."
      />
      <Card className="mb-4 p-4">
        <Input placeholder="Filter by who, what, when…" aria-label="Filter audit log" />
      </Card>
      <Card>
        <Table
          headers={["When", "Who", "Action", "What", "Where"]}
          rows={auditEntries.map((a) => [
            <span key={a.id} className="font-mono text-xs">
              {a.when}
            </span>,
            a.who,
            a.action,
            a.what,
            a.where,
          ])}
        />
      </Card>
    </div>
  );
}
