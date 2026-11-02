import { Card, PageHeader, Stat } from "@/components/ui";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Enrollment status, carrier submission, onboarding, and data quality."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Stat label="Finish before close" value="94%" note="Target ≥ 95%" />
        </Card>
        <Card className="p-5">
          <Stat label="Phone / iPad enrollments" value="71%" note="Majority target" />
        </Card>
        <Card className="p-5">
          <Stat label="Carrier rejects" value="1.4%" note="Target under 2%" />
        </Card>
        <Card className="p-5">
          <Stat label="Manual reminders" value="~0" note="Automations covering OE" />
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {[
          ["Enrollment status", "By group, window, and step"],
          ["Carrier submission", "Draft → approved → confirmed"],
          ["Onboarding", "Checklist SLA and overdue owners"],
          ["Data quality", "Missing dependents, age-26, turning-65 flags"],
        ].map(([title, body]) => (
          <Card key={title} className="p-5">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="mt-2 text-sm text-ink/70">{body}</p>
            <button type="button" className="text-link mt-4 text-sm">
              Open report
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
