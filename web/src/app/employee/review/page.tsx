import { Button, Card, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Review" };

export default function ReviewPage() {
  return (
    <EmployeeShell step={6}>
      <PageHeader title="Review your elections" description="Confirm before you sign." />
      <Card className="divide-y divide-hairline p-1">
        {[
          ["Medical", "Gold PPO 1500 · You + family · $186.40 / pay"],
          ["Dental", "Guardian PPO · You + family · $18.50 / pay"],
          ["Vision", "Waived · Covered elsewhere"],
          ["Life", "1× salary · Beneficiary Omar Patel"],
        ].map(([k, v]) => (
          <div key={k} className="px-4 py-3 text-sm">
            <p className="label-mono">{k}</p>
            <p className="mt-1 font-medium">{v}</p>
          </div>
        ))}
      </Card>
      <p className="mt-4 text-sm text-muted">
        Total per paycheck{" "}
        <span className="font-display text-xl text-ink">$204.90</span>
      </p>
      <Button href="/employee/sign" variant="accent" className="mt-4 w-full">
        Continue to sign
      </Button>
    </EmployeeShell>
  );
}
