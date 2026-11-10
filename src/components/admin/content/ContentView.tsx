'use client';
/* Admin · Website content: editor bound to the shared draft, live preview, publish/discard, unsaved-changes guard. */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { Band, RelTime, confirmDialog, toast, useBusy } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { FieldErr, focusLater } from '@/components/admin/settings/formKit';
import { CE_GROUPS } from '@/lib/data';
import { EMAIL_RE } from '@/lib/format';
import { useApp } from '@/lib/store';

type CeItem = [string, string, boolean?];
const ceId = (k: string) => `ce-${k.replace('.', '-')}`;
const isGroup = (it: CeItem | CeItem[]): it is CeItem[] => Array.isArray(it[0]);

export function ContentView() {
  const content = useApp(s => s.content);
  const draft = useApp(s => s.contentDraft);
  const publishedAt = useApp(s => s.contentPublishedAt);
  const ed = useCan('content');
  const router = useRouter();
  const pathname = usePathname();
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, run] = useBusy();
  const publishRef = useRef<HTMLButtonElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  /* Unsaved-changes guard: in-app links and page unload. */
  useEffect(() => {
    if (!dirty) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === pathname) return;
      e.preventDefault();
      e.stopPropagation();
      const href = url.pathname + url.search + url.hash;
      confirmDialog({ title: 'Leave without publishing?', body: 'You have unpublished changes to the website content. Leaving discards them.', confirmLabel: 'Discard and leave', danger: true }).then(ok => {
        if (!ok) { if (publishRef.current && !publishRef.current.disabled) publishRef.current.focus(); return; }
        useApp.getState().discardDraft();
        router.push(href);
        toast('Unpublished changes discarded.', { icon: 'refresh' });
      });
    };
    const onUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    document.addEventListener('click', onClick, true);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [dirty, pathname, router]);

  const change = (k: string, v: string) => {
    useApp.getState().setDraft(k, v);
    if (errs[k] && v.trim()) setErrs(p => { const next = { ...p }; delete next[k]; return next; });
  };

  const discard = () => {
    confirmDialog({ title: 'Discard unpublished changes?', body: 'The editor goes back to the content that is live on the website now.', confirmLabel: 'Discard changes', danger: true }).then(ok => {
      if (!ok) return;
      const undo = useApp.getState().discardDraft();
      setErrs({});
      toast('Changes discarded.', { icon: 'refresh', undo });
    });
  };

  const publish = () => {
    const d = useApp.getState().contentDraft;
    const empty = Object.keys(d).find(k => !String(d[k]).trim());
    if (empty) { setErrs({ [empty]: 'This field can’t be empty.' }); focusLater(ceId(empty)); return; }
    if (!EMAIL_RE.test(d['rep.email'])) { setErrs({ 'rep.email': 'Enter an email address in the format name@firm.com.' }); focusLater(ceId('rep.email')); return; }
    setErrs({});
    run(() => {
      useApp.getState().publishContent();
      toast('Published. The website is updated.', { action: { label: 'View website', onClick: () => router.push('/') } });
    }, 700);
  };

  const field = ([k, label, long]: CeItem) => {
    const id = ceId(k), err = errs[k];
    const common = { id, value: draft[k] ?? '', disabled: !ed, 'aria-describedby': `${id}-err`, 'aria-invalid': err ? true : undefined } as const;
    return (
      <div className="field" key={k}>
        <label className="label" htmlFor={id}>{label}</label>
        {long
          ? <textarea className="textarea" rows={3} {...common} onChange={e => change(k, e.target.value)} />
          : <input className="input" {...common} type={k === 'rep.email' ? 'email' : 'text'} onChange={e => change(k, e.target.value)} />}
        <FieldErr id={id} msg={err} />
      </div>
    );
  };

  const e = (k: string) => draft[k] ?? '';

  return (
    <>
      <Band
        eyebrow="Website" title="Website content" sub="Edit the marketing site’s key copy. Publishing updates the website right away."
        actions={<Link className="btn btn-ghost btn-sm" href="/"><Icon name="eye" size={18} />View website</Link>}
      />
      <div className="wrap pcontent">
        {ed ? null : <RoNote feature="content" />}
        <div className="ce">
          <section className="card" aria-label="Content editor">
            <div className="ce-bar">
              <span className="state" aria-live="polite">
                {dirty
                  ? <span className="badge st-review"><Icon name="eye" size={12} />Unsaved changes</span>
                  : <><span className="badge st-complete"><Icon name="check" size={12} />Published</span><span className="small">Last published <RelTime date={publishedAt} /></span></>}
              </span>
              <button className="btn btn-ghost btn-sm" type="button" id="ce-discard" onClick={discard} disabled={!(dirty && ed) || busy}>Discard changes</button>
              <button ref={publishRef} className="btn btn-primary btn-sm" type="button" id="ce-publish" onClick={publish} disabled={!(dirty && ed) || busy} aria-busy={busy || undefined}>Publish</button>
            </div>
            <form className="ce-form" noValidate onSubmit={ev => { ev.preventDefault(); if (dirty && ed) publish(); }}>
              <div style={{ padding: '16px 24px 0' }}>
                <p className="legal-note callout" style={{ margin: 0 }}>
                  <Icon name="file" size={18} />
                  <span>Use approved Legal Support brochure copy. New claims, statistics or client names need approval before they go live.</span>
                </p>
              </div>
              {CE_GROUPS.map(([g, items]) => (
                <fieldset key={g}>
                  <legend>{g}</legend>
                  {items.map(it => isGroup(it)
                    ? <div className="ce-sub" key={it[0][0]}><b>{it[0][1]}</b>{it.map(field)}</div>
                    : field(it))}
                </fieldset>
              ))}
            </form>
          </section>
          <aside className="ce-preview" aria-label="Live preview">
            <p className="eyebrow" style={{ marginBottom: 12 }}>Live preview</p>
            <div aria-live="off">
              <div className="cp">
                <div className="cp-hero">
                  <p className="eyebrow">Managed operations for midsize law firms</p>
                  <h3>{e('hero.line')} <span className="accent-line">{e('hero.accent')}</span></h3>
                  <p>{e('hero.sub')}</p>
                </div>
                <div className="sigbar" />
                <div className="cp-sec">
                  <h4>How Hyacinth works</h4>
                  <div className="cp-3">{[0, 1, 2].map(i => <div key={i}><b>{e(`p${i}.title`)}</b><p><em>{e(`p${i}.tag`)}</em> {e(`p${i}.text`)}</p></div>)}</div>
                </div>
                <div className="cp-sec" style={{ background: 'var(--white)' }}>
                  <h4>Operating model</h4>
                  <div className="cp-3">{[0, 1, 2, 3, 4, 5].map(i => <div key={i}><span className="cp-num">0{i + 1}</span><b>{e(`a${i}.title`)}</b><p>{e(`a${i}.text`)}</p></div>)}</div>
                </div>
                <div className="cp-sec cp-stats">
                  <h4>Proof of execution</h4>
                  <div className="cp-3">{[0, 1, 2].map(i => <div key={i}><span className="fig">{e(`s${i}.fig`)}</span><p>{e(`s${i}.label`)}</p></div>)}</div>
                </div>
                <div className="cp-sec">
                  <h4>Contact representative</h4>
                  <p><b>{e('rep.name')}</b> · {e('rep.email')} · {e('rep.phone')}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
