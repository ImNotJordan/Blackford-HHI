"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActionBar, LanguageToggle, PortalPage } from "@/components/portal/chrome";
import { BrandMark, FieldError, btn, cx } from "@/components/ui";
import { CONTACT, GROUP, MEMBER, WINDOW_CLOSES } from "@/lib/demo-data";

const CODE_LENGTH = 6;
const CODE_SECONDS = 10 * 60;

export function SignInScreen() {
  const t = useTranslations("signIn");
  const tc = useTranslations("common");
  const format = useFormatter();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [channel, setChannel] = useState<"text" | "email">("text");
  const [secondsLeft, setSecondsLeft] = useState(CODE_SECONDS);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const expired = secondsLeft === 0;
  const code = digits.join("");

  function resetCode(next: "text" | "email") {
    setChannel(next);
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(CODE_SECONDS);
    setError("");
    setNotice(t("resent"));
    inputs.current[0]?.focus();
  }

  function setDigit(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "");
    if (clean.length > 1) {
      // Pasted or autofilled the whole code
      const next = clean.slice(0, CODE_LENGTH).split("");
      setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => next[i] ?? ""));
      inputs.current[Math.min(next.length, CODE_LENGTH - 1)]?.focus();
      return;
    }
    setDigits((d) => d.map((v, i) => (i === index ? clean : v)));
    if (clean && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (expired) return;
    if (code.length < CODE_LENGTH) {
      setError(t("incomplete"));
      return;
    }
    // Demo: any 6-digit code is accepted. The real check runs server-side.
    router.push("/portal/start");
  }

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <PortalPage tone="white">
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <main id="main" className="flex flex-1 flex-col gap-7 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BrandMark />
              <span className="font-display text-[15px] font-extrabold">{tc("brand")}</span>
            </span>
            <LanguageToggle pill />
          </div>

          <div className="flex flex-col gap-1.5 rounded-2xl bg-brand-tint p-5">
            <span className="text-[13px] font-semibold text-brand-hover">{GROUP.name}</span>
            <span className="font-display text-xl font-extrabold">{t("enrollmentTitle", { year: GROUP.planYear })}</span>
            <span className="text-sm text-brand-ink">
              {t("banner", { date: format.dateTime(WINDOW_CLOSES, { weekday: "long", month: "short", day: "numeric" }) })}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="m-0 font-display text-[26px] font-extrabold tracking-tight">
              {t("heading", { name: MEMBER.firstName })}
            </h1>
            <p className="m-0 leading-normal text-muted">
              {channel === "text" ? t("textSent", { last4: MEMBER.phoneLast4 }) : t("emailSent")}
            </p>
          </div>

          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 text-sm font-semibold">{t("code")}</legend>
            <div className="grid grid-cols-6 gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  aria-label={t("digit", { n: i + 1 })}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "code-error" : undefined}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={i === 0 ? CODE_LENGTH : 1}
                  value={d}
                  disabled={expired}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className={cx(
                    "h-14 min-w-0 rounded-xl text-center text-2xl font-bold text-ink disabled:bg-canvas",
                    error ? "border-2 border-error-line" : d ? "border-2 border-brand" : "border border-line-strong",
                  )}
                />
              ))}
            </div>
            {error ? <FieldError id="code-error">{error}</FieldError> : null}
            {expired ? (
              <p role="alert" className="m-0 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-error">
                {t("expired")}
                <button type="button" onClick={() => resetCode(channel)} className="min-h-11 font-semibold text-brand underline">
                  {t("resend")}
                </button>
              </p>
            ) : (
              <span className="text-[13px] text-muted" aria-live="off">
                {t("expiresIn", { time: `${mm}:${ss}` })}
              </span>
            )}
            <span role="status" className="text-[13px] text-brand-hover">
              {notice}
            </span>
          </fieldset>
        </main>

        <ActionBar>
          <button type="submit" className={btn.primary} disabled={expired}>
            {tc("continue")}
          </button>
          <button
            type="button"
            className={btn.secondary}
            onClick={() => resetCode(channel === "text" ? "email" : "text")}
          >
            {channel === "text" ? t("emailInstead") : t("textInstead")}
          </button>
          <Link href="/portal/link/not-mine" className="mx-auto inline-flex min-h-11 items-center text-sm font-semibold">
            {t("notMine")}
          </Link>
          <p className="m-0 flex items-start gap-2 text-xs leading-normal text-muted">
            <Lock aria-hidden="true" size={16} className="mt-px flex-none" />
            {t("privacy", { phone: CONTACT.phoneDisplay })}
          </p>
        </ActionBar>
      </form>
    </PortalPage>
  );
}
