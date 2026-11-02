import { ModuleTag } from "@/components/features";
import { VerificationBanner } from "@/components/verification";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { verificationCases } from "@/lib/verification";
import { DocumentsProofGallery } from "./proof-gallery";
import { proofAssets } from "@/lib/verification";

export const metadata = { title: "Documents" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Records"
        title="Documents"
        description="Plans, signed elections, carrier apps, and uploaded proof on every client record."
        actions={
          <Button href="/manager/verifications" variant="secondary">
            Verification queue
          </Button>
        }
      />
      <ModuleTag code="A" name="Documents" />
      <div className="mt-4">
        <VerificationBanner>
          Proof images attached to life events and paper elections live here
          until staff completes manual verification.
        </VerificationBanner>
      </div>
      <DocumentsProofGallery
        proofs={[
          proofAssets.birthCert,
          proofAssets.paperSign,
          proofAssets.idCard,
          proofAssets.addressProof,
        ]}
      />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Document", "Client", "Type", "Status", ""]}
          rows={[
            [
              "Election confirmation.pdf",
              "Aisha Patel",
              "Signed",
              <StatusChip key="1" tone="success">
                On file
              </StatusChip>,
              "—",
            ],
            [
              "Birth certificate scan",
              "Harbor Light · birth event",
              "Proof",
              <StatusChip key="2" tone="warning">
                Needs review
              </StatusChip>,
              <Button
                key="2a"
                href="/manager/verifications/vr-101"
                variant="secondary"
                className="!min-h-9 !px-3 !text-sm"
              >
                Verify
              </Button>,
            ],
            [
              "Florida Blue change file",
              "Harbor Light",
              "Carrier",
              <StatusChip key="3" tone="auto">
                Draft
              </StatusChip>,
              "—",
            ],
            ...verificationCases
              .filter((c) => c.proofs.length && c.id !== "vr-101")
              .slice(0, 2)
              .map((c) => [
                c.proofs[0].fileName,
                c.subject,
                "Proof",
                <StatusChip key={c.id} tone="warning">
                  In queue
                </StatusChip>,
                <Button
                  key={`${c.id}-b`}
                  href={c.href}
                  variant="secondary"
                  className="!min-h-9 !px-3 !text-sm"
                >
                  Open
                </Button>,
              ]),
          ]}
        />
      </Card>
    </div>
  );
}
