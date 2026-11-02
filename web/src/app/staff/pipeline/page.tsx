import { Card, PageHeader } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Pipeline" };

const stages = ["Prospect", "Quoting", "Onboarding", "Enrolling", "Active", "Renewal"];

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Prospect → quoting → onboarding → enrolling → active → renewal (module A)."
      />
      <div className="panel-fit grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const shown = clients.filter((c) => c.pipeline === stage);
          return (
            <Card key={stage} className="p-3">
              <p className="label-mono mb-3">{stage}</p>
              <div className="space-y-2">
                {(shown.length
                  ? shown
                  : [{ id: stage, name: "Empty lane", city: "No records" }]
                ).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-[10px] border border-hairline bg-ivory p-3 text-sm"
                  >
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted">{"city" in c ? c.city : ""}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
