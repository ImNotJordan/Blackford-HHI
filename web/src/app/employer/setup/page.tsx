import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Setup approval" };

export default function SetupPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C"
        title="Setup summary"
        description="Approve to lock the setup and mark the group Ready to enroll."
      />
      <ModuleTag code="C" name="Setup approval" />
      <Card className="mt-4 animate-rise space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="warning">Awaiting HR approval</StatusChip>
          <StatusChip tone="auto">Effective 2027-03-01</StatusChip>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b border-hairline pb-2">
            <span className="text-muted">Eligible employees</span>
            <span className="font-medium text-ink">42</span>
          </li>
          <li className="flex justify-between border-b border-hairline pb-2">
            <span className="text-muted">Medical plans</span>
            <span className="font-medium text-ink">2</span>
          </li>
          <li className="flex justify-between border-b border-hairline pb-2">
            <span className="text-muted">Waiting period</span>
            <span className="font-medium text-ink">
              First of month after 30 days
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted">Open enrollment</span>
            <span className="font-medium text-ink">Feb 1 – Feb 28, 2027</span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <ActionButton variant="secondary" success="Change request sent">
            Request changes
          </ActionButton>
          <ActionButton success="Setup locked · Ready to enroll">
            Approve setup
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}
