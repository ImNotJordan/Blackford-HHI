"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

const MAX_TRIES = 5;

export default function StaffLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [wrong, setWrong] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const locked = wrong >= MAX_TRIES;
  const code = digits.join("");

  function setDigit(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((d) => d.map((x, j) => (j === i ? v : x)));
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  function verify(e: FormEvent) {
    e.preventDefault();
    if (locked || code.length < 6) return;
    // Demo: any 6 digits except 000000 succeed.
    if (code === "000000") {
      setWrong((w) => w + 1);
      setDigits(Array(6).fill(""));
      inputs.current[0]?.focus();
      return;
    }
    router.push("/work");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-ivory)]">
      <div className="mx-auto grid w-full max-w-6xl flex-1 lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-[var(--brand-ink)] px-10 py-12 text-[var(--brand-ivory)] lg:flex">
          <div>
            <p className="eyebrow !text-[var(--brand-pale-gold)]">Staff CRM</p>
            <h1
              className="mt-4 max-w-sm text-[42px] leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Sign in to your book of business.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--brand-gray)]">
              Password plus authenticator app for every Blackford staff
              account. Sessions end after 30 idle minutes.
            </p>
          </div>
          <div>
            <p
              className="text-[56px] leading-none text-[var(--brand-pale-gold)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              48
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--brand-gray)]">
              Active groups in Dana’s book · demo
            </p>
          </div>
          <div className="signature-bar absolute bottom-0 left-0 right-0" aria-hidden>
            <span />
            <span />
          </div>
        </aside>

        <main className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="rise mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-ink)] text-[var(--brand-ivory)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                B
              </span>
              <span className="text-sm font-semibold text-[var(--brand-ink)]">
                Blackford
              </span>
            </Link>

            <p className="eyebrow mt-10">Step {step} of 2</p>

            {step === 1 ? (
              <>
                <h2
                  className="mt-2 text-[32px] leading-tight text-[var(--brand-ink)]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  Staff sign-in
                </h2>
                <form
                  className="mt-8 flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <label className="field-label">
                    Work email
                    <input
                      className="field-in"
                      type="email"
                      name="email"
                      autoComplete="username"
                      defaultValue="dana.whitfield@example.com"
                      required
                    />
                  </label>
                  <label className="field-label">
                    Password
                    <input
                      className="field-in"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      defaultValue="demo-password"
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-accent mt-2">
                    Continue
                  </button>
                </form>
                <button
                  type="button"
                  className="mt-4 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]"
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                <h2
                  className="mt-2 text-[32px] leading-tight text-[var(--brand-ink)]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  Enter your authenticator code
                </h2>
                <p className="mt-2 text-[15px] text-[var(--brand-gray)]">
                  Open your authenticator app and enter the 6-digit code for
                  Blackford. Demo: any code works except 000000.
                </p>
                <form className="mt-8 flex flex-col gap-4" onSubmit={verify}>
                  <fieldset className="m-0 flex gap-2 border-0 p-0" disabled={locked}>
                    <legend className="sr-only">6-digit code</legend>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputs.current[i] = el;
                        }}
                        aria-label={`Digit ${i + 1}`}
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={d}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !d && i > 0) inputs.current[i - 1]?.focus();
                        }}
                        className="h-14 w-12 rounded-[var(--radius-md)] border border-[var(--brand-hairline)] bg-[var(--brand-surface)] text-center font-[family-name:var(--font-mono)] text-[22px] focus:border-[var(--brand-gold-deep)]"
                      />
                    ))}
                  </fieldset>
                  <label className="flex min-h-11 items-center gap-2.5 text-[14px]">
                    <input type="checkbox" className="h-5 w-5 accent-[var(--brand-ink)]" />
                    Trust this device for 12 hours
                  </label>
                  {wrong > 0 && !locked ? (
                    <p role="alert" className="m-0 text-[14px] font-semibold text-[var(--brand-ruby)]">
                      That code didn&apos;t match. {MAX_TRIES - wrong} tries left.
                    </p>
                  ) : null}
                  {locked ? (
                    <p role="alert" className="m-0 rounded-[10px] border border-[var(--brand-ruby)] bg-[var(--brand-surface)] px-3.5 py-3 text-[14px] text-[var(--brand-ruby)]">
                      Account locked for 15 minutes. A Blackford admin has been
                      notified.
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    className="btn btn-accent mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={locked || code.length < 6}
                  >
                    Verify and sign in
                  </button>
                </form>
                <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
                  <button
                    type="button"
                    className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]"
                  >
                    Use a recovery code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[var(--brand-gold-deep)] underline underline-offset-[3px]"
                  >
                    Back
                  </button>
                </div>
                <div className="mt-6 rounded-[10px] border border-[var(--brand-gold)] bg-[var(--brand-parchment)] px-3.5 py-3 text-[13px] leading-relaxed">
                  After 5 wrong codes the account locks for 15 minutes and a
                  Blackford admin is notified.
                </div>
              </>
            )}

            <p className="mt-6 text-[13px] text-[var(--brand-gray)]">
              For Blackford staff only. Every sign-in attempt is recorded in the
              audit log.
            </p>
            <p className="mt-2 text-[13px] text-[var(--brand-gray)]">
              Employer HR?{" "}
              <a href="http://localhost:3300/employer/invite">
                Open the employer portal
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
