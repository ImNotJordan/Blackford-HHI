"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ActionBar, PortalMain, PortalPage, StepHeader } from "@/components/portal/chrome";
import { FieldError, btn, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { DENTAL_PLANS, MEDICAL_PLANS, VISION_PLANS, WAIVE_REASONS, money, type WaiveReason } from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";
import { useCoveredLabel } from "@/lib/use-covered-label";

type Line = "dental" | "vision";

export function ElectScreen() {
  const t = useTranslations("elect");
  const tc = useTranslations("common");
  const tCompare = useTranslations("compare");
  const router = useRouter();
  const { state, update, totals } = useEnrollment();
  const covered = useCoveredLabel();
  const [errors, setErrors] = useState<Record<Line, boolean>>({ dental: false, vision: false });

  const medicalPlan = MEDICAL_PLANS.find((p) => p.id === state.medical);

  function next() {
    const e = {
      dental: state.dental === "waive" && !state.dentalWaiveReason,
      vision: state.vision === "waive" && !state.visionWaiveReason,
    };
    setErrors(e);
    if (e.dental || e.vision) return;
    router.push("/portal/beneficiaries");
  }

  function block(line: Line) {
    const plans = line === "dental" ? DENTAL_PLANS : VISION_PLANS;
    const value = line === "dental" ? state.dental : state.vision;
    const reason = line === "dental" ? state.dentalWaiveReason : state.visionWaiveReason;
    const isWaived = value === "waive";
    const choose = (v: string) =>
      update(line === "dental" ? { dental: v as typeof state.dental } : { vision: v as typeof state.vision });
    const setReason = (r: WaiveReason | "") =>
      update(line === "dental" ? { dentalWaiveReason: r } : { visionWaiveReason: r });

    return (
      <fieldset
        className={cx(
          "m-0 flex flex-col gap-2.5 rounded-2xl bg-surface p-4",
          isWaived ? "border border-line" : "border-2 border-brand",
        )}
      >
        <legend className="px-1.5 font-bold">{t(line)}</legend>
        {plans.map((p) => (
          <label key={p.id} className="flex min-h-11 cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              name={line}
              checked={value === p.id}
              onChange={() => choose(p.id)}
              className="m-0 h-[22px] w-[22px] accent-brand"
            />
            <span className="flex-1">
              <b>{p.name}</b>
              <span className="block text-[13px] text-muted">{covered}</span>
            </span>
            <span className="font-bold">{money(p.rates[state.tier])}</span>
          </label>
        ))}
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5">
          <input
            type="radio"
            name={line}
            checked={isWaived}
            onChange={() => choose("waive")}
            className="m-0 h-[22px] w-[22px] accent-brand"
          />
          <span className="flex-1 font-semibold">{line === "dental" ? t("waiveDental") : t("waiveVision")}</span>
        </label>
        {isWaived ? (
          <>
            <label className={labelClass}>
              {tCompare("reason")}
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value as WaiveReason | "");
                  setErrors((x) => ({ ...x, [line]: false }));
                }}
                aria-invalid={errors[line] || undefined}
                aria-describedby={errors[line] ? `err-${line}` : undefined}
                className={cx(inputClass, errors[line] && invalidClass)}
              >
                <option value="">{tc("chooseOne")}</option>
                {WAIVE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {tc(`waiveReasons.${r}`)}
                  </option>
                ))}
              </select>
            </label>
            {errors[line] ? <FieldError id={`err-${line}`}>{tCompare("errReason")}</FieldError> : null}
          </>
        ) : null}
      </fieldset>
    );
  }

  return (
    <PortalPage>
      <StepHeader step="elect" backHref="/portal/compare" />
      <PortalMain className="gap-3.5">
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="m-0 leading-normal text-ink-2">
          {medicalPlan ? t("intro", { plan: medicalPlan.name }) : t("introWaived")}
        </p>
        {block("dental")}
        {block("vision")}
      </PortalMain>
      <ActionBar>
        <div className="flex justify-between" aria-live="polite">
          <span className="text-muted">{t("soFar")}</span>
          <span className="font-bold">{money(totals.total)}</span>
        </div>
        <button type="button" onClick={next} className={btn.primary}>
          {tc("continue")}
        </button>
      </ActionBar>
    </PortalPage>
  );
}
