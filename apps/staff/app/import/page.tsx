import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default function ImportPage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/clients" className="no-underline">
          Clients
        </Link>{" "}
        <span aria-hidden>/</span> Import
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
            Import the current book
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            book-of-business-2026.xlsx · 1,284 rows · uploaded by Dana Whitfield
          </p>
        </div>
        <ol
          aria-label="Import steps"
          className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px]"
        >
          <li>
            <Tag variant="ok">1 Upload</Tag>
          </li>
          <li>
            <Tag variant="ok">2 Map columns</Tag>
          </li>
          <li>
            <Tag variant="info">3 Review duplicates</Tag>
          </li>
          <li>
            <Tag variant="mute">4 Import</Tag>
          </li>
        </ol>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        <Stat label="Ready to import" value="1,231" />
        <Stat label="Possible duplicates" value="41" warn />
        <Stat label="Rows with errors" value="12" />
        <Stat label="Columns mapped" value="18 of 19" />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="dup" className="card min-w-0 flex-[3_1_560px] gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="dup" className="heading m-0 text-lg font-bold">
              Possible duplicates
            </h2>
            <span className="text-[13px] text-[var(--color-text-muted)]">
              Matched on name + date of birth, or ZIP + employer
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr>
                  <th className="th">In the file</th>
                  <th className="th">Already in the platform</th>
                  <th className="th">Match</th>
                  <th className="th">Action</th>
                </tr>
              </thead>
              <tbody>
                <DupRow
                  fileName="Maria Delgado"
                  fileSub="1988-04-11 · Riverside Dental"
                  existingName="María Delgado"
                  existingSub="1988-04-11 · Riverside Dental"
                  match="warn"
                />
                <DupRow
                  fileName="Tom Bartram"
                  fileSub="ZIP 33602 · Bartram Logistics"
                  existingName="Thomas Bartram"
                  existingSub="ZIP 33602 · Bartram Logistics"
                  match="mute"
                />
                <DupRow
                  fileName="Grace Okafor"
                  fileSub="1961-07-14 · Individual"
                  existingName="Grace Okafor"
                  existingSub="1961-07-14 · Okafor household"
                  match="warn"
                  last
                />
              </tbody>
            </table>
          </div>
          <Link href="#" className="text-[13px] font-semibold">
            Show 38 more
          </Link>
        </section>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="map" className="card gap-2.5">
            <h2 id="map" className="heading m-0 text-lg font-bold">
              Column mapping
            </h2>
            <MapRow col="First Name" field="First name" />
            <MapRow col="DOB" field="Date of birth" />
            <MapRow col="Policy #" field="Policy number" />
            <label className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] text-[var(--color-amber-dark)]">
                Agent Notes
              </span>
              <select className="field-in min-h-10 max-w-[180px]">
                <option>Choose a field</option>
                <option>Note on record</option>
                <option>Don&apos;t import</option>
              </select>
            </label>
          </section>
          <section aria-labelledby="errs" className="card gap-2">
            <h2 id="errs" className="heading m-0 text-lg font-bold">
              Rows with errors · 12
            </h2>
            <p className="m-0 text-[13px] leading-normal text-[var(--color-text-muted)]">
              Missing date of birth (7), unknown carrier name (3), bad phone
              format (2). They&apos;re left out; download them to fix and upload
              again.
            </p>
            <button type="button" className="btn btn-secondary self-start">
              Download error rows
            </button>
          </section>
          <button type="button" className="btn btn-primary">
            Import 1,231 rows and resolve duplicates
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border px-5 py-4 ${
        warn ? "border-[#F3D3AE] bg-[#FDF3E7]" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <span className={`text-[13px] ${warn ? "text-[#7A3F06]" : "text-[var(--color-text-muted)]"}`}>
        {label}
      </span>
      <span className={`heading text-[26px] font-extrabold ${warn ? "text-[#7A3F06]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function MapRow({ col, field }: { col: string; field: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#EEF1F5] pb-2">
      <span className="font-mono text-[13px]">{col}</span>
      <span>{field}</span>
    </div>
  );
}

function DupRow({
  fileName,
  fileSub,
  existingName,
  existingSub,
  match,
  last,
}: {
  fileName: string;
  fileSub: string;
  existingName: string;
  existingSub: string;
  match: "warn" | "mute";
  last?: boolean;
}) {
  return (
    <tr>
      <td className={last ? "td border-0" : "td"}>
        <b>{fileName}</b>
        <div className="text-xs text-[var(--color-text-muted)]">{fileSub}</div>
      </td>
      <td className={last ? "td border-0" : "td"}>
        <b>{existingName}</b>
        <div className="text-xs text-[var(--color-text-muted)]">{existingSub}</div>
      </td>
      <td className={last ? "td border-0" : "td"}>
        <Tag variant={match}>{match === "warn" ? "Strong" : "Possible"}</Tag>
      </td>
      <td className={last ? "td border-0" : "td"}>
        <label>
          <span className="sr-only">Action for {fileName}</span>
          <select className="field-in min-h-10">
            <option>Merge into existing</option>
            <option>Keep both</option>
            <option>Skip row</option>
          </select>
        </label>
      </td>
    </tr>
  );
}
