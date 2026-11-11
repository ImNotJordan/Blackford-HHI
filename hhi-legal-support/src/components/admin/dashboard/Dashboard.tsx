'use client';
/* Admin · Dashboard: KPI tiles, workload by service area, at-risk items, recent activity, new leads. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Avatar, Band, DueChip, EmptyState, HBarChart, KpiRow, KpiTile, RelTime, StatusBadge, toast } from '@/components/ui';
import { WorkflowSheet } from '@/components/shared/WorkflowSheet';
import { RoNote, useCan } from '@/components/admin/common';
import { FirmWizard } from '@/components/admin/FirmWizard';
import { ReassignModal, type ReassignTarget } from '@/components/admin/workflows/ReassignModal';
import { AREAS } from '@/lib/data';
import { diffDays, fmtD, greeting, relText, today } from '@/lib/format';
import { allDeadlines, allOpen, allSla, firmName, firmOf } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { AreaKey } from '@/lib/types';

const GOLD = 'var(--gold)';
const OTHER = 'color-mix(in srgb,var(--warm-gray) 45%,var(--white))';
export const AT_RISK_HREF = '/admin/workflows?status=at-risk,blocked';

export function Dashboard() {
  const router = useRouter();
  const s = useApp();
  const canWf = useCan('workflows');
  const canClients = useCan('clients');
  const [table, setTable] = useState(false);
  const [sheet, setSheet] = useState<string | null>(null);
  const [reassign, setReassign] = useState<ReassignTarget | null>(null);
  const [wizard, setWizard] = useState(false);

  const open = allOpen(s);
  const riskDl = allDeadlines(s).filter(d => !d.done && d.atRisk && diffDays(d.date) >= 0);
  const sla = allSla(s);
  const weekLeads = s.leads.filter(l => diffDays(l.created) >= -6);
  const newLeads = s.leads.filter(l => l.status === 'New');
  const rows = (Object.entries(AREAS) as [AreaKey, string][]).map(([k, label]) => {
    const o = open.filter(w => w.area === k);
    const risk = o.filter(w => w.status === 'at-risk' || w.status === 'blocked').length;
    return { label, risk, other: o.length - risk, total: o.length };
  });
  const atRisk = open.filter(w => w.status === 'at-risk' || w.status === 'blocked').sort((a, b) => a.due.getTime() - b.due.getTime());

  const escalate = (id: string) => {
    const st = useApp.getState(), w = st.workflows.find(x => x.id === id);
    if (!w) return;
    const was = !!w.escalated;
    const undo = st.toggleEscalation(id);
    const lead = firmOf(st, w.firm)?.lead;
    toast(was ? `${id} is no longer escalated.` : `${id} escalated to ${lead ? st.team[lead].name : 'the engagement lead'}.`, { icon: 'flag', undo });
  };

  return (
    <>
      <Band
        eyebrow={`Hyacinth admin · ${fmtD(today())}`}
        title={`Good ${greeting()}, ${(s.admin.name || 'there').split(' ')[0]}.`}
        sub="Operations across every client firm, in one view."
        actions={<>
          {canClients && <button className="btn btn-primary btn-sm" type="button" onClick={() => setWizard(true)}><Icon name="plus" size={18} />Add client firm</button>}
          <Link className="btn btn-ghost btn-sm" href="/admin/leads"><Icon name="inbox" size={18} />Open leads</Link>
        </>}
      >
        <KpiRow cols={5} ariaLabel="Operations summary">
          <KpiTile href="/admin/clients" label="Active client firms" value={s.firms.filter(f => f.status === 'Active').length} foot={`${s.firms.filter(f => f.status === 'Onboarding').length} onboarding`} />
          <KpiTile href="/admin/workflows" label="Open workflows, all clients" value={open.length} foot={`${open.filter(w => w.status === 'at-risk').length} at risk`} />
          <KpiTile href={AT_RISK_HREF} label="Deadlines at risk" value={riskDl.length} foot="Flagged and upcoming" />
          <KpiTile href="/admin/clients" label="SLA on time, all clients" value={sla == null ? '—' : `${sla.toFixed(1)}%`} foot="Average across firms" />
          <KpiTile href="/admin/leads" label="New leads this week" value={weekLeads.length} foot={`${newLeads.length} not yet contacted`} />
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        <div className="ov-grid">
          <section className="card" aria-labelledby="wl-h">
            <div className="card-head">
              <div><h2 className="h4" id="wl-h">Workload by service area</h2><p className="small">Open workflows across all client firms</p></div>
              <button className="btn btn-quiet btn-sm" type="button" id="ad-chart-table" aria-pressed={table} onClick={() => setTable(v => !v)}>
                <Icon name="list" size={18} />{table ? 'Chart view' : 'Table view'}
              </button>
            </div>
            <div className="card-body">
              {table ? (
                <div className="table-wrap" tabIndex={0} role="region" aria-label="Workload by service area table" style={{ borderTop: 0 }}>
                  <table className="mini-table">
                    <thead><tr><th scope="col">Service area</th><th scope="col">At risk or blocked</th><th scope="col">Other open</th><th scope="col">Total</th></tr></thead>
                    <tbody>{rows.map(r => <tr key={r.label}><td>{r.label}</td><td>{r.risk}</td><td>{r.other}</td><td><b>{r.total}</b></td></tr>)}</tbody>
                  </table>
                </div>
              ) : (
                <HBarChart
                    ariaLabel="Workload by service area"
                    summary={`${rows.map(r => `${r.label}: ${r.total} open, ${r.risk} at risk or blocked`).join('. ')}.`}
                    rows={rows.map(r => ({
                      label: r.label, valueText: String(r.total),
                      segments: [{ name: 'At risk or blocked', value: r.risk, color: GOLD }, { name: 'Other open', value: r.other, color: OTHER }],
                      tip: [{ label: 'At risk or blocked', value: r.risk }, { label: 'Other open', value: r.other }]
                    }))}
                  />
              )}
            </div>
          </section>

          <section className="card" aria-labelledby="ar-h">
            <div className="card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 className="h4" id="ar-h" tabIndex={-1}>At-risk items</h2>
                <span className="count-badge">{atRisk.length}</span>
              </div>
              <Link className="btn btn-quiet btn-sm" href={AT_RISK_HREF}>All at-risk <Icon name="arrow-right" size={18} /></Link>
            </div>
            {atRisk.length ? (
              <>
                <div className="ex-list">
                  {atRisk.map(w => (
                    <article className="ex" key={w.id} aria-labelledby={`art-${w.id}`}>
                      <span className={`sev${w.status === 'at-risk' ? ' high' : ''}`}><Icon name={w.status === 'at-risk' ? 'alert' : 'block'} size={16} /></span>
                      <div>
                        <h3 className="ex-title" id={`art-${w.id}`}>{w.title}</h3>
                        <p className="ex-meta">
                          <span>{firmName(s, w.firm)}</span><span aria-hidden="true">·</span><span className="mono">{w.id}</span>
                          <span aria-hidden="true">·</span><span>{s.team[w.owner]?.name}</span>
                        </p>
                        <p className="ex-meta">
                          <StatusBadge status={w.status} /><DueChip date={w.due} />
                          {w.escalated && <span className="mini-chip"><Icon name="flag" size={12} />&nbsp;Escalated</span>}
                        </p>
                        <div className="ex-actions">
                          <button className="btn btn-dark btn-sm" type="button" onClick={() => setSheet(w.id)}><Icon name="eye" size={16} />Open</button>
                          {canWf && <>
                            <button className="btn btn-ghost btn-sm" type="button" id={`arr-${w.id}`} onClick={() => setReassign({ wf: w.id })}><Icon name="users" size={16} />Reassign</button>
                            <button className="btn btn-ghost btn-sm" type="button" id={`are-${w.id}`} aria-pressed={!!w.escalated} onClick={() => escalate(w.id)}>
                              <Icon name="flag" size={16} />{w.escalated ? 'Escalated' : 'Escalate'}
                            </button>
                          </>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {!canWf && <div style={{ padding: '0 24px 16px' }}><RoNote feature="workflows" /></div>}
              </>
            ) : (
              <EmptyState icon="check" title="Nothing at risk" text="No workflow is at risk or blocked across any client firm."
                actions={<Link className="btn btn-ghost btn-sm" href="/admin/workflows">Review all workflows</Link>} />
            )}
          </section>
        </div>

        <div className="ov-grid b">
          <section className="card" aria-labelledby="af-h">
            <div className="card-head">
              <div><h2 className="h4" id="af-h">Recent activity</h2><p className="small">Latest entries in the audit log</p></div>
              <Link className="btn btn-quiet btn-sm" href="/admin/audit">Audit log <Icon name="arrow-right" size={18} /></Link>
            </div>
            <ul className="feed">
              {s.audit.length ? s.audit.slice(0, 7).map(a => (
                <li key={a.id}>
                  {a.user === 'Website' ? <span className="avatar" aria-hidden="true"><Icon name="inbox" size={14} /></span> : <Avatar name={a.user} />}
                  <div>
                    <p><b>{a.user}</b> · {a.action}</p>
                    <p className="small">{a.type} · {a.target} · <RelTime date={a.at} /></p>
                  </div>
                </li>
              )) : <li>No activity yet.</li>}
            </ul>
          </section>

          <section className="card" aria-labelledby="nl-h">
            <div className="card-head">
              <div><h2 className="h4" id="nl-h">New leads</h2><p className="small">From the website contact form</p></div>
              <Link className="btn btn-quiet btn-sm" href="/admin/leads">Pipeline <Icon name="arrow-right" size={18} /></Link>
            </div>
            {newLeads.length ? (
              <div className="row-list">
                {newLeads.map(l => (
                  <Link key={l.id} className="row-item" href={`/admin/leads?lead=${encodeURIComponent(l.id)}`}>
                    <Avatar name={l.name} />
                    <span>
                      <span className="row-title" style={{ display: 'block' }}>{l.name}</span>
                      <span className="row-sub" style={{ display: 'block' }}>{l.firm} · {l.area} · {relText(l.created)}</span>
                    </span>
                    <Icon name="chevron-right" size={18} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon="inbox" title="No new leads" text="Every website submission has been contacted."
                actions={<Link className="btn btn-ghost btn-sm" href="/admin/leads">Open the pipeline</Link>} />
            )}
          </section>
        </div>
      </div>

      <WorkflowSheet id={sheet} onClose={() => setSheet(null)} />
      <ReassignModal target={reassign} onClose={() => setReassign(null)} />
      <FirmWizard open={wizard} mode="create" onClose={() => setWizard(false)} onDone={() => router.push('/admin/clients')} />
    </>
  );
}
