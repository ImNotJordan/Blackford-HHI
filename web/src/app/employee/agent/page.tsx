import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Agent mode" };

export default function AgentModePage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Agent-assisted enrollment"
        description="iPad mode for in-person meetings — open an employee and walk the same flow."
      />
      <Card className="mb-4 p-4">
        <StatusChip tone="auto">Device · iPad</StatusChip>
        <p className="mt-3 text-sm">Search the group roster, then hand the iPad to the employee to sign.</p>
      </Card>
      <Card className="divide-y divide-hairline">
        {["Aisha Patel", "Jordan Kim", "Sam Ortiz"].map((name) => (
          <div key={name} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium">{name}</span>
            <Button href="/employee/details" variant="secondary" className="!min-h-9 !px-3 !text-sm">
              Open
            </Button>
          </div>
        ))}
      </Card>
    </EmployeeShell>
  );
}
