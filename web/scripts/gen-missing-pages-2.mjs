import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

function write(rel, contents) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
  console.log("wrote", rel);
}

const pages = {
  "employee/documents/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Your documents" };

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader eyebrow="Module D · E" title="Your documents" description="Confirmation PDFs and signed elections on your record." />
      <ModuleTag code="E" name="Documents" />
      <div className="mt-4 space-y-3">
        {[
          ["Election confirmation.pdf", "Signed Mar 3", "success"],
          ["Medical election form", "Signed", "success"],
          ["Dental election form", "Signed", "success"],
        ].map(([name, meta, tone]) => (
          <Card key={name} className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div>
              <p className="font-medium text-ink">{name}</p>
              <p className="text-sm text-muted">{meta}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip tone={tone}>{tone === "success" ? "On file" : "Pending"}</StatusChip>
              <Button variant="secondary" className="!min-h-9 !text-sm">Download</Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployeeShell>
  );
}
`,

  "employee/messages/page.tsx": `import { ModuleTag } from "@/components/features";
import { InboxWorkspace } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Messages" };

const threads = [
  { id: "e1", from: "Blackford", channel: "Text", preview: "Your enrollment window is open — secure link inside.", time: "Mon", client: "Aisha Patel", unread: true },
  { id: "e2", from: "You", channel: "Text", preview: "Got it — finishing tonight.", time: "Mon", client: "Aisha Patel", unread: false },
];

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader eyebrow="Module B" title="Messages" description="Texts and emails about enrollment — no health details in SMS." />
      <ModuleTag code="B" name="Messages" />
      <div className="mt-4"><InboxWorkspace threads={threads} /></div>
    </EmployeeShell>
  );
}
`,

  "employee/changes/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "My changes" };

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader
        eyebrow="Module F"
        title="My life event status"
        description="Track proof review after you report a life event."
        actions={<Button href="/employee/life-event" variant="accent">Report new</Button>}
      />
      <ModuleTag code="F" name="QLE status" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <StatusChip tone="warning">Proof in review</StatusChip>
            <StatusChip tone="neutral">Inside 30 days</StatusChip>
          </div>
          <p className="mt-3 font-medium text-ink">Birth · Feb 28, 2027</p>
          <p className="mt-1 text-sm text-muted">Staff verifying birth certificate · usually 1–2 business days.</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Approved</StatusChip>
          <p className="mt-3 font-medium text-ink">Address change · Jan 2027</p>
          <p className="mt-1 text-sm text-muted">Carrier file included on next change day.</p>
        </Card>
      </div>
    </EmployeeShell>
  );
}
`,

  "employee/resume/page.tsx": `import { EnrollmentStepper, ModuleTag } from "@/components/features";
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
`,

  "employee/waive-reason/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, Field, PageHeader, Select, Textarea } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Waive reason" };

