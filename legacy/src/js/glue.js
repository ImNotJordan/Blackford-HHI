/* Hyacinth Legal Support · Firm-scoped reports, shared-link filters, KPI tiles */
'use strict';
/* =========================================================
   Glue: firm-scoped reports, shared-link filters
   ========================================================= */
function repFor(i) {
  const r = REPORTS[i], f = pFirm();
  if (!f || f.id === 'cw') return r;
  const s = f.scale || 0.3, sc = v => Math.max(1, Math.round(v * s));
  const areas = r.areas.filter(a => f.services.includes(a[0])).map(([a, op, cp, ot]) => [a, sc(op), sc(cp), ot]);
  const raised = sc(r.exRaised);
  return { ...r, areas, completed: sum(areas.map(a => a[2])), exRaised: raised, exResolved: Math.min(raised, sc(r.exResolved)), onTime: f.sla != null ? f.sla : r.onTime };
}
const repMonthVal = i => { const k = REPORTS[i].key; return { y: +k.slice(0, 4), m: +k.slice(5, 7) - 1 }; };
const repIdxFor = (y, m) => REPORTS.slice(0, REPORT_COUNT).findIndex(r => r.key === `${y}-${String(m + 1).padStart(2, '0')}`);
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a) return;
  const h = a.getAttribute('href');
  if (h === '#admin-clients') state.admin.clientId = null;
  const reset = { q: '', firms: [], areas: [], statuses: [], owner: 'all', due: null };
  if (a.dataset.adStatus) { Object.assign(state.admin.wf, reset, { statuses: a.dataset.adStatus === 'all' ? [] : a.dataset.adStatus === 'at-risk' ? ['at-risk', 'blocked'] : [a.dataset.adStatus] }); state.admin.wfTab = 'all'; }
  if (a.dataset.adFirm) { Object.assign(state.admin.wf, reset, { firms: [a.dataset.adFirm] }); state.admin.wfTab = 'all'; }
}, true);

/* =========================================================
   KPI tiles: one component for every summary strip
   ========================================================= */
function kpiTile(t) {
  const inner = `<span class="kpi-label">${t.label}</span><span class="kpi-value">${t.value}</span><span class="kpi-foot"><span>${t.foot}</span>${icon('arrow-right', 18)}</span>`;
  if (t.href) return `<a class="kpi" href="${t.href}" ${t.attrs || ''}>${inner}</a>`;
  return `<button type="button" class="kpi" ${t.id ? `id="${t.id}"` : ''} data-action="${t.action}" ${t.attrs || ''} ${t.pressed != null ? `aria-pressed="${!!t.pressed}"` : ''}>${inner}</button>`;
}
const kpiRow = items => items.map(kpiTile).join('');
const refocus = id => { const b = document.getElementById(id); if (b) b.focus({ preventScroll: true }); };
Object.assign(ACTIONS, {
  'kpi-wf': btn => { state.wf.status = btn.dataset.s; wfUpdate(); refocus(btn.id); announce(btn.dataset.s === 'all' ? 'Showing all workflows' : `Showing ${STATUS[btn.dataset.s].toLowerCase()} workflows`); },
  'kpi-dl': btn => {
    const k = btn.dataset.k;
    state.dl.day = null;
    if (k === 'week') { state.dl.mode = 'week'; state.dl.anchor = weekStart(TODAY); }
    if (k === 'month') { state.dl.mode = 'month'; state.dl.anchor = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); }
    if (k === 'risk') state.dl.riskOnly = !state.dl.riskOnly;
    dlUpdate(); refocus(btn.id);
    announce(k === 'risk' ? (state.dl.riskOnly ? 'Showing at-risk deadlines only' : 'Showing all deadlines') : `Showing this ${k}`);
  },
  'kpi-aw': btn => {
    const k = btn.dataset.k;
    if (k === 'templates') { state.admin.wfTab = 'templates'; }
    else { state.admin.wfTab = 'all'; Object.assign(state.admin.wf, { q: '', firms: [], areas: [], owner: 'all', due: null, statuses: k === 'open' ? ['on-track', 'at-risk', 'review', 'blocked'] : [k] }); }
    renderAdminView('admin-workflows', { focus: false }); refocus(btn.id);
  },
  'kpi-us': btn => { const u = state.admin.users; u.status = u.status === btn.dataset.s ? 'all' : btn.dataset.s; AVIEWS['admin-users'].update(); refocus(btn.id); announce(u.status === 'all' ? 'Showing all users' : `Showing ${u.status.toLowerCase()} users`); },
  'kpi-au': btn => {
    const k = btn.dataset.k, a = state.admin.audit;
    if (k === 'people') { const t = $('#au-user'); if (t) { t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); t.focus(); ddOpen('au-user'); } return; }
    if (k === 'all') { ACTIONS['au-clear'](); }
    if (k === 'today') { a.range = a.range && sameDay(a.range.start, TODAY) && sameDay(a.range.end, TODAY) ? null : { start: TODAY, end: TODAY, preset: 'today' }; ddSet('au-range', a.range); auTable(); }
    AVIEWS['admin-audit'].update(); refocus(btn.id);
  },
  'kpi-scroll': btn => {
    const el = $(btn.dataset.target); if (!el) return;
    el.setAttribute('tabindex', '-1');
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    el.focus({ preventScroll: true });
  }
});
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-ad-firm-status]');
  if (a) state.admin.wf.statuses = [a.dataset.adFirmStatus];
}, false);
