import {
  ActivityTimeline,
  FeatureCallout,
  ModuleTag,
} from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "My coverage" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Client · Individual / Medicare"
        title="My coverage"
        description="Your household, policies, and service requests — separate from group employee enrollment."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="A" name="Household" />
        <ModuleTag code="F" name="Life events" />
      </div>
      <Card className="animate-scale mb-4 p-6">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="active">Active</StatusChip>
          <StatusChip tone="auto">Medicare · Supplement</StatusChip>
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
          Florida Blue Medicare Supplement Plan G
        </h2>
        <p className="mt-2 text-sm text-muted">
          Effective Jun 1, 2026 · Policy MS-441902
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button href="/client/id-cards" variant="secondary">
            ID cards
          </Button>
          <Button href="/client/medicare" variant="secondary">
            Medicare options
          </Button>
          <Button href="/client/enroll" variant="accent">
            Enrollment
          </Button>
        </div>
      </Card>
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <FeatureCallout module="H" title="Nightly data quality" tone="warning">
          Clients turning 65 within 6 months are flagged for your account
          manager (Automation 11). Ask about Medicare options when ready.
        </FeatureCallout>
        <Card className="animate-rise p-5">
          <p className="label-mono">Activity</p>
          <h3 className="mt-1 text-ink">On your record</h3>
          <div className="mt-4">
            <ActivityTimeline
              items={[
                {
                  title: "Confirmation PDF stored",
                  meta: "Jun 1, 2026 · 2:14 PM",
                },
                {
                  title: "Application signed electronically",
                  meta: "May 20, 2026 · iPhone",
                },
                {
                  title: "OTP sign-in from secure link",
                  meta: "May 20, 2026",
                },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
