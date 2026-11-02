import { Card, PageHeader, Table } from "@/components/ui";
import { plans } from "@/lib/mock-data";

export const metadata = { title: "Plans & rates" };

export default function EmployerPlansPage() {
  return (
    <div>
      <PageHeader
        title="Plans, rates & contributions"
        description="What your group offers. Blackford staff enters rates; you confirm on the setup summary."
      />
      <Card>
        <Table
          headers={["Plan", "Type", "Employee / pay", "Employer share"]}
          rows={plans.map((p) => [
            p.name,
            p.type,
            <span key={p.id} className="font-mono text-xs">
              ${p.paycheck.toFixed(2)}
            </span>,
            p.type === "Medical" ? "70%" : "50%",
          ])}
        />
      </Card>
    </div>
  );
}
