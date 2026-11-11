/* Non-visual helpers shared with the UI kit (safe to import anywhere). */
import { diffDays } from '@/lib/format';
import type { IconName } from '@/components/icons';

/** Due-date chip rules: Overdue (Ruby icon), Due today (Gold outline), Due in 1–3 days (Parchment), Later (neutral). */
export function dueChipInfo(date: Date, done?: boolean): { cls: string; text: string; icon: IconName | null } {
  if (done) return { cls: 'due-done', text: 'Done', icon: 'check' };
  const n = diffDays(date);
  if (n < 0) return { cls: 'due-over', text: `Overdue · ${-n} ${n === -1 ? 'day' : 'days'}`, icon: 'alert' };
  if (n === 0) return { cls: 'due-today', text: 'Due today', icon: 'clock' };
  if (n <= 3) return { cls: 'due-soon', text: `Due in ${n} ${n === 1 ? 'day' : 'days'}`, icon: 'clock' };
  return { cls: 'due-later', text: `Due in ${n} days`, icon: null };
}
