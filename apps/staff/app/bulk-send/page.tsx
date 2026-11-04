import Link from "next/link";
import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { Tag } from "@/components/ui/tag";

export default function BulkSendPage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <Link href="/inbox" className="no-underline">
          Inbox
        </Link>{" "}
        <span aria-hidden>/</span> New bulk message
      </nav>

      <header className="flex flex-col gap-1">
        <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
          New bulk message
        </h1>
        <p className="m-0 text-[var(--color-text-muted)]">
          Replies land in the shared inbox and on each person&apos;s record.
        </p>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-5">
          <section aria-labelledby="aud" className="card gap-3.5">
            <h2 id="aud" className="heading m-0 text-lg font-bold">
              1 · Who gets it
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[220px] flex-[1_1_220px]">
                Group
                <select className="field-in">
                  <option>Riverside Dental Group</option>
                </select>
              </label>
              <label className="field-label min-w-[220px] flex-[1_1_220px]">
                Filter
                <select className="field-in">
                  <option>Not yet enrolled</option>
                  <option>Started, not signed</option>
                  <option>Everyone eligible</option>
                  <option>Saved filter…</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="font-semibold">27 people</span>
              <Tag variant="ok">24 can be texted</Tag>
              <Tag variant="mute">2 email only</Tag>
              <Tag variant="warn">1 opted out of both — left out</Tag>
            </div>
          </section>

          <section aria-labelledby="msg" className="card gap-3.5">
            <h2 id="msg" className="heading m-0 text-lg font-bold">
              2 · Message
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[260px] flex-[2_1_260px]">
                Template
                <select className="field-in">
                  <option>Open enrollment reminder · not started</option>
                </select>
              </label>
              <label className="field-label min-w-[160px] flex-[1_1_160px]">
                Channel
                <select className="field-in">
                  <option>Text, email if no mobile</option>
                  <option>Text only</option>
                  <option>Email only</option>
                </select>
              </label>
            </div>
            <div role="tablist" aria-label="Language" className="flex gap-1">
              <button type="button" role="tab" aria-selected className="btn btn-secondary border-[var(--color-teal)] bg-[#E6F2F1] text-[#0B5953]">
                English
              </button>
              <button type="button" role="tab" aria-selected={false} className="btn btn-secondary">
                Spanish · sent to 9
              </button>
            </div>
            <label className="field-label">
              Text
              <textarea
                rows={4}
                className="field-in min-h-[100px] resize-y py-3 leading-normal"
                defaultValue="Hi [first name], Riverside Dental open enrollment closes [window end]. It takes about 15 minutes on your phone: [secure link] — Blackford. Reply STOP to opt out."
              />
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Tag variant="mute">[first name]</Tag>
              <Tag variant="mute">[window end]</Tag>
              <Tag variant="mute">[secure link]</Tag>
              <Tag variant="mute">[account manager]</Tag>
              <span className="self-center text-[var(--color-text-muted)]">
                142 characters · 1 text segment
              </span>
            </div>
          </section>

          <section aria-labelledby="when" className="card gap-3">
            <h2 id="when" className="heading m-0 text-lg font-bold">
              3 · When
            </h2>
            <label className="flex min-h-11 items-center gap-2.5">
              <input type="radio" name="when" defaultChecked className="h-5 w-5 accent-[var(--color-teal)]" />
              Now — anyone in quiet hours (9 PM–8 AM their time) gets it at 8 AM
            </label>
            <label className="flex min-h-11 items-center gap-2.5">
              <input type="radio" name="when" className="h-5 w-5 accent-[var(--color-teal)]" />
              Schedule for a date and time
            </label>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-5">
          <section aria-labelledby="prev" className="card gap-3">
            <h2 id="prev" className="heading m-0 text-lg font-bold">
              Preview for Tuan Nguyen
            </h2>
            <div className="max-w-[280px] self-start rounded-[16px_16px_16px_4px] bg-[#EEF1F5] px-3.5 py-3 leading-normal">
              Hi Tuan, Riverside Dental open enrollment closes Feb 28. It takes
              about 15 minutes on your phone: [secure enrollment link] —
              Blackford. Reply STOP to opt out.
            </div>
          </section>
          <section aria-labelledby="rules" className="card">
            <h2 id="rules" className="heading mb-1.5 m-0 text-lg font-bold">
              Applied automatically
            </h2>
            <RuleRow label="STOP and HELP replies" value={<Tag variant="ok">Handled</Tag>} />
            <RuleRow label="Opt-outs and no consent" value={<Tag variant="ok">Left out</Tag>} />
            <RuleRow label="Failed text or bounce" value="Other channel, then call task" />
            <RuleRow label="Delivery tracking" value="On each record" last />
          </section>
          <button type="button" className="btn btn-primary">
            Send to 26 people
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function RuleRow({
  label,
  value,
  last,
}: {
  label: string;
  value: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-3 py-2.5 ${last ? "" : "border-b border-[#EEF1F5]"}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
