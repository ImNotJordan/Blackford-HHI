import { StaffShell } from "@/components/staff-shell";
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

export default function TemplatesPage() {
  return (
    <StaffShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
            Message templates
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            Used by staff and by the automations. Every template has an English
            and a Spanish version.
          </p>
        </div>
        <button type="button" className="btn btn-primary">
          New template
        </button>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <section
          aria-label="Templates"
          className="flex min-w-[280px] flex-[1_1_280px] flex-col gap-0.5 rounded-xl border border-[var(--color-border)] bg-white p-2"
        >
          {TEMPLATES.map((t) => (
            <a
              key={t.name}
              href="#"
              aria-current={t.active}
              className={`flex flex-col gap-1 rounded-[10px] px-3 py-3 no-underline text-[var(--color-text)] ${
                t.active ? "bg-[#E6F2F1]" : ""
              }`}
            >
              <span className="font-bold">{t.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{t.meta}</span>
            </a>
          ))}
        </section>

        <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
          <section aria-labelledby="ed" className="card gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="ed" className="heading m-0 text-lg font-bold">
                Reminder · not started
              </h2>
              <Tag variant="ok">Both languages complete</Tag>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              <label className="field-label">
                English text
                <textarea
                  rows={5}
                  className="field-in min-h-[120px] resize-y py-3 leading-normal"
                  defaultValue="Hi [first name], you haven't started your [group name] benefits yet. It takes about 15 minutes: [secure link]. Closes [window end]. Reply STOP to opt out."
                />
              </label>
              <label className="field-label">
                Spanish text
                <textarea
                  rows={5}
                  className="field-in min-h-[120px] resize-y py-3 leading-normal"
                  defaultValue="Hola [first name], aún no ha comenzado sus beneficios de [group name]. Toma unos 15 minutos: [secure link]. Cierra el [window end]. Responda STOP para no recibir mensajes."
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[13px] text-[var(--color-text-muted)]">Merge fields:</span>
              <Tag variant="mute">[first name]</Tag>
              <Tag variant="mute">[group name]</Tag>
              <Tag variant="mute">[window end]</Tag>
              <Tag variant="mute">[secure link]</Tag>
              <Tag variant="mute">[account manager]</Tag>
            </div>
          </section>

          <section aria-labelledby="rules" className="card gap-3">
            <h2 id="rules" className="heading m-0 text-lg font-bold">
              Checks before saving
            </h2>
            <CheckRow label="Opt-out wording in every text" pass />
            <CheckRow label="No health or plan details in the text body" pass />
            <div className="flex justify-between gap-3">
              <span>Fits in 2 text segments</span>
              <Tag variant="warn">Spanish: 2 segments</Tag>
            </div>
            <div className="flex flex-wrap gap-2">
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

function CheckRow({ label, pass }: { label: string; pass?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      {pass ? <Tag variant="ok">Pass</Tag> : null}
    </div>
  );
}
