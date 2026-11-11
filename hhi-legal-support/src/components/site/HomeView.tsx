'use client';
/* Website home page. Editable copy comes from the shared store (admin "Website content" publishes it live). */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { toast } from '@/components/ui';
import { useApp } from '@/lib/store';
import { ContactForm } from './ContactForm';
import { SiteLink } from './SiteLink';
import { applyArea, goSection, pending, reduced, SITE_SECTIONS, SPY_ORDER } from './nav';
import { useSite } from './siteStore';

const LANES: [string, string, string, string][] = [
  ['svc-client', '01', 'Client Operations', 'Intake, communications, scheduling, follow-up'],
  ['svc-legal', '02', 'Legal Support', 'Records, documents, deadlines, data'],
  ['svc-business', '03', 'Business Operations', 'Billing, reporting, CRM, finance']
];
const PILLAR_ICONS: IconName[] = ['users', 'workflow', 'eye'];
const SERVICES: { id: string; icon: IconName; title: string; items: string[] }[] = [
  { id: 'svc-client', icon: 'message', title: 'Client Operations', items: ['Intake', 'Client communications', 'Scheduling', 'Document collection', 'Status updates', 'Follow-up'] },
  { id: 'svc-legal', icon: 'file', title: 'Legal Support', items: ['Records coordination', 'Document organization', 'Deadline tracking', 'Data administration', 'Attorney-directed workflows'] },
  { id: 'svc-business', icon: 'briefcase', title: 'Business Operations', items: ['Billing support', 'Reporting', 'CRM administration', 'Finance workflows', 'Research', 'Back-office processes'] }
];
const DIFF: [string, string, string][] = [
  ['A', 'Defined Process', 'Each workflow is mapped and documented, so it runs the same way regardless of who picks it up.'],
  ['B', 'Active Management', 'Hyacinth manages the team day to day, including priorities, quality checks, and escalations.'],
  ['C', 'Scalable Support', 'Start with one workflow and add capacity as the process proves itself.']
];
const WORK = ['Outreach', 'Historical data collection', 'Contractor and lab coordination', 'Settlement projections', 'Filings', 'Deadline management', 'Follow-up'];
const STEPS: [string, string][] = [
  ['Start with one bottleneck', 'Pick the recurring work that is costing your team the most time.'],
  ['Build the process', 'Define the workflow, the handoffs, and what the team owns.'],
  ['Prove the leverage', 'Run it with visible execution so you can see the capacity returned.'],
  ['Scale from there', 'Extend the model to the next workflow once the first one works.']
];

function copyText(txt: string) {
  try {
    navigator.clipboard.writeText(txt).then(() => toast(`Copied ${txt}.`, { icon: 'copy' }), () => toast(`Select and copy: ${txt}`, { icon: 'copy' }));
  } catch {
    toast(`Select and copy: ${txt}`, { icon: 'copy' });
  }
}

