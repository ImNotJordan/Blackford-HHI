import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tag } from "@/components/ui/tag";

const STEPS: { label: string; state: "done" | "current" | "todo" }[] = [
  { label: "Upload", state: "done" },
  { label: "Map columns", state: "done" },
  { label: "Review duplicates", state: "current" },
  { label: "Import", state: "todo" },
];

export default function ImportPage() {
  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Clients", href: "/clients" }, { label: "Import" }]}
        title="Import the current book"
        meta={["book-of-business-2026.xlsx", "1,284 rows", "Uploaded by Dana Whitfield"]}
        actions={
          <ol aria-label="Import steps" className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
            {STEPS.map((s, i) => (
              <li
                key={s.label}
                aria-current={s.state === "current" ? "step" : undefined}
                className="flex items-center gap-1"
              >
                {i > 0 ? <span aria-hidden className="h-px w-4 bg-hairline" /> : null}
                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] ${
                    s.state === "current"
                      ? "bg-ink font-semibold text-ivory"
                      : s.state === "done"
                        ? "text-gold-deep"
                        : "text-muted"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] ${
                      s.state === "current"
                        ? "bg-pale-gold text-ink"
                        : s.state === "done"
                          ? "bg-parchment text-gold-deep"
                          : "border border-hairline"
                    }`}
                  >
                    {s.state === "done" ? "✓" : i + 1}
                  </span>
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        <StatCard label="Ready to import" value="1,231" />
        <StatCard label="Possible duplicates" value="41" tone="warn" hint="Review before importing" hintAccent />
        <StatCard label="Rows with errors" value="12" hint="Left out of the import" />
        <StatCard label="Columns mapped" value="18 of 19" hint="1 needs a field" />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="dup" className="card min-w-0 flex-[3_1_560px]">
          <div className="card-head">
            <h2 id="dup" className="section-title">
              Possible duplicates
            </h2>
            <span className="text-[13px] text-muted">
              Matched on name + date of birth, or ZIP + employer
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table min-w-[680px]">
              <thead>
                <tr>
                  <th scope="col" className="th">In the file</th>
                  <th scope="col" className="th">Already in the platform</th>
                  <th scope="col" className="th">Match</th>
                  <th scope="col" className="th">Action</th>
                </tr>
              </thead>
              <tbody>
                <DupRow
                  fileName="Maria Delgado"
                  fileSub="1988-04-11 · Riverside Dental"
                  existingName="María Delgado"
                  existingSub="1988-04-11 · Riverside Dental"
                  strong
                />
                <DupRow
                  fileName="Tom Bartram"
                  fileSub="ZIP 33602 · Bartram Logistics"
                  existingName="Thomas Bartram"
                  existingSub="ZIP 33602 · Bartram Logistics"
                />
                <DupRow
                  fileName="Grace Okafor"
                  fileSub="1961-07-14 · Individual"
                  existingName="Grace Okafor"
                  existingSub="1961-07-14 · Okafor household"
                  strong
                />
              </tbody>
            </table>
          </div>
          <Link href="#" className="link-action self-start">
            Show 38 more
          </Link>
        </section>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="map" className="card gap-1">
            <h2 id="map" className="section-title mb-2">
              Column mapping
            </h2>
            <div className="divided">
              <MapRow col="First Name" field="First name" />
              <MapRow col="DOB" field="Date of birth" />
              <MapRow col="Policy #" field="Policy number" />
              <label className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2 font-mono text-[13px] font-medium text-gold-deep">
                  <span aria-hidden className="dot dot-gold h-2 w-2" />
                  Agent Notes
                </span>
                <select className="field-in min-h-9 max-w-[180px] border-gold">
                  <option>Choose a field</option>
                  <option>Note on record</option>
                  <option>Don&apos;t import</option>
                </select>
              </label>
            </div>
          </section>
          <section aria-labelledby="errs" className="card gap-3">
            <h2 id="errs" className="section-title">
              Rows with errors · 12
            </h2>
            <p className="m-0 text-[14px] text-ink-soft">
              Missing date of birth (7), unknown carrier name (3), bad phone
              format (2). They&apos;re left out; download them to fix and upload
              again.
            </p>
            <button type="button" className="btn btn-secondary btn-sm self-start">
              Download error rows
            </button>
          </section>
          <button type="button" className="btn btn-primary min-h-12">
            Import 1,231 rows and resolve duplicates
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function MapRow({ col, field }: { col: string; field: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
      <span className="font-mono text-[13px] text-ink-soft">{col}</span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="text-muted">→</span>
        {field}
      </span>
    </div>
  );
}

function DupRow({
  fileName,
  fileSub,
  existingName,
  existingSub,
  strong,
}: {
  fileName: string;
  fileSub: string;
  existingName: string;
  existingSub: string;
  strong?: boolean;
}) {
  return (
    <tr>
      <td className="td">
        <span className="font-semibold">{fileName}</span>
        <div className="td-sub">{fileSub}</div>
      </td>
      <td className="td">
        <span className="font-semibold">{existingName}</span>
        <div className="td-sub">{existingSub}</div>
      </td>
      <td className="td">
        <Tag variant={strong ? "warn" : "mute"}>{strong ? "Strong" : "Possible"}</Tag>
      </td>
      <td className="td">
        <label>
          <span className="sr-only">Action for {fileName}</span>
          <select className="field-in min-h-9">
            <option>Merge into existing</option>
            <option>Keep both</option>
            <option>Skip row</option>
          </select>
        </label>
      </td>
    </tr>
  );
}
