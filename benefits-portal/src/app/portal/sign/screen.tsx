"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ActionBar, PortalMain, PortalPage, StepHeader } from "@/components/portal/chrome";
import { DrawnSignature } from "@/components/portal/signature-pad";
import { FieldError, btn, card, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import {
  DENTAL_PLANS,
  GROUP,
  MEDICAL_PLANS,
  VISION_PLANS,
  money,
  wholeMoney,
  type WaiveReason,
} from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";
import { useCoveredLabel } from "@/lib/use-covered-label";

type Row = { key: string; title: string; sub: string; amount: string; href: string };

export function SignScreen() {
  const t = useTranslations("sign");
  const tc = useTranslations("common");
  const router = useRouter();
  const { state, update, totals } = useEnrollment();
  const covered = useCoveredLabel();
  const [consent, setConsent] = useState(true);
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [name, setName] = useState(state.signatureName);
  const [hasInk, setHasInk] = useState(false);
  const [errors, setErrors] = useState<{ consent?: boolean; signature?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const medical = MEDICAL_PLANS.find((p) => p.id === state.medical);
  const dental = DENTAL_PLANS.find((p) => p.id === state.dental);
  const vision = VISION_PLANS.find((p) => p.id === state.vision);
  const waived = (r: WaiveReason | "") => t("waived", { reason: r ? tc(`waiveReasons.${r}`) : "—" });

  const rows: Row[] = [
    medical
      ? { key: "medical", title: t("medicalLine", { plan: medical.name }), sub: covered, amount: money(totals.medical), href: "/portal/compare" }
      : { key: "medical", title: t("medical"), sub: waived(state.medicalWaiveReason), amount: money(0), href: "/portal/compare" },
    dental
      ? { key: "dental", title: t("dentalLine", { plan: dental.name }), sub: covered, amount: money(totals.dental), href: "/portal/elect" }
      : { key: "dental", title: t("dental"), sub: waived(state.dentalWaiveReason), amount: money(0), href: "/portal/elect" },
    vision
      ? { key: "vision", title: t("visionLine", { plan: vision.name }), sub: covered, amount: money(totals.vision), href: "/portal/elect" }
      : { key: "vision", title: t("vision"), sub: waived(state.visionWaiveReason), amount: money(0), href: "/portal/elect" },
    {
      key: "life",
      title: t("basicLife", { amount: wholeMoney(GROUP.basicLife) }),
      sub: t("beneficiary", { list: state.primary.map((b) => `${b.name}, ${b.share}%`).join("; ") }),
      amount: t("paidBy", { group: GROUP.shortName }),
      href: "/portal/beneficiaries",
    },
  ];

  function submit() {
    const signatureOk = mode === "type" ? name.trim().length > 1 : hasInk;
    const next = { consent: !consent, signature: !signatureOk };
    setErrors(next);
    if (next.consent || next.signature) return;
    setSubmitting(true);
    // Demo stand-in for the idempotent submit call (consent is recorded first, then the signature).
    window.setTimeout(() => {
      update({ signedAt: new Date(), signatureName: mode === "type" ? name.trim() : state.signatureName });
      router.push("/portal/done");
    }, 600);
  }

  return (
    <PortalPage>
      <StepHeader step="sign" backHref="/portal/beneficiaries" />
      <PortalMain className="gap-3.5">
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>

        <section aria-label={t("elections")} className={cx(card, "px-4 py-1")}>
          {rows.map((r) => (
            <div key={r.key} className="flex justify-between gap-3 border-b border-line-soft py-3 last:border-b-0">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">{r.title}</span>
                <span className="text-[13px] text-muted">{r.sub}</span>
              </div>
              <div className="flex flex-none flex-col items-end gap-0.5 text-right">
                <span className="font-bold">{r.amount}</span>
                <Link href={r.href} aria-label={t("changeAria", { item: r.title })} className="inline-flex min-h-11 items-center text-[13px] font-semibold">
                  {t("change")}
                </Link>
              </div>
            </div>
          ))}
        </section>

        <div className="flex items-baseline justify-between rounded-[14px] bg-navy px-4 py-3.5 text-white">
          <span className="font-semibold">{t("total")}</span>
          <span className="font-display text-[22px] font-extrabold">{money(totals.total)}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2.5 text-[13px] leading-normal text-ink-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrors((x) => ({ ...x, consent: false }));
              }}
              aria-invalid={errors.consent || undefined}
              aria-describedby={errors.consent ? "err-consent" : undefined}
              className="m-0 h-[22px] w-[22px] flex-none accent-brand"
            />
            <span>{t("consent")}</span>
          </label>
          <details className="ml-8 text-[13px]">
            <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-brand">{t("readConsent")}</summary>
            <p className="m-0 rounded-lg bg-surface p-3 leading-normal text-ink-2">{t("consentText")}</p>
          </details>
          {errors.consent ? <FieldError id="err-consent">{t("errConsent")}</FieldError> : null}
        </div>

        <div role="group" aria-label={t("sigType")} className="grid grid-cols-2 gap-2">
          {(["type", "draw"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                setErrors((x) => ({ ...x, signature: false }));
              }}
              className={cx(
                "min-h-12 rounded-xl border font-semibold",
                mode === m ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:bg-canvas",
              )}
            >
              {t(m)}
            </button>
          ))}
        </div>

        {mode === "type" ? (
          <label className={labelClass}>
            {t("typeName")}
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((x) => ({ ...x, signature: false }));
              }}
              autoComplete="name"
              aria-invalid={errors.signature || undefined}
              aria-describedby={errors.signature ? "err-sig" : undefined}
              className={cx(inputClass, "min-h-[52px] border-line-strong px-3.5 text-lg italic", errors.signature && invalidClass)}
            />
          </label>
        ) : (
          <DrawnSignature
            label={t("pad")}
            hint={t("drawHere")}
            clearLabel={t("clear")}
            invalid={!!errors.signature}
            describedBy={errors.signature ? "err-sig" : undefined}
            onChange={(ink) => {
              setHasInk(ink);
              if (ink) setErrors((x) => ({ ...x, signature: false }));
            }}
          />
        )}
        {errors.signature ? <FieldError id="err-sig">{mode === "type" ? t("errName") : t("errDraw")}</FieldError> : null}
      </PortalMain>
      <ActionBar>
        <button type="button" onClick={submit} disabled={submitting} aria-busy={submitting} className={btn.primary}>
          {submitting ? t("submitting") : t("submit")}
        </button>
        <span className="text-center text-xs text-muted">{t("pdfNote")}</span>
      </ActionBar>
    </PortalPage>
  );
}
