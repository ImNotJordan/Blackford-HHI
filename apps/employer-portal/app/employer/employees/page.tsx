import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { Callout, Card, Field, PageHeader, SecurityNote, Tag, type Tone } from "@/components/ui";

const ROSTER: {
  name: string;
  className: string;
  hired: string;
  status: string;
  tone: Tone;
  action: string;
}[] = [
  { name: "Jordan Price", className: "Driver", hired: "Feb 16, 2027", status: "Invite on Apr 1", tone: "info", action: "Edit" },
  { name: "Maria Delgado", className: "Office", hired: "Jun 3, 2019", status: "Enrolled", tone: "success", action: "Request termination" },
  { name: "Tuan Nguyen", className: "Office", hired: "Aug 22, 2021", status: "Started", tone: "warning", action: "Request termination" },
  { name: "Leah Morgan", className: "Driver", hired: "Jan 9, 2023", status: "Not started", tone: "neutral", action: "Request termination" },
  { name: "Omar Haddad", className: "Part-time", hired: "Oct 1, 2024", status: "Not eligible · under 30 hrs", tone: "neutral", action: "Edit" },
];

export default function EmployerEmployeesPage() {
  return (
    <PortalShell activeNav="employees" userName="Tom Brooks" userInitials="TB">
      <PageHeader
        context="Step 4 of 4 · Bartram Logistics · 44 employees"
        title="Employees"
        description="Changes go to Blackford for approval before reaching a carrier. Full SSNs are never shown here — only masked values like •••-••-1234."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
        <Card
          title="Roster"
          id="roster"
          actions={
            <label className="w-full min-w-[220px] sm:w-auto">
              <span className="sr-only">Search employees</span>
              <input
                type="search"
                className="field-input"
                placeholder="Search name or employee ID"
              />
            </label>
          }
        >
          <div className="table-wrap">
            <table className="data-table min-w-[620px]">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Class</th>
                  <th scope="col">Hired</th>
                  <th scope="col">Benefits</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((row) => (
                  <tr key={row.name}>
                    <td className="cell-strong">{row.name}</td>
                    <td className="cell-muted">{row.className}</td>
                    <td className="cell-muted whitespace-nowrap">{row.hired}</td>
                    <td>
                      <Tag tone={row.tone}>{row.status}</Tag>
                    </td>
                    <td className="text-right">
                      <Link href="#" className="whitespace-nowrap text-sm font-semibold">
                        {row.action}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="#" className="text-sm font-semibold">
            Show all 44 →
          </Link>
        </Card>

        <Card
          title="Add a new hire"
          id="add-hire"
          footer={
            <button type="button" className="btn btn-primary btn-block">
              Add new hire
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <input className="field-input" defaultValue="Jordan" readOnly />
            </Field>
            <Field label="Last name">
              <input className="field-input" defaultValue="Price" readOnly />
            </Field>
            <Field label="Hire date">
              <input className="field-input" defaultValue="02/16/2027" readOnly />
            </Field>
            <Field label="Class">
              <select className="field-input" defaultValue="Driver">
                <option>Driver</option>
                <option>Office</option>
                <option>Part-time</option>
              </select>
            </Field>
            <Field label="Hours a week">
              <input className="field-input" defaultValue="36" readOnly />
            </Field>
            <Field label="Mobile">
              <input className="field-input" type="tel" defaultValue="(555) 010-0002" readOnly />
            </Field>
          </div>
          <Callout tone="success" title="Eligible Apr 1, 2027">
            1st of the month after a 30-day wait. Jordan gets an enrollment link
            by text and email that morning, with 30 days to finish.
          </Callout>
        </Card>
      </div>

      <SecurityNote />
    </PortalShell>
  );
}
