import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";

export const metadata = { title: "Carrier files" };

export default function CarriersPage() {
  return (
    <div>
      <PageHeader
        title="Carrier submission"
        description="Validated drafts, staff approval, then SFTP or encrypted download — never plain email."
      />
      <Card>
        <Table
          headers={["Carrier", "Group", "Kind", "Records", "Errors", "Status", ""]}
          rows={carrierFiles.map((f) => [
            f.carrier,
            f.group,
            f.kind,
            <span key={`${f.id}-r`} className="font-mono text-xs">
              {f.records}
            </span>,
            <span key={`${f.id}-e`} className="font-mono text-xs">
              {f.errors}
            </span>,
            <StatusChip
              key={`${f.id}-s`}
              tone={
                f.status.includes("Pending")
                  ? "warning"
                  : f.status.includes("Delivered")
                    ? "success"
                    : "auto"
              }
            >
              {f.status}
            </StatusChip>,
            <Link key={`${f.id}-l`} href={`/manager/carriers/${f.id}`} className="text-sm">
              Open
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
