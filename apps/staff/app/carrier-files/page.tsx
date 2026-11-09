import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

const PIPELINE = [
  { label: "Waiting for next file", value: "38" },
  { label: "In a file to approve", value: "19", highlight: true },
  { label: "Submitted", value: "21" },
  { label: "Confirmed by carrier", value: "412" },
  { label: "Rejected · back to staff", value: "1" },
];

const FILES: {
  name: string;
  href?: string;
  carrier: string;
  records: string;
  built: string;
  delivery: string;
  status: string;
  tag: "ok" | "warn" | "info";
  action: string;
}[] = [
  { name: "Weekly change file", href: "/carrier-files/dental-weekly", carrier: "[Carrier] Dental", records: "14 · 1 error", built: "Feb 16 06:00", delivery: "SFTP", status: "Waiting for approval", tag: "warn", action: "Review" },
  { name: "Weekly change file", carrier: "[Carrier] Medical", records: "5", built: "Feb 16 06:00", delivery: "SFTP", status: "Waiting for approval", tag: "warn", action: "Review" },
  { name: "Weekly change file", carrier: "[Carrier] Dental", records: "21", built: "Feb 09 06:00", delivery: "SFTP", status: "Confirmed Feb 12", tag: "ok", action: "Resend" },
  { name: "Open enrollment file", carrier: "[Carrier] Medical", records: "62", built: "Feb 03 06:00", delivery: "SFTP", status: "Submitted · day 4 of 5", tag: "info", action: "Resend" },
  { name: "Weekly change file", carrier: "[Carrier] Vision", records: "3", built: "Feb 02 06:00", delivery: "Encrypted download", status: "Partial · 1 rejected", tag: "warn", action: "Open" },
];

export default function CarrierFilesPage() {
  return (
    <StaffShell>
      <header className="flex flex-col gap-1">
        <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
          Carrier files
        </h1>
        <p className="m-0 text-[var(--color-text-muted)]">
          Approved CSV files by SFTP at launch. Nothing leaves without staff
          approval.
        </p>
      </header>

      <section aria-labelledby="st" className="card flex flex-col gap-3">
        <h2 id="st" className="heading m-0 text-lg">
          Enrollments on their way to carriers
        </h2>
        <div className="flex flex-wrap gap-3">
          {PIPELINE.map((p) => (
            <div
              key={p.label}
              className={`flex flex-[1_1_140px] flex-col gap-1 rounded-[10px] border px-4 py-3.5 ${
                p.highlight
                  ? "border-[var(--brand-gold)] bg-[var(--brand-parchment)]"
                  : "border-[var(--brand-hairline)] bg-[var(--brand-ivory)]"
              }`}
            >
              <span className="text-[13px] text-[var(--brand-ink)]">{p.label}</span>
              <span className="stat-figure !text-[26px]">{p.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="q" className="card flex flex-col gap-3">
        <h2 id="q" className="heading m-0 text-lg">
          Files
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className="th">File</th>
                <th scope="col" className="th">Carrier</th>
                <th scope="col" className="th">Records</th>
                <th scope="col" className="th">Built</th>
                <th scope="col" className="th">Delivery</th>
                <th scope="col" className="th">Status</th>
                <th scope="col" className="th">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FILES.map((f) => (
                <tr key={`${f.carrier}-${f.built}`}>
                  <td className="td font-semibold">
                    {f.href ? <Link href={f.href}>{f.name}</Link> : f.name}
                  </td>
                  <td className="td">{f.carrier}</td>
                  <td className="td">{f.records}</td>
                  <td className="td font-[family-name:var(--font-mono)] text-[13px]">{f.built}</td>
                  <td className="td">{f.delivery}</td>
                  <td className="td">
                    <Tag variant={f.tag}>{f.status}</Tag>
                  </td>
                  <td className="td">
                    {f.href ? (
                      <Link href={f.href} className="font-semibold">
                        {f.action}
                      </Link>
                    ) : (
                      <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]">
                        {f.action}
                      </button>
                    )}
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
