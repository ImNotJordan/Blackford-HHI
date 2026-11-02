import { EnrollmentStepper, ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
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
        description="Per-paycheck and annual cost for you + family."
      />
      <ModuleTag code="D" name="Plan comparison" />
      <div className="mt-4">
        <EnrollmentStepper current={3} />
      </div>
      <div className="stagger space-y-3">
        {medical.map((p, i) => (
          <Card
            key={p.id}
            className={`ui-card p-5 ${i === 0 ? "border-ink" : ""}`}
          >
            {i === 0 ? (
              <StatusChip tone="active">Recommended</StatusChip>
            ) : null}
            <h2 className="mt-2 font-display text-xl text-ink">{p.name}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label-mono">Per paycheck</p>
                <p className="font-display text-2xl text-ink">
                  ${p.paycheck.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="label-mono">Annual</p>
                <p className="font-display text-2xl text-ink">
                  ${p.annual.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-muted">Deductible</p>
                <p className="font-medium text-ink">
                  ${p.deductible.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted">Out-of-pocket max</p>
                <p className="font-medium text-ink">
                  ${p.oop?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
        <Button href="/employee/elect" variant="accent" className="w-full">
          Choose a plan
        </Button>
      </div>
    </EmployeeShell>
  );
}
