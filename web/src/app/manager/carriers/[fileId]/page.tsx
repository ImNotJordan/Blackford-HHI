import { Suspense } from "react";
import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { RouteFallback } from "@/components/route-fallback";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";

export default function CarrierFilePage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <CarrierFileContent params={params} />
    </Suspense>
  );
}

async function CarrierFileContent({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = carrierFiles.find((f) => f.id === fileId) ?? carrierFiles[0];
  return (
    <div>
      <PageHeader
        eyebrow="Module G · Carrier submission"
        title={`${file.carrier} · ${file.kind}`}
        description={`${file.group} · Created ${file.created}`}
        actions={
          <>
            <ActionButton variant="secondary" success="Download ready">
              Download encrypted
            </ActionButton>
            <ActionButton success="Approved · delivery queued">
              Approve & deliver
            </ActionButton>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="G" name="Carrier file" />
        <StatusChip tone="warning">{file.status}</StatusChip>
        <StatusChip tone={file.errors ? "danger" : "success"}>
          {file.errors} validation errors
        </StatusChip>
      </div>
      <Card className="mb-4 border-gold bg-parchment p-5">
        <p className="label-mono">Validation</p>
        <p className="mt-2 text-sm text-ink">
          2 records held: missing dependent SSN · dependent age over plan
          limit. Fix data or hold those people and send the rest.
        </p>
      </Card>
      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["Employee", "Action", "Plan code", "Result"]}
          rows={[
            [
              "Aisha Patel",
              "Change",
              "MED-GOLD-1500",
              <StatusChip key="ok1" tone="success">
                OK
              </StatusChip>,
            ],
            [
              "Omar Patel",
              "Add",
              "DEP-SPOUSE",
              <StatusChip key="err1" tone="danger">
                Missing SSN
              </StatusChip>,
            ],
            [
              "Nora Patel",
              "Add",
              "DEP-CHILD",
              <StatusChip key="err2" tone="danger">
                Age check
              </StatusChip>,
            ],
            [
              "Jordan Kim",
              "Term",
              "MED-GOLD-1500",
              <StatusChip key="ok2" tone="success">
                OK
              </StatusChip>,
            ],
          ]}
        />
      </Card>
    </div>
  );
}