export default function Page() {
  return (
    <EmployeeShell step={4}>
      <PageHeader
        eyebrow="Module D · H · ACA"
        title="Waive reason"
        description="Required when you waive a benefit — kept for ACA reporting."
      />
      <ModuleTag code="D" name="Waive" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Benefit"><Select defaultValue="vision"><option value="vision">Vision</option><option value="medical">Medical</option><option value="dental">Dental</option></Select></Field>
        <Field label="Reason"><Select defaultValue="elsewhere"><option value="elsewhere">Covered elsewhere</option><option value="cost">Cost</option><option value="none">Do not want coverage</option><option value="other">Other</option></Select></Field>
        <Field label="Details (optional)"><Textarea placeholder="Other coverage carrier…" /></Field>
        <ActionButton success="Waive reason saved">Save waive reason</ActionButton>
        <Button href="/employee/elect" variant="secondary" className="w-full">Back to elections</Button>
      </Card>
    </EmployeeShell>
  );
}
`,

  // Client enroll flow + extras
  "client/enroll/details/page.tsx": `import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Enrollment details" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 1" title="Confirm your details" description="Passwordless session from your secure link." />
      <ModuleTag code="D" name="Individual enroll" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Legal name"><Input defaultValue="James Ortega" /></Field>
        <Field label="Mobile"><Input defaultValue="(904) 555-0177" /></Field>
        <Field label="Email"><Input type="email" defaultValue="james.ortega@email.com" /></Field>
        <Button href="/client/enroll/household" variant="accent" className="w-full">Continue</Button>
      </Card>
    </div>
  );
}
`,

  "client/enroll/household/page.tsx": `import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Household" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 2" title="Household" description="Who should be on this application." />
      <ModuleTag code="D" name="Household" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Spouse / partner (optional)"><Input placeholder="Full name" /></Field>
        <Field label="Dependent (optional)"><Input placeholder="Full name" /></Field>
        <Button href="/client/enroll/plans" variant="accent" className="w-full">Continue to plans</Button>
      </Card>
    </div>
  );
}
`,

  "client/enroll/plans/page.tsx": `import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Compare plans" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 3" title="Compare plans" description="Medicare Supplement and related options." />
      <ModuleTag code="D" name="Plans" />
      <div className="mt-4 space-y-3">
        {["Plan G · Florida Blue", "Plan N · Florida Blue"].map((p, i) => (
          <Card key={p} className="p-4">
            <StatusChip tone={i === 0 ? "active" : "neutral"}>{i === 0 ? "Selected" : "Option"}</StatusChip>
            <p className="mt-2 font-display text-xl text-ink">{p}</p>
            <p className="text-sm text-muted">Monthly premium shown after quote confirmation.</p>
          </Card>
        ))}
        <Button href="/client/enroll/review" variant="accent" className="w-full">Continue</Button>
      </div>
    </div>
  );
}
`,

  "client/enroll/review/page.tsx": `import { Button, Card, PageHeader } from "@/components/ui";
import { ModuleTag } from "@/components/features";

export const metadata = { title: "Review" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Individual intake · Step 4" title="Review" description="Confirm before you sign." />
      <ModuleTag code="D" name="Review" />
      <Card className="mt-4 divide-y divide-hairline">
        {[["Coverage", "Florida Blue Medicare Supplement Plan G"], ["Applicant", "James Ortega"], ["Effective", "Jun 1, 2026"]].map(([k, v]) => (
          <div key={k} className="px-4 py-3 text-sm">
            <p className="label-mono">{k}</p>
            <p className="mt-1 font-medium text-ink">{v}</p>
          </div>
        ))}
      </Card>
      <Button href="/client/sign" variant="accent" className="mt-4 w-full">Continue to sign</Button>
    </div>
  );
}
`,

  "client/sign/page.tsx": `import { ModuleTag, SignatureAudit } from "@/components/features";
