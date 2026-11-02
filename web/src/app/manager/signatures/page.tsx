import { ModuleTag, SignatureAudit } from "@/components/features";
import { VerificationBanner } from "@/components/verification";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Signatures" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module E · Signing"
        title="Signatures & audit trails"
        description="Produce any signed document and its audit trail on request. Paper uploads need manual proof review."
        actions={
          <Button href="/manager/verifications/vr-104" variant="accent">
            Review paper upload
          </Button>
        }
      />
      <ModuleTag code="E" name="E-signature" />
      <div className="mt-4">
        <VerificationBanner>
          Wet-ink / paper fallback elections include a scanned image. Open
          verification to confirm pages, signature, and elections before filing.
        </VerificationBanner>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SignatureAudit />
        <Card className="animate-rise overflow-hidden">
          <Table
            headers={["Document", "Signer", "Status", ""]}
            rows={[
              [
                "Medical election",
                "Aisha Patel",
                <StatusChip key="a" tone="success">
                  Signed
                </StatusChip>,
                "—",
              ],
              [
                "Dental election",
                "Aisha Patel",
                <StatusChip key="b" tone="success">
                  Signed
                </StatusChip>,
                "—",
              ],
              [
                "Paper election scan",
                "Elena Brooks",
                <StatusChip key="c" tone="warning">
                  Proof review
                </StatusChip>,
                <Button
                  key="c2"
                  href="/manager/verifications/vr-104"
                  variant="secondary"
                  className="!min-h-9 !px-3 !text-sm"
                >
                  Verify
                </Button>,
              ],
              [
                "Broker agreement",
                "Rivers & Reed HR",
                <StatusChip key="d" tone="warning">
                  Awaiting
                </StatusChip>,
                "—",
              ],
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
