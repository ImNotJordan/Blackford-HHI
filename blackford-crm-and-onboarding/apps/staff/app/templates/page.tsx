import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

const TEMPLATES = [
  { name: "Reminder · not started", meta: "Text + email · Automation 2", active: true },
  { name: "Reminder · started", meta: "Text + email · Automation 2" },
  { name: "Reminder · ready to sign", meta: "Text + email · Automation 2" },
  { name: "Enrollment invite", meta: "Text + email · Automation 1" },
  { name: "Confirmation", meta: "Email with PDF · Automation 3" },
  { name: "HR weekly digest", meta: "Email · Automation 7" },
  { name: "Census errors", meta: "Email · Automation 9" },
];

const MERGE_FIELDS = ["[first name]", "[group name]", "[window end]", "[secure link]", "[account manager]"];

export default function TemplatesPage() {
  return (
    <StaffShell>
      <PageHeader
        title="Message templates"
        description="Used by staff and by the automations. Every template has an English and a Spanish version."
        actions={
          <button type="button" className="btn btn-primary">
            New template
          </button>
        }
      />

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Templates" className="panel min-w-[280px] flex-[1_1_280px]">
          <div className="panel-head">
            <span className="label">{TEMPLATES.length} templates</span>
          </div>
          <div className="divided">
            {TEMPLATES.map((t) => (
              <a
                key={t.name}
                href="#"
                aria-current={t.active ? "true" : undefined}
                className="list-row"
              >
                <span className="font-semibold">{t.name}</span>
                <span className="text-[13px] text-muted">{t.meta}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
          <section aria-labelledby="ed" className="card gap-4">
            <div className="card-head items-center">
              <h2 id="ed" className="section-title">
                Reminder · not started
              </h2>
              <Tag variant="ok">Both languages complete</Tag>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              <label className="field-label">
                English text
                <textarea
                  rows={5}
                  className="field-in min-h-[130px]"
                  defaultValue="Hi [first name], you haven't started your [group name] benefits yet. It takes about 15 minutes: [secure link]. Closes [window end]. Reply STOP to opt out."
                />
              </label>
              <label className="field-label">
                Spanish text
                <textarea
                  rows={5}
                  className="field-in min-h-[130px]"
                  defaultValue="Hola [first name], aún no ha comenzado sus beneficios de [group name]. Toma unos 15 minutos: [secure link]. Cierra el [window end]. Responda STOP para no recibir mensajes."
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[13px] text-muted">Merge fields:</span>
              {MERGE_FIELDS.map((f) => (
                <button key={f} type="button" className="merge-field cursor-pointer hover:border-ink">
                  {f}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="rules" className="card gap-1">
            <h2 id="rules" className="section-title mb-1">
              Checks before saving
            </h2>
            <div className="divided">
              <CheckRow label="Opt-out wording in every text" result={<Tag variant="ok">Pass</Tag>} />
              <CheckRow label="No health or plan details in the text body" result={<Tag variant="ok">Pass</Tag>} />
              <CheckRow label="Fits in 2 text segments" result={<Tag variant="warn">Spanish: 2 segments</Tag>} />
            </div>
            <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-divider pt-4">
              <button type="button" className="btn btn-secondary">
                Send me a test
              </button>
              <button type="button" className="btn btn-primary">
                Save template
              </button>
            </div>
          </section>
        </div>
      </div>
    </StaffShell>
  );
}

function CheckRow({ label, result }: { label: string; result: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
      <span>{label}</span>
      {result}
    </div>
  );
}
