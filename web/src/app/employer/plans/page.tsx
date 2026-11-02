import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, PageHeader, Table } from "@/components/ui";
import { plans } from "@/lib/mock-data";

export const metadata = { title: "Plans & rates" };

export default function EmployerPlansPage() {
  return (
    <div>
      <PageHeader
        title="Plans, rates & contributions"
        description="What your group offers. Blackford staff enters rates; you confirm on the setup summary."
        actions={
          <Button href="/employer/contributions" variant="secondary">
            Edit contributions
          </Button>
        }
      />
      <ModuleTag code="C" name="Plans" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Plan", "Type", "Employee / pay", "Employer share"]}
          rows={plans.map((p) => [
            p.name,
            p.type,
            <span key={p.id} className="font-mono text-xs">
              ${p.paycheck.toFixed(2)}
            </span>,
            p.type === "Medical" ? "70%" : p.type === "Dental" ? "50%" : "0%",
          ])}
        />
      </Card>
      <div className="mt-4">
        <ActionButton success="Plans confirmed for setup">
          Confirm plans for setup
        </ActionButton>
      </div>
    </div>
  );
}
