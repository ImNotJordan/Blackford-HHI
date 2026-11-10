'use client';
/* Workflow detail slide-over (legacy renderDetail). Used by the client portal and by admin.
   Open when `id` is set; call onClose to close. Every change goes through the store and offers Undo. */
import { useEffect, useState, type FormEvent } from 'react';
import { useApp } from '@/lib/store';
import { AREAS } from '@/lib/data';
import { getWf, firmOf, firmName, typeLabel, staffOptions, deadlineMarkers } from '@/lib/selectors';
import { fmtD, sameDay, today } from '@/lib/format';
import { Icon } from '@/components/icons';
import { Sheet, StatusDropdown, DatePicker, Combobox, Avatar, RelTime, DueChip, toast, useBusy } from '@/components/ui';
import { FieldError, focusSoon, plural } from '@/components/portal/common';
import { changeStatus, archiveWithConfirm } from '@/components/portal/wfActions';
import type { Step } from '@/lib/types';

export interface WorkflowSheetProps { id: string | null; onClose(): void; initialFocus?: string }

export function WorkflowSheet({ id, onClose, initialFocus }: WorkflowSheetProps) {
  // Keep showing the last workflow while the sheet animates closed.
  const [lastId, setLastId] = useState(id);
  if (id && id !== lastId) setLastId(id);
  const shownId = id || lastId;
  const exists = useApp(s => !!shownId && s.workflows.some(w => w.id === shownId));

  // Archived or removed while open (including Undo of a create): close.
  useEffect(() => { if (id && !exists) onClose(); }, [id, exists, onClose]);

  return (
    <Sheet open={!!id && exists} onClose={onClose} labelledBy="sheet-title" initialFocus={initialFocus || '#sheet-close'}>
      {shownId && exists ? <SheetContent key={shownId} id={shownId} onClose={onClose} /> : null}
    </Sheet>
  );
}

