import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
export const metadata = { title: "Users & roles" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Users & roles" description="Assign Blackford admin, account manager, employer HR, employee, or client access." actions={<Button variant="accent">Invite staff</Button>} />
      <Card>
        <Table
          headers={["Name", "Role", "Scope", "MFA", "Status"]}
          rows={[
            ["Alex Rivera", <StatusChip key="a" tone="active">Blackford admin</StatusChip>, "All groups", "On", "Active"],
            ["Maya Chen", <StatusChip key="b" tone="neutral">Account manager</StatusChip>, "Assigned book", "On", "Active"],
            ["Sam Ortiz", <StatusChip key="c" tone="neutral">Account manager</StatusChip>, "Assigned book", "On", "Active"],
            ["Jordan Miles", <StatusChip key="d" tone="auto">Employer HR</StatusChip>, "Rivers & Reed LLP", "OTP", "Active"],
            ["Former contractor", <StatusChip key="e" tone="danger">Account manager</StatusChip>, "—", "Off", "Remove"],
          ]}
        />
      </Card>
    </div>
  );
}
