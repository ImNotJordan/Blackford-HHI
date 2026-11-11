/* Date, time-zone and display formatting rules, used everywhere.
   Default `Nov 2, 2026`; with time `Nov 2, 2026 · 3:30 PM CT`; ranges `Nov 1 – Nov 30, 2026`. */
import type { TzKey, MonthValue } from './types';

export const DAY = 864e5;
export const TZS: Record<TzKey, { id: string; name: string }> = {
  CT: { id: 'America/Chicago', name: 'Central Time' },
  ET: { id: 'America/New_York', name: 'Eastern Time' },
  MT: { id: 'America/Denver', name: 'Mountain Time' },
  PT: { id: 'America/Los_Angeles', name: 'Pacific Time' }
};
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Today at local midnight. A function, not a constant, so it is computed in the browser. */
export const today = () => startOf(new Date());
export const addDays = (n: number, base: Date = today()) => { const d = new Date(base); d.setDate(d.getDate() + n); return d; };
export const at = (dayOffset: number, hour = 10, min = 0) => { const d = addDays(dayOffset); d.setHours(hour, min, 0, 0); return d; };
export const addMonths = (d: Date, n: number) => { const t = new Date(d.getFullYear(), d.getMonth() + n, 1); const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); t.setDate(Math.min(d.getDate(), last)); return t; };
export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const diffDays = (d: Date) => Math.round((startOf(d).getTime() - today().getTime()) / DAY);
export const weekStart = (d: Date) => addDays(-((d.getDay() + 6) % 7), startOf(d));
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseISO = (v: string) => { const [y, m, dd] = v.split('-').map(Number); return new Date(y, m - 1, dd); };
export const initials = (n: string) => n.split(/\s+/).filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);
export const fmtD = (d: Date | null | undefined) => d ? fmt(d, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
export const fmtAxis = (d: Date) => fmt(d, { month: 'short', day: 'numeric' });
export const fmtLong = (d: Date) => fmt(d, { weekday: 'long', month: 'long', day: 'numeric' });
export const fmtMonth = (d: Date) => fmt(d, { month: 'long', year: 'numeric' });
export const fmtTime = (d: Date, tz: TzKey) => `${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZS[tz].id })} ${tz}`;
export const fmtDT = (d: Date | null | undefined, tz: TzKey) => d ? `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZS[tz].id })} · ${fmtTime(d, tz)}` : '';
export function fmtRange(a: Date | null | undefined, b?: Date | null) {
  if (!a) return '';
  const e = b || a;
  if (sameDay(a, e)) return fmtD(a);
  const sy = a.getFullYear() === e.getFullYear();
  return `${fmt(a, sy ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' })} – ${fmtD(e)}`;
}
export const monthLabel = (v: MonthValue | null | undefined) => v ? fmtMonth(new Date(v.y, v.m, 1)) : '';
export function relText(d: Date) {
  const m = Math.round((Date.now() - d.getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 60 * 24 && sameDay(d, new Date())) return `${Math.round(m / 60)}h ago`;
  const days = Math.round((today().getTime() - startOf(d).getTime()) / DAY);
  if (days <= 0) return `${Math.max(1, Math.round(m / 60))}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return fmtD(d);
}
export function relDue(d: Date) {
  const n = diffDays(d);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `Due in ${n} days`;
  if (n === -1) return '1 day overdue';
  return `${-n} days overdue`;
}
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; };

/* ---------- Time zones ---------- */
export function tzParts(d: Date, tz: TzKey) {
  const o: Record<string, number> = {};
  new Intl.DateTimeFormat('en-US', { timeZone: TZS[tz].id, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(d).forEach(p => { if (p.type !== 'literal') o[p.type] = +p.value; });
  return { year: o.year, month: o.month, day: o.day, hour: o.hour % 24, minute: o.minute };
}
/** Builds the Date for a wall-clock time in the given business time zone. */
export function wallToDate(y: number, m: number, d: number, h: number, mi: number, tz: TzKey) {
  const guess = Date.UTC(y, m, d, h, mi);
  const p = tzParts(new Date(guess), tz);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(guess - (asUTC - guess));
}

/* ---------- Typed date input: returns null (empty) or undefined (invalid) ---------- */
export function parseDateText(raw: string): Date | null | undefined {
  const s = String(raw || '').replace(/[,·]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  let y: number, m: number, d: number, x: RegExpMatchArray | null;
  if ((x = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { y = +x[1]; m = +x[2] - 1; d = +x[3]; }
  else if ((x = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) { m = +x[1] - 1; d = +x[2]; y = +x[3]; if (y < 100) y += 2000; }
  else if ((x = s.match(/^([A-Za-z]{3,9})\.? (\d{1,2}) (\d{4})$/))) { m = MONTHS.indexOf(x[1].slice(0, 3).toLowerCase()); d = +x[2]; y = +x[3]; }
  else if ((x = s.match(/^(\d{1,2}) ([A-Za-z]{3,9})\.? (\d{4})$/))) { d = +x[1]; m = MONTHS.indexOf(x[2].slice(0, 3).toLowerCase()); y = +x[3]; }
  else return undefined;
  if (m < 0 || m > 11) return undefined;
  const dt = new Date(y, m, d);
  if (dt.getMonth() !== m || dt.getDate() !== d) return undefined;
  return dt;
}
export function parseDateTimeText(raw: string, tz: TzKey): Date | null | undefined {
  const s = String(raw || '').replace(/\b(CT|ET|MT|PT|CST|CDT|EST|EDT|MST|MDT|PST|PDT)\b/gi, '').trim();
  if (!s) return null;
  const tm = s.match(/(\d{1,2}):(\d{2})\s*([ap]\.?\s?m\.?)?/i);
  let datePart = s, h = 9, mi = 0;
  if (tm && tm.index != null) {
    datePart = (s.slice(0, tm.index) + ' ' + s.slice(tm.index + tm[0].length)).replace(/\bat\b|@/gi, ' ');
    h = +tm[1]; mi = +tm[2];
    if (tm[3]) { const pm = /p/i.test(tm[3]); if (h > 12) return undefined; if (h === 12) h = pm ? 12 : 0; else if (pm) h += 12; }
    if (h > 23 || mi > 59) return undefined;
  }
  const d = parseDateText(datePart);
  if (!d) return undefined;
  return wallToDate(d.getFullYear(), d.getMonth(), d.getDate(), h, mi, tz);
}
export const niceStep = (raw: number) => { if (raw <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(raw))); const n = raw / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const digits = (v: string) => (v.match(/\d/g) || []).length;
export const csvCell = (v: unknown) => /[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? '');
export const toCSV = (rows: unknown[][]) => rows.map(r => r.map(csvCell).join(',')).join('\n');
