import { Card, Input, PageHeader, Table } from "@/components/ui";
import { auditEntries } from "@/lib/mock-data";
export const metadata = { title: "Audit log" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Audit log" description="Immutable — export evidence for an audit on request." />
      <Card className="mb-4 p-4"><Input placeholder="Filter who, what, when…" aria-label="Filter" /></Card>
      <Card>
        <Table headers={["When", "Who", "Action", "What"]} rows={auditEntries.map((a) => [
          <span key={a.id} className="font-mono text-xs">{a.when}</span>, a.who, a.action, a.what,
        ])} />
      </Card>
    </div>
  );
}
