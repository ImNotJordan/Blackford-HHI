import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Renewals" };

export default function RenewalsPage() {
  return (
    <div>
      <PageHeader
        title="Renewals"
        description="120 days before renewal the system starts the workflow and task list."
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card className="border-gold bg-parchment p-5">
          <p className="label-mono">Automation 14</p>
          <p className="mt-2 text-sm">Palm Coast Logistics renewal opened · 118 days out</p>
        </Card>
        <Card className="p-5">
          <p className="label-mono">Active renewals</p>
          <p className="mt-1 font-display text-3xl">2</p>
        </Card>
        <Card className="p-5">
          <p className="label-mono">Awaiting rates</p>
          <p className="mt-1 font-display text-3xl">1</p>
        </Card>
      </div>
      <Card>
        <Table
          headers={["Group", "Renewal date", "Mode", "Status"]}
          rows={[
            [
              "Palm Coast Logistics",
              "2027-05-01",
              "Re-enrollment window",
              <StatusChip key="r1" tone="warning">
                Collecting rates
              </StatusChip>,
            ],
            [
              "Coastal Clinics",
              "2027-07-01",
              "Passive renewal",
              <StatusChip key="r2" tone="auto">
                Scheduled
              </StatusChip>,
            ],
          ]}
        />
      </Card>
    </div>
  );
}
