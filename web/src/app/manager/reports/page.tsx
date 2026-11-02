import { ModuleTag } from "@/components/features";
import { ReportsWorkspace } from "@/components/gap-features";
import { Card, PageHeader, Stat } from "@/components/ui";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H"
        title="Reports"
        description="Enrollment, carrier submission, onboarding SLA, and data quality for your book."
      />
      <div className="mb-4">
        <ModuleTag code="H" name="Reporting" />
      </div>
      <div className="stagger mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="ui-card p-4">
          <Stat label="Finish before close" value="94%" note="Target ≥ 95%" />
        </Card>
        <Card className="ui-card p-4">
          <Stat
            label="Phone / iPad enrollments"
            value="71%"
            note="Majority target"
          />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Carrier rejects" value="1.4%" note="Target under 2%" />
        </Card>
        <Card className="ui-card p-4">
          <Stat
            label="Manual reminders"
            value="~0"
            note="Automations covering OE"
          />
        </Card>
      </div>
      <ReportsWorkspace audience="manager" />
    </div>
  );
}
