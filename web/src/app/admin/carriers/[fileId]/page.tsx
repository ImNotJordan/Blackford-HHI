import { Suspense } from "react";
import { RouteFallback } from "@/components/route-fallback";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";

export default function Page({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = carrierFiles.find((f) => f.id === fileId) ?? carrierFiles[0];
  return (
    <div>
      <PageHeader
        title={`Approve · ${file.carrier}`}
        description={`${file.group} · Admin approver`}
        actions={
          <>
            <Button variant="secondary">Hold errors</Button>
            <Button variant="accent">Approve & deliver</Button>
          </>
        }
      />
      <StatusChip tone="warning">{file.status}</StatusChip>
      <Card className="mt-4">
        <Table
          headers={["Employee", "Action", "Result"]}
          rows={[
            [
              "Aisha Patel",
              "Change",
              <StatusChip key="1" tone="success">
                OK
              </StatusChip>,
            ],
            [
              "Omar Patel",
              "Add",
              <StatusChip key="2" tone="danger">
                Missing SSN
              </StatusChip>,
            ],
          ]}
        />
      </Card>
    </div>
  );
}