export function HomeView() {
  const C = useApp(s => s.content);
  const setSpy = useSite(s => s.setSpy);
  const params = useSearchParams();
  const area = params.get('area');
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ?area=<Area> preselects the contact form's area. */
  useEffect(() => { applyArea(area); }, [area]);

  /* Arrival: a site link from another page (pending) or a direct load / other surface (URL hash, no focus move). */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    const fromLink = pending.nav;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = pending.section || hash || 'home';
    if (fromLink) { goSection(SITE_SECTIONS.includes(target) ? target : 'home', false); return; }
    pending.section = null;
    if (!hash) return;
    if (SITE_SECTIONS.includes(hash)) goSection(hash, true);
    else {
      try { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search); } catch { /* ignore */ }
      toast(`Nothing lives at “#${hash.slice(0, 40)}”. Showing the home page instead.`, { icon: 'alert' });
    }
  }, []);

  /* Back / forward between section entries. */
  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname !== '/') return;
      const h = decodeURIComponent(window.location.hash.slice(1)) || 'home';
      if (SITE_SECTIONS.includes(h)) goSection(h, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* Scroll-spy for the primary nav. */
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) visible.add(en.target.id); else visible.delete(en.target.id); });
      setSpy([...SPY_ORDER].reverse().find(id => visible.has(id)) || null);
    }, { rootMargin: '-45% 0px -50% 0px' });
    SPY_ORDER.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { io.disconnect(); setSpy(null); };
  }, [setSpy]);

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  const lane = (id: string) => {
    const card = document.getElementById(id);
    if (!card) return;
    card.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'center' });
    setFlash(id);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1800);
    card.querySelector<HTMLElement>('.link-arrow')?.focus({ preventScroll: true });
  };

  return (
    <div id="page-home">
      <section className="hero on-ink" id="home" data-spy aria-labelledby="hero-title">
        <div className="wrap">
          <div className="hero-copy">
            <p className="eyebrow">Managed operations for midsize law firms</p>
            <h1 className="display" id="hero-title" tabIndex={-1}><span>{C['hero.line']}</span> <span className="accent-line">{C['hero.accent']}</span></h1>
            <p className="lede">{C['hero.sub']}</p>
            <div className="hero-ctas">
              <SiteLink className="btn btn-primary" href="/#contact" focus="c-name">Talk about capacity <Icon name="arrow-right" /></SiteLink>
              <SiteLink className="btn btn-ghost" href="/#services">See where we plug in</SiteLink>
            </div>
          </div>
          <figure className="layer" aria-labelledby="layer-cap">
            <figcaption id="layer-cap" className="sr-only">How Hyacinth sits behind your firm: your attorneys, paralegals and leadership stay focused on the practice of law while Hyacinth runs three lanes of recurring work.</figcaption>
            <div className="layer-top">
              <span className="layer-k">The practice of law</span>
              <span className="roles">Attorneys · Paralegals · Leadership</span>
            </div>
            <div className="layer-flow">Focus protected. Recurring work moves below.</div>
            <span className="layer-k">Hyacinth operating layer</span>
            <div className="lanes">
              {LANES.map(([target, n, title, sub]) => (
                <button key={target} className="lane" type="button" onClick={() => lane(target)}>
                  <span className="lane-n">{n}</span><span><b>{title}</b><span className="small">{sub}</span></span><Icon name="arrow-right" />
                </button>
              ))}
            </div>
            <div className="layer-foot"><Icon name="eye" /><span>Visible execution, managed with accountability</span></div>
          </figure>
        </div>
        <div className="sigbar" role="presentation" />
      </section>

      <section className="band on-light" id="pillars" data-spy aria-labelledby="pillars-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">How Hyacinth works</p>
            <h2 className="h2" id="pillars-title" tabIndex={-1}>Three commitments <span className="accent-line">behind every engagement.</span></h2>
          </div>
          <div className="pillars">
            {PILLAR_ICONS.map((ic, i) => (
              <div className="pillar" key={ic}>
                <span className="pi"><Icon name={ic} /></span>
                <h3 className="h3">{C[`p${i}.title`]}</h3>
                <p><em>{C[`p${i}.tag`]}</em> <span>{C[`p${i}.text`]}</span></p>
                {i === 2 && <SiteLink className="link-arrow" href="/portal">See it in the client portal <Icon name="arrow-right" /></SiteLink>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band on-light" id="services" data-spy aria-labelledby="services-title" style={{ borderTop: '1px solid var(--hairline)' }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Where we plug in</p>
            <h2 className="h2" id="services-title" tabIndex={-1}>Built around the recurring work <span className="accent-line">that consumes your team&apos;s capacity.</span></h2>
          </div>
          <div className="svc-grid">
            {SERVICES.map(s => (
              <article key={s.id} className={`card svc${flash === s.id ? ' is-flash' : ''}`} id={s.id} aria-labelledby={`${s.id}-h`}>
                <span className="svc-icon"><Icon name={s.icon} /></span>
                <h3 className="h3" id={`${s.id}-h`}>{s.title}</h3>
                <ul>{s.items.map(it => <li key={it}>{it}</li>)}</ul>
                <div className="card-foot">
                  <SiteLink className="link-arrow" href={`/?area=${encodeURIComponent(s.title)}#contact`} area={s.title} focus="c-name">Discuss {s.title} <Icon name="arrow-right" /></SiteLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band on-light" id="model" data-spy aria-labelledby="model-title" style={{ background: 'var(--white)', borderBlock: '1px solid var(--hairline)' }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Operating model</p>
            <h2 className="h2" id="model-title" tabIndex={-1}>Six service areas. <span className="accent-line">One managed operating layer.</span></h2>
          </div>
          <ol className="model-grid">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const n = `0${i + 1}`;
              return (
                <li className="model-item" key={i}>
                  <span className="model-num" aria-hidden="true">{n}</span>
                  <h3 className="h3"><span className="sr-only">{n} </span><span>{C[`a${i}.title`]}</span></h3>
                  <p>{C[`a${i}.text`]}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="band on-ink" id="difference" data-spy aria-labelledby="diff-title">
        <div className="wrap">
          <div className="diff">
            <div className="stack-16" style={{ alignContent: 'start' }}>
              <p className="eyebrow">The difference</p>
              <h2 className="h2" id="diff-title" tabIndex={-1}>Capacity is useful. <span className="accent-line">Managed execution creates leverage.</span></h2>
            </div>
            <div className="diff-points">
              {DIFF.map(([l, h, p]) => (
                <div className="diff-point" key={l}><span className="diff-letter" aria-hidden="true">{l}</span><div><h3 className="h3">{h}</h3><p>{p}</p></div></div>
              ))}
            </div>
          </div>

          <div className="proof" id="proof" data-spy aria-labelledby="proof-title">
            <div className="proof-head">
              <div className="stack-16">
                <p className="eyebrow">Proof of execution</p>
                <h2 className="h2" id="proof-title" tabIndex={-1}>PFAS water litigation <span className="accent-line">for a plaintiff firm.</span></h2>
              </div>
              <p style={{ maxWidth: '44ch' }}>Hyacinth ran the operating lifecycle for the firm, end to end.</p>
            </div>
            <div className="stats">
              {[0, 1, 2].map(i => (
                <div className="stat" key={i}><span className="stat-fig">{C[`s${i}.fig`]}</span><p>{C[`s${i}.label`]}</p></div>
              ))}
            </div>
            <div className="work-covered">
              <h3 className="h4">The work covered</h3>
              <ul className="work-list">{WORK.map(w => <li key={w}>{w}</li>)}</ul>
            </div>
            <div className="why">
              <div className="why-col">
                <p className="eyebrow">Why it worked</p>
                <p className="h4" style={{ fontWeight: 500 }}>One team owned the full lifecycle, from first outreach to final follow-up, on defined workflows under active management.</p>
              </div>
              <div className="why-col callout">
                <p className="eyebrow">The transferable lesson</p>
                <p className="h4" style={{ fontWeight: 500 }}>High-volume, deadline-driven work scales when it runs on a defined process with visible execution. The same model applies to your firm&apos;s recurring work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band on-light" id="approach" data-spy aria-labelledby="approach-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Engagement path</p>
            <h2 className="h2" id="approach-title" tabIndex={-1}>Start with one bottleneck. <span className="accent-line">Scale from there.</span></h2>
          </div>
          <ol className="timeline">
            {STEPS.map(([h, p], i) => (
              <li className="t-step" key={h}><span className="t-marker" aria-hidden="true" /><span className="t-num">0{i + 1}</span><h3 className="h3">{h}</h3><p>{p}</p></li>
            ))}
          </ol>
          <div className="approach-cta">
            <SiteLink className="btn btn-dark" href="/#contact" focus="c-name">Start with your bottleneck <Icon name="arrow-right" /></SiteLink>
            <SiteLink className="link-arrow" href="/portal">Preview the client portal <Icon name="arrow-right" /></SiteLink>
          </div>
        </div>
      </section>

      <section className="band contact on-ink" id="contact" data-spy aria-labelledby="contact-title">
        <div className="wrap">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2 className="h2" id="contact-title" tabIndex={-1}>Let&apos;s talk about where your firm <span className="accent-line">needs more capacity.</span></h2>
            <p className="lede">Share a few details and a Hyacinth representative will follow up to talk through one bottleneck.</p>
            <ul className="contact-points">
              <li><Icon name="check" /><span>Start with one bottleneck</span></li>
              <li><Icon name="check" /><span>Build the process around your workflows</span></li>
              <li><Icon name="check" /><span>Scale once the leverage is proven</span></li>
            </ul>
            <div className="contact-rep">
              <span className="layer-k">Your representative</span>
              <b style={{ fontSize: 'var(--fs-18)' }}>{C['rep.name']}</b>
              <span className="row"><Icon name="message" /><span>{C['rep.email']}</span>
                <button className="btn btn-quiet btn-sm" type="button" aria-label="Copy email address" onClick={() => copyText(C['rep.email'] || '')}>Copy</button></span>
              <span className="row"><Icon name="user" /><span>{C['rep.phone']}</span>
                <button className="btn btn-quiet btn-sm" type="button" aria-label="Copy phone number" onClick={() => copyText(C['rep.phone'] || '')}>Copy</button></span>
            </div>
          </div>
          <div className="form-card" id="contact-card"><ContactForm /></div>
        </div>
      </section>
    </div>
  );
}
