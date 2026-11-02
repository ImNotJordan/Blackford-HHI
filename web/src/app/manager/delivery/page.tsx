import { ConsentNotice, ModuleTag, QuietHoursNotice } from "@/components/features";
import { DeliveryTrackingBoard } from "@/components/gap-features";
import { Button, PageHeader } from "@/components/ui";

export const metadata = { title: "Delivery tracking" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module B · Delivery"
        title="Delivery tracking"
        description="Channel status with fallback — text fail → email; both fail → call task (Automation 12)."
        actions={
          <Button href="/manager/compose" variant="accent">
            Compose
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="B" name="Communications" />
      </div>
      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <ConsentNotice />
        <QuietHoursNotice />
      </div>
      <DeliveryTrackingBoard />
    </div>
  );
}
