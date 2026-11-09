import Link from "next/link";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

const LINES = [
  { label: "Medical · PPO 1500 · Employee + spouse", amount: "$142.50" },
  { label: "Dental · Dental PPO · Employee + spouse", amount: "$18.40" },
  { label: "Vision · Waived (other coverage)", amount: "$0.00" },
  { label: "Basic life · $25,000 · Beneficiary Carlos Delgado", amount: "Employer paid" },
];

const TRAIL: { event: string; when: string; extra?: string }[] = [
  { event: "Form generated", when: "Feb 16 08:58:41 · System" },
  { event: "Signing link sent by text", when: "Feb 16 08:58:44 · to ••• 4821" },
  { event: "Identity confirmed with one-time code", when: "Feb 16 09:03:10" },
  { event: "Agreed to electronic records", when: "Feb 16 09:04:22 · consent v1.2" },
  { event: "Signed", when: "Feb 16 09:05:03 · iPhone, Safari", extra: "IP 203.0.113.24" },
  { event: "Stored on record; confirmation PDF sent", when: "Feb 16 09:05:06 · System" },
];

export default function SignedDocumentPage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/groups/riverside-dental">
          Riverside Dental Group
        </Link>{" "}
        <span aria-hidden>/</span> Maria Delgado <span aria-hidden>/</span> Documents
      </nav>

      <header className="page-header">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">
              2027 benefit election form
            </h1>
            <Tag variant="ok">Signed</Tag>
          </div>
          <div className="meta-row">
            <span>Signer: Maria Delgado</span>
            <span>Signed Feb 16, 2027 · 9:05 AM ET</span>
            <span>Ready for carrier file</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Download audit trail
          </button>
          <button type="button" className="btn btn-primary">
            Download signed PDF
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <section
          aria-label="Document preview"
          className="flex min-w-0 flex-[3_1_520px] justify-center rounded-lg border border-hairline bg-sand p-6"
        >
          <div className="flex w-full max-w-[560px] flex-col gap-5 bg-surface p-8 shadow-sm">
            <div className="flex justify-between gap-3 border-b border-hairline pb-3">
              <span className="heading text-[18px]">Blackford &amp; Associates</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                Page 1 of 2
              </span>
            </div>
            <span className="font-semibold">Benefit Election Form · Plan year 2027</span>
            <dl className="m-0 grid grid-cols-[120px_1fr] gap-x-3 gap-y-1.5 text-[14px]">
              <dt className="text-muted">Employee</dt>
              <dd className="m-0">Maria Delgado</dd>
              <dt className="text-muted">Employer</dt>
              <dd className="m-0">Riverside Dental Group</dd>
              <dt className="text-muted">Effective</dt>
              <dd className="m-0">March 1, 2027</dd>
            </dl>
            <div className="flex flex-col">
              {LINES.map((l) => (
                <div key={l.label} className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
                  <span>{l.label}</span>
                  <span className="font-mono text-[13px]">{l.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 border-t-2 border-ink pt-3">
              <span className="heading text-[24px] italic">Maria Delgado</span>
              <span className="font-mono text-[11px] text-muted">
                Signed electronically · Feb 16, 2027 9:05 AM ET · ID 7F3A-21C9
              </span>
            </div>
          </div>
        </section>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-6">
          <section aria-labelledby="trail" className="card flex flex-col gap-1">
            <h2 id="trail" className="section-title">
              Audit trail
            </h2>
            <ol className="m-0 flex list-none flex-col p-0">
              {TRAIL.map((t, i) => (
                <li key={t.event} className="flex gap-3">
                  <span className="flex flex-col items-center" aria-hidden>
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
                    {i < TRAIL.length - 1 ? (
                      <span className="w-px flex-1 bg-hairline" />
                    ) : null}
                  </span>
                  <div className="flex flex-col gap-0.5 pb-3.5">
                    <span className="font-semibold">{t.event}</span>
                    <span className="font-mono text-[12px] text-muted">
                      {t.when}
                    </span>
                    {t.extra ? (
                      <span className="font-mono text-[12px] text-muted">
                        {t.extra}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="docs" className="card flex flex-col gap-1">
            <h2 id="docs" className="section-title">
              Other documents
            </h2>
            <div className="flex items-center justify-between gap-3 border-b border-hairline py-2.5">
              <span>Carrier application · medical</span>
              <Tag variant="ok">Signed</Tag>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-hairline py-2.5">
              <span>Life beneficiary form</span>
              <Tag variant="ok">Signed</Tag>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <span>Paper signature upload</span>
              <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                Upload
              </button>
            </div>
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}
