import { Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "Household" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Household" description="Individual and Medicare household view (SOW module A)." />
      <div className="space-y-3">
        {[
          ["James Ortega", "Primary · DOB 04/18/1959"],
          ["Elena Ortega", "Spouse · covered on separate policy"],
        ].map(([name, meta]) => (
          <Card key={name} className="flex items-center justify-between p-4">
            <div><p className="font-medium">{name}</p><p className="text-sm text-muted">{meta}</p></div>
            <StatusChip tone="success">On file</StatusChip>
          </Card>
        ))}
      </div>
    </div>
  );
}
