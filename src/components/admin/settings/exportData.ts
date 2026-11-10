'use client';
/* CSV exports of the shared demo data (Settings → Data export, Audit log → Export CSV). */
import { openCsv } from '@/components/ui';
import { AREAS, STATUS } from '@/lib/data';
import { fmtD, fmtDT, iso, toCSV, today } from '@/lib/format';
import { firmName, firmWfs, slaFor } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { AuditEntry } from '@/lib/types';

export type ExportKey = 'clients' | 'workflows' | 'leads' | 'audit';

/** Builds the CSV, writes an Export audit entry and opens the CSV preview. Pass `auditRows` to export a filtered audit log. */
export function exportData(k: ExportKey, auditRows?: AuditEntry[]) {
  const s = useApp.getState(), tz = s.settings.tz;
  const staff = (key: string | null) => (key ? s.team[key]?.name || key : '');
  let name: string, rows: unknown[][];
  if (k === 'clients') {
    name = 'client-firms';
    rows = [['Firm', 'City', 'Status', 'Primary contact', 'Email', 'Services', 'Team lead', 'Open workflows', 'SLA on time (%)'],
      ...s.firms.map(f => {
        const sla = slaFor(s, f.id);
        return [f.name, f.city, f.status, f.contact.name, f.contact.email, f.services.map(a => AREAS[a]).join('; '), staff(f.lead), firmWfs(s, f.id).filter(w => w.status !== 'complete').length, sla == null ? '' : sla.toFixed(1)];
      })];
  } else if (k === 'workflows') {
    name = 'workflows';
    rows = [['ID', 'Workflow', 'Matter', 'Client', 'Service area', 'Owner', 'Status', 'Due'],
      ...s.workflows.map(w => [w.id, w.title, w.matter, firmName(s, w.firm), AREAS[w.area], staff(w.owner), STATUS[w.status], fmtD(w.due)])];
  } else if (k === 'leads') {
    name = 'leads';
    rows = [['ID', 'Name', 'Firm', 'Email', 'Phone', 'Area', 'Stage', 'Representative', 'Follow-up', 'Submitted'],
      ...s.leads.map(l => [l.id, l.name, l.firm, l.email, l.phone, l.area, l.status, staff(l.rep), l.followUp ? fmtDT(l.followUp, tz) : '', fmtDT(l.created, tz)])];
  } else {
    name = 'audit-log';
    rows = [['When', 'User', 'Role', 'Type', 'Action', 'Target'],
      ...(auditRows || s.audit).map(x => [fmtDT(x.at, tz), x.user, x.role, x.type, x.action, x.target])];
  }
  const label = name.replace('-', ' ');
  s.logAudit('Export', `Exported ${label} CSV`, label);
  openCsv(`Export ${label}`, `hyacinth-${name}-${iso(today())}.csv`, toCSV(rows));
}
