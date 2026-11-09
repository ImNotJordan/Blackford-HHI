import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { StatCard } from "@/components/ui/stat-card";
import { Tag } from "@/components/ui/tag";

const ESCALATIONS: {
  task: string;
  owner: string;
  due: string;
  from: string;
  state: string;
  tag: "bad" | "warn" | "mute";
}[] = [
  { task: "Bartram · collect signed agreement", owner: "Jamie Ortiz", due: "Feb 10", from: "Automation 10", state: "Escalated · 6 days late", tag: "bad" },
  { task: "Riverside · 9 people outstanding at close", owner: "Dana Whitfield", due: "Feb 28", from: "Automation 5", state: "Upcoming", tag: "mute" },
  { task: "Call Leah Morgan — text and email failed", owner: "Dana Whitfield", due: "Today", from: "Automation 12", state: "Due today", tag: "warn" },
  { task: "Follow up [Carrier] Dental Feb 2 file", owner: "Marcus Lee", due: "Feb 9", from: "Automation 17", state: "Escalated", tag: "bad" },
];

const FLAGS: {
  flag: string;
  tag: "warn" | "info";
  person: string;
  group: string;
  groupHref?: string;
  owner: string;
  action: string;
}[] = [
  { flag: "Missing dependent date of birth", tag: "warn", person: "Priya Nair · newborn", group: "Coastal Marine", owner: "Dana Whitfield", action: "Fix record" },
  { flag: "Dependent turns 26 in 74 days", tag: "warn", person: "Ada Okafor", group: "Individual", groupHref: "/households/okafor", owner: "Dana Whitfield", action: "Open task" },
  { flag: "Turning 65 in 6 months", tag: "info", person: "Grace Okafor", group: "Individual", groupHref: "/households/okafor", owner: "Dana Whitfield", action: "Open task" },
  { flag: "Missing SSN for carrier file", tag: "warn", person: "Jordan Price", group: "Riverside Dental", groupHref: "/groups/riverside-dental", owner: "Marcus Lee", action: "Ask HR" },
];

export default function ExceptionsPage() {
  return (
    <StaffShell>
      <header className="flex flex-col gap-1">
        <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
          Exceptions for staff
        </h1>
        <p className="m-0 text-[var(--color-text-muted)]">
          Only what the automations couldn&apos;t handle. Each item is a task on
          the person&apos;s record.
        </p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard label="Escalated to admin" value="2" hint="Past due, owner notified" hintAccent />
        <StatCard label="Overdue tasks" value="5" hint="Across the team" />
        <StatCard label="Call tasks" value="2" hint="Text and email both failed" />
        <StatCard label="Nightly data flags" value="6" hint="Automation 11 · 2:00 AM" />
      </div>

      <section aria-labelledby="esc" className="card flex flex-col gap-3">
        <h2 id="esc" className="heading m-0 text-lg">
          Escalations and overdue
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className="th">Task</th>
                <th scope="col" className="th">Owner</th>
                <th scope="col" className="th">Due</th>
                <th scope="col" className="th">From</th>
                <th scope="col" className="th">State</th>
              </tr>
            </thead>
            <tbody>
              {ESCALATIONS.map((e) => (
                <tr key={e.task}>
                  <td className="td font-semibold">{e.task}</td>
                  <td className="td">{e.owner}</td>
                  <td className="td">{e.due}</td>
                  <td className="td">{e.from}</td>
                  <td className="td">
                    <Tag variant={e.tag}>{e.state}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="dq" className="card flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="dq" className="heading m-0 text-lg">
            Nightly data checks · Automation 11
          </h2>
          <span className="text-[13px] text-[var(--color-text-muted)]">
            Last run today 2:00 AM
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className="th">Flag</th>
                <th scope="col" className="th">Person</th>
                <th scope="col" className="th">Group</th>
                <th scope="col" className="th">Owner</th>
                <th scope="col" className="th">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FLAGS.map((f) => (
                <tr key={f.flag}>
                  <td className="td">
                    <Tag variant={f.tag}>{f.flag}</Tag>
                  </td>
                  <td className="td font-semibold">{f.person}</td>
                  <td className="td">
                    {f.groupHref ? <Link href={f.groupHref}>{f.group}</Link> : f.group}
                  </td>
                  <td className="td">{f.owner}</td>
                  <td className="td">
                    <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                      {f.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StaffShell>
  );
}
