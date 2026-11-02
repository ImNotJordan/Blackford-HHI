import Link from "next/link";
import { Button, Card, Input, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Find any client and open every plan, message, and document tied to them."
        actions={
          <>
            <Button variant="secondary">Import spreadsheet</Button>
            <Button variant="accent">New client</Button>
          </>
        }
      />
      <Card className="mb-4 p-4">
        <Input
          placeholder="Search by name, EIN, email, phone…"
          aria-label="Search clients"
          defaultValue=""
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", "Group", "Individual", "Medicare", "My book"].map((f) => (
            <button
              key={f}
              type="button"
              className={`min-h-10 rounded-full border px-3 text-sm ${
                f === "All"
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline bg-surface text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <Table
          headers={["Client", "Type", "Pipeline", "Owner", "Enrollment", ""]}
          rows={clients.map((c) => [
            <div key={c.id}>
              <Link href={`/manager/clients/${c.id}`} className="font-medium text-ink no-underline">
                {c.name}
              </Link>
              <p className="text-xs text-muted">{c.city}</p>
            </div>,
            c.type,
            <StatusChip key={`${c.id}-p`} tone="neutral">
              {c.pipeline}
            </StatusChip>,
            c.owner,
            <span key={`${c.id}-e`} className="font-mono text-xs">
              {c.enrolled}/{c.employees}
            </span>,
            <Link key={`${c.id}-l`} href={`/manager/clients/${c.id}`} className="text-sm">
              Open
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
