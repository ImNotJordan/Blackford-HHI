'use client';
/* Topbar bell + notifications popover (legacy #notif-pop). */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useApp } from '@/lib/store';
import { Icon } from '@/components/icons';
import { toast } from '@/components/ui';
import { openWf, usePortalUi } from './uiStore';
import { focusSoon, plural } from './common';

export function NotificationsButton() {
  const router = useRouter();
  const pathname = usePathname();
  const notifications = useApp(s => s.notifications);
  const unread = notifications.filter(n => n.unread).length;
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(pathname);
  if (path !== pathname) { setPath(pathname); setOpen(false); }
  const bellRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const close = (focusBell: boolean) => {
    setOpen(false);
    if (focusBell) bellRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => popRef.current?.querySelector<HTMLElement>('button:not([disabled]), a[href]')?.focus({ preventScroll: true }));
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !bellRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); bellRef.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey, true); };
  }, [open]);

  const onPopKey = (e: ReactKeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) || !popRef.current) return;
    const items = Array.from(popRef.current.querySelectorAll<HTMLElement>('.notif, .pop-head button:not([disabled])'));
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  };

  const readAll = () => {
    const n = unread;
    const undo = useApp.getState().readAllNotifications();
    focusSoon('#notif-pop .notif');
    toast(`Marked ${plural(n, 'notification')} as read.`, { undo });
  };

  const openOne = (id: string) => {
    const n = useApp.getState().notifications.find(x => x.id === id);
    if (!n) return;
    useApp.getState().readNotification(id);
    close(true);
    if (n.wf) openWf(n.wf);
    else if (n.route) router.push(n.route);
  };

  const toPrefs = () => {
    setOpen(false);
    if (pathname === '/portal/account') focusSoon('#pref-alerts');
    else usePortalUi.getState().set({ pendingFocus: '#pref-alerts' });
  };

  return (
    <>
      <button
        ref={bellRef} className="icon-btn" type="button" id="bell-btn" aria-expanded={open} aria-controls="notif-pop"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications, none unread'}
        onClick={() => (open ? close(true) : setOpen(true))}
      >
        <Icon name="bell" />
        <span className="bell-dot" id="bell-dot" aria-hidden="true" hidden={unread === 0}>{unread}</span>
      </button>
      <div ref={popRef} className={`pop${open ? ' is-open' : ''}`} id="notif-pop" role="dialog" aria-label="Notifications" hidden={!open} onKeyDown={onPopKey}>
        <div className="pop-head">
          <h2 className="h4">Notifications</h2>
          <button className="btn btn-quiet btn-sm" type="button" disabled={unread === 0} onClick={readAll}>Mark all as read</button>
        </div>
        <div className="notif-list" id="notif-list">
          {notifications.map(n => (
            <button key={n.id} type="button" className={`notif${n.unread ? ' unread' : ''}`} onClick={() => openOne(n.id)}>
              <span className="dot" aria-hidden="true" />
              <span><span className="n-text">{n.text}</span><span className="small">{n.time}{n.unread ? ' · Unread' : ''}</span></span>
            </button>
          ))}
        </div>
        <div className="pop-foot">
          <Link className="btn btn-quiet btn-sm" href="/portal/account" onClick={toPrefs}>Notification preferences</Link>
        </div>
      </div>
    </>
  );
}
