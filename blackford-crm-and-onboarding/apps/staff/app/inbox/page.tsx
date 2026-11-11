import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

export default function InboxPage() {
  return (
    <StaffShell>
      <PageHeader
        title="Shared inbox"
        description="Texts and emails from employees, HR contacts and individual clients. Replies are saved on each person's record."
        actions={
          <>
            <Link href="/templates" className="btn btn-secondary">
              Templates
            </Link>
            <Link href="/bulk-send" className="btn btn-primary">
              Bulk send
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-stretch gap-4">
        <section aria-label="Conversations" className="panel min-w-0 flex-[1_1_280px]">
          <div className="border-b border-divider p-2.5">
            <div role="group" aria-label="Inbox filter" className="segmented segmented-fill">
              <button type="button" aria-pressed="true">
                Unanswered <span className="pill-count">5</span>
              </button>
              <button type="button" aria-pressed="false">
                Mine
              </button>
              <button type="button" aria-pressed="false">
                All
              </button>
            </div>
          </div>
          <div className="divided">
            <ConvRow active unread initials="MD" name="Maria Delgado" time="9:12" sub="Riverside Dental · Text" preview="¿Puedo agregar a mi esposo después?" />
            <ConvRow unread initials="KB" name="Kevin Brooks" time="8:40" sub="Riverside Dental · Email" preview="Two new hires start Monday — census attached" />
            <ConvRow initials="HC" name="Helen Carter" time="Yesterday" sub="Medicare household · Text" preview="Need a new ID card, lost mine" />
            <ConvRow initials="DO" name="Derek Owens" time="Mon" sub="Riverside Dental · Text" preview="STOP" />
          </div>
        </section>

        <section
          aria-label="Conversation with Maria Delgado"
          className="panel min-w-0 flex-[3_1_440px]"
        >
          <div className="panel-head">
            <div className="flex items-center gap-3">
              <span className="avatar avatar-gold">MD</span>
              <div className="flex flex-col">
                <h2 className="section-title text-[19px]">Maria Delgado</h2>
                <span className="text-[13px] text-muted">
                  Text (555) 010-4821 · prefers Spanish · Eastern time
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-secondary btn-sm">
                Assign
              </button>
              <button type="button" className="btn btn-secondary btn-sm">
                Mark done
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 bg-ivory p-5">
            <div className="self-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Feb 1 · Automation 1
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="bubble bubble-out">
                Hola Maria, ya puede elegir sus beneficios de 2027 con Riverside
                Dental. Abra su enlace seguro: [link]
              </div>
              <span className="text-xs text-muted">Delivered · template “Invitación OE”</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="bubble bubble-in">
                Gracias, ya firmé. ¿Puedo agregar a mi esposo después de la fecha
                límite?
              </div>
              <span className="text-xs text-muted">Today 9:12</span>
            </div>
            <div className="flex items-center gap-2 self-center rounded-full border border-pale-gold bg-surface px-3 py-1 text-xs text-gold-deep">
              <span aria-hidden className="dot dot-gold-deep h-1.5 w-1.5" />
              Maria signed her election form · 9:05
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-divider px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <div role="group" aria-label="Channel" className="segmented">
                <button type="button" aria-pressed="true">
                  Text
                </button>
                <button type="button" aria-pressed="false">
                  Email
                </button>
              </div>
              <button type="button" className="btn btn-secondary btn-sm">
                Insert template
              </button>
              <span className="flex-1" />
              <Tag variant="ok">Text consent on file</Tag>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="sr-only">Message</span>
              <textarea
                rows={3}
                className="field-in"
                defaultValue="Sí, Maria. Si se casó o tuvo otro cambio de vida, tiene 30 días para agregarlo. Si no, puede agregarlo en la próxima inscripción abierta."
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[13px] text-muted">
                Texts carry a secure link, never health details.
              </span>
              <button type="button" className="btn btn-primary">
                Send text
              </button>
            </div>
          </div>
        </section>

        <aside aria-label="Client details" className="card min-w-0 flex-[1_1_240px] gap-1 self-start">
          <h2 className="section-title mb-2 text-[19px]">On her record</h2>
          <div className="divided">
            <Detail label="Group">
              <Link href="/groups/riverside-dental" className="font-semibold">
                Riverside Dental Group
              </Link>
            </Detail>
            <Detail label="Enrollment">
              <Tag variant="ok">Enrolled and signed</Tag>
            </Detail>
            <Detail label="Consent">Text: yes · Email: yes</Detail>
            <Detail label="Quiet hours">8 a.m.–8 p.m. her time</Detail>
            <Detail label="Open requests">None</Detail>
          </div>
          <button type="button" className="btn btn-secondary mt-3">
            Create service request
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function ConvRow({
  initials,
  name,
  time,
  sub,
  preview,
  active,
  unread,
}: {
  initials: string;
  name: string;
  time: string;
  sub: string;
  preview: string;
  active?: boolean;
  unread?: boolean;
}) {
  return (
    <Link
      href="#"
      aria-current={active ? "true" : undefined}
      className="list-row flex-row gap-3"
    >
      <span className={`avatar avatar-sm ${active ? "avatar-gold" : ""}`}>{initials}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-2">
          <span className={unread ? "font-semibold" : "font-medium"}>{name}</span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
            {time}
            {unread ? <span role="img" aria-label="Unanswered" className="dot dot-ruby h-2 w-2" /> : null}
          </span>
        </span>
        <span className="text-xs text-muted">{sub}</span>
        <span className={`truncate text-[14px] ${unread ? "text-ink" : "text-ink-soft"}`}>{preview}</span>
      </span>
    </Link>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 text-[14px]">
      <span className="label">{label}</span>
      <span>{children}</span>
    </div>
  );
}