function SheetContent({ id, onClose }: { id: string; onClose(): void }) {
  const s = useApp();
  const w = getWf(s, id)!;
  const firm = firmOf(s, w.firm);
  const done = w.steps.filter(x => x.done).length, n = w.steps.length, allDone = done === n;
  const complete = w.status === 'complete';
  const team = [w.owner, ...w.support.filter(k => k !== w.owner)].filter(k => s.team[k]);
  const pct = Math.round((done / n) * 100);

  /* reassign */
  const [owner, setOwner] = useState(w.owner);
  const [ownerBase, setOwnerBase] = useState(w.owner);
  if (ownerBase !== w.owner) { setOwnerBase(w.owner); setOwner(w.owner); }
  const [reBusy, runRe] = useBusy();
  const onReassign = (e: FormEvent) => {
    e.preventDefault();
    const cur = getWf(useApp.getState(), id);
    if (!cur || !owner) return;
    if (owner === cur.owner) { toast(`${s.team[owner].name} already owns this workflow.`, { icon: 'alert' }); return; }
    runRe(() => {
      const st = useApp.getState();
      const undo = st.reassignWorkflow(id, owner);
      focusSoon('#reassign-save');
      toast(`${id} reassigned to ${st.team[owner].name}.`, { icon: 'users', undo });
    });
  };

  /* comment */
  const [comment, setComment] = useState('');
  const [cErr, setCErr] = useState('');
  const [cBusy, runC] = useBusy();
  const onComment = (e: FormEvent) => {
    e.preventDefault();
    const v = comment.trim();
    const err = !v ? 'Write a comment before posting.' : v.length > 1000 ? 'Keep comments under 1,000 characters.' : '';
    setCErr(err);
    if (err) { document.getElementById('comment-text')?.focus(); return; }
    runC(() => {
      useApp.getState().addComment(id, v);
      setComment('');
      focusSoon('#comment-text');
      toast('Comment posted to the activity log.', { icon: 'message' });
    });
  };

  /* complete workflow */
  const [wBusy, runW] = useBusy();

  const onDue = (v: Date | null) => {
    if (!v) return;
    const st = useApp.getState(), cur = getWf(st, id);
    if (!cur || sameDay(cur.due, v)) return;
    const undo = st.setWorkflowDue(id, v);
    toast(`${id} now due ${fmtD(v)}.`, { icon: 'calendar', undo });
  };

  return (
    <>
      <div className="sheet-head on-ink">
        <div className="sheet-head-top">
          <div className="stack-8">
            <p className="eyebrow">{w.id} · {AREAS[w.area]}</p>
            <h2 className="h3" id="sheet-title">{w.title}</h2>
            <p className="small">{w.matter} · {typeLabel(s, w.type)}</p>
          </div>
          <button className="icon-btn" type="button" id="sheet-close" onClick={onClose} aria-label="Close workflow details"><Icon name="x" /></button>
        </div>
        <div className="prog" style={{ marginTop: 8 }}>
          <div className="prog-track" style={{ background: 'var(--ink-line)' }}><div className="prog-fill" style={{ width: `${pct}%`, background: 'var(--pale-gold)' }} /></div>
          <span>{done} of {n} steps complete</span>
        </div>
      </div>

      <div className="sheet-body">
        <section className="sheet-sec" aria-label="Summary">
          <div className="meta-grid">
            <div>
              <div className="lab">Status</div>
              <StatusDropdown id={`dst-${w.id}`} size="sm" ariaLabel={`Status for ${w.id}`} title={`Status for ${w.id}`} value={w.status} onChange={v => changeStatus(w.id, v)} />
            </div>
            <div className="field">
              <span className="lab" id="dd-due-l">Due</span>
              <DatePicker
                id={`dd-due-${w.id}`} labelId="dd-due-l" title="Due date" value={w.due} required
                min={complete ? null : today()} minReason="Due dates can’t be moved into the past."
                markers={deadlineMarkers(s, 'all')} onChange={onDue}
              />
              <div>{complete ? <span className="small">Completed</span> : <DueChip date={w.due} />}</div>
            </div>
            <div>
              <div className="lab">Owner</div>
              <span className="person"><Avatar name={s.team[w.owner]?.name || w.owner} />{s.team[w.owner]?.name || w.owner}</span>
            </div>
            <div>
              <div className="lab">Reviewing attorney</div>
              {w.attorney}
              <div className="small">{firmName(s, w.firm)}</div>
            </div>
          </div>
        </section>

        <section className="sheet-sec" aria-labelledby="steps-h">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h3 className="h4" id="steps-h">Steps</h3>
            <span className="small" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><span className="badge auto-badge"><Icon name="zap" size={12} />Automated</span>runs without staff time</span>
          </div>
          <ol className="steps">
            {w.steps.map((st, i) => <StepItem key={i} wfId={w.id} step={st} index={i} />)}
          </ol>
        </section>

        <section className="sheet-sec" aria-labelledby="tm-h">
          <h3 className="h4" id="tm-h">Assigned team</h3>
          <ul className="team-list">
            {team.map((k, i) => (
              <li className="person" key={k}>
                <Avatar name={s.team[k].name} />
                <span><b style={{ fontSize: 'var(--fs-14)' }}>{s.team[k].name}</b><span className="small" style={{ display: 'block' }}>{i === 0 ? 'Owner · ' : ''}{s.team[k].role}</span></span>
              </li>
            ))}
          </ul>
          <form className="inline-form" noValidate onSubmit={onReassign}>
            <div className="field">
              <span className="label" id="reassign-owner-l">Reassign owner</span>
              <Combobox id="reassign-owner" labelId="reassign-owner-l" title="New owner" value={owner} onChange={setOwner} options={staffOptions(s, firm?.team)} />
            </div>
            <button className="btn btn-dark" type="submit" id="reassign-save" aria-busy={reBusy || undefined} disabled={reBusy}>Save owner</button>
          </form>
        </section>

        <section className="sheet-sec" aria-labelledby="act-h">
          <h3 className="h4" id="act-h">Activity</h3>
          <form className="stack-8" noValidate onSubmit={onComment}>
            <label className="label" htmlFor="comment-text">Add a comment</label>
            <textarea
              className="textarea" id="comment-text" value={comment}
              onChange={e => { setComment(e.target.value); if (cErr && e.target.value.trim()) setCErr(''); }}
              aria-describedby="comment-text-err" aria-invalid={cErr ? true : undefined}
              placeholder="Share context or instructions with the Hyacinth team"
            />
            <FieldError id="comment-text-err" msg={cErr} />
            <div>
              <button className="btn btn-dark btn-sm" type="submit" id="comment-submit" aria-busy={cBusy || undefined} disabled={cBusy}><Icon name="send" size={16} />Post comment</button>
            </div>
          </form>
          <ol className="log" aria-label="Activity log, newest first">
            {w.log.map((e, i) => (
              <li key={`${e.at.getTime()}-${i}`} className={e.kind === 'comment' ? 'comment' : undefined}>
                {e.sys ? <span className="avatar sys" aria-hidden="true"><Icon name="zap" size={14} /></span> : <Avatar name={e.who} />}
                <div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}>
                    <span className="who">{e.who}</span>
                    <span className="when"><RelTime date={e.at} /></span>
                    {e.kind === 'comment' ? <span className="when">· Comment</span> : null}
                  </div>
                  <p className="txt">{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="sheet-foot">
        <button className="btn btn-quiet" type="button" id="sheet-archive" onClick={() => { void archiveWithConfirm(w.id, onClose); }}><Icon name="archive" size={18} />Archive</button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {allDone || complete ? null : <span className="small" id="complete-hint">{plural(n - done, 'step')} remaining</span>}
          {complete
            ? <span className="badge st-complete" style={{ height: 36, padding: '0 14px', fontSize: 'var(--fs-14)' }}><Icon name="check" size={16} />Workflow complete</span>
            : (
              <button
                className="btn btn-primary" type="button" id="sheet-complete"
                disabled={!allDone || wBusy} aria-busy={wBusy || undefined} aria-describedby={allDone ? undefined : 'complete-hint'}
                onClick={() => runW(() => changeStatus(id, 'complete'))}
              >Mark workflow complete</button>
            )}
        </div>
      </div>
    </>
  );
}

function StepItem({ wfId, step, index }: { wfId: string; step: Step; index: number }) {
  const [busy, run] = useBusy();
  const act = (auto: boolean) => run(() => {
    const st = useApp.getState(), w = getWf(st, wfId);
    if (!w || w.steps[index]?.done) return;
    const r = st.completeStep(wfId, index, { auto });
    let msg = auto ? `“${step.title}” ran.` : `“${step.title}” marked complete.`;
    if (r.reviewed) msg = 'Review recorded. Status set to On track.';
    const after = getWf(useApp.getState(), wfId);
    if (r.allDone && after && after.status !== 'complete') msg += ' All steps are done.';
    const next = after ? after.steps.findIndex(x => !x.done) : -1;
    focusSoon(next >= 0 ? `#step-${next}` : '#sheet-complete:not([disabled])', '#steps-h');
    toast(msg, { undo: r.undo });
  });
  const s = step;
  return (
    <li className={`step${s.auto ? ' auto' : ''}${s.done ? ' done' : ''}`}>
      <span className="step-mark" aria-hidden="true">{s.done ? <Icon name="check" size={14} /> : index + 1}</span>
      <div>
        <p className="step-title">{s.title}<span className="sr-only">, {s.done ? 'completed' : 'not completed'}</span></p>
        <p className="step-meta">
          {s.auto ? <span className="badge auto-badge"><Icon name="zap" size={12} />Automated</span> : null}
          {s.review ? <span className="badge st-review"><Icon name="eye" size={12} />Attorney review</span> : null}
          <span>{s.done ? `Completed by ${s.by} · ${fmtD(s.at)}` : s.auto ? 'Queued. Runs automatically.' : 'Not started'}</span>
        </p>
        {s.done ? null : (
          <div className="step-actions">
            {s.auto
              ? <button className="btn btn-ghost btn-sm" type="button" id={`step-${index}`} aria-busy={busy || undefined} disabled={busy} onClick={() => act(true)}><Icon name="zap" size={16} />Run now</button>
              : <button className="btn btn-dark btn-sm" type="button" id={`step-${index}`} aria-busy={busy || undefined} disabled={busy} onClick={() => act(false)}><Icon name="check" size={16} />{s.review ? 'Record review' : 'Mark complete'}</button>}
          </div>
        )}
      </div>
    </li>
  );
}
