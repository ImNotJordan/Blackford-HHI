import { FeatureCallout, ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Medicare options" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module H · Automation 11" title="Medicare options" description="You're flagged as turning 65 within 6 months — talk through options with Blackford." />
      <ModuleTag code="H" name="Turning 65" />
      <div className="mt-4">
        <FeatureCallout module="H" title="Nightly data quality flag" tone="warning">
          Clients turning 65 within 6 months appear on your account manager's queue.
        </FeatureCallout>
      </div>
      <Card className="mt-4 space-y-3 p-4">
        <StatusChip tone="auto">Age-in window</StatusChip>
        <p className="text-sm text-ink">Current coverage: Medicare Supplement Plan G. Ask about Part D, Advantage vs Supplement, and Medigap rules.</p>
        <Button href="/client/messages" variant="accent" className="w-full">Message my agent</Button>
        <Button href="/client/enroll/details" variant="secondary" className="w-full">Start individual intake</Button>
      </Card>
    </div>
  );
}
