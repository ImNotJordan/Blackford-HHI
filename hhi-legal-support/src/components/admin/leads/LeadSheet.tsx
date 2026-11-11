'use client';
/* Lead detail slide-over: stage, representative, follow-up, submitted info, notes, activity, convert to client. */
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { Avatar, Combobox, DateTimePicker, RelTime, Select, Sheet, toast, useBusy } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { FieldErr, copyText, useTz } from '@/components/admin/settings/formKit';
import { LEAD_STAGES } from '@/lib/data';
import { fmtDT, today } from '@/lib/format';
import { firmName, staffOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { Lead, LeadStage } from '@/lib/types';

const STAGE_OPTS = LEAD_STAGES.map(x => ({ value: x, label: x }));

interface LeadSheetProps {
  lead: Lead | null;
  onClose(): void;
  onStage(id: string, stage: LeadStage): void;
  onConvert(lead: Lead): void;
}

export function LeadSheet({ lead, onClose, onStage, onConvert }: LeadSheetProps) {
  return (
    <Sheet open={!!lead} onClose={onClose} labelledBy="sheet-title" initialFocus="#sheet-close">
      {lead ? <LeadBody key={lead.id} lead={lead} onClose={onClose} onStage={onStage} onConvert={onConvert} /> : null}
    </Sheet>
  );
}

function LeadBody({ lead: l, onClose, onStage, onConvert }: { lead: Lead } & Omit<LeadSheetProps, 'lead'>) {
  const s = useApp();
  const tz = useTz();
  const ed = useCan('leads');
  const canClients = useCan('clients');
  const [note, setNote] = useState('');
  const [noteErr, setNoteErr] = useState<string | null>(null);
  const [busy, run] = useBusy();
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const won = l.status === 'Won';

  const setRep = (v: string) => {
    if (!v || v === l.rep) return;
    const undo = s.setLeadRep(l.id, v);
    toast(`${l.name} assigned to ${s.team[v]?.name || v}.`, { undo });
  };
  const setFollowUp = (v: Date | null) => {
    if ((v?.getTime() ?? null) === (l.followUp?.getTime() ?? null)) return;
    const undo = s.setLeadFollowUp(l.id, v);
    toast(v ? `Follow-up set for ${fmtDT(v, tz)}.` : 'Follow-up cleared.', { icon: 'calendar', undo });
  };
  const addNote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = note.trim();
    if (!v) { setNoteErr('Write a note before adding it.'); noteRef.current?.focus(); return; }
    setNoteErr(null);
    run(() => {
      useApp.getState().addLeadNote(l.id, v);
      setNote('');
      noteRef.current?.focus();
      toast('Note added.');
    });
  };

  const info: [string, string][] = [['Name', l.name], ['Firm', l.firm], ['Email', l.email], ['Phone', l.phone], ['Area', l.area], ['Bottleneck', l.msg || 'Not provided']];

  return (
    <>
      <div className="sheet-head on-ink">
        <div className="sheet-head-top">
          <div className="stack-8">
            <p className="eyebrow">{l.id} · Lead</p>
            <h2 className="h3" id="sheet-title">{l.name}</h2>
            <p className="small">{l.firm} · Submitted {fmtDT(l.created, tz)}</p>
          </div>
          <button className="icon-btn" type="button" id="sheet-close" onClick={onClose} aria-label="Close lead details"><Icon name="x" /></button>
        </div>
      </div>
      <div className="sheet-body">
        {ed ? null : <div className="sheet-sec"><RoNote feature="leads" /></div>}
        <section className="sheet-sec" aria-label="Pipeline">
          <div className="meta-grid">
            <div className="field">
              <span className="lab" id="ld-stage-l">Stage</span>
              <Select id="ld-stage" labelId="ld-stage-l" title="Stage" value={l.status} disabled={!ed} options={STAGE_OPTS} onChange={v => onStage(l.id, v as LeadStage)} />
            </div>
            <div className="field">
              <span className="lab" id="ld-rep-l">Assigned representative</span>
              <Combobox id="ld-rep" labelId="ld-rep-l" title="Representative" placeholder="Unassigned" value={l.rep || ''} disabled={!ed} options={staffOptions(s)} onChange={setRep} />
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <span className="lab" id="ld-fu-l">Follow-up call</span>
              <DateTimePicker id="ld-fu" labelId="ld-fu-l" title="Follow-up call" value={l.followUp} disabled={!ed} min={today()} minReason="Follow-ups can’t be scheduled in the past." onChange={setFollowUp} />
            </div>
          </div>
        </section>
        <section className="sheet-sec" aria-labelledby="ls-h">
          <h3 className="h4" id="ls-h">Submitted information</h3>
          <dl className="dl-list">
            {info.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}{k === 'Email' ? <> <button className="text-btn" type="button" onClick={() => copyText(v)} aria-label={`Copy email ${v}`}>Copy</button></> : null}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="sheet-sec" aria-labelledby="lnn-h">
          <h3 className="h4" id="lnn-h">Notes</h3>
          {ed ? (
            <form className="stack-8" onSubmit={addNote} noValidate>
              <label className="sr-only" htmlFor="ln-text">Add a note</label>
              <textarea
                ref={noteRef} className="textarea" id="ln-text" aria-describedby="ln-text-err" aria-invalid={noteErr ? true : undefined}
                placeholder="What did you learn on the call?" value={note}
                onChange={e => { setNote(e.target.value); if (noteErr && e.target.value.trim()) setNoteErr(null); }}
              />
              <FieldErr id="ln-text" msg={noteErr} />
              <div><button className="btn btn-dark btn-sm" type="submit" id="ln-submit" disabled={busy} aria-busy={busy || undefined}>Add note</button></div>
            </form>
          ) : null}
          <ol className="log">
            {l.notes.length ? l.notes.map((n, i) => (
              <li className="comment" key={`${n.at.getTime()}-${i}`}>
                <Avatar name={n.who} />
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="who">{n.who}</span><span className="when"><RelTime date={n.at} /></span></div>
                  <p className="txt">{n.text}</p>
                </div>
              </li>
            )) : <li className="small" style={{ display: 'block' }}>No notes yet.</li>}
          </ol>
        </section>
        <section className="sheet-sec" aria-labelledby="lla-h">
          <h3 className="h4" id="lla-h">Activity</h3>
          <ol className="log">
            {l.log.map((e, i) => (
              <li key={`${e.at.getTime()}-${i}`}>
                {e.sys ? <span className="avatar sys" aria-hidden="true"><Icon name="inbox" size={14} /></span> : <Avatar name={e.who} />}
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="who">{e.who}</span><span className="when"><RelTime date={e.at} /></span></div>
                  <p className="txt">{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <div className="sheet-foot">
        {l.convertedFirm ? (
          <>
            <span className="badge st-complete" style={{ height: 32 }}><Icon name="check" size={14} />Converted to {firmName(s, l.convertedFirm)}</span>
            <Link className="btn btn-dark" href={`/admin/clients/${l.convertedFirm}`}>Open client firm</Link>
          </>
        ) : (
          <>
            <span className="small" id="conv-hint">{won ? (canClients ? 'Ready to convert into a client firm.' : 'Converting needs “Manage client firms”.') : 'Move the lead to Won to convert it.'}</span>
            <button className="btn btn-primary" type="button" id="ld-convert" disabled={!(won && canClients)} aria-describedby="conv-hint" onClick={() => onConvert(l)}>Convert to client</button>
          </>
        )}
      </div>
    </>
  );
}
