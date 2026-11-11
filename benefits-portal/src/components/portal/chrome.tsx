"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, WifiOff } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { STEPS, useEnrollment, type StepId } from "@/lib/enrollment-store";
import { BrandMark, cx } from "@/components/ui";

/** Phone-first column. Full width on phones, a centered column on larger screens. */
export function PortalPage({ children, tone = "canvas" }: { children: ReactNode; tone?: "canvas" | "white" }) {
  return (
    <div
      className={cx(
        "mx-auto flex min-h-dvh w-full max-w-[480px] flex-col text-[15px] sm:border-x sm:border-line",
        tone === "white" ? "bg-surface" : "bg-canvas",
      )}
    >
      <OfflineBanner />
      {children}
    </div>
  );
}

export function PortalMain({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main id="main" className={cx("flex flex-1 flex-col gap-4 px-4 py-5", className)}>
      {children}
    </main>
  );
}

export function LanguageToggle({ pill = false }: { pill?: boolean }) {
  const t = useTranslations("common");
  const { state, update } = useEnrollment();
  return (
    <button
      type="button"
      lang={state.locale === "en" ? "es" : "en"}
      aria-label={t("switchLanguageAria")}
      onClick={() => update({ locale: state.locale === "en" ? "es" : "en" })}
      className={cx(
        "min-h-11 border border-line bg-surface px-3 text-[13px] font-semibold text-ink hover:bg-canvas",
        pill ? "rounded-full" : "rounded-[10px]",
      )}
    >
      {t("switchLanguage")}
    </button>
  );
}

export function BrandHeader({ right, full = false }: { right?: ReactNode; full?: boolean }) {
  const t = useTranslations("common");
  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
      <span className="flex items-center gap-2">
        <BrandMark />
        <span className="font-display font-extrabold">{full ? t("brand") : t("brandShort")}</span>
      </span>
      {right}
    </header>
  );
}

export function BackHeader({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <header className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
      <Link
        href={href}
        aria-label={ariaLabel}
        className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink hover:bg-canvas hover:text-ink"
      >
        <ChevronLeft aria-hidden="true" size={22} />
      </Link>
      <span className="font-bold">{label}</span>
    </header>
  );
}

/** Guided-flow header: back, "Step n of 6", save and exit, progress bar. */
export function StepHeader({ step, backHref }: { step: StepId; backHref: string }) {
  const t = useTranslations("common");
  const router = useRouter();
  const { reachStep } = useEnrollment();
  const index = STEPS.findIndex((s) => s.id === step) + 1;
  const total = STEPS.length;
  const label = t("stepOf", { step: index, total, label: t(`stepShort.${step}`) });

  useEffect(() => {
    reachStep(step);
  }, [reachStep, step]);

  return (
    <header className="flex flex-col gap-2.5 border-b border-line bg-surface px-4 pt-3 pb-3.5">
      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          aria-label={t("back")}
          className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink hover:bg-canvas hover:text-ink"
        >
          <ChevronLeft aria-hidden="true" size={22} />
        </Link>
        <span className="text-[13px] font-semibold text-muted">{label}</span>
        <button
          type="button"
          onClick={() => router.push("/portal/link/welcome-back")}
          className="min-h-11 px-2 text-[13px] font-semibold text-brand hover:text-brand-hover"
        >
          {t("saveExit")}
        </button>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
        className="h-1.5 overflow-hidden rounded-full bg-sunken"
      >
        <div className="h-full bg-brand transition-[width]" style={{ width: `${(index / total) * 100}%` }} />
      </div>
    </header>
  );
}

/** Sticky bottom action area. */
export function ActionBar({ children, row = false }: { children: ReactNode; row?: boolean }) {
  return (
    <div
      className={cx(
        "no-print sticky bottom-0 z-10 flex gap-2 border-t border-line bg-surface px-4 pt-3 pb-5",
        row ? "flex-row" : "flex-col",
      )}
    >
      {children}
    </div>
  );
}

export function OfflineBanner() {
  const t = useTranslations("common");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;
  return (
    <div role="alert" className="flex items-start gap-2 bg-warn-tint px-4 py-3 text-sm leading-normal text-warn-ink">
      <WifiOff aria-hidden="true" size={18} className="mt-0.5 flex-none" />
      <span>{t.rich("offline", { b: (c) => <b>{c}</b> })}</span>
    </div>
  );
}

export function SavedNote({ date }: { date: string }) {
  const t = useTranslations("common");
  return (
    <p className="m-0 flex items-center gap-2 text-xs text-muted">
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
        <path d="m5 12 5 5L20 7" />
      </svg>
      {t("savedNote", { date })}
    </p>
  );
}
