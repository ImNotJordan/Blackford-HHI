import { ModuleTag } from "@/components/features";
import { ReportsWorkspace } from "@/components/gap-features";
import { Card, PageHeader, Stat } from "@/components/ui";

export const metadata = { title: "Weekly reports" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H · All books"
        title="Weekly reports"
        description="Enrollment, carrier submission, overdue tasks, and data quality across every group."
      />
      <div className="mb-4">
        <ModuleTag code="H" name="Weekly review" />
      </div>
      <div className="stagger mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="ui-card p-4">
          <Stat label="Finish before close" value="94%" />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Carrier rejects" value="1.4%" />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Overdue tasks" value="11" />
        </Card>
        <Card className="ui-card p-4">
          <Stat label="Data flags" value="27" note="Age-26 / turning-65" />
        </Card>
      </div>
      <ReportsWorkspace audience="admin" />
    </div>
  );
}
