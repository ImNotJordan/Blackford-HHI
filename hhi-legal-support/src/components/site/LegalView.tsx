'use client';
/* Privacy notice, terms of use and accessibility statement (prototype copy from LEGAL). */
import { useEffect } from 'react';
import { Icon } from '@/components/icons';
import { LEGAL } from '@/lib/data';
import { SiteLink } from './SiteLink';
import { focusEl, pending } from './nav';

export function LegalView({ page }: { page: 'privacy' | 'terms' | 'accessibility' }) {
  const L = LEGAL[page];

  useEffect(() => {
    const fromLink = pending.nav;
    pending.nav = false;
    pending.section = null;
    pending.focus = null;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (fromLink) requestAnimationFrame(() => focusEl(document.getElementById('legal-title')));
  }, [page]);

  return (
    <div id="page-legal">
      <section className="legal-hero on-ink">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <SiteLink href="/">Home</SiteLink><span aria-hidden="true">/</span><span aria-current="page">{L.title}</span>
          </nav>
          <p className="eyebrow">Hyacinth Industries, LLC</p>
          <h1 className="h2" id="legal-title" tabIndex={-1}>{L.title}</h1>
          <p>Last updated {L.updated}</p>
        </div>
        <div className="sigbar" role="presentation" />
      </section>
      <section className="legal-body on-light">
        <div className="wrap">
          <article className="legal-doc">
            <p className="legal-note callout"><Icon name="file" /><span>Prototype copy for design review. Final language requires review by counsel before launch.</span></p>
            {L.sections.map(([h, parts]) => (
              <section key={h}>
                <h2 className="h3">{h}</h2>
                {parts.map((p, i) => Array.isArray(p)
                  ? <ul key={i}>{p.map(li => <li key={li}>{li}</li>)}</ul>
                  : <p key={i}>{p}</p>)}
              </section>
            ))}
            <section>
              <h2 className="h3">Contact</h2>
              <p>Questions about this page? Reach us through the contact form.</p>
              <p><SiteLink className="btn btn-dark" href="/#contact" focus="c-name">Go to the contact form</SiteLink></p>
            </section>
          </article>
          <aside className="legal-aside" aria-label="Related pages">
            <p className="eyebrow">Legal</p>
            {Object.entries(LEGAL).map(([k, v]) => (
              <SiteLink key={k} href={`/${k}`} aria-current={k === page ? 'page' : undefined}>{v.title}<Icon name="chevron-right" size={18} /></SiteLink>
            ))}
            <SiteLink href="/">Back to home<Icon name="home" size={18} /></SiteLink>
          </aside>
        </div>
      </section>
    </div>
  );
}
