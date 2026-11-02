import { Suspense } from "react";
import { RouteFallback } from "@/components/route-fallback";
import { Button, Card, PageHeader, Stat, StatusChip } from "@/components/ui";
import { clients, onboardingChecklist } from "@/lib/mock-data";

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <GroupDetailContent params={params} />
    </Suspense>
  );
}

async function GroupDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = clients.find((c) => c.id === id) ?? clients[0];
  const pct = Math.round((group.enrolled / Math.max(group.employees, 1)) * 100);
  return (
    <div>
      <PageHeader
        title={group.name}
        description={`Group · ${group.city} · Owner ${group.owner}`}
        actions={
          <>
            <Button href="/manager/compose" variant="secondary">
              Bulk message
            </Button>
            <Button href={`/manager/onboarding/${group.id}`} variant="accent">
              Onboarding
            </Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusChip tone="active">{group.pipeline}</StatusChip>
        <StatusChip tone="auto">Effective {group.effective}</StatusChip>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Stat
            label="Enrolled"
            value={`${pct}%`}
            note={`${group.enrolled} of ${group.employees}`}
          />
        </Card>
        <Card className="p-5">
          <Stat
            label="Outstanding"
            value={String(group.employees - group.enrolled)}
            note="Not started or in progress"
          />
        </Card>
        <Card className="p-5">
          <Stat label="Window" value="12d" note="Days until close" />
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="font-display text-xl text-ink">Onboarding snapshot</h2>
        <ul className="mt-4 space-y-2">
          {onboardingChecklist.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 border-b border-hairline py-2 text-sm last:border-0"
            >
              <span className={c.done ? "text-muted line-through" : "text-ink"}>
                {c.label}
              </span>
              <StatusChip tone={c.done ? "success" : "warning"}>
                {c.done ? "Done" : c.due}
              </StatusChip>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
