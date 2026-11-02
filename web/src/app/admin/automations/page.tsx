import { ModuleTag } from "@/components/features";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { automations } from "@/lib/sow-features";

export const metadata = { title: "Automations" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="SOW · 17 automations at launch"
        title="Automations"
        description="Each is logged, can be paused per group, and has timings Blackford can change without a developer."
      />
      <div className="mb-4">
        <ModuleTag code="H" name="Automation engine" />
      </div>
      <div className="stagger mb-4 grid gap-3 sm:grid-cols-3">
        {["Enrollment", "Onboarding", "Carrier"].map((g) => (
          <Card key={g} className="ui-card p-4">
            <p className="label-mono">{g}</p>
            <p className="mt-1 font-display text-2xl text-ink">
              {automations.filter((a) => a.group === g).length}
            </p>
            <p className="text-sm text-muted">automations</p>
          </Card>
        ))}
      </div>
      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["#", "When this happens", "The system does this", "Who hears", "Group"]}
          rows={automations.map((a) => [
            <span key={a.id} className="font-mono text-xs text-ink">
              {a.id}
            </span>,
            a.when,
            a.does,
            a.who,
            <StatusChip key={`${a.id}-g`} tone="auto">
              {a.group}
            </StatusChip>,
          ])}
        />
      </Card>
    </div>
  );
}
