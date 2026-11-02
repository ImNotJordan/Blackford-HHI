import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";
export const metadata = { title: "Carrier approvals" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Carrier approvals" description="Blackford approver role — validate, approve, deliver by SFTP." />
      <Card>
        <Table
          headers={["Carrier", "Group", "Status", ""]}
          rows={carrierFiles.map((f) => [
            f.carrier,
            f.group,
            <StatusChip key={f.id} tone={f.status.includes("Pending") ? "warning" : "success"}>{f.status}</StatusChip>,
            <Link key={`${f.id}-l`} href={`/admin/carriers/${f.id}`} className="text-sm">Review</Link>,
          ])}
        />
      </Card>
    </div>
  );
}
