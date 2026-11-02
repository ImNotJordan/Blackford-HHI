import { FeatureCallout, ModuleTag } from "@/components/features";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Data quality" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Automation 11 · Nightly"
        title="Data quality flags"
        description="Missing dependent data, dependents turning 26 within 90 days, clients turning 65 within 6 months."
      />
      <ModuleTag code="H" name="Data quality" />
      <div className="mt-4 mb-4">
        <FeatureCallout module="H" title="Nightly check completed 2:00 AM" tone="auto">
          27 open flags across your book. Act before the next carrier file.
        </FeatureCallout>
      </div>
      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["Flag", "Person", "Group", "Due"]}
          rows={[
            [<StatusChip key="1" tone="warning">Age 26 in 60d</StatusChip>, "Nora Patel", "Harbor Light", "90-day window"],
            [<StatusChip key="2" tone="danger">Missing SSN</StatusChip>, "Omar Patel", "Harbor Light", "Before export"],
            [<StatusChip key="3" tone="auto">Turning 65</StatusChip>, "James Ortega", "Individual", "6 months"],
          ]}
        />
      </Card>
    </div>
  );
}
