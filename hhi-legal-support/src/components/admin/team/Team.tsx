'use client';
/* Admin · Team & capacity: KPI tiles, staff table with capacity bars, capacity list, member + reassign modals. */
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { ActionMenu, Avatar, Band, KpiRow, KpiTile, confirmDialog, toast } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { scrollToSection } from '@/components/admin/shell/kit';
import { ReassignModal, type ReassignTarget } from '@/components/admin/workflows/ReassignModal';
import { sum } from '@/lib/format';
import { activeStaff, workload } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { Staff } from '@/lib/types';
import { MemberModal } from './MemberModal';

function CapBar({ load, cap }: { load: number; cap: number }) {
  const over = load > cap;
  return (
    <div className={`cap${over ? ' over' : ''}`}>
      <div className="cap-track" aria-hidden="true"><div className="cap-fill" style={{ width: `${Math.min(100, (load / cap) * 100)}%` }} /></div>
      <span>
        {over && <Icon name="alert" size={14} />}
        {load} of {cap} in use{over ? ` · over by ${load - cap}` : load === cap ? ' · at capacity' : ` · ${cap - load} open`}
      </span>
    </div>
  );
}

export function Team() {
  const s = useApp();
  const ed = useCan('team');
  const [member, setMember] = useState<string | null>(null);
  const [reassign, setReassign] = useState<ReassignTarget | null>(null);

  const act = activeStaff(s);
  const over = act.filter(([k, t]) => workload(s, k) > t.capacity).length;
  const slots = sum(act.map(([k, t]) => Math.max(0, t.capacity - workload(s, k))));
  const ranked = act.map(([k, t]) => ({ k, t, l: workload(s, k) })).sort((a, b) => b.l / b.t.capacity - a.l / a.t.capacity);

  const reactivate = (k: string, t: Staff) => {
    const undo = useApp.getState().setMemberActive(k, true);
    toast(`${t.name} is active again.`, { undo });
  };
  const deactivate = async (k: string, t: Staff) => {
    const ok = await confirmDialog({
      title: `Deactivate ${t.name}?`,
      body: `${t.name} will no longer appear in owner and representative lists. Their ${workload(s, k)} open workflows keep their owner until you reassign them.`,
      confirmLabel: 'Deactivate', danger: true
    });
    if (!ok) return;
    const undo = useApp.getState().setMemberActive(k, false);
    toast(`${t.name} deactivated.`, { undo });
  };

  return (
    <>
      <Band
        eyebrow="Operations" title="Team & capacity" sub="Who is on which client, how much work they hold, and where there is room."
        actions={ed ? <button className="btn btn-primary btn-sm" type="button" onClick={() => setMember('new')}><Icon name="plus" size={18} />Add team member</button> : null}
      >
        <KpiRow cols={3} ariaLabel="Team summary">
          <KpiTile label="Active staff" value={act.length} foot="Go to the staff list" onClick={() => scrollToSection('tm-h')} />
          <KpiTile label="Over capacity" value={over} foot={over ? 'Reassign work' : 'Nobody is over'} onClick={() => scrollToSection('cap-h')} />
          <KpiTile label="Open slots" value={slots} foot="See who has room" onClick={() => scrollToSection('cap-h')} />
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        {!ed && <RoNote feature="team" />}
        <section className="card" aria-labelledby="tm-h">
          <div className="card-head"><div><h2 className="h4" id="tm-h">Staff</h2><p className="small">Workload counts open workflows across every client</p></div></div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Staff table">
            <table className="data" style={{ minWidth: 920 }}>
              <thead>
                <tr>
                  <th scope="col">Name</th><th scope="col">Role</th><th scope="col">Assigned clients</th><th scope="col">Workload</th>
                  <th scope="col">Capacity</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(s.team).map(([k, t]) => {
                  const clients = s.firms.filter(f => f.team.includes(k) || f.lead === k);
                  const load = workload(s, k), inactive = t.active === false;
                  return (
                    <tr key={k}>
                      <td>
                        <span className="person"><Avatar name={t.name} /><span><b>{t.name}</b><span className="cell-sub" style={{ display: 'block' }}>{t.email}</span></span></span>
                      </td>
                      <td>{t.role}<div className="cell-sub">{t.access}</div></td>
                      <td>
                        <div className="chips-inline">
                          {clients.length ? clients.map(f => <span className="mini-chip" key={f.id}>{f.name.split(/[ &]/)[0]}</span>) : <span className="small">None</span>}
                        </div>
                      </td>
                      <td className="tnum">{load}</td>
                      <td><CapBar load={load} cap={t.capacity} /></td>
                      <td>{inactive ? <span className="badge st-blocked">Inactive</span> : <span className="badge st-complete"><Icon name="check" size={12} />Active</span>}</td>
                      <td>
                        <ActionMenu
                          id={`tmm-${k}`} label={`More actions for ${t.name}`}
                          items={[
                            { label: 'Edit team member', icon: 'file', disabled: !ed, onSelect: () => setMember(k) },
                            { label: 'Reassign work', icon: 'users', disabled: !ed || !load, onSelect: () => setReassign({ from: k }) },
                            'separator',
                            inactive
                              ? { label: 'Reactivate', icon: 'refresh', disabled: !ed, onSelect: () => reactivate(k, t) }
                              : { label: 'Deactivate', icon: 'block', danger: true, disabled: !ed, onSelect: () => { void deactivate(k, t); } }
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" aria-labelledby="cap-h">
          <div className="card-head"><div><h2 className="h4" id="cap-h">Capacity</h2><p className="small">Most loaded first. Reassign work from anyone over capacity.</p></div></div>
          <div className="row-list">
            {ranked.map(({ k, t, l }) => (
              <div className="row-item" key={k} style={{ gridTemplateColumns: 'auto minmax(0,1fr) auto' }}>
                <Avatar name={t.name} />
                <span style={{ display: 'grid', gap: 6 }}>
                  <span className="row-title">{t.name} <span className="small">· {t.role}</span></span>
                  <CapBar load={l} cap={t.capacity} />
                </span>
                {ed && l > 0 && (
                  <button className="btn btn-ghost btn-sm" type="button" id={`tmr-${k}`} aria-label={`Reassign work from ${t.name}`} onClick={() => setReassign({ from: k })}>Reassign</button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <MemberModal member={member} onClose={() => setMember(null)} />
      <ReassignModal target={reassign} onClose={() => setReassign(null)} />
    </>
  );
}
