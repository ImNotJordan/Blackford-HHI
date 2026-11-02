import { EnrollmentStepper, ModuleTag } from "@/components/features";
import { ElectWaiveBoard } from "@/components/interactive";
import { Button, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Elect or waive" };

export default function ElectPage() {
  return (
    <EmployeeShell step={4}>
      <PageHeader
        eyebrow="Module D"
        title="Elect or waive"
        description="One decision per benefit — enroll or waive with a reason for ACA."
      />
      <ModuleTag code="D" name="Elections" />
      <div className="mt-4">
        <EnrollmentStepper current={4} />
      </div>
      <ElectWaiveBoard
        items={[
          {
            type: "Medical",
            plan: "Florida Blue Gold PPO 1500",
            choice: "Enroll",
          },
          {
            type: "Dental",
            plan: "Guardian Dental PPO",
            choice: "Enroll",
          },
          {
            type: "Vision",
            plan: "MetLife Vision",
            choice: "Waive",
          },
        ]}
      />
      <div className="mt-4 flex flex-col gap-2">
        <Button href="/employee/waive-reason" variant="secondary" className="w-full">
          Add waive reason (ACA)
        </Button>
        <Button href="/employee/beneficiaries" variant="accent" className="w-full">
          Save elections
        </Button>
      </div>
    </EmployeeShell>
  );
}
