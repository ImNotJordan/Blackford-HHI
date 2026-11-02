import { Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "Documents" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Documents" description="Signed applications and confirmation PDFs on your record." />
      <Card className="divide-y divide-hairline">
        {[
          ["Election confirmation.pdf", "Signed · Jun 1, 2026"],
          ["Medicare application.pdf", "Signed · May 20, 2026"],
        ].map(([name, meta]) => (
          <div key={name} className="flex items-center justify-between px-4 py-3">
            <div><p className="font-medium text-sm">{name}</p><p className="text-xs text-muted">{meta}</p></div>
            <StatusChip tone="success">On file</StatusChip>
          </div>
        ))}
      </Card>
    </div>
  );
}
