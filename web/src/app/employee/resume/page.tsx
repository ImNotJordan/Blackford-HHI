import { EnrollmentStepper, ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";
import { enrollmentFlow } from "@/lib/sow-features";

export const metadata = { title: "Resume enrollment" };

export default function Page() {
  const current = 3;
  return (
    <EmployeeShell step={current}>
      <PageHeader eyebrow="Module D" title="Save & resume" description="Pick up exactly where you left off — or jump to a completed step." />
      <ModuleTag code="D" name="Resume" />
      <div className="mt-4"><EnrollmentStepper current={current} /></div>
      <Card className="mt-4 border-gold bg-parchment p-4">
        <StatusChip tone="auto">Saved at compare plans</StatusChip>
        <p className="mt-2 text-sm text-ink">About 8 minutes remaining · window closes Mar 15.</p>
        <Button href="/employee/compare" variant="accent" className="mt-3 w-full">Resume here</Button>
      </Card>
      <ul className="mt-4 space-y-2">
        {enrollmentFlow.map((s) => (
          <li key={s.step}>
            <Button
              href={s.href}
              variant={s.step === current ? "primary" : s.step < current ? "secondary" : "ghost"}
              className="w-full !justify-between"
            >
              <span>{s.step}. {s.label}</span>
              <span className="text-xs opacity-70">{s.step < current ? "Done" : s.step === current ? "Current" : "Later"}</span>
            </Button>
          </li>
        ))}
      </ul>
    </EmployeeShell>
  );
}
