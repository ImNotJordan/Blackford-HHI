"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ActionBar, BackHeader, PortalMain, PortalPage } from "@/components/portal/chrome";
import { Alert, FieldError, Tag, btn, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { CONTACT, DENTAL_PLANS, MEDICAL_PLANS, VISION_PLANS } from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";

const NEEDS = ["idCard", "details", "claim", "other"] as const;
type Need = (typeof NEEDS)[number];

export function HelpScreen() {
  const t = useTranslations("help");
  const { state, update } = useEnrollment();
  const [need, setNeed] = useState<Need>("idCard");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const coveredDependents = state.dependents.filter(
    (d) =>
      state.tier === "family" ||
      (state.tier === "spouse" && d.relation === "spouse") ||
      (state.tier === "kids" && d.relation === "child"),
  );
  const covered = [t("forMe"), ...coveredDependents.map((d) => d.firstName)];
  const plans = [
    MEDICAL_PLANS.find((p) => p.id === state.medical)?.name,
    DENTAL_PLANS.find((p) => p.id === state.dental)?.name,
    VISION_PLANS.find((p) => p.id === state.vision)?.name,
  ].filter((p): p is string => Boolean(p));
  const cards = plans.flatMap((plan) => covered.map((who) => t("cardFor", { plan, who })));
  const [card, setCard] = useState(cards[0] ?? "");

  function send() {
    if (need === "other" && !notes.trim()) {
      setError(true);
      return;
    }
    update({
      requests: [{ id: `q${Date.now()}`, kind: need, sent: "today", status: "received" }, ...state.requests],
    });
    setNotes("");
    setSent(true);
  }

  return (
    <PortalPage>
      <BackHeader href="/portal/my-benefits" label={t("title")} ariaLabel={t("backAria")} />
      <PortalMain className="gap-3 py-[18px]">
        <h1 className="sr-only">{t("title")}</h1>
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 font-display text-xl font-extrabold">{t("need")}</legend>
          {NEEDS.map((n) => (
            <label
              key={n}
              className={cx(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] bg-surface px-3.5 py-2",
                need === n ? "border-2 border-brand" : "border border-line",
              )}
            >
              <input
                type="radio"
                name="need"
                checked={need === n}
                onChange={() => {
                  setNeed(n);
                  setSent(false);
                  setError(false);
                }}
                className="m-0 h-[22px] w-[22px] accent-brand"
              />
              <span className="flex-1">
                <b>{t(`kinds.${n}`)}</b>
                {n !== "other" ? <span className="block text-[13px] text-muted">{t(`kindSub.${n}`)}</span> : null}
              </span>
            </label>
          ))}
        </fieldset>

        {need === "idCard" && cards.length ? (
          <label className={labelClass}>
            {t("whichCard")}
            <select value={card} onChange={(e) => setCard(e.target.value)} className={inputClass}>
              {cards.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        ) : null}

        <label className={labelClass}>
          {need === "other" ? t("notesRequired") : t("notes")}
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError(false);
            }}
            aria-invalid={error || undefined}
            aria-describedby={`no-medical${error ? " err-notes" : ""}`}
            className={cx(inputClass, "py-2.5", error && invalidClass)}
          />
        </label>
        {error ? <FieldError id="err-notes">{t("errNotes")}</FieldError> : null}
        <p id="no-medical" className="m-0 text-xs leading-normal text-muted">
          {t("noMedical", { name: CONTACT.firstName })}
        </p>

        {sent ? <Alert tone="ok" role="status">{t("sent")}</Alert> : null}

        <section aria-labelledby="open" className="flex flex-col gap-2 rounded-[14px] border border-line bg-surface px-3.5 py-3">
          <h2 id="open" className="m-0 text-[13px] font-bold">
            {t("open")}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {state.requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 text-[13px] text-muted">
                <span>
                  {t("sentOn", {
                    kind: t(`kinds.${r.kind as Need | "address"}`),
                    date: r.sent === "today" ? t("today") : r.sent,
                  })}
                </span>
                {r.status === "inProgress" ? <Tag tone="info">{t("inProgress")}</Tag> : <Tag tone="mute">{t("received")}</Tag>}
              </li>
            ))}
          </ul>
        </section>
      </PortalMain>
      <ActionBar>
        <button type="button" onClick={send} className={btn.primary}>
          {t("send")}
        </button>
        <span className="text-center text-xs text-muted">{t("footnote")}</span>
      </ActionBar>
    </PortalPage>
  );
}
