import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src", "app");

function write(rel, content) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart());
  console.log("wrote", rel);
}

// —— Admin ——
write(
  "admin/layout.tsx",
  `
import { Suspense } from "react";
import { AdminShell } from "@/components/shells";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
`,
);

write(
  "admin/page.tsx",
  `
import Link from "next/link";
import { Button, Card, PageHeader, Stat, StatusChip } from "@/components/ui";

export const metadata = { title: "Blackford admin" };

export default function AdminHomePage() {
  return (
    <div>
      <PageHeader
        title="Platform overview"
        description="Cross-book health for the Blackford admin — weekly reviews, access, and carrier approvals."
        actions={<Button href="/admin/users" variant="accent">Review user access</Button>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><Stat label="Active groups" value="48" note="All account managers" /></Card>
        <Card className="p-5"><Stat label="Files awaiting approval" value="3" note="Carrier gateway" /></Card>
        <Card className="p-5"><Stat label="Overdue tasks" value="11" note="Escalated to admin" /></Card>
        <Card className="p-5"><Stat label="Staff with MFA" value="100%" note="Required for staff" /></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-xl">This week’s review</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["Enrollment status", "/admin/reports"],
              ["Carrier file log", "/admin/carriers"],
              ["Overdue tasks", "/admin/reports"],
              ["Data quality flags", "/admin/reports"],
            ].map(([label, href]) => (
              <li key={label} className="flex items-center justify-between border-b border-hairline pb-2">
                <span>{label}</span>
                <Link href={href} className="text-sm">Open</Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-gold bg-parchment p-5">
          <p className="label-mono !text-gold-deep">Quarterly</p>
          <h3 className="mt-2">User access review due</h3>
          <p className="mt-2 text-sm text-ink/80">
            Remove people who have left. Confirm roles: Blackford admin, account manager, employer HR, employee, client.
          </p>
          <Button href="/admin/users" variant="primary" className="mt-4">Open users & roles</Button>
        </Card>
      </div>
    </div>
  );
}
`,
);

