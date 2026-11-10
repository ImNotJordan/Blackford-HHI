"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Check, FileDown } from "lucide-react";
import { ActionBar, BrandHeader, PortalMain, PortalPage } from "@/components/portal/chrome";
import { btn, card, cx } from "@/components/ui";
import { CONTACT, COVERAGE_STARTS, GROUP, MEMBER } from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";

const FIRST_DEDUCTION = new Date(2027, 2, 6); // Mar 6, 2027 paycheck

export function DoneScreen() {
  const t = useTranslations("done");
  const format = useFormatter();
  const { state } = useEnrollment();
  const signedAt = state.signedAt;

  if (!signedAt) {
    return (
      <PortalPage>
        <BrandHeader />
        <PortalMain>
          <h1 className="m-0 font-display text-2xl font-extrabold">{t("notSignedTitle")}</h1>
          <p className="m-0 leading-normal text-ink-2">{t("notSignedBody")}</p>
          <Link href="/portal/sign" className={btn.primary}>
            {t("goSign")}
          </Link>
        </PortalMain>
      </PortalPage>
    );
  }

  const short = (d: Date) => format.dateTime(d, { month: "short", day: "numeric" });
  const long = (d: Date) => format.dateTime(d, { month: "long", day: "numeric" });

  return (
    <PortalPage>
      <BrandHeader />
      <PortalMain className="pt-7">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand" aria-hidden="true">
          <Check size={28} strokeWidth={2.5} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[26px] font-extrabold tracking-tight">{t("title", { name: MEMBER.firstName })}</h1>
          <p className="m-0 leading-normal text-ink-2">
            {t("body", {
              date: short(signedAt),
              time: format.dateTime(signedAt, { hour: "numeric", minute: "2-digit" }),
              year: GROUP.planYear,
              start: long(COVERAGE_STARTS),
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className={cx(card, "no-print flex min-h-11 items-center gap-3 px-4 py-3.5 text-left text-ink hover:bg-canvas")}
        >
          <FileDown aria-hidden="true" size={24} className="text-brand" />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="font-bold">{t("pdf")}</span>
            <span className="text-[13px] text-muted">{t("pdfSub")}</span>
          </span>
        </button>

        <section aria-labelledby="next" className={cx(card, "flex flex-col gap-2.5 px-4 py-3.5")}>
          <h2 id="next" className="m-0 text-base font-bold">
            {t("nextTitle")}
          </h2>
          <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 leading-normal text-ink-2">
            <li>{t("next1")}</li>
            <li>{t("next2", { date: long(COVERAGE_STARTS) })}</li>
            <li>{t("next3", { date: long(FIRST_DEDUCTION) })}</li>
          </ol>
        </section>

        <section aria-labelledby="later" className={cx(card, "flex flex-col gap-2 px-4 py-3.5")}>
          <h2 id="later" className="m-0 text-base font-bold">
            {t("laterTitle")}
          </h2>
          <p className="m-0 text-[13px] leading-normal text-muted">{t("laterBody")}</p>
          <Link href="/portal/life-event" className="inline-flex min-h-11 items-center font-bold">
            {t("report")}
          </Link>
        </section>

        <Link href="/portal/my-benefits" className={btn.secondary}>
          {t("myBenefits")}
        </Link>
      </PortalMain>
      <ActionBar>
        <span className="text-center text-[13px] text-muted">{t("contact", { name: CONTACT.name })}</span>
        <a href={CONTACT.phoneHref} className="mx-auto inline-flex min-h-11 items-center font-bold">
          {t("call", { phone: CONTACT.phoneDisplay })}
        </a>
      </ActionBar>
    </PortalPage>
  );
}
