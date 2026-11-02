import { EnrollmentStepper, ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your enrollment" };

export default function EmployeeHomePage() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Employee · Module D"
        title="Continue enrollment"
        description="Harbor Light Manufacturing · Finish on your phone in one session."
      />
      <div className="mb-4">
        <ModuleTag code="D" name="Benefits portal" />
      </div>
      <EnrollmentStepper current={3} />
      <Card className="animate-scale mb-4 border-gold bg-parchment p-5">
        <StatusChip tone="auto">Saved · Compare plans</StatusChip>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Pick up exactly where you left off. About 8 minutes remaining. A
          confirmation PDF lands on your record when you sign.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-hairline">
          <div
            className="progress-fill h-full rounded-full bg-ink"
            style={{ width: "43%" }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">Step 3 of 7 · Window closes Mar 15</p>
      </Card>
      <div className="stagger space-y-3">
        <Button href="/employee/compare" variant="accent" className="w-full">
          Resume at compare plans
        </Button>
        <Button href="/employee/life-event" variant="secondary" className="w-full">
          Report a life event
        </Button>
        <Button href="/employee/agent" variant="ghost" className="w-full">
          Agent iPad mode
        </Button>
      </div>
    </EmployeeShell>
  );
}
