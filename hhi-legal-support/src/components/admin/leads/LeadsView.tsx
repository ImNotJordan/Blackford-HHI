'use client';
/* Admin · Leads: KPI tiles, six-stage pipeline board (drag and drop for mouse, stage menu for keyboard/touch), lead sheet via ?lead=ID. */
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { Icon } from '@/components/icons';
import { Band, KpiRow, KpiTile, RelTime, Select, toast } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { FirmWizard } from '@/components/admin/FirmWizard';
import { scrollFocus, useTz } from '@/components/admin/settings/formKit';
import { LEAD_STAGES } from '@/lib/data';
import { DAY, fmtDT, startOf, today } from '@/lib/format';
import { useApp, type FirmInput } from '@/lib/store';
import type { AreaKey, Lead, LeadStage } from '@/lib/types';
import { LeadSheet } from './LeadSheet';

const STAGE_OPTS = LEAD_STAGES.map(x => ({ value: x, label: x }));
const colId = (s: LeadStage) => `bc-${s.replace(/\s/g, '')}`;
const AREA_SERVICES: Record<string, AreaKey[]> = { 'Client Operations': ['cx'], 'Legal Support': ['lo'], 'Business Operations': ['fa'] };
/** Leads whose "new" highlight has already played this session (the flash runs once, like the legacy board). */
const seenNew = new Set<string>();

type Prefill = Partial<FirmInput> & { leadId?: string };

