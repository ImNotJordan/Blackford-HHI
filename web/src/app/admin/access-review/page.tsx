import { ModuleTag } from "@/components/features";
import { ApproveRejectRow } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Access review" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H · Quarterly"
        title="User access review"
        description="Confirm roles and remove people who have left. Required for platform oversight."
        actions={<Button href="/admin/users" variant="secondary">Users & roles</Button>}
      />
      <ModuleTag code="H" name="Access review" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Name", "Role", "Last sign-in", "Recommendation", ""]}
          rows={[
            ["Alex Rivera", "Blackford admin", "Today", <StatusChip key="a" tone="success">Keep</StatusChip>, <ApproveRejectRow key="a2" label="Alex" />],
            ["Maya Chen", "Account manager", "Today", <StatusChip key="b" tone="success">Keep</StatusChip>, <ApproveRejectRow key="b2" label="Maya" />],
            ["Former contractor", "Account manager", "90+ days", <StatusChip key="c" tone="danger">Remove</StatusChip>, <ApproveRejectRow key="c2" label="Former" />],
            ["Jordan Miles", "Employer HR", "Yesterday", <StatusChip key="d" tone="auto">Confirm scope</StatusChip>, <ApproveRejectRow key="d2" label="Jordan" />],
          ]}
        />
      </Card>
    </div>
  );
}
