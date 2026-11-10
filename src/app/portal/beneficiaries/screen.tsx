"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useId, useState } from "react";
import { ActionBar, PortalMain, PortalPage, StepHeader } from "@/components/portal/chrome";
import { Alert, FieldError, btn, card, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { GROUP, ageOn, parseUsDate, wholeMoney } from "@/lib/demo-data";
import { useEnrollment, type Beneficiary } from "@/lib/enrollment-store";

type Group = "primary" | "contingent";

function sumShares(list: Beneficiary[]) {
  return list.reduce((acc, b) => acc + (Number(b.share) || 0), 0);
}

function AddPerson({ onAdd, onCancel }: { onAdd: (name: string, relation: string) => void; onCancel: () => void }) {
  const t = useTranslations("beneficiaries");
  const tc = useTranslations("common");
  const uid = useId();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-canvas p-3">
      <label className={labelClass}>
        {t("nameLabel")}
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
          aria-invalid={error || undefined}
          aria-describedby={error ? `${uid}-err` : undefined}
          className={cx(inputClass, error && invalidClass)}
        />
      </label>
      {error ? <FieldError id={`${uid}-err`}>{t("errName")}</FieldError> : null}
      <label className={labelClass}>
        {t("relationLabel")}
        <input value={relation} onChange={(e) => setRelation(e.target.value)} className={inputClass} />
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={btn.secondary}>
          {tc("cancel")}
        </button>
        <button
          type="button"
          onClick={() => (name.trim() ? onAdd(name.trim(), relation.trim()) : setError(true))}
          className={btn.primary}
        >
          {t("add")}
        </button>
      </div>
    </div>
  );
}

export function BeneficiariesScreen() {
  const t = useTranslations("beneficiaries");
  const tc = useTranslations("common");
  const router = useRouter();
  const { state, update } = useEnrollment();
  const [adding, setAdding] = useState<Group | null>(null);
  const [triedNext, setTriedNext] = useState(false);

  const primarySum = sumShares(state.primary);
  const contingentSum = sumShares(state.contingent);
  const primaryOk = state.primary.length > 0 && primarySum === 100;
  const contingentOk = state.contingent.length === 0 || contingentSum === 100;

  const named = new Set([...state.primary, ...state.contingent].map((b) => b.name));
  const suggestions = state.dependents.filter((d) => !named.has(`${d.firstName} ${d.lastName}`));

  const hasMinor = [...state.primary, ...state.contingent].some((b) => {
    const dep = state.dependents.find((d) => `${d.firstName} ${d.lastName}` === b.name);
    const dob = dep ? parseUsDate(dep.dob) : null;
    return dob ? ageOn(dob) < 18 : false;
  });

  function setList(group: Group, list: Beneficiary[]) {
    update(group === "primary" ? { primary: list } : { contingent: list });
  }

  function add(group: Group, name: string, relation: string) {
    const list = group === "primary" ? state.primary : state.contingent;
    const share = list.length === 0 ? "100" : "0";
    setList(group, [...list, { id: `b${Date.now()}`, name, relation, share }]);
    setAdding(null);
  }

  function next() {
    setTriedNext(true);
    if (primaryOk && contingentOk) router.push("/portal/sign");
  }

  function section(group: Group) {
    const list = group === "primary" ? state.primary : state.contingent;
    const sum = group === "primary" ? primarySum : contingentSum;
    const ok = group === "primary" ? primaryOk : contingentOk;
    const heading = group === "primary" ? t("primary") : t("contingent");
    const showSumError = list.length > 0 && sum !== 100;

    return (
      <section aria-labelledby={`h-${group}`} className={cx(card, "flex flex-col gap-2.5 px-4 py-3.5")}>
        <div className="flex items-baseline justify-between">
          <h2 id={`h-${group}`} className="m-0 text-base font-bold">
            {heading}
          </h2>
          {list.length ? (
            <span className={cx("rounded-md px-2 py-[3px] text-xs font-bold", ok ? "bg-brand-tint text-brand" : "bg-error-tint text-error")}>
              {sum}%
            </span>
          ) : (
            <span className="rounded-md bg-sunken px-2 py-[3px] text-xs font-bold text-ink-2">
              {group === "primary" ? "0%" : t("optional")}
            </span>
          )}
        </div>
        {group === "contingent" ? <p className="m-0 text-[13px] leading-normal text-muted">{t("contingentNote")}</p> : null}

        {list.map((b) => {
          const dep = state.dependents.find((d) => `${d.firstName} ${d.lastName}` === b.name);
          return (
            <div key={b.id} className="flex items-center gap-2 py-1.5">
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="font-semibold">{b.name}</span>
                <span className="text-[13px] text-muted">
                  {dep ? t("fromDependents", { relation: tc(`relation.${dep.relation}`) }) : b.relation || t("addedByYou")}
                </span>
              </div>
              <label className="flex items-center gap-1">
                <span className="sr-only">{t("share", { name: b.name })}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={b.share}
                  onChange={(e) =>
                    setList(
                      group,
                      list.map((x) => (x.id === b.id ? { ...x, share: e.target.value.replace(/\D/g, "").slice(0, 3) } : x)),
                    )
                  }
                  aria-invalid={showSumError || undefined}
                  aria-describedby={showSumError ? `sum-${group}` : undefined}
                  className="min-h-11 w-14 rounded-[10px] border border-field text-center text-ink"
                />
                %
              </label>
              <button
                type="button"
                aria-label={t("remove", { name: b.name })}
                onClick={() => setList(group, list.filter((x) => x.id !== b.id))}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
          );
        })}

        {showSumError ? (
          <div id={`sum-${group}`}>
            <Alert tone="error">{t.rich("errSum", { group: heading, sum, b: (c) => <b>{c}</b> })}</Alert>
          </div>
        ) : null}
        {group === "primary" && list.length === 0 && triedNext ? (
          <FieldError id="no-primary">{t("errNoPrimary")}</FieldError>
        ) : null}

        {adding === group ? (
          <AddPerson onAdd={(n, r) => add(group, n, r)} onCancel={() => setAdding(null)} />
        ) : (
          <div className="flex flex-col gap-2">
            {suggestions.length ? (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => add(group, `${d.firstName} ${d.lastName}`, d.relation)}
                    className="min-h-11 rounded-full border border-line bg-surface px-3 text-[13px] font-semibold text-ink hover:bg-canvas"
                  >
                    {t("addNamed", { name: d.firstName })}
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setAdding(group)}
              className="min-h-12 rounded-xl border border-dashed border-field bg-surface font-semibold text-brand hover:bg-canvas"
            >
              {t("addPerson")}
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <PortalPage>
      <StepHeader step="beneficiaries" backHref="/portal/elect" />
      <PortalMain className="gap-3.5">
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="m-0 leading-normal text-ink-2">
          {t("intro", { amount: wholeMoney(GROUP.basicLife), group: GROUP.shortName })}
        </p>
        {section("primary")}
        {section("contingent")}
        {hasMinor ? (
          <Alert tone="info" role="status">
            {t("minorNote")}
          </Alert>
        ) : null}
      </PortalMain>
      <ActionBar>
        <button type="button" onClick={next} disabled={triedNext && !(primaryOk && contingentOk)} className={btn.primary}>
          {t("next")}
        </button>
      </ActionBar>
    </PortalPage>
  );
}
