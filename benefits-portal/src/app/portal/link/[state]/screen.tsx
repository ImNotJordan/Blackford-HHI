"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ActionBar, BrandHeader, LanguageToggle, PortalMain, PortalPage } from "@/components/portal/chrome";
import { Alert, btn, card, cx } from "@/components/ui";
import {
  CONTACT,
  DENTAL_PLANS,
  GROUP,
  MEDICAL_PLANS,
  MEMBER,
  VISION_PLANS,
  WINDOW_CLOSES,
  daysUntil,
  money,
} from "@/lib/demo-data";
import { STEPS, useEnrollment } from "@/lib/enrollment-store";
import type { LinkState } from "./states";

/** Fallback signature time for the "already enrolled" state when visited directly. */
const DEMO_SIGNED_AT = new Date(2027, 1, 16, 9, 5);

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="m-0 font-display text-[22px] font-extrabold tracking-tight">{children}</h1>;
}

export function LinkStateScreen({ state: linkState }: { state: LinkState }) {
  const t = useTranslations("link");
  const tc = useTranslations("common");
  const tSignIn = useTranslations("signIn");
  const tMine = useTranslations("myBenefits");
  const format = useFormatter();
  const router = useRouter();
  const { state, update, totals } = useEnrollment();
  const [notice, setNotice] = useState("");
  const short = (d: Date) => format.dateTime(d, { month: "short", day: "numeric" });

  let body: React.ReactNode = null;
  let actions: React.ReactNode = null;

  switch (linkState) {
    case "expired":
      body = (
        <>
          <Title>{t("expired.title")}</Title>
          <p className="m-0 leading-normal text-ink-2">{t("expired.body")}</p>
          {notice ? <Alert tone="ok" role="status">{notice}</Alert> : null}
        </>
      );
      actions = (
        <>
          <button type="button" className={btn.primary} onClick={() => setNotice(t("expired.sentText"))}>
            {t("expired.text")}
          </button>
          <button type="button" className={btn.secondary} onClick={() => setNotice(t("expired.sentEmail"))}>
            {t("expired.email")}
          </button>
        </>
      );
      break;

    case "welcome-back": {
      const stopIndex = STEPS.findIndex((s) => s.id === state.lastStep);
      body = (
        <>
          <Title>{t("welcome.title", { name: MEMBER.firstName })}</Title>
          <p className="m-0 leading-normal text-ink-2">
            {t.rich("welcome.body", { step: tc(`steps.${state.lastStep}`), b: (c) => <b>{c}</b> })}
          </p>
          <ol className={cx(card, "m-0 flex list-none flex-col gap-1.5 p-3.5 text-sm")}>
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                aria-current={i === stopIndex ? "step" : undefined}
                className={cx(
                  "flex items-center gap-2",
                  i < stopIndex && "text-brand",
                  i === stopIndex && "font-bold",
                  i > stopIndex && "text-muted",
                )}
              >
                {i < stopIndex ? <Check aria-hidden="true" size={16} /> : i === stopIndex ? <ChevronRight aria-hidden="true" size={16} /> : <span className="w-4" />}
                {tc(`steps.${s.id}`)}
              </li>
            ))}
          </ol>
          <p className="m-0 text-[13px] text-warn">
            {t("welcome.left", { days: daysUntil(WINDOW_CLOSES), date: short(WINDOW_CLOSES) })}
          </p>
        </>
      );
      actions = (
        <Link href={STEPS[stopIndex]?.href ?? "/portal/start"} className={btn.primary}>
          {t("welcome.resume")}
        </Link>
      );
      break;
    }

    case "enrolled": {
      const signedAt = state.signedAt ?? DEMO_SIGNED_AT;
      const line = (label: string, plan: string | undefined) => `${label} ${plan ?? tMine("waived").toLowerCase()}`;
      const summary = [
        line(tMine("medical"), MEDICAL_PLANS.find((p) => p.id === state.medical)?.name),
        line(tMine("dental"), DENTAL_PLANS.find((p) => p.id === state.dental)?.name),
        line(tMine("vision"), VISION_PLANS.find((p) => p.id === state.vision)?.name),
      ].join(" · ");
      body = (
        <>
          <Title>{t("enrolled.title")}</Title>
          <p className="m-0 leading-normal text-ink-2">
            {t("enrolled.body", {
              year: GROUP.planYear,
              date: short(signedAt),
              time: format.dateTime(signedAt, { hour: "numeric", minute: "2-digit" }),
            })}
          </p>
          <div className={cx(card, "p-3.5 text-sm leading-relaxed")}>
            {summary}
            <br />
            <b>
              {money(totals.total)} {tc("perPaycheck")}
            </b>
          </div>
          <p className="m-0 text-[13px] leading-normal text-muted">{t("enrolled.change", { date: short(WINDOW_CLOSES) })}</p>
        </>
      );
      actions = (
        <>
          <Link href="/portal/my-benefits" className={btn.primary}>
            {t("enrolled.see")}
          </Link>
          <button
            type="button"
            className={btn.secondary}
            onClick={() => {
              // Reopening voids the signature status; the signed PDF is kept on the record.
              update({ signedAt: null });
              router.push("/portal/compare");
            }}
          >
            {t("enrolled.reopen")}
          </button>
        </>
      );
      break;
    }

    case "closed":
      body = (
        <>
          <Title>{t("closed.title")}</Title>
          <p className="m-0 leading-normal text-ink-2">
            {t("closed.body", { group: GROUP.shortName, date: short(WINDOW_CLOSES), contact: CONTACT.firstName })}
          </p>
          <p className="m-0 text-sm leading-normal text-muted">{t("closed.lifeChange")}</p>
        </>
      );
      actions = (
        <>
          <a href={CONTACT.phoneHref} className={btn.primary}>
            {t("closed.call", { name: CONTACT.firstName })}
          </a>
          <Link href="/portal/life-event" className={btn.secondary}>
            {t("closed.report")}
          </Link>
        </>
      );
      break;

    case "signed-out":
      body = (
        <>
          <Title>{t("signedOut.title")}</Title>
          <p className="m-0 leading-normal text-ink-2">{t("signedOut.body")}</p>
        </>
      );
      actions = (
        <Link href="/portal/sign-in" className={btn.primary}>
          {t("signedOut.newCode")}
        </Link>
      );
      break;

    case "not-mine":
      body = (
        <>
          <Title>{t("notMine.title")}</Title>
          <p className="m-0 leading-normal text-ink-2">{t("notMine.body")}</p>
          <p className="m-0 text-xs leading-normal text-muted">{tSignIn("privacy", { phone: CONTACT.phoneDisplay })}</p>
        </>
      );
      break;
  }

  return (
    <PortalPage>
      <BrandHeader right={<LanguageToggle />} />
      <PortalMain className="gap-3.5 px-[18px] py-[22px]">{body}</PortalMain>
      {actions ? <ActionBar>{actions}</ActionBar> : null}
    </PortalPage>
  );
}
