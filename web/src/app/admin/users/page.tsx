import { ModuleTag } from "@/components/features";
import { InviteStaffPanel, RemovableUserRow } from "@/components/working";
import { Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Users & roles" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H"
        title="Users & roles"
        description="Assign Blackford admin, account manager, employer HR, employee, or client access."
      />
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <ModuleTag code="H" name="Roles" />
        <InviteStaffPanel />
      </div>
      <Card className="divide-y divide-hairline overflow-hidden">
        <div className="hidden border-b border-hairline bg-ivory px-3 py-2 text-xs font-medium text-ink sm:grid sm:grid-cols-5">
          <span>Name</span>
          <span>Role</span>
          <span>Scope</span>
          <span>MFA</span>
          <span>Status</span>
        </div>
        <RemovableUserRow
          name="Alex Rivera"
          role={<StatusChip tone="active">Blackford admin</StatusChip>}
          scope="All groups"
          mfa="On"
        />
        <RemovableUserRow
          name="Maya Chen"
          role={<StatusChip tone="neutral">Account manager</StatusChip>}
          scope="Assigned book"
          mfa="On"
        />
        <RemovableUserRow
          name="Sam Ortiz"
          role={<StatusChip tone="neutral">Account manager</StatusChip>}
          scope="Assigned book"
          mfa="On"
        />
        <RemovableUserRow
          name="Jordan Miles"
          role={<StatusChip tone="auto">Employer HR</StatusChip>}
          scope="Rivers & Reed LLP"
          mfa="OTP"
        />
        <RemovableUserRow
          name="Former contractor"
          role={<StatusChip tone="danger">Account manager</StatusChip>}
          scope="—"
          mfa="Off"
          removable
        />
      </Card>
    </div>
  );
}