write(
  "admin/sign-in/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Admin sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Blackford admin" description="MFA required. Full platform access." />
      <Card className="space-y-4 p-6">
        <Field label="Work email"><Input type="email" placeholder="admin@blackford.com" /></Field>
        <Field label="Password"><Input type="password" /></Field>
        <Field label="Authenticator code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/admin" variant="accent" className="w-full">Sign in</Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/users/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
export const metadata = { title: "Users & roles" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Users & roles" description="Assign Blackford admin, account manager, employer HR, employee, or client access." actions={<Button variant="accent">Invite staff</Button>} />
      <Card>
        <Table
          headers={["Name", "Role", "Scope", "MFA", "Status"]}
          rows={[
            ["Alex Rivera", <StatusChip key="a" tone="active">Blackford admin</StatusChip>, "All groups", "On", "Active"],
            ["Maya Chen", <StatusChip key="b" tone="neutral">Account manager</StatusChip>, "Assigned book", "On", "Active"],
            ["Sam Ortiz", <StatusChip key="c" tone="neutral">Account manager</StatusChip>, "Assigned book", "On", "Active"],
            ["Jordan Miles", <StatusChip key="d" tone="auto">Employer HR</StatusChip>, "Rivers & Reed LLP", "OTP", "Active"],
            ["Former contractor", <StatusChip key="e" tone="danger">Account manager</StatusChip>, "—", "Off", "Remove"],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/groups/page.tsx",
  `
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";
export const metadata = { title: "All groups" };
export default function Page() {
  return (
    <div>
      <PageHeader title="All groups" description="Admin sees every group — not limited to one account manager’s book." />
      <Card>
        <Table
          headers={["Group", "Owner", "Pipeline", "Enrollment"]}
          rows={clients.filter((c) => c.type === "Group").map((g) => [
            g.name,
            g.owner,
            <StatusChip key={g.id}>{g.pipeline}</StatusChip>,
            <span key={\`\${g.id}-e\`} className="font-mono text-xs">{g.enrolled}/{g.employees}</span>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/carriers/page.tsx",
  `
import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";
export const metadata = { title: "Carrier approvals" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Carrier approvals" description="Blackford approver role — validate, approve, deliver by SFTP." />
      <Card>
        <Table
          headers={["Carrier", "Group", "Status", ""]}
          rows={carrierFiles.map((f) => [
            f.carrier,
            f.group,
            <StatusChip key={f.id} tone={f.status.includes("Pending") ? "warning" : "success"}>{f.status}</StatusChip>,
            <Link key={\`\${f.id}-l\`} href={\`/admin/carriers/\${f.id}\`} className="text-sm">Review</Link>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/carriers/[fileId]/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";
export default async function Page({ params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  const file = carrierFiles.find((f) => f.id === fileId) ?? carrierFiles[0];
  return (
    <div>
      <PageHeader title={\`Approve · \${file.carrier}\`} description={\`\${file.group} · Admin approver\`} actions={<><Button variant="secondary">Hold errors</Button><Button variant="accent">Approve & deliver</Button></>} />
      <StatusChip tone="warning">{file.status}</StatusChip>
      <Card className="mt-4">
        <Table headers={["Employee", "Action", "Result"]} rows={[
          ["Aisha Patel", "Change", <StatusChip key="1" tone="success">OK</StatusChip>],
          ["Omar Patel", "Add", <StatusChip key="2" tone="danger">Missing SSN</StatusChip>],
        ]} />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/reports/page.tsx",
  `
import { Card, PageHeader, Stat } from "@/components/ui";
export const metadata = { title: "Weekly reports" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Weekly reports" description="Enrollment, carrier submission, overdue tasks, and data quality (SOW H)." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><Stat label="Finish before close" value="94%" /></Card>
        <Card className="p-5"><Stat label="Carrier rejects" value="1.4%" /></Card>
        <Card className="p-5"><Stat label="Overdue tasks" value="11" /></Card>
        <Card className="p-5"><Stat label="Data flags" value="27" note="Age-26 / turning-65" /></Card>
      </div>
    </div>
  );
}
`,
);

write(
  "admin/audit/page.tsx",
  `
import { Card, Input, PageHeader, Table } from "@/components/ui";
import { auditEntries } from "@/lib/mock-data";
export const metadata = { title: "Audit log" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Audit log" description="Immutable — export evidence for an audit on request." />
      <Card className="mb-4 p-4"><Input placeholder="Filter who, what, when…" aria-label="Filter" /></Card>
      <Card>
        <Table headers={["When", "Who", "Action", "What"]} rows={auditEntries.map((a) => [
          <span key={a.id} className="font-mono text-xs">{a.when}</span>, a.who, a.action, a.what,
        ])} />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/automations/page.tsx",
  `
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
export const metadata = { title: "Automations" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Automations" description="Seventeen launch automations — each logged and pauseable per group." />
      <Card>
        <Table
          headers={["#", "Trigger", "Audience", "Status"]}
          rows={[
            ["1", "Window opens → invite", "Employee", <StatusChip key="1" tone="success">Running</StatusChip>],
            ["2", "7 / 3 / 1 day reminders", "Employee", <StatusChip key="2" tone="success">Running</StatusChip>],
            ["4", "Below 70% → notify HR", "HR + AM", <StatusChip key="4" tone="success">Running</StatusChip>],
            ["15", "Build carrier draft", "Approver", <StatusChip key="15" tone="auto">Paused · Palm Coast</StatusChip>],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/settings/page.tsx",
  `
import { Button, Card, Field, PageHeader, Select } from "@/components/ui";
export const metadata = { title: "Security settings" };
export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Security settings" description="MFA for staff, session timeouts, HIPAA hosting under a BAA." />
      <Card className="space-y-4 p-6">
        <Field label="Staff MFA policy">
          <Select defaultValue="required"><option value="required">Required for all staff</option></Select>
        </Field>
        <Field label="Idle sign-out">
          <Select defaultValue="30"><option value="15">15 minutes</option><option value="30">30 minutes</option></Select>
        </Field>
        <Field label="Quiet hours default">
          <Select defaultValue="8-20"><option value="8-20">8 a.m. – 8 p.m. recipient TZ</option></Select>
        </Field>
        <Button variant="accent">Save settings</Button>
      </Card>
    </div>
  );
}
`,
);

// —— Manager: copy staff pages with path rewrite ——
function rewriteStaffToManager(content) {
  return content
    .replaceAll("/staff/", "/manager/")
    .replaceAll('"/staff"', '"/manager"')
    .replaceAll("'/staff'", "'/manager'")
    .replaceAll("`/staff", "`/manager");
}

const staffDir = path.join(root, "staff");
function walk(dir, base = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, ent.name);
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, rel);
    else if (ent.name === "page.tsx") {
      const src = fs.readFileSync(full, "utf8");
      write(path.join("manager", rel).replace(/\\\\/g, "/"), rewriteStaffToManager(src));
    }
  }
}
walk(staffDir);

write(
  "manager/layout.tsx",
  `
import { Suspense } from "react";
import { ManagerShell } from "@/components/shells";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <ManagerShell>{children}</ManagerShell>
    </Suspense>
  );
}
`,
);

// Fix manager home metadata/title tone
write(
  "manager/page.tsx",
  `
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Card, PageHeader, Stat, StatusChip, Table } from "@/components/ui";
import { clients, tasks } from "@/lib/mock-data";

export const metadata = { title: "Account manager" };

export default function ManagerHomePage() {
  return (
    <div>
      <PageHeader
        title="My work today"
        description="Your assigned book — queues and exceptions the automations escalate to the account manager."
        actions={
          <>
            <Button href="/manager/compose" variant="secondary">Message a group</Button>
            <Button href="/manager/clients" variant="accent">Find a client</Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><Stat label="Due today" value="7" note="On your queue" /></Card>
        <Card className="p-5"><Stat label="Unread inbox" value="2" /></Card>
        <Card className="p-5"><Stat label="Groups enrolling" value="3" /></Card>
        <Card className="p-5"><Stat label="Drafts ready" value="1" note="Send to admin approver" /></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <h2 className="font-display text-xl">Priority queue</h2>
            <Link href="/manager/tasks" className="text-sm">All tasks</Link>
          </div>
          <Table
            headers={["Task", "Client", "Due", ""]}
            rows={tasks.map((t) => [
              <div key={t.id}><p className="font-medium">{t.title}</p><StatusChip tone={t.priority === "high" ? "danger" : "warning"}>{t.type}</StatusChip></div>,
              t.client,
              <span key={\`\${t.id}-d\`} className="font-mono text-xs">{t.due}</span>,
              <Link key={\`\${t.id}-a\`} href={t.type === "Carrier" ? "/manager/carriers/cf-88" : "/manager/changes"} className="inline-flex items-center gap-1 text-sm no-underline">Open <ArrowRight className="h-3.5 w-3.5" /></Link>,
            ])}
          />
        </Card>
        <div className="space-y-4">
          <Card className="border-gold bg-parchment p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-gold-deep" aria-hidden />
              <div>
                <p className="label-mono !text-gold-deep">Your book</p>
                <h3 className="mt-1">Harbor Light below 70%</h3>
                <p className="mt-2 text-sm">44 outstanding · OE closes in 3 days.</p>
                <Button href="/manager/groups/cl-1042" variant="primary" className="mt-4">View group</Button>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3">Assigned clients</h3>
            <ul className="space-y-3">
              {clients.filter((c) => c.owner === "Maya Chen").map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link href={\`/manager/clients/\${c.id}\`} className="font-medium no-underline">{c.name}</Link>
                  {c.enrolled > 0 ? <CheckCircle2 className="h-4 w-4 text-gold-deep" /> : <StatusChip tone="warning">Needs work</StatusChip>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
`,
);

write(
  "manager/sign-in/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Account manager sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Account manager" description="MFA required. Access limited to your assigned groups." />
      <Card className="space-y-4 p-6">
        <Field label="Work email"><Input type="email" placeholder="you@blackford.com" /></Field>
        <Field label="Password"><Input type="password" /></Field>
        <Field label="Authenticator code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/manager" variant="accent" className="w-full">Sign in</Button>
      </Card>
    </div>
  );
}
`,
);

// —— Client portal ——
write(
  "client/layout.tsx",
  `
import { Suspense } from "react";
import { ClientShell } from "@/components/shells";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <ClientShell>{children}</ClientShell>
    </Suspense>
  );
}
`,
);

write(
  "client/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "My coverage" };
export default function Page() {
  return (
    <div>
      <PageHeader title="My coverage" description="James Ortega · Individual client · Jacksonville area" />
      <Card className="mb-4 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusChip tone="active">Active</StatusChip>
          <StatusChip tone="auto">Medicare · Supplement</StatusChip>
        </div>
        <h2 className="mt-4 font-display text-2xl">Florida Blue Medicare Supplement Plan G</h2>
        <p className="mt-2 text-sm text-ink/70">Effective Jun 1, 2026 · Policy MS-441902</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button href="/client/documents" variant="secondary">View documents</Button>
          <Button href="/client/service" variant="accent">Request ID card</Button>
        </div>
      </Card>
      <Card className="border-gold bg-parchment p-5">
        <p className="label-mono !text-gold-deep">Turning 65 check</p>
        <p className="mt-2 text-sm">Nightly data quality already tracks clients turning 65 within 6 months — ask your account manager about Medicare options.</p>
      </Card>
    </div>
  );
}
`,
);

write(
  "client/sign-in/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Client sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Client portal" description="One-time code to your phone or email — your own record only." />
      <Card className="space-y-4 p-6">
        <Field label="Mobile or email"><Input placeholder="(904) 555-0199" /></Field>
        <Field label="One-time code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/client" variant="accent" className="w-full">Continue</Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "client/household/page.tsx",
  `
import { Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "Household" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Household" description="Individual and Medicare household view (SOW module A)." />
      <div className="space-y-3">
        {[
          ["James Ortega", "Primary · DOB 04/18/1959"],
          ["Elena Ortega", "Spouse · covered on separate policy"],
        ].map(([name, meta]) => (
          <Card key={name} className="flex items-center justify-between p-4">
            <div><p className="font-medium">{name}</p><p className="text-sm text-warm-gray">{meta}</p></div>
            <StatusChip tone="success">On file</StatusChip>
          </Card>
        ))}
      </div>
    </div>
  );
}
`,
);

write(
  "client/plans/page.tsx",
  `
import { Card, PageHeader, Table } from "@/components/ui";
export const metadata = { title: "Plans & IDs" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Plans & ID cards" description="Carriers, policy numbers, and effective dates on your record." />
      <Card>
        <Table headers={["Plan", "Carrier", "Policy #", "Effective"]} rows={[
          ["Medicare Supplement G", "Florida Blue", "MS-441902", "2026-06-01"],
          ["Part D Rx", "Wellcare", "PD-22910", "2026-06-01"],
        ]} />
      </Card>
    </div>
  );
}
`,
);

write(
  "client/messages/page.tsx",
  `
import { Card, PageHeader } from "@/components/ui";
export const metadata = { title: "Messages" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Messages" description="Texts and emails with Blackford — no health details in SMS." />
      <Card className="divide-y divide-hairline">
        {[
          ["Blackford", "Your annual review is coming up — reply YES to schedule.", "Mon"],
          ["You", "YES — mornings work best.", "Mon"],
        ].map(([from, body, when]) => (
          <div key={body} className="px-4 py-3 text-sm">
            <div className="flex justify-between"><span className="font-medium">{from}</span><span className="font-mono text-xs text-warm-gray">{when}</span></div>
            <p className="mt-1 text-ink/75">{body}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
`,
);

write(
  "client/documents/page.tsx",
  `
import { Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "Documents" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Documents" description="Signed applications and confirmation PDFs on your record." />
      <Card className="divide-y divide-hairline">
        {[
          ["Election confirmation.pdf", "Signed · Jun 1, 2026"],
          ["Medicare application.pdf", "Signed · May 20, 2026"],
        ].map(([name, meta]) => (
          <div key={name} className="flex items-center justify-between px-4 py-3">
            <div><p className="font-medium text-sm">{name}</p><p className="text-xs text-warm-gray">{meta}</p></div>
            <StatusChip tone="success">On file</StatusChip>
          </div>
        ))}
      </Card>
    </div>
  );
}
`,
);

write(
  "client/enroll/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
export const metadata = { title: "Enrollment" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Enrollment" description="When a window is open for your individual intake, start here." />
      <Card className="p-5">
        <StatusChip tone="neutral">No open window</StatusChip>
        <p className="mt-3 text-sm text-ink/75">Your account manager will send a secure link when it’s time to enroll or renew. Group employees use the Employee portal instead.</p>
        <Button href="/employee/sign-in" variant="secondary" className="mt-4">I’m a group employee</Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "client/life-event/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
export const metadata = { title: "Life event" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Report a life event" description="Address or coverage changes — staff approve before the carrier file." />
      <Card className="space-y-4 p-5">
        <Field label="Event type">
          <Select defaultValue="address"><option value="address">Address change</option><option value="lost">Lost coverage</option></Select>
        </Field>
        <Field label="Event date"><Input type="date" /></Field>
        <Field label="Upload proof"><Input type="file" /></Field>
        <Button variant="accent" className="w-full">Submit for review</Button>
      </Card>
    </div>
  );
}
`,
);

write(
  "client/service/page.tsx",
  `
import { Button, Card, Field, PageHeader, Select, Textarea } from "@/components/ui";
export const metadata = { title: "Service request" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Service request" description="ID card, claim help, or a change — routed to your account manager." />
      <Card className="space-y-4 p-5">
        <Field label="Request type">
          <Select defaultValue="id"><option value="id">ID card</option><option value="claim">Claim help</option><option value="change">Policy change</option></Select>
        </Field>
        <Field label="Details"><Textarea placeholder="Tell us what you need…" /></Field>
        <Button variant="accent" className="w-full">Submit request</Button>
      </Card>
    </div>
  );
}
`,
);

// Redirect shim for old /staff
write(
  "staff/page.tsx",
  `
import { redirect } from "next/navigation";
export default function StaffRedirect() {
  redirect("/manager");
}
`,
);

console.log("role pages done");