export function LeadsView() {
  const leads = useApp(s => s.leads);
  const team = useApp(s => s.team);
  const tz = useTz();
  const ed = useCan('leads');
  const router = useRouter();
  const params = useSearchParams();
  const leadId = params.get('lead');
  const open = leadId ? leads.find(l => l.id === leadId) || null : null;

  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [dropStage, setDropStage] = useState<LeadStage | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const drag = useRef<string | null>(null);

  // Mark highlighted new leads as seen once they have rendered.
  useEffect(() => { leads.forEach(l => { if (l.isNew) seenNew.add(l.id); }); }, [leads]);
  // Unknown ?lead= id: drop it from the URL.
  useEffect(() => { if (leadId && !open) router.replace('/admin/leads', { scroll: false }); }, [leadId, open, router]);

  const openLead = (id: string) => router.push(`/admin/leads?lead=${encodeURIComponent(id)}`, { scroll: false });
  const closeLead = () => router.replace('/admin/leads', { scroll: false });

  const moveLead = (id: string, stage: LeadStage, refocus = false) => {
    const l = useApp.getState().leads.find(x => x.id === id);
    if (!l || l.status === stage) return;
    const undo = useApp.getState().setLeadStage(id, stage);
    toast(`${l.name} moved to ${stage}.`, { undo });
    if (refocus) requestAnimationFrame(() => document.getElementById(`lst-${id}`)?.focus());
  };

  const convert = (l: Lead) => {
    setPrefill({
      name: l.firm === 'Firm not provided' ? '' : l.firm,
      contact: { name: l.name, email: l.email, phone: l.phone },
      services: AREA_SERVICES[l.area] || [],
      lead: l.rep || '',
      leadId: l.id
    });
    closeLead();
  };

  /* drag and drop (mouse) */
  const onDragStart = (e: DragEvent, id: string) => {
    drag.current = id;
    setDragging(id);
    try { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; } catch { /* ignore */ }
  };
  const endDrag = () => { drag.current = null; setDragging(null); setDropStage(null); };
  const onDragOver = (e: DragEvent, stage: LeadStage) => {
    if (!drag.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropStage !== stage) setDropStage(stage);
  };
  const onDragLeave = (e: DragEvent<HTMLElement>, stage: LeadStage) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    if (dropStage === stage) setDropStage(null);
  };
  const onDrop = (e: DragEvent, stage: LeadStage) => {
    const id = drag.current;
    if (!id) return;
    e.preventDefault();
    endDrag();
    moveLead(id, stage);
  };

  const t0 = today().getTime();
  const weekCount = leads.filter(l => (t0 - startOf(l.created).getTime()) / DAY <= 6).length;
  const openCount = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  const wonCount = leads.filter(l => l.status === 'Won').length;

  return (
    <>
      <Band
        eyebrow="Growth" title="Leads" sub="Submissions from the website contact form, by pipeline stage."
        actions={<Link className="btn btn-ghost btn-sm" href="/#contact"><Icon name="arrow-right" size={18} />Open the website form</Link>}
      >
        <KpiRow cols={3} ariaLabel="Lead summary">
          <KpiTile label="New this week" value={weekCount} foot="Go to New" onClick={() => scrollFocus(colId('New'))} />
          <KpiTile label="Open pipeline" value={openCount} foot="New through Proposal" onClick={() => scrollFocus(colId('Contacted'))} />
          <KpiTile label="Won" value={wonCount} foot="Ready to convert" onClick={() => scrollFocus(colId('Won'))} />
        </KpiRow>
      </Band>
      <div className="wrap pcontent">
        {ed
          ? <p className="small">Drag a card to another stage, or change its stage from the menu on the card. Website submissions appear in New right away.</p>
          : <RoNote feature="leads" />}
        <div className="board" role="list" aria-label="Lead pipeline">
          {LEAD_STAGES.map(stage => {
            const items = leads.filter(l => l.status === stage);
            return (
              <section
                key={stage} className={`bcol${dropStage === stage ? ' is-drop' : ''}`} role="listitem" data-stage={stage} aria-labelledby={colId(stage)}
                onDragOver={e => onDragOver(e, stage)} onDragLeave={e => onDragLeave(e, stage)} onDrop={e => onDrop(e, stage)}
              >
                <div className="bcol-head"><h2 className="h4" id={colId(stage)}>{stage}</h2><span className="count-badge">{items.length}</span></div>
                <div className="bcol-body">
                  {items.length ? items.map(l => (
                    <article
                      key={l.id} className={`lcard${l.isNew && !seenNew.has(l.id) ? ' is-new' : ''}${dragging === l.id ? ' is-dragging' : ''}`}
                      draggable={ed} data-lead={l.id} aria-labelledby={`lc-${l.id}`}
                      onDragStart={ed ? e => onDragStart(e, l.id) : undefined} onDragEnd={ed ? endDrag : undefined}
                    >
                      <div>
                        <button type="button" className="wf-link" id={`lc-${l.id}`} onClick={() => openLead(l.id)}>{l.name}</button>
                        <div className="small">{l.firm}</div>
                      </div>
                      <div className="lcard-meta"><span className="mini-chip">{l.area}</span><RelTime date={l.created} /></div>
                      {l.followUp ? <div className="lcard-meta"><Icon name="calendar" size={14} />Follow-up {fmtDT(l.followUp, tz)}</div> : null}
                      {l.convertedFirm ? <div className="lcard-meta"><span className="badge st-complete"><Icon name="check" size={12} />Converted</span></div> : null}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                        <span className="small">{l.rep ? team[l.rep]?.name || l.rep : 'Unassigned'}</span>
                        {ed
                          ? <Select id={`lst-${l.id}`} size="sm" ariaLabel={`Stage for ${l.name}`} title={`Stage for ${l.name}`} value={l.status} options={STAGE_OPTS} onChange={v => moveLead(l.id, v as LeadStage, true)} />
                          : <span className="mini-chip">{l.status}</span>}
                      </div>
                    </article>
                  )) : <p className="bcol-empty">No leads in this stage.</p>}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <LeadSheet lead={open} onClose={closeLead} onStage={(id, st) => moveLead(id, st)} onConvert={convert} />
      <FirmWizard
        open={!!prefill} onClose={() => setPrefill(null)} mode="create" startStep={1} prefill={prefill || undefined}
        onDone={() => { setPrefill(null); router.push('/admin/clients'); }}
      />
    </>
  );
}