import { SignaturePad } from "@/components/interactive";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Sign" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module E" title="Sign your application" description="Electronic-records consent first, then sign." />
      <ModuleTag code="E" name="E-sign" />
      <div className="mt-4">
        <SignaturePad
          continueHref="/client/confirmation"
          defaultName="James Ortega"
          continueLabel="View confirmation"
          successBody="Application signed · confirmation PDF on your record."
        />
      </div>
      <div className="mt-4"><SignatureAudit /></div>
    </div>
  );
}
`,

  "client/confirmation/page.tsx": `import { ModuleTag, SignatureAudit } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Confirmation" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Modules D · E" title="You're covered" description="Confirmation PDF is on your record. Your account manager can produce the audit trail anytime." />
      <ModuleTag code="E" name="Complete" />
      <Card className="mt-4 p-6 text-center">
        <StatusChip tone="success">Complete</StatusChip>
        <p className="mt-4 font-display text-2xl text-ink">Plan G on file</p>
        <Button href="/client/documents" variant="secondary" className="mt-4 w-full">View documents</Button>
        <Button href="/client" variant="primary" className="mt-2 w-full">Back to coverage</Button>
      </Card>
      <div className="mt-4"><SignatureAudit /></div>
    </div>
  );
}
`,

  "client/id-cards/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "ID cards" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module A" title="ID cards" description="Request a replacement card or view the last request status." />
      <ModuleTag code="A" name="ID cards" />
      <Card className="mt-4 space-y-3 p-4">
        <StatusChip tone="active">Plan G · MS-441902</StatusChip>
        <p className="text-sm text-muted">Last request · none on file</p>
        <ActionButton success="ID card request submitted">Request replacement ID card</ActionButton>
        <Button href="/client/service" variant="ghost" className="w-full">Other service request</Button>
      </Card>
    </div>
  );
}
`,

  "client/claims/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Claim help" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Service"
        title="Claim help status"
        description="Open claim questions routed to your account manager."
        actions={<Button href="/client/service" variant="accent">New request</Button>}
      />
      <ModuleTag code="A" name="Claims" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <StatusChip tone="warning">In progress</StatusChip>
          <p className="mt-2 font-medium text-ink">Claim · dental EOB question</p>
          <p className="mt-1 text-sm text-muted">Assigned to Sam Ortiz · due in 2 days</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Resolved</StatusChip>
          <p className="mt-2 font-medium text-ink">Claim · provider billed wrong plan</p>
          <p className="mt-1 text-sm text-muted">Closed Feb 12, 2027</p>
        </Card>
      </div>
    </div>
  );
}
`,

  "client/medicare/page.tsx": `import { FeatureCallout, ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Medicare options" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module H · Automation 11" title="Medicare options" description="You're flagged as turning 65 within 6 months — talk through options with Blackford." />
      <ModuleTag code="H" name="Turning 65" />
      <div className="mt-4">
        <FeatureCallout module="H" title="Nightly data quality flag" tone="warning">
          Clients turning 65 within 6 months appear on your account manager's queue.
        </FeatureCallout>
      </div>
      <Card className="mt-4 space-y-3 p-4">
        <StatusChip tone="auto">Age-in window</StatusChip>
        <p className="text-sm text-ink">Current coverage: Medicare Supplement Plan G. Ask about Part D, Advantage vs Supplement, and Medigap rules.</p>
        <Button href="/client/messages" variant="accent" className="w-full">Message my agent</Button>
        <Button href="/client/enroll/details" variant="secondary" className="w-full">Start individual intake</Button>
      </Card>
    </div>
  );
}
`,

  "client/verification-status/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Verification status" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module F"
        title="Proof verification status"
        description="See whether staff has approved your uploaded documents."
        actions={<Button href="/client/life-event" variant="secondary">Submit another</Button>}
      />
      <ModuleTag code="F" name="Verification" />
      <div className="mt-4 space-y-3">
        <Card className="p-4">
          <StatusChip tone="warning">Ready for review</StatusChip>
          <p className="mt-2 font-medium text-ink">Address proof · utility bill</p>
          <p className="mt-1 text-sm text-muted">Uploaded Mar 2 · waiting on manual verification</p>
        </Card>
        <Card className="p-4">
          <StatusChip tone="success">Approved</StatusChip>
          <p className="mt-2 font-medium text-ink">Photo ID</p>
          <p className="mt-1 text-sm text-muted">Verified Mar 2 · used for ID card request</p>
        </Card>
      </div>
    </div>
  );
}
`,

  // Update client enroll hub
  "client/enroll/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Enrollment" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module D"
        title="Enrollment"
        description="Individual / Medicare intake when a window is open for you."
      />
      <div className="mb-4">
        <ModuleTag code="D" name="Individual intake" />
      </div>
      <Card className="animate-rise p-5">
        <StatusChip tone="active">Demo window open</StatusChip>
        <p className="mt-3 text-sm text-muted">
          Start the guided individual enrollment — details, household, plans, review, and sign.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/client/enroll/details" variant="accent">
            Start enrollment
          </Button>
          <Button href="/client/messages" variant="secondary">
            Check messages
          </Button>
          <Button href="/employee/sign-in" variant="ghost">
            I'm a group employee
          </Button>
        </div>
      </Card>
    </div>
  );
}
`,
};

for (const [rel, body] of Object.entries(pages)) {
  write(rel, body);
}
console.log("batch 2 done", Object.keys(pages).length);
