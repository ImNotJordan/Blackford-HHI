import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "ID cards" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module A" title="ID cards" description="Request a replacement card or view the last request status." />
      <ModuleTag code="A" name="ID cards" />
      <Card className="mt-4 space-y-3 p-4">
        <StatusChip tone="active">Plan G · MS-441902</StatusChip>
        <p className="text-sm text-muted">Last request · none on file</p>
        <ActionButton success="ID card request submitted">Request replacement ID card</ActionButton>
        <Button href="/client/service" variant="ghost" className="w-full">Other service request</Button>
      </Card>
    </div>
  );
}
