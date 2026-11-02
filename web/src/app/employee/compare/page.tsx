import { EnrollmentStepper, ModuleTag } from "@/components/features";
import { PlanPicker } from "@/components/working";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";
import { plans } from "@/lib/mock-data";

export const metadata = { title: "Compare plans" };

export default function ComparePage() {
  const medical = plans.filter((p) => p.type === "Medical");
  return (
    <EmployeeShell step={3}>
      <PageHeader
        eyebrow="Module D · Benefits portal"
        title="Compare medical plans"
        description="Per-paycheck and annual cost for you + family. Tap a plan to select."
      />
      <ModuleTag code="D" name="Plan comparison" />
      <div className="mt-4">
        <EnrollmentStepper current={3} />
      </div>
      <div className="mt-4">
        <PlanPicker plans={medical} />
      </div>
    </EmployeeShell>
  );
}
