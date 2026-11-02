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
  "staff/groups/page.tsx",
  `
import Link from "next/link";
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Groups" };

export default function GroupsPage() {
  const groups = clients.filter((c) => c.type === "Group");
  return (
    <div>
      <PageHeader
        title="Groups"
        description="Employer groups from prospect through renewal."
        actions={<Button variant="accent">New group</Button>}
      />
      <Card>
        <Table
          headers={["Group", "Pipeline", "Effective", "Enrollment", ""]}
          rows={groups.map((g) => [
            <Link key={g.id} href={\`/staff/groups/\${g.id}\`} className="font-medium no-underline">
              {g.name}
            </Link>,
            <StatusChip key={\`\${g.id}-p\`}>{g.pipeline}</StatusChip>,
            <span key={\`\${g.id}-e\`} className="font-mono text-xs">
              {g.effective}
            </span>,
            <span key={\`\${g.id}-n\`} className="font-mono text-xs">
              {g.enrolled}/{g.employees}
            </span>,
            <Link key={\`\${g.id}-l\`} href={\`/staff/groups/\${g.id}\`} className="text-sm">
              Open
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/groups/[id]/page.tsx",
  `
import { Button, Card, PageHeader, Stat, StatusChip } from "@/components/ui";
import { clients, onboardingChecklist } from "@/lib/mock-data";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = clients.find((c) => c.id === id) ?? clients[0];
  const pct = Math.round((group.enrolled / Math.max(group.employees, 1)) * 100);
  return (
    <div>
      <PageHeader
        title={group.name}
        description={\`Group · \${group.city} · Owner \${group.owner}\`}
        actions={
          <>
            <Button href="/staff/compose" variant="secondary">
              Bulk message
            </Button>
            <Button href={\`/staff/onboarding/\${group.id}\`} variant="accent">
              Onboarding
            </Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusChip tone="active">{group.pipeline}</StatusChip>
        <StatusChip tone="auto">Effective {group.effective}</StatusChip>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Stat label="Enrolled" value={\`\${pct}%\`} note={\`\${group.enrolled} of \${group.employees}\`} />
        </Card>
        <Card className="p-5">
          <Stat
            label="Outstanding"
            value={String(group.employees - group.enrolled)}
            note="Not started or in progress"
          />
        </Card>
        <Card className="p-5">
          <Stat label="Window" value="12d" note="Days until close" />
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="font-display text-xl">Onboarding snapshot</h2>
        <ul className="mt-4 space-y-2">
          {onboardingChecklist.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 border-b border-hairline py-2 text-sm last:border-0"
            >
              <span className={c.done ? "text-ink/60 line-through" : ""}>{c.label}</span>
              <StatusChip tone={c.done ? "success" : "warning"}>
                {c.done ? "Done" : c.due}
              </StatusChip>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/pipeline/page.tsx",
  `
import { Card, PageHeader } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Pipeline" };

const stages = ["Prospect", "Quoting", "Onboarding", "Enrolling", "Active", "Renewal"];

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Prospect → quoting → onboarding → enrolling → active → renewal (module A)."
      />
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const shown = clients.filter((c) => c.pipeline === stage);
          return (
            <Card key={stage} className="p-3">
              <p className="label-mono mb-3">{stage}</p>
              <div className="space-y-2">
                {(shown.length
                  ? shown
                  : [{ id: stage, name: "Empty lane", city: "No records" }]
                ).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-[10px] border border-hairline bg-ivory p-3 text-sm"
                  >
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-warm-gray">{"city" in c ? c.city : ""}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
`,
);

write(
  "staff/inbox/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { inbox } from "@/lib/mock-data";

export const metadata = { title: "Inbox" };

export default function InboxPage() {
  return (
    <div>
      <PageHeader
        title="Shared inbox"
        description="Replies land here and on the client timeline. STOP and HELP are handled automatically."
        actions={<Button href="/staff/compose" variant="accent">Compose</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="divide-y divide-hairline">
          {inbox.map((m) => (
            <button
              key={m.id}
              type="button"
              className="flex w-full cursor-pointer flex-col gap-1 px-4 py-4 text-left hover:bg-ivory"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{m.from}</span>
                <span className="font-mono text-xs text-warm-gray">{m.time}</span>
              </div>
              <p className="text-sm text-ink/75">{m.preview}</p>
              <div className="mt-1 flex gap-2">
                <StatusChip tone={m.unread ? "warning" : "neutral"}>{m.channel}</StatusChip>
                <StatusChip tone="neutral">{m.client}</StatusChip>
              </div>
            </button>
          ))}
        </Card>
        <Card className="flex min-h-[420px] flex-col p-5">
          <div className="border-b border-hairline pb-4">
            <h2 className="font-display text-xl">Aisha Patel</h2>
            <p className="text-sm text-warm-gray">Harbor Light · Text thread</p>
          </div>
          <div className="flex-1 space-y-3 py-4">
            <div className="max-w-[80%] rounded-[10px] bg-ivory px-3 py-2 text-sm">
              Your enrollment window is open. Secure link inside — no password needed.
            </div>
            <div className="ml-auto max-w-[80%] rounded-[10px] bg-ink px-3 py-2 text-sm text-ivory">
              Got the link — starting enrollment now
            </div>
          </div>
          <div className="flex gap-2 border-t border-hairline pt-4">
            <input
              className="min-h-11 flex-1 rounded-[10px] border border-hairline px-3 text-sm"
              placeholder="Reply from the record…"
              aria-label="Reply"
            />
            <Button variant="primary">Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
`,
);

write(
  "staff/compose/page.tsx",
  `
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui";

export const metadata = { title: "Compose" };

export default function ComposePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Compose message"
        description="Templates with merge fields, English and Spanish. Texts carry a secure link — never health details."
      />
      <Card className="space-y-4 p-6">
        <Field label="Audience">
          <Select defaultValue="group">
            <option value="group">Entire group · Harbor Light Manufacturing</option>
            <option value="filter">Filtered list · Not yet enrolled</option>
            <option value="one">Single client</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Channel">
            <Select defaultValue="both">
              <option value="both">Text + email</option>
              <option value="text">Text only</option>
              <option value="email">Email only</option>
            </Select>
          </Field>
          <Field label="Template">
            <Select defaultValue="invite">
              <option value="invite">Enrollment invite</option>
              <option value="reminder">Window closing reminder</option>
              <option value="confirm">Confirmation</option>
            </Select>
          </Field>
        </div>
        <Field label="Language">
          <Select defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </Select>
        </Field>
        <Field label="Subject (email)">
          <Input defaultValue="Your benefits enrollment is open" />
        </Field>
        <Field
          label="Message"
          hint="Quiet hours: 8 a.m.–8 p.m. recipient time zone. Consent checked before send."
        >
          <Textarea defaultValue="Hi {{first_name}}, your enrollment window for {{group_name}} is open. Use this secure link to enroll — it works on your phone." />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Save draft</Button>
          <Button variant="accent">Send with consent check</Button>
        </div>
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/tasks/page.tsx",
  `
import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { tasks } from "@/lib/mock-data";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks & service requests"
        description="Team queues, due dates by request type, and escalations when overdue."
      />
      <Card>
        <Table
          headers={["Task", "Type", "Client", "Due", "Priority"]}
          rows={tasks.map((t) => [
            <Link key={t.id} href="/staff/changes" className="font-medium no-underline">
              {t.title}
            </Link>,
            t.type,
            t.client,
            <span key={\`\${t.id}-d\`} className="font-mono text-xs">
              {t.due}
            </span>,
            <StatusChip key={\`\${t.id}-p\`} tone={t.priority === "high" ? "danger" : "warning"}>
              {t.priority}
            </StatusChip>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/onboarding/page.tsx",
  `
import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Onboarding" };

export default function OnboardingListPage() {
  const rows = clients.filter((c) => ["Onboarding", "Enrolling"].includes(c.pipeline));
  return (
    <div>
      <PageHeader
        title="Employer onboarding"
        description="Signed → ready to enroll. Checklists with due dates counted back from the effective date."
      />
      <Card>
        <Table
          headers={["Group", "Effective", "Status", ""]}
          rows={rows.map((g) => [
            g.name,
            <span key={g.id} className="font-mono text-xs">
              {g.effective}
            </span>,
            <StatusChip key={\`\${g.id}-s\`}>{g.pipeline}</StatusChip>,
            <Link key={\`\${g.id}-l\`} href={\`/staff/onboarding/\${g.id}\`} className="text-sm">
              Checklist
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/onboarding/[groupId]/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { clients, onboardingChecklist } from "@/lib/mock-data";

export default async function OnboardingDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const group = clients.find((c) => c.id === groupId) ?? clients[1];
  const done = onboardingChecklist.filter((c) => c.done).length;
  return (
    <div>
      <PageHeader
        title={\`Onboarding · \${group.name}\`}
        description={\`\${done} of \${onboardingChecklist.length} steps complete · Effective \${group.effective}\`}
        actions={<Button href="/employer/census" variant="secondary">Open employer portal view</Button>}
      />
      <Card className="divide-y divide-hairline">
        {onboardingChecklist.map((step, i) => (
          <div key={step.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">
                <span className="mr-2 font-mono text-xs text-warm-gray">{i + 1}.</span>
                {step.label}
              </p>
              <p className="text-sm text-warm-gray">Owner · {step.owner}</p>
            </div>
            <StatusChip tone={step.done ? "success" : step.owner === "System" ? "auto" : "warning"}>
              {step.done ? "Complete" : \`Due \${step.due}\`}
            </StatusChip>
          </div>
        ))}
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/changes/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Life events" };

const changes = [
  {
    id: "le-1",
    employee: "Aisha Patel",
    event: "Birth",
    reported: "Mar 1, 2027",
    window: "Inside 30 days",
    status: "Needs approval",
  },
  {
    id: "le-2",
    employee: "Marcus Lee",
    event: "Address",
    reported: "Feb 28, 2027",
    window: "Inside 30 days",
    status: "Proof missing",
  },
  {
    id: "le-3",
    employee: "Priya Shah",
    event: "Marriage",
    reported: "Feb 12, 2027",
    window: "Outside window",
    status: "Exception review",
  },
];

export default function ChangesPage() {
  return (
    <div>
      <PageHeader
        title="Life event approvals"
        description="Staff approve before a change reaches the carrier file (module F)."
      />
      <Card>
        <Table
          headers={["Employee", "Event", "Reported", "Window", "Status", ""]}
          rows={changes.map((c) => [
            c.employee,
            c.event,
            c.reported,
            c.window,
            <StatusChip
              key={c.id}
              tone={c.status.includes("approval") ? "warning" : c.status.includes("missing") ? "danger" : "neutral"}
            >
              {c.status}
            </StatusChip>,
            <Button key={\`\${c.id}-a\`} variant="secondary" className="!min-h-9 !px-3 !text-sm">
              Review
            </Button>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/renewals/page.tsx",
  `
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Renewals" };

export default function RenewalsPage() {
  return (
    <div>
      <PageHeader
        title="Renewals"
        description="120 days before renewal the system starts the workflow and task list."
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Card className="border-gold bg-parchment p-5">
          <p className="label-mono !text-gold-deep">Automation 14</p>
          <p className="mt-2 text-sm">Palm Coast Logistics renewal opened · 118 days out</p>
        </Card>
        <Card className="p-5">
          <p className="label-mono">Active renewals</p>
          <p className="mt-1 font-display text-3xl">2</p>
        </Card>
        <Card className="p-5">
          <p className="label-mono">Awaiting rates</p>
          <p className="mt-1 font-display text-3xl">1</p>
        </Card>
      </div>
      <Card>
        <Table
          headers={["Group", "Renewal date", "Mode", "Status"]}
          rows={[
            [
              "Palm Coast Logistics",
              "2027-05-01",
              "Re-enrollment window",
              <StatusChip key="r1" tone="warning">
                Collecting rates
              </StatusChip>,
            ],
            [
              "Coastal Clinics",
              "2027-07-01",
              "Passive renewal",
              <StatusChip key="r2" tone="auto">
                Scheduled
              </StatusChip>,
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
  "staff/carriers/page.tsx",
  `
import Link from "next/link";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";

export const metadata = { title: "Carrier files" };

export default function CarriersPage() {
  return (
    <div>
      <PageHeader
        title="Carrier submission"
        description="Validated drafts, staff approval, then SFTP or encrypted download — never plain email."
      />
      <Card>
        <Table
          headers={["Carrier", "Group", "Kind", "Records", "Errors", "Status", ""]}
          rows={carrierFiles.map((f) => [
            f.carrier,
            f.group,
            f.kind,
            <span key={\`\${f.id}-r\`} className="font-mono text-xs">
              {f.records}
            </span>,
            <span key={\`\${f.id}-e\`} className="font-mono text-xs">
              {f.errors}
            </span>,
            <StatusChip
              key={\`\${f.id}-s\`}
              tone={
                f.status.includes("Pending")
                  ? "warning"
                  : f.status.includes("Delivered")
                    ? "success"
                    : "auto"
              }
            >
              {f.status}
            </StatusChip>,
            <Link key={\`\${f.id}-l\`} href={\`/staff/carriers/\${f.id}\`} className="text-sm">
              Open
            </Link>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/carriers/[fileId]/page.tsx",
  `
import { Button, Card, PageHeader, StatusChip, Table } from "@/components/ui";
import { carrierFiles } from "@/lib/mock-data";

export default async function CarrierFilePage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = carrierFiles.find((f) => f.id === fileId) ?? carrierFiles[0];
  return (
    <div>
      <PageHeader
        title={\`\${file.carrier} · \${file.kind}\`}
        description={\`\${file.group} · Created \${file.created}\`}
        actions={
          <>
            <Button variant="secondary">Download encrypted</Button>
            <Button variant="accent">Approve & deliver</Button>
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusChip tone="warning">{file.status}</StatusChip>
        <StatusChip tone={file.errors ? "danger" : "success"}>
          {file.errors} validation errors
        </StatusChip>
      </div>
      <Card className="mb-4 border-gold bg-parchment p-5">
        <p className="label-mono !text-gold-deep">Validation</p>
        <p className="mt-2 text-sm">
          2 records held: missing dependent SSN · dependent age over plan limit. Fix data or hold
          those people and send the rest.
        </p>
      </Card>
      <Card>
        <Table
          headers={["Employee", "Action", "Plan code", "Result"]}
          rows={[
            ["Aisha Patel", "Change", "MED-GOLD-1500", <StatusChip key="ok1" tone="success">OK</StatusChip>],
            ["Omar Patel", "Add", "DEP-SPOUSE", <StatusChip key="err1" tone="danger">Missing SSN</StatusChip>],
            ["Nora Patel", "Add", "DEP-CHILD", <StatusChip key="err2" tone="danger">Age check</StatusChip>],
            ["Jordan Kim", "Term", "MED-GOLD-1500", <StatusChip key="ok2" tone="success">OK</StatusChip>],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/reports/page.tsx",
  `
import { Card, PageHeader, Stat } from "@/components/ui";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Enrollment status, carrier submission, onboarding, and data quality."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Stat label="Finish before close" value="94%" note="Target ≥ 95%" />
        </Card>
        <Card className="p-5">
          <Stat label="Phone / iPad enrollments" value="71%" note="Majority target" />
        </Card>
        <Card className="p-5">
          <Stat label="Carrier rejects" value="1.4%" note="Target under 2%" />
        </Card>
        <Card className="p-5">
          <Stat label="Manual reminders" value="~0" note="Automations covering OE" />
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {[
          ["Enrollment status", "By group, window, and step"],
          ["Carrier submission", "Draft → approved → confirmed"],
          ["Onboarding", "Checklist SLA and overdue owners"],
          ["Data quality", "Missing dependents, age-26, turning-65 flags"],
        ].map(([title, body]) => (
          <Card key={title} className="p-5">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="mt-2 text-sm text-ink/70">{body}</p>
            <button type="button" className="mt-4 text-sm font-medium text-gold-deep underline">
              Open report
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
`,
);

write(
  "staff/audit/page.tsx",
  `
import { Card, Input, PageHeader, Table } from "@/components/ui";
import { auditEntries } from "@/lib/mock-data";

export const metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Immutable trail of every sign-in, view, change, export, message, and signature."
      />
      <Card className="mb-4 p-4">
        <Input placeholder="Filter by who, what, when…" aria-label="Filter audit log" />
      </Card>
      <Card>
        <Table
          headers={["When", "Who", "Action", "What", "Where"]}
          rows={auditEntries.map((a) => [
            <span key={a.id} className="font-mono text-xs">
              {a.when}
            </span>,
            a.who,
            a.action,
            a.what,
            a.where,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "staff/search/page.tsx",
  `
import Link from "next/link";
import { Card, Input, PageHeader } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        title="Search"
        description="Saved filters and full-text across clients, groups, policies, and documents."
      />
      <Card className="mb-4 p-4">
        <Input
          autoFocus
          placeholder="Try “Harbor Light”, policy number, or EIN…"
          aria-label="Global search"
          defaultValue="Harbor"
        />
      </Card>
      <Card className="divide-y divide-hairline">
        {clients
          .filter((c) => c.name.toLowerCase().includes("harbor") || true)
          .slice(0, 3)
          .map((c) => (
            <Link
              key={c.id}
              href={\`/staff/clients/\${c.id}\`}
              className="block px-5 py-4 no-underline hover:bg-ivory"
            >
              <p className="font-medium text-ink">{c.name}</p>
              <p className="text-sm text-warm-gray">
                {c.type} · {c.pipeline} · {c.id}
              </p>
            </Link>
          ))}
      </Card>
    </div>
  );
}
`,
);

console.log("staff pages complete");
