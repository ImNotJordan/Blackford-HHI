import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";

const ROSTER = [
  {
    name: "Jordan Price",
    className: "Driver",
    hired: "Feb 16, 2027",
    status: "Invite on Apr 1",
    tag: "info" as const,
    action: "Edit",
  },
  {
    name: "Maria Delgado",
    className: "Office",
    hired: "Jun 3, 2019",
    status: "Enrolled",
    tag: "ok" as const,
    action: "Request termination",
  },
  {
    name: "Tuan Nguyen",
    className: "Office",
    hired: "Aug 22, 2021",
    status: "Started",
    tag: "warn" as const,
    action: "Request termination",
  },
  {
    name: "Leah Morgan",
    className: "Driver",
    hired: "Jan 9, 2023",
    status: "Not started",
    tag: "mute" as const,
    action: "Request termination",
  },
  {
    name: "Omar Haddad",
    className: "Part-time",
    hired: "Oct 1, 2024",
    status: "Not eligible · under 30 hrs",
    tag: "mute" as const,
    action: "Edit",
    last: true,
  },
];

const TAG_CLASS = {
  ok: "tag tag-ok",
  warn: "tag tag-warn",
  info: "tag tag-info",
  mute: "tag tag-mute",
};

export default function EmployerEmployeesPage() {
  return (
    <PortalShell
        activeNav="employees"
        userName="Tom Brooks"
        userInitials="TB"
      >

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1
              className="m-0 text-[30px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Employees
            </h1>
            <p className="m-0 text-[var(--color-text-muted)]">
              Bartram Logistics · 44 employees · changes go to Blackford for
              approval before reaching a carrier. Full SSNs are never shown in
              this portal — only masked values like •••-••-1234 when needed.
            </p>
          </div>
          <label className="field-label min-w-[240px]">
            <span className="text-xs font-normal text-[var(--color-text-muted)]">
              Search
            </span>
            <input
              type="search"
              className="field-input"
              placeholder="Name or employee ID"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <section
            aria-labelledby="roster"
            className="card flex min-w-0 flex-[3_1_560px] flex-col gap-3"
          >
            <h2
              id="roster"
              className="m-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Roster
            </h2>
            <div className="overflow-x-auto">
              <table className="portal-table w-full min-w-[620px] border-collapse">
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
                      <td className={`font-semibold ${row.last ? "border-b-0" : ""}`}>
                        {row.name}
                      </td>
                      <td className={row.last ? "border-b-0" : ""}>
                        {row.className}
                      </td>
                      <td className={row.last ? "border-b-0" : ""}>
                        {row.hired}
                      </td>
                      <td className={row.last ? "border-b-0" : ""}>
                        <span className={TAG_CLASS[row.tag]}>{row.status}</span>
                      </td>
                      <td className={row.last ? "border-b-0" : ""}>
                        <Link href="#" className="font-semibold text-[13px]">
                          {row.action}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="#" className="text-[13px] font-semibold">
              Show all 44
            </Link>
          </section>

          <section
            aria-labelledby="add-hire"
            className="card flex min-w-0 flex-[2_1_320px] flex-col gap-3"
          >
            <h2
              id="add-hire"
              className="m-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Add a new hire
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[140px] flex-1">
                First name
                <input className="field-input" defaultValue="Jordan" readOnly />
              </label>
              <label className="field-label min-w-[140px] flex-1">
                Last name
                <input className="field-input" defaultValue="Price" readOnly />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[140px] flex-1">
                Hire date
                <input
                  className="field-input"
                  defaultValue="02/16/2027"
                  readOnly
                />
              </label>
              <label className="field-label min-w-[140px] flex-1">
                Class
                <select className="field-input" defaultValue="Driver">
                  <option>Driver</option>
                  <option>Office</option>
                  <option>Part-time</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[140px] flex-1">
                Hours a week
                <input className="field-input" defaultValue="36" readOnly />
              </label>
              <label className="field-label min-w-[140px] flex-1">
                Mobile
                <input
                  className="field-input"
                  type="tel"
                  defaultValue="(555) 010-0002"
                  readOnly
                />
              </label>
            </div>
            <div className="flex flex-col gap-1 rounded-[var(--radius-md)] bg-[var(--color-teal-muted)] p-3.5 text-[#0B4A45]">
              <span className="font-bold">Eligible Apr 1, 2027</span>
              <span className="text-[13px] leading-relaxed">
                1st of the month after a 30-day wait. Jordan gets an enrollment
                link by text and email that morning, with 30 days to finish.
              </span>
            </div>
            <button type="button" className="btn btn-primary">
              Add new hire
            </button>
          </section>
        </div>

        <p className="m-0 text-xs leading-relaxed text-[var(--color-text-muted)]">
          Sign in with a one-time code — no password. You&apos;re signed out
          after 15 minutes idle.
        </p>
      </main>
    </PortalShell>
  );
}
