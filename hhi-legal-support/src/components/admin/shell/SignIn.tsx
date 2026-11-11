'use client';
/* Hyacinth staff sign-in (prototype: any email and password work). */
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Icon, Logo } from '@/components/icons';
import { Switch, toast, useBusy } from '@/components/ui';
import { EMAIL_RE } from '@/lib/format';
import { useApp } from '@/lib/store';
import { ErrText } from './kit';

/** Only same-surface admin paths are accepted as a return target. */
function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith('/admin') || raw.startsWith('//') || raw.startsWith('/admin/sign-in')) return '/admin';
  return raw;
}

export function SignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const target = safeNext(params.get('next'));
  const signedIn = useApp(s => s.admin.signedIn);
  const keepDefault = useApp(s => s.admin.keep);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(keepDefault);
  const [errs, setErrs] = useState<{ email?: string; pass?: string }>({});
  const [busy, run] = useBusy();

  useEffect(() => {
    if (signedIn) router.replace(target);
  }, [signedIn, target, router]);

  useEffect(() => { document.getElementById('signin-title')?.focus({ preventScroll: true }); }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const em = email.trim();
    const e1 = !em ? 'Enter your work email.' : !EMAIL_RE.test(em) ? 'Enter an email address in the format name@hyacinth.example.' : '';
    const e2 = !pass ? 'Enter your password.' : '';
    setErrs({ email: e1, pass: e2 });
    if (e1 || e2) { document.getElementById(e1 ? 'as-email' : 'as-pass')?.focus(); return; }
    run(() => {
      const st = useApp.getState();
      st.adminSignIn(em, keep);
      toast(`Signed in as ${useApp.getState().admin.name}.`, { icon: 'user' });
    }, 800);
  };

  if (signedIn) return null;
  return (
    <main id="main" tabIndex={-1}>
      <div className="signin on-ink" id="admin-signin">
        <div className="signin-wrap">
          <div className="stack-16">
            <Logo />
            <span className="admin-flag">Admin</span>
            <h1 className="h2" id="signin-title" tabIndex={-1}>Hyacinth staff sign-in</h1>
            <p>Run client firms, workflows, team capacity, leads and website content from one place.</p>
          </div>
          <form className="signin-card" noValidate aria-labelledby="signin-title" onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="as-email">Work email</label>
              <input
                className="input" id="as-email" type="email" autoComplete="username" placeholder="name@hyacinth.example" aria-describedby="as-email-err"
                aria-required="true" aria-invalid={errs.email ? true : undefined} value={email}
                onChange={e => { setEmail(e.target.value); if (errs.email && e.target.value.trim()) setErrs(x => ({ ...x, email: '' })); }}
              />
              <ErrText id="as-email" msg={errs.email} />
            </div>
            <div className="field">
              <label className="label" htmlFor="as-pass">Password</label>
              <div className="pw-wrap">
                <input
                  className="input" id="as-pass" type={showPw ? 'text' : 'password'} autoComplete="current-password" aria-describedby="as-pass-err"
                  aria-required="true" aria-invalid={errs.pass ? true : undefined} value={pass}
                  onChange={e => { setPass(e.target.value); if (errs.pass && e.target.value) setErrs(x => ({ ...x, pass: '' })); }}
                />
                <button className="icon-btn" type="button" aria-pressed={showPw} aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(v => !v)}>
                  <Icon name="eye" />
                </button>
              </div>
              <ErrText id="as-pass" msg={errs.pass} />
            </div>
            <div className="switch-row">
              <span id="as-keep-l" className="label">Keep me signed in on this device</span>
              <Switch id="as-keep" checked={keep} onChange={setKeep} labelledBy="as-keep-l" />
            </div>
            <button className="btn btn-primary btn-block" type="submit" id="as-submit" aria-busy={busy || undefined} disabled={busy}>Sign in to admin</button>
            <p className="small">Prototype: any email and password work. Nothing is sent anywhere.</p>
          </form>
          <Link className="link-arrow" href="/">Back to the website <Icon name="arrow-right" /></Link>
        </div>
      </div>
    </main>
  );
}
