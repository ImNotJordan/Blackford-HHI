import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src", "app");

function write(rel, content) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart());
  console.log("wrote", rel);
}

write(
  "employer/page.tsx",
  `
import { Card, PageHeader, Stat, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Enrollment progress" };

export default function EmployerHomePage() {
  return (
    <div>
      <PageHeader
        title="Enrollment progress"
        description="Rivers & Reed LLP · Window open through Feb 28, 2027"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Stat label="Complete" value="18" note="Of 42 employees" />
        </Card>
        <Card className="p-5">
          <Stat label="In progress" value="9" note="Saved mid-flow" />
        </Card>
        <Card className="p-5">
          <Stat label="Not started" value="15" note="Reminders running" />
        </Card>
      </div>
      <Card>
        <Table
          headers={["Employee", "Status", "Last activity", "Deduction"]}
          rows={[
            [
              "Elena Brooks",
              <StatusChip key="s1" tone="success">
                Complete
              </StatusChip>,
              "Yesterday",
              "$204.90 / pay",
            ],
            [
              "Noah Grant",
              <StatusChip key="s2" tone="warning">
                In progress
              </StatusChip>,
              "Today · 8:14 AM",
              "—",
            ],
            [
              "Sofia Nguyen",
              <StatusChip key="s3" tone="neutral">
                Not started
              </StatusChip>,
              "Invite sent",
              "—",
            ],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "employer/sign-in/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";

export const metadata = { title: "Employer sign-in" };

export default function EmployerSignInPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Employer portal"
        description="Secure sign-in for the HR contact invited during onboarding."
      />
      <Card className="space-y-4 p-6">
        <Field label="Work email">
          <Input type="email" placeholder="hr@company.com" />
        </Field>
        <Field label="One-time code" hint="We text or email a code — no long-lived password required for MVP demos.">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-widest" />
        </Field>
        <Button href="/employer" variant="accent" className="w-full">
          Continue
        </Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "employer/company/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Company details" };

export default function CompanyPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Company details"
        description="Confirm legal name, contacts, and payroll schedule before census upload."
      />
      <Card className="space-y-4 p-6">
        <Field label="Legal name">
          <Input defaultValue="Rivers & Reed LLP" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="EIN">
            <Input defaultValue="59-1234567" className="font-mono" />
          </Field>
          <Field label="Payroll schedule">
            <Select defaultValue="biweekly">
              <option value="biweekly">Biweekly</option>
              <option value="semimonthly">Semi-monthly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </Field>
        </div>
        <Field label="Primary HR contact">
          <Input defaultValue="Jordan Miles · jordan.miles@riversreed.com" />
        </Field>
        <Button variant="accent">Save details</Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "employer/census/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Census" };

export default function CensusPage() {
  return (
    <div>
      <PageHeader
        title="Census upload"
        description="Upload from the Blackford template. Errors return with a link to fix and re-upload."
        actions={<Button variant="accent">Upload census CSV</Button>}
      />
      <Card className="mb-4 border-gold bg-parchment p-5">
        <p className="label-mono !text-gold-deep">Validation · Automation 9</p>
        <p className="mt-2 text-sm">
          3 rows failed: missing hire date (row 12), invalid class code (row 19), dependent age blank
          (row 27). Fix and upload again.
        </p>
      </Card>
      <Card>
        <Table
          headers={["Row", "Name", "Issue", "Status"]}
          rows={[
            ["12", "Chris Alvarez", "Missing hire date", <StatusChip key="e1" tone="danger">Error</StatusChip>],
            ["19", "Lee Morgan", "Class code “PT-FLEX” unknown", <StatusChip key="e2" tone="danger">Error</StatusChip>],
            ["27", "Dependent of Kim Park", "Age required", <StatusChip key="e3" tone="danger">Error</StatusChip>],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "employer/plans/page.tsx",
  `
import { Card, PageHeader, Table } from "@/components/ui";
import { plans } from "@/lib/mock-data";

export const metadata = { title: "Plans & rates" };

export default function EmployerPlansPage() {
  return (
    <div>
      <PageHeader
        title="Plans, rates & contributions"
        description="What your group offers. Blackford staff enters rates; you confirm on the setup summary."
      />
      <Card>
        <Table
          headers={["Plan", "Type", "Employee / pay", "Employer share"]}
          rows={plans.map((p) => [
            p.name,
            p.type,
            <span key={p.id} className="font-mono text-xs">
              \${p.paycheck.toFixed(2)}
            </span>,
            p.type === "Medical" ? "70%" : "50%",
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "employer/setup/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Setup approval" };

export default function SetupPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Setup summary"
        description="Approve to lock the setup and mark the group Ready to enroll."
      />
      <Card className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="warning">Awaiting HR approval</StatusChip>
          <StatusChip tone="auto">Effective 2027-03-01</StatusChip>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b border-hairline pb-2">
            <span>Eligible employees</span>
            <span className="font-medium">42</span>
          </li>
          <li className="flex justify-between border-b border-hairline pb-2">
            <span>Medical plans</span>
            <span className="font-medium">2</span>
          </li>
          <li className="flex justify-between border-b border-hairline pb-2">
            <span>Waiting period</span>
            <span className="font-medium">First of month after 30 days</span>
          </li>
          <li className="flex justify-between">
            <span>Open enrollment</span>
            <span className="font-medium">Feb 1 – Feb 28, 2027</span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="secondary">Request changes</Button>
          <Button href="/employer" variant="accent">
            Approve setup
          </Button>
        </div>
      </Card>
    </div>
  );
}
`,
);

// Employee portal — each step wrapped in EmployeeShell via layout helper components in page
const employeePages = [
  [
    "employee/page.tsx",
    `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your enrollment" };

export default function EmployeeHomePage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Continue enrollment"
        description="Harbor Light Manufacturing · Window closes Mar 15, 2027"
      />
      <Card className="mb-4 border-gold bg-parchment p-4">
        <StatusChip tone="auto">Saved at · Compare plans</StatusChip>
        <p className="mt-3 text-sm">Pick up exactly where you left off. Takes about 8 minutes on your phone.</p>
      </Card>
      <div className="space-y-3">
        <Button href="/employee/details" variant="accent" className="w-full">
          Resume enrollment
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
`,
  ],
  [
    "employee/sign-in/page.tsx",
    `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Sign in" };

export default function EmployeeSignInPage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Sign in with a code"
        description="We sent a one-time code to the phone or email on file. No password."
      />
      <Card className="space-y-4 p-5">
        <Field label="One-time code">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-[0.3em]" />
        </Field>
        <Button href="/employee" variant="accent" className="w-full">
          Continue
        </Button>
        <button type="button" className="w-full text-sm text-gold-deep underline">
          Resend code
        </button>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/details/page.tsx",
    `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your details" };

export default function DetailsPage() {
  return (
    <EmployeeShell step={1}>
      <PageHeader title="Confirm your details" description="Make sure we have the right contact info." />
      <Card className="space-y-4 p-5">
        <Field label="Legal name">
          <Input defaultValue="Aisha Patel" />
        </Field>
        <Field label="Mobile">
          <Input defaultValue="(904) 555-0142" />
        </Field>
        <Field label="Email">
          <Input type="email" defaultValue="aisha.patel@harborlight.com" />
        </Field>
        <Field label="Home address">
          <Input defaultValue="1840 Riverside Ave, Jacksonville, FL" />
        </Field>
        <Button href="/employee/dependents" variant="accent" className="w-full">
          Save & continue
        </Button>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/dependents/page.tsx",
    `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Dependents" };

export default function DependentsPage() {
  return (
    <EmployeeShell step={2}>
      <PageHeader title="Dependents" description="Add anyone you want to cover." />
      <div className="space-y-3">
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Omar Patel</p>
            <p className="text-sm text-warm-gray">Spouse · DOB 03/12/1990</p>
          </div>
          <StatusChip tone="success">On file</StatusChip>
        </Card>
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Nora Patel</p>
            <p className="text-sm text-warm-gray">Child · DOB 08/02/2022</p>
          </div>
          <StatusChip tone="success">On file</StatusChip>
        </Card>
        <Button variant="secondary" className="w-full">
          Add dependent
        </Button>
        <Button href="/employee/compare" variant="accent" className="w-full">
          Continue
        </Button>
      </div>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/compare/page.tsx",
    `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";
import { plans } from "@/lib/mock-data";

export const metadata = { title: "Compare plans" };

export default function ComparePage() {
  const medical = plans.filter((p) => p.type === "Medical");
  return (
    <EmployeeShell step={3}>
      <PageHeader
        title="Compare medical plans"
        description="Per-paycheck and annual cost for you + family."
      />
      <div className="space-y-3">
        {medical.map((p, i) => (
          <Card key={p.id} className={\`p-4 \${i === 0 ? "border-ink" : ""}\`}>
            {i === 0 ? <StatusChip tone="active">Recommended</StatusChip> : null}
            <h2 className="mt-2 font-display text-xl">{p.name}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label-mono">Per paycheck</p>
                <p className="font-display text-2xl">\${p.paycheck.toFixed(2)}</p>
              </div>
              <div>
                <p className="label-mono">Annual</p>
                <p className="font-display text-2xl">\${p.annual.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-warm-gray">Deductible</p>
                <p className="font-medium">\${p.deductible.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-warm-gray">Out-of-pocket max</p>
                <p className="font-medium">\${p.oop?.toLocaleString()}</p>
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
`,
  ],
  [
    "employee/elect/page.tsx",
    `
import { Button, Card, Field, PageHeader, Select, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Elect or waive" };

export default function ElectPage() {
  return (
    <EmployeeShell step={4}>
      <PageHeader title="Elect or waive" description="One decision per benefit — enroll or waive with a reason." />
      <div className="space-y-3">
        {[
          ["Medical", "Florida Blue Gold PPO 1500", "Enroll"],
          ["Dental", "Guardian Dental PPO", "Enroll"],
          ["Vision", "MetLife Vision", "Waive"],
        ].map(([type, plan, choice]) => (
          <Card key={type} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="label-mono">{type}</p>
                <p className="mt-1 font-medium">{plan}</p>
              </div>
              <StatusChip tone={choice === "Enroll" ? "success" : "neutral"}>{choice}</StatusChip>
            </div>
            {choice === "Waive" ? (
              <Field label="Waive reason" hint="Kept for ACA reporting">
                <Select defaultValue="other" className="mt-2">
                  <option value="other">Covered elsewhere</option>
                  <option value="cost">Cost</option>
                  <option value="none">Do not want coverage</option>
                </Select>
              </Field>
            ) : null}
          </Card>
        ))}
        <Button href="/employee/beneficiaries" variant="accent" className="w-full">
          Save elections
        </Button>
      </div>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/beneficiaries/page.tsx",
    `
import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Beneficiaries" };

export default function BeneficiariesPage() {
  return (
    <EmployeeShell step={5}>
      <PageHeader title="Beneficiaries" description="Required for life coverage elections." />
      <Card className="space-y-4 p-5">
        <Field label="Primary beneficiary">
          <Input defaultValue="Omar Patel" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Relationship">
            <Select defaultValue="spouse">
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Share">
            <Input defaultValue="100%" />
          </Field>
        </div>
        <Button href="/employee/review" variant="accent" className="w-full">
          Continue to review
        </Button>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/review/page.tsx",
    `
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
      <p className="mt-4 text-sm text-ink/70">
        Total per paycheck <span className="font-display text-xl text-ink">$204.90</span>
      </p>
      <Button href="/employee/sign" variant="accent" className="mt-4 w-full">
        Continue to sign
      </Button>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/sign/page.tsx",
    `
import { Button, Card, Field, PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Sign" };

export default function SignPage() {
  return (
    <EmployeeShell step={7}>
      <PageHeader
        title="Sign your elections"
        description="Consent to electronic records first, then sign on screen."
      />
      <Card className="space-y-4 p-5">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
          <span>
            I agree to receive and sign these documents electronically. I can request a paper copy
            from Blackford.
          </span>
        </label>
        <Field label="Type your full legal name to sign">
          <input
            className="min-h-14 w-full rounded-[10px] border border-hairline bg-ivory px-3 font-display text-2xl"
            defaultValue="Aisha Patel"
            aria-label="Signature"
          />
        </Field>
        <p className="text-xs text-warm-gray">
          Audit trail stores name, time, device, and IP when you finish.
        </p>
        <Button href="/employee/confirmation" variant="accent" className="w-full">
          Sign & submit
        </Button>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/confirmation/page.tsx",
    `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Confirmation" };

export default function ConfirmationPage() {
  return (
    <EmployeeShell>
      <PageHeader title="You're enrolled" description="Confirmation PDF is on your record and emailed to you." />
      <Card className="p-5 text-center">
        <StatusChip tone="success">Complete</StatusChip>
        <p className="mt-4 font-display text-3xl">$204.90</p>
        <p className="text-sm text-warm-gray">Per paycheck starting March 2027</p>
        <div className="mt-6 space-y-2">
          <Button variant="secondary" className="w-full">
            Download confirmation PDF
          </Button>
          <Button href="/employee" variant="primary" className="w-full">
            Back to portal
          </Button>
        </div>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/life-event/page.tsx",
    `
import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Life event" };

export default function LifeEventPage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Report a life event"
        description="Birth, marriage, address, or lost coverage — within 30 days of the event."
      />
      <Card className="space-y-4 p-5">
        <Field label="Event type">
          <Select defaultValue="birth">
            <option value="birth">Birth or adoption</option>
            <option value="marriage">Marriage</option>
            <option value="address">Address change</option>
            <option value="lost">Lost coverage</option>
          </Select>
        </Field>
        <Field label="Event date">
          <Input type="date" defaultValue="2027-02-28" />
        </Field>
        <Field label="Upload proof" hint="Birth certificate, marriage license, or other required document.">
          <Input type="file" />
        </Field>
        <Button variant="accent" className="w-full">
          Submit for staff approval
        </Button>
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
  [
    "employee/agent/page.tsx",
    `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Agent mode" };

export default function AgentModePage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Agent-assisted enrollment"
        description="iPad mode for in-person meetings — open an employee and walk the same flow."
      />
      <Card className="mb-4 p-4">
        <StatusChip tone="auto">Device · iPad</StatusChip>
        <p className="mt-3 text-sm">Search the group roster, then hand the iPad to the employee to sign.</p>
      </Card>
      <Card className="divide-y divide-hairline">
        {["Aisha Patel", "Jordan Kim", "Sam Ortiz"].map((name) => (
          <div key={name} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium">{name}</span>
            <Button href="/employee/details" variant="secondary" className="!min-h-9 !px-3 !text-sm">
              Open
            </Button>
          </div>
        ))}
      </Card>
    </EmployeeShell>
  );
}
`,
  ],
];

for (const [rel, content] of employeePages) {
  write(rel, content);
}

console.log("portal pages complete");
