import { Suspense } from "react";
import { ModuleTag, PipelineBar } from "@/components/features";
import { RouteFallback } from "@/components/route-fallback";
import { Button, Card, PageHeader, Stat, StatusChip } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = clients.find((c) => c.id === id) ?? clients[0];
  return (
    <div>
      <PageHeader
        eyebrow="Admin · All groups"
        title={g.name}
        description={`${g.type} · Owner ${g.owner} · ${g.city}`}
        actions={
          <>
            <Button href="/admin/users" variant="secondary">Access</Button>
            <Button href={`/manager/groups/${g.id}`} variant="accent">Open as manager</Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="H" name="Oversight" />
        <StatusChip tone="active">{g.pipeline}</StatusChip>
      </div>
      <PipelineBar active={g.pipeline} />
      <div className="stagger mt-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><Stat label="Employees" value={String(g.employees)} /></Card>
        <Card className="p-4"><Stat label="Enrolled" value={String(g.enrolled)} /></Card>
        <Card className="p-4"><Stat label="Effective" value={g.effective.slice(0, 7)} /></Card>
      </div>
    </div>
  );
}
