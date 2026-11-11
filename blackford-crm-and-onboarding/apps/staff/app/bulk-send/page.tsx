import type { ReactNode } from "react";
import { StaffShell } from "@/components/staff-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

const MERGE_FIELDS = ["[first name]", "[window end]", "[secure link]", "[account manager]"];

export default function BulkSendPage() {
  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Inbox", href: "/inbox" }, { label: "New bulk message" }]}
        title="New bulk message"
        description="Replies land in the shared inbox and on each person's record."
      />

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-5">
          <Step n={1} id="aud" title="Who gets it">
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[220px]">
                Group
                <select className="field-in">
                  <option>Riverside Dental Group</option>
                </select>
              </label>
              <label className="field-label min-w-[220px]">
                Filter
                <select className="field-in">
                  <option>Not yet enrolled</option>
                  <option>Started, not signed</option>
                  <option>Everyone eligible</option>
                  <option>Saved filter…</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-ivory px-3.5 py-3 text-[14px]">
              <span className="mr-1 font-semibold">27 people</span>
              <Tag variant="ok">24 can be texted</Tag>
              <Tag variant="mute">2 email only</Tag>
              <Tag variant="warn">1 opted out of both — left out</Tag>
            </div>
          </Step>

          <Step n={2} id="msg" title="Message">
            <div className="flex flex-wrap gap-3">
              <label className="field-label min-w-[260px] flex-[2_1_260px]">
                Template
                <select className="field-in">
                  <option>Open enrollment reminder · not started</option>
                </select>
              </label>
              <label className="field-label min-w-[160px]">
                Channel
                <select className="field-in">
                  <option>Text, email if no mobile</option>
                  <option>Text only</option>
                  <option>Email only</option>
                </select>
              </label>
            </div>
            <div role="tablist" aria-label="Language" className="segmented self-start">
              <button type="button" role="tab" aria-selected="true">
                English
              </button>
              <button type="button" role="tab" aria-selected="false">
                Spanish · sent to 9
              </button>
            </div>
            <label className="field-label">
              Text
              <textarea
                rows={4}
                className="field-in min-h-[110px]"
                defaultValue="Hi [first name], Riverside Dental open enrollment closes [window end]. It takes about 15 minutes on your phone: [secure link] — Blackford. Reply STOP to opt out."
              />
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[13px] text-muted">Insert:</span>
              {MERGE_FIELDS.map((f) => (
                <button key={f} type="button" className="merge-field cursor-pointer hover:border-ink">
                  {f}
                </button>
              ))}
              <span className="ml-auto font-mono text-xs text-muted">
                142 characters · 1 text segment
              </span>
            </div>
          </Step>

          <Step n={3} id="when" title="When">
            <div className="flex flex-col">
              <label className="check-row">
                <input type="radio" name="when" defaultChecked />
                Now — anyone in quiet hours (9 PM–8 AM their time) gets it at 8 AM
              </label>
              <label className="check-row">
                <input type="radio" name="when" />
                Schedule for a date and time
              </label>
            </div>
          </Step>
        </div>

        <aside className="sticky top-8 flex min-w-0 flex-[2_1_300px] flex-col gap-5">
          <section aria-labelledby="prev" className="card">
            <h2 id="prev" className="section-title">
              Preview for Tuan Nguyen
            </h2>
            <div className="rounded-lg bg-ivory p-4">
              <div className="bubble bubble-in max-w-[300px]">
                Hi Tuan, Riverside Dental open enrollment closes Feb 28. It takes
                about 15 minutes on your phone: [secure enrollment link] —
                Blackford. Reply STOP to opt out.
              </div>
            </div>
          </section>
          <section aria-labelledby="rules" className="card gap-1">
            <h2 id="rules" className="section-title mb-1">
              Applied automatically
            </h2>
            <div className="divided">
              <RuleRow label="STOP and HELP replies" value={<Tag variant="ok">Handled</Tag>} />
              <RuleRow label="Opt-outs and no consent" value={<Tag variant="ok">Left out</Tag>} />
              <RuleRow label="Failed text or bounce" value="Other channel, then call task" />
              <RuleRow label="Delivery tracking" value="On each record" />
            </div>
          </section>
          <button type="button" className="btn btn-primary min-h-12">
            Send to 26 people
          </button>
        </aside>
      </div>
    </StaffShell>
  );
}

function Step({
  n,
  id,
  title,
  children,
}: {
  n: number;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="card">
      <div className="flex items-center gap-3">
        <span aria-hidden className="avatar avatar-sm avatar-ink font-mono">
          {n}
        </span>
        <h2 id={id} className="section-title">
          <span className="sr-only">Step {n}: </span>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function RuleRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
      <span>{label}</span>
      <span className="text-right text-ink-soft">{value}</span>
    </div>
  );
}
