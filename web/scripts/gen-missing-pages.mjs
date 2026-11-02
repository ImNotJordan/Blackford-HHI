/**
 * Generate remaining SOW MVP gap pages for all five roles.
 * Run: node scripts/gen-missing-pages.mjs
 */
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
  // —— Admin ——
  "admin/mfa-setup/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "MFA setup" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module H · Security"
        title="Staff MFA setup"
        description="Enroll or reset multi-factor authentication. MFA is required for all Blackford staff."
      />
      <ModuleTag code="H" name="MFA" />
      <Card className="mt-4 space-y-4 p-4 sm:p-5">
        <StatusChip tone="warning">Enrollment required</StatusChip>
        <Field label="Staff email">
          <Input type="email" defaultValue="maya.chen@blackford.com" />
        </Field>
        <Field label="Authenticator app code" hint="Scan QR in your authenticator, then enter the 6-digit code.">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-[0.3em]" />
        </Field>
        <div className="flex aspect-video items-center justify-center rounded-[10px] border border-dashed border-hairline bg-ivory text-sm text-muted">
          Mock QR · Blackford MFA enrollment
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="secondary" success="Recovery codes downloaded">
            Download recovery codes
          </ActionButton>
          <ActionButton success="MFA enrolled">Complete MFA setup</ActionButton>
        </div>
      </Card>
    </div>
  );
}
`,

  "admin/access-review/page.tsx": `import { ModuleTag } from "@/components/features";
