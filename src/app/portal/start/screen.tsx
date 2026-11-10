"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ActionBar, BrandHeader, LanguageToggle, PortalMain, PortalPage } from "@/components/portal/chrome";
import { FieldError, btn, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { GROUP, MEMBER, WINDOW_CLOSES, daysUntil } from "@/lib/demo-data";
import { STEPS, useEnrollment } from "@/lib/enrollment-store";

export function StartScreen() {
  const t = useTranslations("start");
  const tc = useTranslations("common");
  const format = useFormatter();
  const router = useRouter();
  const { state, update, reachStep } = useEnrollment();
  const [address, setAddress] = useState(state.address);
  const [mobile, setMobile] = useState(state.mobile);
  const [errors, setErrors] = useState<{ address?: string; mobile?: string }>({});

  useEffect(() => reachStep("details"), [reachStep]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!address.trim()) next.address = t("errAddress");
    if (mobile.replace(/\D/g, "").length !== 10) next.mobile = t("errMobile");
    setErrors(next);
    if (Object.keys(next).length) return;
    update({ address: address.trim(), mobile: mobile.trim() });
    router.push("/portal/dependents");
  }

  return (
    <PortalPage>
      <BrandHeader right={<LanguageToggle />} />
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <PortalMain>
          <div className="flex flex-col gap-1.5">
            <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">
              {t("title", { year: GROUP.planYear, name: MEMBER.firstName })}
            </h1>
            <p className="m-0 leading-normal text-ink-2">{t("intro", { group: GROUP.name })}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-warn-line bg-warn-tint px-3.5 py-3 text-warn-ink">
            <span className="font-semibold">
              {t("finishBy", { date: format.dateTime(WINDOW_CLOSES, { month: "short", day: "numeric" }) })}
            </span>
            <span className="text-[13px]">{t("daysLeft", { days: daysUntil(WINDOW_CLOSES) })}</span>
          </div>

          <ol aria-label={t("stepsLabel")} className="m-0 list-none rounded-2xl border border-line bg-surface px-4 py-1">
            {STEPS.map((s, i) => {
              const current = i === 0;
              return (
                <li
                  key={s.id}
                  aria-current={current ? "step" : undefined}
                  className="flex items-center gap-3 border-b border-line-soft py-3 last:border-b-0"
                >
                  <span
                    className={cx(
                      "flex h-[26px] w-[26px] items-center justify-center rounded-full text-[13px] font-bold",
                      current ? "bg-brand text-white" : "bg-sunken text-ink-2",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cx("flex-1", current && "font-semibold")}>{tc(`steps.${s.id}`)}</span>
                  {current ? <span className="text-[13px] text-muted">{tc("now")}</span> : null}
                </li>
              );
            })}
          </ol>

          <section aria-labelledby="det" className="flex flex-col gap-2.5">
            <h2 id="det" className="m-0 text-base font-bold">
              {t("checkDetails")}
            </h2>
            <label className={labelClass}>
              {t("address")}
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={errors.address ? "err-address" : undefined}
                className={cx(inputClass, errors.address && invalidClass)}
              />
            </label>
            {errors.address ? <FieldError id="err-address">{errors.address}</FieldError> : null}
            <label className={labelClass}>
              {t("mobile")}
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={errors.mobile ? true : undefined}
                aria-describedby={errors.mobile ? "err-mobile" : undefined}
                className={cx(inputClass, errors.mobile && invalidClass)}
              />
            </label>
            {errors.mobile ? <FieldError id="err-mobile">{errors.mobile}</FieldError> : null}
          </section>
        </PortalMain>
        <ActionBar>
          <button type="submit" className={btn.primary}>
            {tc("continue")}
          </button>
        </ActionBar>
      </form>
    </PortalPage>
  );
}
