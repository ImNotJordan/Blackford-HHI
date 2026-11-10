"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ChevronRight, FileText } from "lucide-react";
import { BrandHeader, PortalMain, PortalPage } from "@/components/portal/chrome";
import { card, cx } from "@/components/ui";
import { CONTACT, COVERAGE_STARTS, DENTAL_PLANS, GROUP, MEDICAL_PLANS, VISION_PLANS, WINDOW_CLOSES, money, wholeMoney } from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";
import { useCoveredLabel } from "@/lib/use-covered-label";

const actionRow =
  "flex min-h-[52px] items-center justify-between gap-3 rounded-[14px] border border-line bg-surface px-4 font-semibold text-ink no-underline hover:bg-canvas hover:text-ink";

export function MyBenefitsScreen() {
  const t = useTranslations("myBenefits");
  const tc = useTranslations("common");
  const format = useFormatter();
  const { state, totals } = useEnrollment();
  const covered = useCoveredLabel();

  const medical = MEDICAL_PLANS.find((p) => p.id === state.medical);
  const dental = DENTAL_PLANS.find((p) => p.id === state.dental);
  const vision = VISION_PLANS.find((p) => p.id === state.vision);
  const firstBeneficiary = state.primary[0]?.name.split(" ")[0] ?? "—";

  const rows = [
    { key: "medical", label: t("medical"), plan: medical?.name, amount: totals.medical },
    { key: "dental", label: t("dental"), plan: dental?.name, amount: totals.dental },
    { key: "vision", label: t("vision"), plan: vision?.name, amount: totals.vision },
  ];

  const docs = [t("docElection", { year: GROUP.planYear }), t("docConsent"), t("docConfirmation")];

  return (
    <PortalPage>
      <BrandHeader
        right={
          <Link href="/portal/sign-in" className="inline-flex min-h-11 items-center px-2.5 text-[13px] font-semibold">
            {tc("signOut")}
          </Link>
        }
      />
      <PortalMain className="gap-3.5">
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>

        <Link href="/portal/start" className="flex flex-col gap-1 rounded-2xl bg-navy p-4 text-white no-underline hover:bg-navy-active hover:text-white">
          <span className="text-xs font-bold tracking-[0.08em] text-gold uppercase">{t("renewalEyebrow")}</span>
          <span className="text-[17px] font-bold">{t("renewalTitle", { year: GROUP.planYear + 1 })}</span>
          <span className="text-[13px] text-on-navy">
            {t("renewalBody", { date: format.dateTime(WINDOW_CLOSES, { month: "short", day: "numeric" }) })}
          </span>
        </Link>

        <section aria-labelledby="cov" className={cx(card, "px-4 py-1")}>
          <h2 id="cov" className="mt-3 mb-0 text-base font-bold">
            {t("coverageTitle", {
              year: GROUP.planYear,
              date: format.dateTime(COVERAGE_STARTS, { month: "short", day: "numeric" }),
            })}
          </h2>
          {rows.map((r) => (
            <div key={r.key} className="flex justify-between gap-3 border-b border-line-soft py-3">
              <span>
                <b>{r.label}</b>
                {r.plan ? ` · ${r.plan}` : ""}
                <span className="block text-[13px] text-muted">{r.plan ? covered : t("waived")}</span>
              </span>
              <span className="font-bold">{money(r.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 py-3">
            <span>
              <b>{t("basicLife")}</b> · {wholeMoney(GROUP.basicLife)}
              <span className="block text-[13px] text-muted">{t("beneficiary", { name: firstBeneficiary })}</span>
            </span>
            <span className="font-bold">{t("paid")}</span>
          </div>
        </section>

        <Link href="/portal/life-event" className={actionRow}>
          {t("report")}
          <ChevronRight aria-hidden="true" size={20} />
        </Link>

        <details className="group rounded-[14px] border border-line bg-surface">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold [&::-webkit-details-marker]:hidden">
            {t("documents", { count: docs.length })}
            <ChevronRight aria-hidden="true" size={20} className="transition-transform group-open:rotate-90" />
          </summary>
          <ul className="m-0 flex list-none flex-col border-t border-line-soft px-4 py-2">
            {docs.map((d) => (
              <li key={d} className="flex min-h-11 items-center gap-2.5 text-sm">
                <FileText aria-hidden="true" size={18} className="text-brand" />
                {d}
              </li>
            ))}
          </ul>
        </details>

        <Link href="/portal/help" className={actionRow}>
          {t("help")}
          <ChevronRight aria-hidden="true" size={20} />
        </Link>
      </PortalMain>
      <div className="border-t border-line bg-surface px-4 pt-3 pb-5 text-center text-[13px] text-muted">
        {t("questions")}{" "}
        <a href={CONTACT.phoneHref} className="font-bold">
          {t("call", { name: CONTACT.firstName })}
        </a>
      </div>
    </PortalPage>
  );
}
