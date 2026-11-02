import { ModuleTag } from "@/components/features";
import { RenewalRatesBoard } from "@/components/gap-features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Renewals" };

export default function RenewalsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module F · Renewals"
        title="Renewals"
        description="120 days before renewal the system starts the workflow, rate updates, and re-enrollment window."
        actions={
          <Button href="/manager/compose" variant="secondary">
            Message renewing group
          </Button>
        }
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Renewals" />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="border-gold bg-parchment p-4">
          <p className="label-mono">Automation 14</p>
          <p className="mt-2 text-sm text-ink">
            Palm Coast Logistics renewal opened · 118 days out
          </p>
        </Card>
        <Card className="p-4">
          <p className="label-mono">Active renewals</p>
          <p className="mt-1 font-display text-3xl text-ink">2</p>
        </Card>
        <Card className="p-4">
          <p className="label-mono">Awaiting rates</p>
          <p className="mt-1 font-display text-3xl text-ink">1</p>
        </Card>
      </div>

      <Card className="mb-6 overflow-hidden">
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

      <h2 className="mb-3 font-display text-xl text-ink">
        Rate updates & re-enrollment
      </h2>
      <RenewalRatesBoard />
    </div>
  );
}
