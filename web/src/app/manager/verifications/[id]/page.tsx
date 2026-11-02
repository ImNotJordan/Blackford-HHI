import { Suspense } from "react";
import Link from "next/link";
import { ModuleTag } from "@/components/features";
import { RouteFallback } from "@/components/route-fallback";
import { VerificationWorkspace } from "@/components/verification";
import { PageHeader } from "@/components/ui";
import { getVerificationCase } from "@/lib/verification";

export default function VerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <VerificationDetailContent params={params} />
    </Suspense>
  );
}

async function VerificationDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getVerificationCase(id);

  return (
    <div>
      <PageHeader
        eyebrow="Manual verification"
        title={item.title}
        description={`${item.subject} · ${item.group}`}
        actions={
          <Link href="/manager/verifications" className="text-link text-sm">
            Back to queue
          </Link>
        }
      />
      <div className="mb-4">
        <ModuleTag code="F" name="Proof review" />
      </div>
      <VerificationWorkspace initial={item} />
    </div>
  );
}
