"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { ActionBar, PortalMain, PortalPage, StepHeader } from "@/components/portal/chrome";
import { FieldError, btn, card, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import {
  GROUP,
  MEDICAL_PLANS,
  PAYCHECKS_PER_YEAR,
  TIERS,
  WAIVE_REASONS,
  money,
  wholeMoney,
  type WaiveReason,
} from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";

export function CompareScreen() {
  const t = useTranslations("compare");
  const tc = useTranslations("common");
  const router = useRouter();
  const { state, update } = useEnrollment();
  const sheet = useRef<HTMLDialogElement>(null);
  const [reasonError, setReasonError] = useState(false);
  const waived = state.medical === "waive";

  function next() {
    if (waived && !state.medicalWaiveReason) {
      setReasonError(true);
      return;
    }
    router.push("/portal/elect");
  }

  function choose(id: (typeof MEDICAL_PLANS)[number]["id"]) {
    update({ medical: id, medicalWaiveReason: "" });
    sheet.current?.close();
  }

  return (
    <PortalPage>
      <StepHeader step="compare" backHref="/portal/dependents" />
      <PortalMain>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>
          <p className="m-0 text-sm text-muted">{t("intro", { group: GROUP.shortName })}</p>
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-[13px] font-semibold text-muted">{t("whoCovered")}</legend>
          <div className="flex flex-wrap gap-1.5">
            {TIERS.map((tier) => {
              const on = state.tier === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update({ tier })}
                  className={cx(
                    "min-h-11 rounded-full border px-3 text-[13px]",
                    on ? "border-ink bg-ink font-semibold text-white" : "border-line bg-surface text-ink hover:bg-canvas",
                  )}
                >
                  {tc(`tiers.${tier}`)}
                </button>
              );
            })}
          </div>
        </fieldset>

        {waived ? (
          <section aria-labelledby="waived" className={cx(card, "flex flex-col gap-3 border-2 border-ink p-4")}>
            <h2 id="waived" className="m-0 text-base font-bold">
              {t("waivedTitle")}
            </h2>
            <p className="m-0 text-sm text-ink-2">{t("waivedBody", { group: GROUP.shortName, year: GROUP.planYear })}</p>
            <label className={labelClass}>
              {t("reason")}
              <select
                value={state.medicalWaiveReason}
                onChange={(e) => {
                  update({ medicalWaiveReason: e.target.value as WaiveReason });
                  setReasonError(false);
                }}
                aria-invalid={reasonError || undefined}
                aria-describedby={reasonError ? "err-med-reason" : undefined}
                className={cx(inputClass, reasonError && invalidClass)}
              >
                <option value="">{tc("chooseOne")}</option>
                {WAIVE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {tc(`waiveReasons.${r}`)}
                  </option>
                ))}
              </select>
            </label>
            {reasonError ? <FieldError id="err-med-reason">{t("errReason")}</FieldError> : null}
          </section>
        ) : (
          <div role="radiogroup" aria-label={t("title")} className="flex flex-col gap-4">
            {MEDICAL_PLANS.map((p) => {
              const selected = state.medical === p.id;
              const price = p.rates[state.tier];
              return (
                <label
                  key={p.id}
                  className={cx(
                    "flex cursor-pointer flex-col gap-3 rounded-2xl bg-surface p-4",
                    selected ? "border-2 border-brand" : "border border-line",
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="plan"
                        checked={selected}
                        onChange={() => update({ medical: p.id })}
                        className="mt-0.5 h-[22px] w-[22px] accent-brand"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-base font-bold">{p.name}</span>
                        <span className="text-xs text-muted">{p.network === "any" ? t("any") : t("network")}</span>
                      </span>
                    </span>
                    <span className="flex flex-col items-end">
                      <span className="font-display text-[22px] font-extrabold">{money(price)}</span>
                      <span className="text-xs text-muted">{tc("perPaycheck")}</span>
                    </span>
                  </span>
                  <span className="grid grid-cols-3 gap-2 border-t border-line-soft pt-3">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-muted">{t("deductible")}</span>
                      <span className="text-sm font-semibold">{p.deductible}</span>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-muted">{t("doctorVisit")}</span>
                      <span className="text-sm font-semibold">{p.doctorVisit}</span>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-muted">{t("perYear")}</span>
                      <span className="text-sm font-semibold">{wholeMoney(price * PAYCHECKS_PER_YEAR)}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {waived ? (
          <button type="button" onClick={() => update({ medical: "ppo1500", medicalWaiveReason: "" })} className={cx(btn.link, "self-center")}>
            {t("keep")}
          </button>
        ) : (
          <button type="button" onClick={() => sheet.current?.showModal()} className={cx(btn.link, "self-center text-sm")}>
            {t("details")}
          </button>
        )}
      </PortalMain>

      <ActionBar row>
        {!waived ? (
          <button
            type="button"
            onClick={() => update({ medical: "waive" })}
            className={cx(btn.secondary, "flex-1")}
          >
            {t("waive")}
          </button>
        ) : null}
        <button type="button" onClick={next} className={cx(btn.primary, "flex-[2]")}>
          {t("next")}
        </button>
      </ActionBar>

      <dialog
        ref={sheet}
        aria-labelledby="sheet-title"
        className="mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-surface p-5 text-ink backdrop:bg-ink/40"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="flex flex-col gap-4">
          <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line-strong" />
          <div className="flex items-center justify-between">
            <h2 id="sheet-title" className="m-0 font-display text-[21px] font-extrabold">
              {t("sheetTitle")}
            </h2>
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => sheet.current?.close()}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] hover:bg-canvas"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </div>
          {MEDICAL_PLANS.map((p) => (
            <section key={p.id} aria-labelledby={`sheet-${p.id}`} className="flex flex-col gap-1">
              <h3 id={`sheet-${p.id}`} className="m-0 text-base font-bold">
                {p.name}
              </h3>
              <dl className="m-0">
                <div className="flex justify-between border-b border-line-soft py-1.5 text-sm">
                  <dt>{t("youPay")}</dt>
                  <dd className="m-0 font-bold">{money(p.rates[state.tier])}</dd>
                </div>
                {p.details.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 border-b border-line-soft py-1.5 text-sm">
                    <dt>{t(row.label)}</dt>
                    <dd className="m-0 text-right font-bold">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={() => choose(p.id)} className={cx(btn.primary, "mt-2")}>
                {t("choose", { plan: p.name })}
              </button>
            </section>
          ))}
        </div>
      </dialog>
    </PortalPage>
  );
}