import { ApproveRejectRow } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Access review" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H · Quarterly"
        title="User access review"
        description="Confirm roles and remove people who have left. Required for platform oversight."
        actions={<Button href="/admin/users" variant="secondary">Users & roles</Button>}
      />
      <ModuleTag code="H" name="Access review" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Name", "Role", "Last sign-in", "Recommendation", ""]}
          rows={[
            ["Alex Rivera", "Blackford admin", "Today", <StatusChip key="a" tone="success">Keep</StatusChip>, <ApproveRejectRow key="a2" label="Alex" />],
            ["Maya Chen", "Account manager", "Today", <StatusChip key="b" tone="success">Keep</StatusChip>, <ApproveRejectRow key="b2" label="Maya" />],
            ["Former contractor", "Account manager", "90+ days", <StatusChip key="c" tone="danger">Remove</StatusChip>, <ApproveRejectRow key="c2" label="Former" />],
            ["Jordan Miles", "Employer HR", "Yesterday", <StatusChip key="d" tone="auto">Confirm scope</StatusChip>, <ApproveRejectRow key="d2" label="Jordan" />],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "admin/export-log/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Export log" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module G · Carrier"
        title="Export & confirmation log"
        description="Every carrier file delivery, resend, and confirmation — never plain email."
      />
      <ModuleTag code="G" name="Export log" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["File", "Carrier", "Delivered", "Confirm", ""]}
          rows={[
            ["cf-88", "Florida Blue", "Pending approve", <StatusChip key="1" tone="warning">Awaiting</StatusChip>, "—"],
            ["cf-87", "Guardian", "Feb 24 · SFTP", <StatusChip key="2" tone="success">Confirmed</StatusChip>, <ActionButton key="2a" variant="secondary" success="Resent">Resend</ActionButton>],
            ["cf-80", "MetLife", "Feb 10 · encrypted DL", <StatusChip key="3" tone="danger">No confirm</StatusChip>, <ActionButton key="3a" success="Follow-up tasked">Follow up</ActionButton>],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "admin/groups/[id]/page.tsx": `import { Suspense } from "react";
import { ModuleTag, PipelineBar } from "@/components/features";
import { RouteFallback } from "@/components/route-fallback";
import { Button, Card, PageHeader, Stat, StatusChip } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = clients.find((c) => c.id === id) ?? clients[0];
  return (
    <div>
      <PageHeader
        eyebrow="Admin · All groups"
        title={g.name}
        description={\`\${g.type} · Owner \${g.owner} · \${g.city}\`}
        actions={
          <>
            <Button href="/admin/users" variant="secondary">Access</Button>
            <Button href={\`/manager/groups/\${g.id}\`} variant="accent">Open as manager</Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="H" name="Oversight" />
        <StatusChip tone="active">{g.pipeline}</StatusChip>
      </div>
      <PipelineBar active={g.pipeline} />
      <div className="stagger mt-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><Stat label="Employees" value={String(g.employees)} /></Card>
        <Card className="p-4"><Stat label="Enrolled" value={String(g.enrolled)} /></Card>
        <Card className="p-4"><Stat label="Effective" value={g.effective.slice(0, 7)} /></Card>
      </div>
    </div>
  );
}
`,

  // —— Manager ——
  "manager/notes/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, Textarea } from "@/components/ui";

export const metadata = { title: "Notes" };

const notes = [
  { who: "Maya Chen", when: "Mar 3 · 9:12 AM", body: "Harbor Light HR asked to push OE reminder Friday." },
  { who: "Sam Ortiz", when: "Mar 2 · 4:40 PM", body: "James Ortega interested in Medicare Supplement review." },
  { who: "Maya Chen", when: "Mar 1 · 11:02 AM", body: "Rivers census errors — waiting on hire dates." },
];

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A" title="Notes" description="Staff notes on the book — visible on client timelines." />
      <ModuleTag code="A" name="Notes" />
      <Card className="mt-4 space-y-3 p-4">
        <Textarea placeholder="Add a note…" defaultValue="" />
        <ActionButton success="Note saved on record">Save note</ActionButton>
      </Card>
      <ul className="mt-4 space-y-3">
        {notes.map((n) => (
          <Card key={n.when} className="p-4">
            <p className="text-xs text-muted">{n.who} · {n.when}</p>
            <p className="mt-1 text-sm text-ink">{n.body}</p>
          </Card>
        ))}
      </ul>
    </div>
  );
}
`,

  "manager/team-queue/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Team queue" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Team"
        title="Team queue"
        description="Shared work across account managers — claim or reassign tasks."
        actions={<Button href="/manager" variant="secondary">My work today</Button>}
      />
      <ModuleTag code="A" name="Team queues" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Task", "Client", "Owner", "Due", ""]}
          rows={[
            ["Life event proof", "Harbor Light", "Unassigned", "Today", <Button key="1" href="/manager/verifications/vr-101" variant="accent" className="!min-h-9 !text-sm">Claim</Button>],
            ["Carrier confirm overdue", "Palm Coast", "Sam Ortiz", "Overdue", <StatusChip key="2" tone="danger">Escalated</StatusChip>],
            ["Census follow-up", "Rivers & Reed", "Maya Chen", "Today", <Button key="3" href="/manager/onboarding/cl-1088" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
            ["Undeliverable text", "Palm Coast", "Unassigned", "Today", <Button key="4" href="/manager/delivery" variant="secondary" className="!min-h-9 !text-sm">Claim</Button>],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "manager/templates/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton, WorkingLanguageToggle } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui";

export const metadata = { title: "Templates" };

export default function Page() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Module B"
        title="Message templates"
        description="Merge-field templates in English and Spanish for invites, reminders, and confirmations."
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ModuleTag code="B" name="Templates" />
        <WorkingLanguageToggle />
      </div>
      <Card className="space-y-4 p-4 sm:p-5">
        <Field label="Template">
          <Select defaultValue="invite">
            <option value="invite">Enrollment invite</option>
            <option value="reminder">Window closing</option>
            <option value="confirm">Confirmation</option>
            <option value="qle">Life event received</option>
          </Select>
        </Field>
        <Field label="Name">
          <Input defaultValue="Enrollment invite" />
        </Field>
        <Field label="Subject (email)">
          <Input defaultValue="Your benefits enrollment is open" />
        </Field>
        <Field label="Body" hint="Merge fields: {{first_name}} {{group_name}} {{secure_link}}">
          <Textarea defaultValue="Hi {{first_name}}, your enrollment window for {{group_name}} is open. Use this secure link: {{secure_link}}" />
        </Field>
        <ActionButton success="Template saved">Save template</ActionButton>
      </Card>
    </div>
  );
}
`,

  "manager/contacts/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Contacts & roster" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Linked records"
        title="Contacts & roster"
        description="Employees, dependents, and HR contacts linked to groups and individuals."
      />
      <ModuleTag code="A" name="Contacts" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Name", "Type", "Group / household", "Status", ""]}
          rows={[
            ["Aisha Patel", "Employee", "Harbor Light", <StatusChip key="1" tone="success">Enrolled</StatusChip>, <Button key="1a" href="/manager/clients/cl-1042" variant="secondary" className="!min-h-9 !text-sm">Record</Button>],
            ["Omar Patel", "Dependent", "Harbor Light · Aisha", <StatusChip key="2" tone="warning">Proof review</StatusChip>, <Button key="2a" href="/manager/verifications/vr-101" variant="secondary" className="!min-h-9 !text-sm">Verify</Button>],
            ["Jordan Miles", "HR contact", "Rivers & Reed", <StatusChip key="3" tone="auto">Active</StatusChip>, <Button key="3a" href="/manager/compose" variant="secondary" className="!min-h-9 !text-sm">Message</Button>],
            ["James Ortega", "Individual", "Household primary", <StatusChip key="4" tone="active">Medicare</StatusChip>, <Button key="4a" href="/manager/clients/cl-2210" variant="secondary" className="!min-h-9 !text-sm">Record</Button>],
            ["Elena Ortega", "Dependent", "James Ortega", <StatusChip key="5" tone="neutral">Separate policy</StatusChip>, "—"],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "manager/paper-upload/page.tsx": `import { ModuleTag, SignatureAudit } from "@/components/features";
import { ProofUploader } from "@/components/verification";
import { ActionButton } from "@/components/interactive";
import { Card, Field, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Paper upload" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module E · Paper fallback"
        title="Upload paper document"
        description="Scan wet-ink elections or agreements. Queues for manual verification and audit trail."
      />
      <ModuleTag code="E" name="Paper fallback" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Document type">
          <Select defaultValue="election">
            <option value="election">Employee election form</option>
            <option value="carrier">Carrier application</option>
            <option value="agreement">Employer agreement</option>
          </Select>
        </Field>
        <Field label="Person / group">
          <Select defaultValue="elena">
            <option value="elena">Elena Brooks · Rivers & Reed</option>
            <option value="hr">Rivers & Reed HR · Broker agreement</option>
          </Select>
        </Field>
        <ProofUploader
          requiredTypes={["Scanned PDF or photo of signed pages"]}
        />
        <ActionButton success="Queued for verification">Submit for verification</ActionButton>
      </Card>
      <div className="mt-4">
        <SignatureAudit />
      </div>
    </div>
  );
}
`,

  "manager/prospects/new/page.tsx": `import { ModuleTag, PipelineBar } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "New prospect" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A · Pipeline" title="New prospect" description="Start a group or individual in Prospect." />
      <ModuleTag code="A" name="Prospect" />
      <div className="my-4"><PipelineBar active="Prospect" /></div>
      <Card className="space-y-4 p-4">
        <Field label="Type"><Select defaultValue="group"><option value="group">Group</option><option value="individual">Individual</option></Select></Field>
        <Field label="Name"><Input placeholder="Company or person name" /></Field>
        <Field label="City"><Input defaultValue="Jacksonville, FL" /></Field>
        <Field label="Owner"><Select defaultValue="maya"><option value="maya">Maya Chen</option><option value="sam">Sam Ortiz</option></Select></Field>
        <ActionButton success="Prospect created">Create prospect</ActionButton>
      </Card>
    </div>
  );
}
`,

  "manager/quotes/new/page.tsx": `import { ModuleTag, PipelineBar } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "New quote" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A · Pipeline" title="New quote" description="Move a prospect into quoting with carrier and effective date." />
      <ModuleTag code="A" name="Quoting" />
      <div className="my-4"><PipelineBar active="Quoting" /></div>
      <Card className="space-y-4 p-4">
        <Field label="Prospect"><Select defaultValue="p1"><option value="p1">Bay Street Cafe (new)</option><option value="p2">Harbor Light Manufacturing</option></Select></Field>
        <Field label="Primary carrier"><Input defaultValue="Florida Blue" /></Field>
        <Field label="Proposed effective"><Input type="date" defaultValue="2027-07-01" /></Field>
        <Field label="Lives"><Input defaultValue="24" inputMode="numeric" /></Field>
        <ActionButton success="Quote started · pipeline updated">Save quote</ActionButton>
      </Card>
    </div>
  );
}
`,

  "manager/export-log/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Carrier export log" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module G"
        title="Carrier export log"
        description="Deliveries for your book — resend and confirmation tracking."
        actions={<Button href="/manager/carriers" variant="secondary">Drafts</Button>}
      />
      <ModuleTag code="G" name="Export log" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["File", "Group", "Method", "Status", ""]}
          rows={[
            ["cf-88", "Harbor Light", "—", <StatusChip key="1" tone="warning">Pending approval</StatusChip>, <Button key="1a" href="/manager/carriers/cf-88" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
            ["cf-87", "Harbor Light", "SFTP", <StatusChip key="2" tone="success">Confirmed</StatusChip>, <ActionButton key="2a" variant="secondary" success="Resent">Resend</ActionButton>],
            ["cf-80", "Palm Coast", "Encrypted download", <StatusChip key="3" tone="danger">No confirm</StatusChip>, <ActionButton key="3a" success="Task created">Create follow-up</ActionButton>],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  // —— Employer ——
  "employer/contributions/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Contributions" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module C" title="Employer contributions" description="Set employer share by plan type before setup approval." />
      <ModuleTag code="C" name="Contributions" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Medical employer share"><Input defaultValue="70%" /></Field>
        <Field label="Dental employer share"><Input defaultValue="50%" /></Field>
        <Field label="Vision employer share"><Input defaultValue="0%" /></Field>
        <Field label="Contribution basis"><Select defaultValue="pct"><option value="pct">Percent of premium</option><option value="flat">Flat dollar</option></Select></Field>
        <ActionButton success="Contributions saved">Save contributions</ActionButton>
      </Card>
    </div>
  );
}
`,

  "employer/windows/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, StatusChip } from "@/components/ui";

export const metadata = { title: "Enrollment windows" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module C · D" title="OE & new-hire windows" description="Open enrollment and new-hire enrollment windows for your group." />
      <ModuleTag code="C" name="Windows" />
      <Card className="mt-4 space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="active">OE open</StatusChip>
          <StatusChip tone="auto">New-hire rolling</StatusChip>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="OE start"><Input type="date" defaultValue="2027-02-01" /></Field>
          <Field label="OE end"><Input type="date" defaultValue="2027-02-28" /></Field>
        </div>
        <Field label="New-hire window length" hint="Days after eligibility date">
          <Input defaultValue="30" inputMode="numeric" />
        </Field>
        <ActionButton success="Windows saved">Save windows</ActionButton>
      </Card>
    </div>
  );
}
`,

  "employer/invites/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Invites" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module D · Automations 1–3"
        title="Enrollment invites"
        description="Secure link invites scheduled when setup is locked and windows open."
      />
      <ModuleTag code="D" name="Invites" />
      <Card className="mt-4 mb-4 border-gold bg-parchment p-4">
        <p className="label-mono">Automation 1</p>
        <p className="mt-1 text-sm text-ink">15 not-started employees queued for invite · Mar 4 · 8:00 AM</p>
        <ActionButton className="mt-3" success="Invites scheduled">Schedule outstanding invites</ActionButton>
      </Card>
      <Card className="overflow-hidden">
        <Table
          headers={["Employee", "Channel", "Status", "Next"]}
          rows={[
            ["Sofia Nguyen", "Text + email", <StatusChip key="1" tone="auto">Queued</StatusChip>, "Mar 4"],
            ["Noah Grant", "Text", <StatusChip key="2" tone="success">Opened</StatusChip>, "Reminder · 3 days"],
            ["Elena Brooks", "Email", <StatusChip key="3" tone="success">Complete</StatusChip>, "—"],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "employer/documents/page.tsx": `import { ModuleTag } from "@/components/features";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Documents" };

export default function Page() {
  return (
    <div>
      <PageHeader eyebrow="Module C · E" title="Group documents" description="Signed agreements, census files, and setup summaries for your group." />
      <ModuleTag code="C" name="Documents" />
      <Card className="mt-4 overflow-hidden">
        <Table
          headers={["Document", "Type", "Status", ""]}
          rows={[
            ["Broker agreement", "E-sign", <StatusChip key="1" tone="warning">Awaiting signature</StatusChip>, <Button key="1a" href="/employer/agreement" variant="accent" className="!min-h-9 !text-sm">Sign</Button>],
            ["Census · Feb upload", "Census", <StatusChip key="2" tone="danger">3 errors</StatusChip>, <Button key="2a" href="/employer/census" variant="secondary" className="!min-h-9 !text-sm">Fix</Button>],
            ["Setup summary", "Setup", <StatusChip key="3" tone="warning">Needs approval</StatusChip>, <Button key="3a" href="/employer/setup" variant="secondary" className="!min-h-9 !text-sm">Open</Button>],
          ]}
        />
      </Card>
    </div>
  );
}
`,

  "employer/intake/page.tsx": `import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Individual intake" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C · Individual intake"
        title="Individual intake"
        description="Add someone outside the census file — eligibility and invite follow group rules."
      />
      <ModuleTag code="C" name="Intake" />
      <Card className="mt-4 space-y-4 p-4">
        <Field label="Legal name"><Input placeholder="Full legal name" /></Field>
        <Field label="Relationship to group"><Select defaultValue="employee"><option value="employee">Employee</option><option value="owner">Owner</option><option value="cobra">COBRA</option></Select></Field>
        <Field label="Email"><Input type="email" /></Field>
        <Field label="Mobile"><Input /></Field>
        <ActionButton success="Intake saved · invite eligible">Save intake</ActionButton>
      </Card>
    </div>
  );
}
`,
};

for (const [rel, body] of Object.entries(pages)) {
  write(rel, body);
}
console.log("missing pages batch 1 done", Object.keys(pages).length);
