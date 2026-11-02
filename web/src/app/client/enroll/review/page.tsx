import { Button, Card, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Review" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 4" title="Review" description="Confirm before you sign." />
      <ModuleTag code="D" name="Review" />
      <Card className="mt-4 divide-y divide-hairline">
        {[["Coverage", "Florida Blue Medicare Supplement Plan G"], ["Applicant", "James Ortega"], ["Effective", "Jun 1, 2026"]].map(([k, v]) => (
          <div key={k} className="px-4 py-3 text-sm">
            <p className="label-mono">{k}</p>
            <p className="mt-1 font-medium text-ink">{v}</p>
          </div>
        ))}
      </Card>
      <Button href="/client/sign" variant="accent" className="mt-4 w-full">Continue to sign</Button>
    </div>
  );
}
