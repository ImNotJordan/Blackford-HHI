import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Onboarding" };

export default function OnboardingListPage() {
  const rows = clients.filter((c) => ["Onboarding", "Enrolling"].includes(c.pipeline));
  return (
    <div>
      <PageHeader
        title="Employer onboarding"
        description="Signed → ready to enroll. Checklists with due dates counted back from the effective date."
      />
      <Card>
        <Table
          headers={["Group", "Effective", "Status", ""]}
          rows={rows.map((g) => [
            g.name,
            <span key={g.id} className="font-mono text-xs">
              {g.effective}
            </span>,
            <StatusChip key={`${g.id}-s`}>{g.pipeline}</StatusChip>,
            <Link key={`${g.id}-l`} href={`/staff/onboarding/${g.id}`} className="text-sm">
              Checklist
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
