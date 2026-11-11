'use client';
/* Admin · Client firm detail: KPI tiles, workflows, notes, services, team, contacts. */
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { Avatar, Band, DueChip, EmptyState, KpiRow, KpiTile, RelTime, StatusBadge, toast, useBusy } from '@/components/ui';
import { WorkflowSheet } from '@/components/shared/WorkflowSheet';
import { FirmBadge, RoNote, useCan } from '@/components/admin/common';
import { FirmWizard } from '@/components/admin/FirmWizard';
import { ErrText, Field } from '@/components/admin/shell/kit';
import { AREAS } from '@/lib/data';
import { EMAIL_RE, diffDays, fmtD } from '@/lib/format';
import { allDeadlines, firmWfs, getWf, slaFor } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { AreaKey } from '@/lib/types';
import { togglePauseFirm, viewAsClient } from './firmActions';

export function ClientDetail() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(String(params?.id || ''));
  const router = useRouter();
  const exists = useApp(s => s.firms.some(f => f.id === id));

  useEffect(() => { if (!exists) router.replace('/admin/clients'); }, [exists, router]);
  if (!exists) return null;
  return <Detail key={id} id={id} />;
}

function Detail({ id }: { id: string }) {
  const router = useRouter();
  const s = useApp();
  const ed = useCan('clients');
  const x = s.firms.find(f => f.id === id)!;
  const [sheet, setSheet] = useState<string | null>(null);
  const [wizStep, setWizStep] = useState<number | null>(null);

  const wfs = [...firmWfs(s, x.id)].sort((a, b) => a.due.getTime() - b.due.getTime());
  const open = wfs.filter(w => w.status !== 'complete');
  const sla = slaFor(s, x.id);
  const week = allDeadlines(s).filter(d => getWf(s, d.wf)?.firm === x.id && !d.done && diffDays(d.date) >= 0 && diffDays(d.date) <= 6).length;
  const wfHref = `/admin/workflows?firm=${encodeURIComponent(x.id)}`;
  const team = [x.lead, ...x.team.filter(k => k !== x.lead)].filter(k => s.team[k]);

  return (
    <>
      <Band
        crumbs={
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link className="text-btn" style={{ color: 'inherit' }} href="/admin/clients"><Icon name="chevron-left" size={16} />Client firms</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{x.name}</span>
          </nav>
        }
        title={x.name}
        sub={<>{x.city} · Client since {fmtD(x.since)} · <FirmBadge status={x.status} /></>}
        actions={<>
          <button className="btn btn-primary btn-sm" type="button" onClick={() => viewAsClient(x.id, router)}><Icon name="eye" size={18} />View as client</button>
          {ed && <>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => setWizStep(1)}>Edit firm</button>
            <button className="btn btn-ghost btn-sm" type="button" id="firm-pause" onClick={() => { void togglePauseFirm(x.id); }}>{x.status === 'Paused' ? 'Reactivate' : 'Pause'}</button>
          </>}
        </>}
      >
        <KpiRow ariaLabel={`${x.name} summary`}>
          <KpiTile href={wfHref} label="Open workflows" value={open.length} foot="Manage this firm’s workflows" />
          <KpiTile href={`${wfHref}&status=at-risk`} label="At risk" value={open.filter(w => w.status === 'at-risk').length} foot="See at-risk work" />
          <KpiTile label="SLA on time" value={sla == null ? '—' : `${sla.toFixed(1)}%`} foot={sla == null ? 'Not enough data yet' : 'Open the client’s portal'} onClick={() => viewAsClient(x.id, router)} />
          <KpiTile href={wfHref} label="Deadlines in 7 days" value={week} foot="Review workflows by due date" />
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        {!ed && <RoNote feature="clients" />}
        <div className="detail-grid">
          <div className="stack-24">
            <section className="card" aria-labelledby="fdw-h">
              <div className="card-head">
                <div><h2 className="h4" id="fdw-h">Workflows</h2><p className="small">Everything Hyacinth is running for this firm</p></div>
                <Link className="btn btn-quiet btn-sm" href={wfHref}>Manage <Icon name="arrow-right" size={18} /></Link>
              </div>
              {wfs.length ? (
                <div className="row-list">
                  {wfs.map(w => (
                    <button type="button" className="row-item" key={w.id} onClick={() => setSheet(w.id)}>
                      <span className="mono">{w.id}</span>
                      <span>
                        <span className="row-title" style={{ display: 'block' }}>{w.title}</span>
                        <span className="row-sub" style={{ display: 'block' }}>{s.team[w.owner]?.name} · {AREAS[w.area]}</span>
                      </span>
                      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <StatusBadge status={w.status} />{w.status !== 'complete' && <DueChip date={w.due} />}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState icon="workflow" title="No workflows yet" text="Workflows appear here once the firm’s team starts work."
                  actions={<Link className="btn btn-ghost btn-sm" href="/admin/workflows">Go to workflows</Link>} />
              )}
            </section>

            <section className="card" aria-labelledby="fdn-h">
              <div className="card-head"><h2 className="h4" id="fdn-h">Notes</h2></div>
              <div className="card-body stack-16">
                {ed && <NoteForm firmId={x.id} />}
                <ol className="log">
                  {x.notes.length ? x.notes.map((n, i) => (
                    <li className="comment" key={`${n.at.getTime()}-${i}`}>
                      <Avatar name={n.who} />
                      <div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'baseline' }}><span className="who">{n.who}</span><span className="when"><RelTime date={n.at} /></span></div>
                        <p className="txt">{n.text}</p>
                      </div>
                    </li>
                  )) : <li className="small">No notes yet.</li>}
                </ol>
              </div>
            </section>
          </div>

          <div className="stack-24">
            <section className="card" aria-labelledby="fds-h">
              <div className="card-head">
                <h2 className="h4" id="fds-h">Enabled services</h2>
                {ed && <button className="btn btn-quiet btn-sm" type="button" aria-label="Edit enabled services" onClick={() => setWizStep(2)}>Edit</button>}
              </div>
              <ul className="card-body stack-8">
                {(Object.entries(AREAS) as [AreaKey, string][]).map(([k, v]) => (
                  <li className="person" style={{ whiteSpace: 'normal' }} key={k}>
                    {x.services.includes(k) ? <span className="badge st-complete"><Icon name="check" size={12} />On</span> : <span className="badge st-on-track">Off</span>}
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card" aria-labelledby="fdt-h">
              <div className="card-head">
                <h2 className="h4" id="fdt-h">Assigned team</h2>
                {ed && <button className="btn btn-quiet btn-sm" type="button" aria-label="Edit assigned team" onClick={() => setWizStep(3)}>Edit</button>}
              </div>
              <ul className="card-body team-list">
                {team.map((k, i) => (
                  <li className="person" key={k}>
                    <Avatar name={s.team[k].name} />
                    <span><b style={{ fontSize: 'var(--fs-14)' }}>{s.team[k].name}</b><span className="small" style={{ display: 'block' }}>{i === 0 ? 'Team lead · ' : ''}{s.team[k].role}</span></span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card" aria-labelledby="fdc-h">
              <div className="card-head"><h2 className="h4" id="fdc-h">Contacts</h2></div>
              <div className="card-body stack-16">
                <ul className="team-list">
                  {x.contacts.map((c, i) => (
                    <li className="person" style={{ whiteSpace: 'normal' }} key={`${c.email}-${i}`}>
                      <Avatar name={c.name} />
                      <span>
                        <b style={{ fontSize: 'var(--fs-14)' }}>{c.name}</b>{c.primary && <> <span className="mini-chip">Primary</span></>}
                        <span className="small" style={{ display: 'block' }}>{c.title || ''}{c.title ? ' · ' : ''}{c.email}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {ed && <ContactForm firmId={x.id} />}
              </div>
            </section>
          </div>
        </div>
      </div>

      <WorkflowSheet id={sheet} onClose={() => setSheet(null)} />
      <FirmWizard open={wizStep != null} mode="edit" firmId={x.id} startStep={wizStep || 1} onClose={() => setWizStep(null)} />
    </>
  );
}

function NoteForm({ firmId }: { firmId: string }) {
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [busy, run] = useBusy();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const v = text.trim();
    if (!v) { setErr('Write a note before adding it.'); document.getElementById('fn-text')?.focus(); return; }
    setErr('');
    run(() => {
      useApp.getState().addFirmNote(firmId, v);
      setText('');
      document.getElementById('fn-text')?.focus();
      toast('Note added.');
    });
  };
  return (
    <form className="stack-8" noValidate onSubmit={submit}>
      <label className="label" htmlFor="fn-text">Add a note</label>
      <textarea
        className="textarea" id="fn-text" aria-describedby="fn-text-err" aria-invalid={err ? true : undefined} value={text}
        placeholder="Context for the Hyacinth team. Clients don’t see notes." onChange={e => { setText(e.target.value); if (err && e.target.value.trim()) setErr(''); }}
      />
      <ErrText id="fn-text" msg={err} />
      <div><button className="btn btn-dark btn-sm" type="submit" id="fn-submit" aria-busy={busy || undefined} disabled={busy}>Add note</button></div>
    </form>
  );
}

function ContactForm({ firmId }: { firmId: string }) {
  const [v, setV] = useState({ name: '', email: '', title: '' });
  const [errs, setErrs] = useState<{ name?: string; email?: string }>({});
  const [busy, run] = useBusy();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const n = v.name.trim(), em = v.email.trim();
    const e1 = n.length < 2 ? 'Enter a name.' : '', e2 = EMAIL_RE.test(em) ? '' : 'Enter an email address in the format name@firm.com.';
    setErrs({ name: e1, email: e2 });
    if (e1 || e2) { document.getElementById(e1 ? 'fc-name' : 'fc-email')?.focus(); return; }
    run(() => {
      useApp.getState().addFirmContact(firmId, { name: n, email: em, title: v.title.trim() });
      setV({ name: '', email: '', title: '' });
      document.getElementById('fc-name')?.focus();
      toast(`${n} added to contacts.`);
    });
  };
  return (
    <form className="form-grid" noValidate onSubmit={submit} aria-label="Add a contact">
      <Field id="fc-name" label="Name" value={v.name} error={errs.name} onChange={t => { setV(x => ({ ...x, name: t })); if (errs.name && t.trim()) setErrs(x => ({ ...x, name: '' })); }} />
      <Field id="fc-email" label="Email" type="email" value={v.email} error={errs.email} onChange={t => { setV(x => ({ ...x, email: t })); if (errs.email && t.trim()) setErrs(x => ({ ...x, email: '' })); }} />
      <Field id="fc-title" label="Title" opt full value={v.title} onChange={t => setV(x => ({ ...x, title: t }))} />
      <div className="full"><button className="btn btn-ghost btn-sm" type="submit" id="fc-submit" aria-busy={busy || undefined} disabled={busy}><Icon name="plus" size={16} />Add contact</button></div>
    </form>
  );
}
