import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";

export default function InboxPage() {
  return (
    <StaffShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
          Shared inbox
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/templates" className="btn btn-secondary no-underline">
            Templates
          </Link>
          <Link href="/bulk-send" className="btn btn-primary no-underline">
            Bulk send
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-stretch gap-4">
        <section
          aria-label="Conversations"
          className="flex min-w-0 flex-[1_1_280px] flex-col rounded-xl border border-[var(--color-border)] bg-white"
        >
          <div
            role="group"
            aria-label="Inbox filter"
            className="flex gap-1 border-b border-[#EEF1F5] p-2.5"
          >
            <button
              type="button"
              aria-pressed
              className="min-h-9 flex-1 rounded-lg bg-[#E6F2F1] text-[13px] font-semibold text-[#0B5953]"
            >
              Unanswered 5
            </button>
            <button type="button" className="min-h-9 flex-1 rounded-lg text-[13px] text-[#3A4756]">
              Mine
            </button>
            <button type="button" className="min-h-9 flex-1 rounded-lg text-[13px] text-[#3A4756]">
              All
            </button>
          </div>
          <ConvRow active name="Maria Delgado" time="9:12" sub="Riverside Dental · Text" preview="¿Puedo agregar a mi esposo después?" />
          <ConvRow name="Kevin Brooks" time="8:40" sub="Riverside Dental · Email" preview="Two new hires start Monday — census attached" />
          <ConvRow name="Helen Carter" time="Yesterday" sub="Medicare household · Text" preview="Need a new ID card, lost mine" />
          <ConvRow name="Derek Owens" time="Mon" sub="Riverside Dental · Text" preview="STOP" last />
        </section>

        <section
          aria-label="Conversation with Maria Delgado"
          className="flex min-w-0 flex-[3_1_440px] flex-col rounded-xl border border-[var(--color-border)] bg-white"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F5] px-4 py-3.5">
            <div className="flex flex-col">
              <h2 className="heading m-0 text-[17px] font-bold">Maria Delgado</h2>
              <span className="text-xs text-[var(--color-text-muted)]">
                Text (555) 010-4821 · prefers Spanish · Eastern time
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                Assign
              </button>
              <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                Mark done
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3.5 bg-[#FAFBFC] p-4">
            <div className="self-center text-xs text-[var(--color-text-muted)]">
              Feb 1 · Automation 1
            </div>
            <div className="flex max-w-[75%] flex-col items-end gap-1 self-end">
              <div className="rounded-[14px_14px_4px_14px] bg-[var(--color-navy)] px-3.5 py-2.5 leading-snug text-white">
                Hola Maria, ya puede elegir sus beneficios de 2027 con Riverside
                Dental. Abra su enlace seguro: [link]
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Delivered · template “Invitación OE”
              </span>
            </div>
            <div className="flex max-w-[75%] flex-col gap-1 self-start">
              <div className="rounded-[14px_14px_14px_4px] bg-[#EEF1F5] px-3.5 py-2.5 leading-snug">
                Gracias, ya firmé. ¿Puedo agregar a mi esposo después de la
                fecha límite?
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)]">Today 9:12</span>
            </div>
            <div className="self-center rounded-full bg-[#E6F2F1] px-2.5 py-1 text-xs text-[var(--color-text-muted)]">
              Maria signed her election form · 9:05
            </div>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-[#EEF1F5] px-4 py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Channel"
                className="flex gap-1 rounded-lg bg-[var(--color-bg)] p-0.5"
              >
                <button type="button" aria-pressed className="min-h-8 rounded-md bg-white px-3 text-[13px] font-semibold">
                  Text
                </button>
                <button type="button" className="min-h-8 rounded-md px-3 text-[13px] text-[var(--color-text-muted)]">
                  Email
                </button>
              </div>
              <button type="button" className="btn btn-secondary min-h-9 px-3 text-[13px]">
                Insert template
              </button>
              <span className="tag tag-ok">Text consent on file</span>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="sr-only">Message</span>
              <textarea
                rows={3}
                className="rounded-[10px] border border-[#C5CED8] px-3 py-2.5 font-[inherit] resize-y"
                defaultValue="Sí, Maria. Si se casó o tuvo otro cambio de vida, tiene 30 días para agregarlo. Si no, puede agregarlo en la próxima inscripción abierta."
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[var(--color-text-muted)]">
                Texts carry a secure link, never health details.
              </span>
              <button type="button" className="btn btn-primary">
                Send text
              </button>
            </div>
          </div>
        </section>

        <aside
          aria-label="Client details"
          className="card min-w-0 flex-[1_1_240px] gap-3.5"
        >
          <h2 className="heading m-0 text-base font-bold">On her record</h2>
          <Detail label="Group">
            <Link href="/groups/riverside-dental" className="font-semibold">
              Riverside Dental Group
            </Link>
          </Detail>
          <Detail label="Enrollment">
            <span className="font-semibold">Enrolled and signed</span>
          </Detail>
          <Detail label="Consent">
            <span>Text: yes · Email: yes</span>
          </Detail>
          <Detail label="Quiet hours">
            <span>8 a.m.–8 p.m. her time</span>
          </Detail>
          <Detail label="Open requests">
            <span>None</span>
          </Detail>
          <button type="button" className="btn btn-secondary min-h-10">
            Create service request
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function ConvRow({
  name,
  time,
  sub,
  preview,
  active,
  last,
}: {
  name: string;
  time: string;
  sub: string;
  preview: string;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <Link
      href="#"
      aria-current={active}
      className={`flex gap-2.5 px-3.5 py-3.5 text-[var(--color-text)] no-underline ${
        active ? "border-l-[3px] border-[var(--color-teal)] bg-[#F2F8F7]" : ""
      } ${last ? "" : "border-b border-[#EEF1F5]"}`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex justify-between">
          <span className="font-bold">{name}</span>
          <span className="text-xs text-[var(--color-text-muted)]">{time}</span>
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">{sub}</span>
        <span className="truncate text-[13px] text-[#3A4756]">{preview}</span>
      </span>
    </Link>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      {children}
    </div>
  );
}
