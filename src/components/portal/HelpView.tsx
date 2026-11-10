'use client';
/* Portal Help & support (legacy helpShell / renderSupport + SUBMITS.support). */
import { useState, type FormEvent } from 'react';
import { useApp } from '@/lib/store';
import { FAQ, SP_TOPICS } from '@/lib/data';
import { pFirm } from '@/lib/selectors';
import { Icon } from '@/components/icons';
import { Band, Select, Avatar, toast, useBusy } from '@/components/ui';
import { openMessage } from './uiStore';
import { FieldError, focusSoon } from './common';

export function HelpView() {
  const s = useApp();
  const F = pFirm(s);
  const lead = s.team[F.lead];
  const leadFirst = lead?.name.split(' ')[0] || 'Your lead';
  const [openFaq, setOpenFaq] = useState<boolean[]>(() => FAQ.map(() => false));

  return (
    <>
      <Band eyebrow="Support" title="Help & support" sub="Reach your Hyacinth team or find answers about how the portal works." />
      <div className="wrap pcontent">
        <div className="two-col">
          <div className="stack-24">
            <section className="card" aria-labelledby="faq-h">
              <div className="card-head"><h2 className="h4" id="faq-h">Common questions</h2></div>
              <div>
                {FAQ.map(([q, a], i) => (
                  <div className="faq" key={q}>
                    <h3 style={{ margin: 0, fontSize: 'inherit' }}>
                      <button type="button" id={`faq-${i}`} aria-expanded={openFaq[i]} aria-controls={`faq-a-${i}`} onClick={() => setOpenFaq(o => o.map((x, j) => (j === i ? !x : x)))}>
                        {q}<Icon name="chevron-down" size={18} />
                      </button>
                    </h3>
                    <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-${i}`} hidden={!openFaq[i]}><p>{a}</p></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="card" aria-labelledby="sp-h">
              <div className="card-head"><div><h2 className="h4" id="sp-h">Request support</h2><p className="small">Goes to {lead?.name || 'your engagement lead'} and the Hyacinth operations desk.</p></div></div>
              <div className="card-body"><SupportForm leadName={lead?.name || 'Your engagement lead'} /></div>
            </section>
          </div>
          <section className="card" aria-labelledby="el-h">
            <div className="card-head"><h2 className="h4" id="el-h">Your engagement lead</h2></div>
            <div className="card-body stack-16">
              {lead ? (
                <>
                  <span className="person"><Avatar name={lead.name} className="lg" /><span><b>{lead.name}</b><span className="small" style={{ display: 'block' }}>Engagement lead, Hyacinth</span></span></span>
                  <p className="small">{leadFirst} manages your dedicated team, sets weekly priorities and owns escalations.</p>
                  <div><button className="btn btn-dark" type="button" onClick={() => openMessage(F.lead)}><Icon name="message" size={18} />Message {leadFirst}</button></div>
                </>
              ) : null}
              <h3 className="h4" style={{ marginTop: 8 }}>Team on your account</h3>
              <ul className="team-list">
                {F.team.filter(k => k !== F.lead && s.team[k]).map(k => (
                  <li className="person" key={k}>
                    <Avatar name={s.team[k].name} />
                    <span><b style={{ fontSize: 'var(--fs-14)' }}>{s.team[k].name}</b><span className="small" style={{ display: 'block' }}>{s.team[k].role}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function SupportForm({ leadName }: { leadName: string }) {
  const [topic, setTopic] = useState(SP_TOPICS[0]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState<{ ref: string; topic: string; msg: string } | null>(null);
  const [busy, run] = useBusy();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = msg.trim();
    if (v.length < 10) { setErr('Describe what you need in at least 10 characters.'); document.getElementById('sp-msg')?.focus(); return; }
    setErr('');
    run(() => {
      const ref = `SR-${4100 + Math.floor(Math.random() * 800)}`;
      setDone({ ref, topic, msg: v });
      focusSoon('#sp-new');
      toast(`Support request ${ref} logged.`);
    });
  };

  if (done) {
    return (
      <div className="success" role="status">
        <span className="success-mark"><Icon name="check" size={24} /></span>
        <h3 className="h4">Request {done.ref} logged</h3>
        <p className="small">{done.topic}: “{done.msg.length > 120 ? `${done.msg.slice(0, 117)}…` : done.msg}”. {leadName} will reply in the portal.</p>
        <div><button className="btn btn-ghost btn-sm" type="button" id="sp-new" onClick={() => { setDone(null); setMsg(''); setTopic(SP_TOPICS[0]); focusSoon('#sp-msg'); }}>Send another request</button></div>
      </div>
    );
  }
  return (
    <form className="stack-16" noValidate onSubmit={submit}>
      <div className="field">
        <span className="label" id="sp-topic-l">Topic</span>
        <Select id="sp-topic" labelId="sp-topic-l" title="Topic" value={topic} onChange={setTopic} options={SP_TOPICS.map(t => ({ value: t, label: t }))} />
      </div>
      <div className="field">
        <label className="label" htmlFor="sp-msg">What do you need?</label>
        <textarea
          className="textarea" id="sp-msg" value={msg} placeholder="Include the workflow ID or matter if it relates to one."
          aria-describedby="sp-msg-err" aria-invalid={err ? true : undefined}
          onChange={e => { setMsg(e.target.value); if (err && e.target.value.trim()) setErr(''); }}
        />
        <FieldError id="sp-msg-err" msg={err} />
      </div>
      <div><button className="btn btn-dark" type="submit" id="sp-submit" aria-busy={busy || undefined} disabled={busy}><Icon name="send" size={18} />Send request</button></div>
    </form>
  );
}
