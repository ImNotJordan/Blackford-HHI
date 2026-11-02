import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Compare plans" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 3" title="Compare plans" description="Medicare Supplement and related options." />
      <ModuleTag code="D" name="Plans" />
      <div className="mt-4 space-y-3">
        {["Plan G · Florida Blue", "Plan N · Florida Blue"].map((p, i) => (
          <Card key={p} className="p-4">
            <StatusChip tone={i === 0 ? "active" : "neutral"}>{i === 0 ? "Selected" : "Option"}</StatusChip>
            <p className="mt-2 font-display text-xl text-ink">{p}</p>
            <p className="text-sm text-muted">Monthly premium shown after quote confirmation.</p>
          </Card>
        ))}
        <Button href="/client/enroll/review" variant="accent" className="w-full">Continue</Button>
      </div>
    </div>
  );
}
