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
  "manager/service-requests/page.tsx",
  `
import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Service requests" };

const rows = [
  ["ID card", "Harbor Light · Aisha Patel", "Due today", "Open"],
  ["Claim help", "Palm Coast · Marcus Lee", "Due in 2 days", "In progress"],
  ["Address change", "James Ortega", "Overdue", "Escalated"],
];

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Service"
        title="Service requests"
        description="ID cards, claim help, and changes — routed to the owner with due dates by type."
        actions={<ActionButton success="Request drafted">New request</ActionButton>}
      />
      <ModuleTag code="A" name="Service requests" />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Type", "Client", "Due", "Status", ""]}
          rows={rows.map((r) => [
            r[0],
            r[1],
            <span key={r[0]} className="font-mono text-xs">{r[2]}</span>,
            <StatusChip key={r[0] + "s"} tone={r[3] === "Escalated" ? "danger" : r[3] === "Open" ? "warning" : "auto"}>
              {r[3]}
            </StatusChip>,
            <ActionButton key={r[0] + "a"} variant="secondary" success="Resolved">
              Resolve
            </ActionButton>,
          ])}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "manager/documents/page.tsx",
  `
import { ModuleTag } from "@/components/features";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Documents" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A · Records"
        title="Documents"
        description="Plans, signed elections, carrier apps, and uploaded proof on every client record."
      />
      <ModuleTag code="A" name="Documents" />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Document", "Client", "Type", "Status"]}
          rows={[
            ["Election confirmation.pdf", "Aisha Patel", "Signed", <StatusChip key="1" tone="success">On file</StatusChip>],
            ["Birth certificate.pdf", "Harbor Light · birth event", "Proof", <StatusChip key="2" tone="warning">Needs review</StatusChip>],
            ["Florida Blue change file", "Harbor Light", "Carrier", <StatusChip key="3" tone="auto">Draft</StatusChip>],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "manager/signatures/page.tsx",
  `
import { ModuleTag, SignatureAudit } from "@/components/features";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Signatures" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module E · Signing"
        title="Signatures & audit trails"
        description="Produce any signed document and its audit trail on request."
      />
      <ModuleTag code="E" name="E-signature" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SignatureAudit />
        <Card className="animate-rise overflow-hidden">
          <Table
            headers={["Document", "Signer", "Status"]}
            rows={[
              ["Medical election", "Aisha Patel", <StatusChip key="a" tone="success">Signed</StatusChip>],
              ["Dental election", "Aisha Patel", <StatusChip key="b" tone="success">Signed</StatusChip>],
              ["Broker agreement", "Rivers & Reed HR", <StatusChip key="c" tone="warning">Awaiting</StatusChip>],
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
`,
);

write(
  "manager/data-quality/page.tsx",
  `
import { FeatureCallout, ModuleTag } from "@/components/features";
import { Card, PageHeader, StatusChip, Table } from "@/components/ui";

export const metadata = { title: "Data quality" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Automation 11 · Nightly"
        title="Data quality flags"
        description="Missing dependent data, dependents turning 26 within 90 days, clients turning 65 within 6 months."
      />
      <ModuleTag code="H" name="Data quality" />
      <div className="mt-4 mb-4">
        <FeatureCallout module="H" title="Nightly check completed 2:00 AM" tone="auto">
          27 open flags across your book. Act before the next carrier file.
        </FeatureCallout>
      </div>
      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["Flag", "Person", "Group", "Due"]}
          rows={[
            [<StatusChip key="1" tone="warning">Age 26 in 60d</StatusChip>, "Nora Patel", "Harbor Light", "90-day window"],
            [<StatusChip key="2" tone="danger">Missing SSN</StatusChip>, "Omar Patel", "Harbor Light", "Before export"],
            [<StatusChip key="3" tone="auto">Turning 65</StatusChip>, "James Ortega", "Individual", "6 months"],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

write(
  "manager/import/page.tsx",
  `
import { DuplicateBanner, ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader } from "@/components/ui";

export const metadata = { title: "Import book" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module A · Spreadsheet import"
        title="Import current book"
        description="Import groups and clients with duplicate detection by name, EIN, email, and phone."
      />
      <ModuleTag code="A" name="Import" />
      <div className="mt-4 space-y-4">
        <DuplicateBanner />
        <Card className="animate-rise space-y-4 p-6">
          <Field label="Spreadsheet" hint="CSV or XLSX from the Blackford template">
            <Input type="file" accept=".csv,.xlsx" />
          </Field>
          <ActionButton success="Import queued · duplicates listed">Run import</ActionButton>
        </Card>
      </div>
    </div>
  );
}
`,
);

write(
  "employer/eligibility/page.tsx",
  `
import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select } from "@/components/ui";

export const metadata = { title: "Eligibility & windows" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module C · Employer onboarding"
        title="Eligibility & windows"
        description="Classes, waiting periods, minimum hours, dependent age limits, OE and new-hire windows."
      />
      <ModuleTag code="C" name="Eligibility" />
      <Card className="mt-4 animate-rise space-y-4 p-6">
        <Field label="Eligibility class">
          <Select defaultValue="ft"><option value="ft">Full-time</option><option value="pt">Part-time</option></Select>
        </Field>
        <Field label="Waiting period">
          <Select defaultValue="30"><option value="0">Date of hire</option><option value="30">First of month after 30 days</option><option value="60">60 days</option></Select>
        </Field>
        <Field label="Minimum hours / week">
          <Input defaultValue="30" inputMode="numeric" />
        </Field>
        <Field label="Dependent age limit">
          <Input defaultValue="26" inputMode="numeric" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Open enrollment start"><Input type="date" defaultValue="2027-02-01" /></Field>
          <Field label="Open enrollment end"><Input type="date" defaultValue="2027-02-28" /></Field>
        </div>
        <ActionButton success="Eligibility saved">Save rules</ActionButton>
      </Card>
    </div>
  );
}
`,
);

write(
  "admin/aca/page.tsx",
  `
import { AcaCaptureNote, ModuleTag } from "@/components/features";
import { Card, PageHeader, Stat, Table } from "@/components/ui";

export const metadata = { title: "ACA data capture" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H · Release 2 files later"
        title="ACA data capture"
        description="Offers, elections, and waivers by month are captured from day one. Filing ships in Release 2."
      />
      <ModuleTag code="H" name="ACA capture" />
      <div className="stagger mt-4 mb-4 grid gap-4 sm:grid-cols-3">
        <Card className="ui-card p-5"><Stat label="Offers logged" value="1,204" /></Card>
        <Card className="ui-card p-5"><Stat label="Elections" value="986" /></Card>
        <Card className="ui-card p-5"><Stat label="Waivers" value="218" /></Card>
      </div>
      <AcaCaptureNote />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Month", "Offers", "Elections", "Waivers"]}
          rows={[
            ["Jan 2027", "402", "318", "84"],
            ["Feb 2027", "410", "340", "70"],
            ["Mar 2027", "392", "328", "64"],
          ]}
        />
      </Card>
    </div>
  );
}
`,
);

console.log("gap pages done");
