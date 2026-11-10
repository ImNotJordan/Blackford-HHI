'use client';
/* "Message your Hyacinth team" modal (legacy openMessage + SUBMITS.message). */
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { pFirm, staffOptions } from '@/lib/selectors';
import { Icon } from '@/components/icons';
import { Modal, Combobox, toast, useBusy } from '@/components/ui';
import { usePortalUi } from './uiStore';
import { FieldError } from './common';

export function MessageModal() {
  const member = usePortalUi(s => s.messageTo);
  const s = useApp();
  const open = !!member;
  const [to, setTo] = useState(member || '');
  const [body, setBody] = useState('');
  const [err, setErr] = useState('');
  const [prevMember, setPrevMember] = useState(member);
  if (prevMember !== member) {
    setPrevMember(member);
    if (member) { setTo(member); setBody(''); setErr(''); }
  }
  const [busy, run] = useBusy();
  const close = () => usePortalUi.getState().set({ messageTo: null });

  const submit = () => {
    const v = body.trim();
    if (!v) { setErr('Write a message before sending.'); document.getElementById('msg-body')?.focus(); return; }
    setErr('');
    run(() => {
      const name = useApp.getState().team[to]?.name || 'your Hyacinth team';
      close();
      toast(`Message sent to ${name}.`, { icon: 'send' });
    });
  };

  return (
    <Modal
      open={open} onClose={close} title="Message your Hyacinth team" initialFocus="#msg-body" onSubmit={submit}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={close}>Cancel</button>
        <button className="btn btn-dark" type="submit" id="msg-send" aria-busy={busy || undefined} disabled={busy}><Icon name="send" size={18} />Send message</button>
      </>}
    >
      <div className="field">
        <span className="label" id="msg-to-l">To</span>
        <Combobox id="msg-to" labelId="msg-to-l" title="Recipient" value={to} onChange={setTo} options={staffOptions(s, s.surface === 'portal' ? pFirm(s).team : undefined)} />
      </div>
      <div className="field">
        <label className="label" htmlFor="msg-body">Message</label>
        <textarea
          className="textarea" id="msg-body" value={body} placeholder="What do you need from the team?"
          aria-describedby="msg-body-err" aria-invalid={err ? true : undefined}
          onChange={e => { setBody(e.target.value); if (err && e.target.value.trim()) setErr(''); }}
        />
        <FieldError id="msg-body-err" msg={err} />
      </div>
    </Modal>
  );
}
