"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { ActionBar, PortalMain, PortalPage, SavedNote, StepHeader } from "@/components/portal/chrome";
import { Alert, FieldError, btn, card, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import {
  CHILD_AGE_LIMIT,
  CONTACT,
  GROUP,
  WINDOW_CLOSES,
  ageOn,
  parseUsDate,
  TODAY,
  type Dependent,
  type Relation,
} from "@/lib/demo-data";
import { useEnrollment } from "@/lib/enrollment-store";

type DobCheck = { error: string; overAge: boolean };

function useDobCheck() {
  const t = useTranslations("dependents");
  return (dob: string, relation: Relation, name: string): DobCheck => {
    const d = parseUsDate(dob);
    if (!d) return { error: t("errDobFormat"), overAge: false };
    if (d > TODAY) return { error: t("errDobFuture"), overAge: false };
    const age = ageOn(d);
    if (relation === "child" && age >= CHILD_AGE_LIMIT) {
      return {
        error: t("errOverAge", { name, age, group: GROUP.shortName, limit: CHILD_AGE_LIMIT }),
        overAge: true,
      };
    }
    return { error: "", overAge: false };
  };
}

function initials(d: Dependent) {
  return `${d.firstName[0] ?? ""}${d.lastName[0] ?? ""}`.toUpperCase();
}

function DisabilityRequest({ name }: { name: string }) {
  const t = useTranslations("dependents");
  const [sent, setSent] = useState(false);
  if (sent) return <Alert tone="ok" role="status">{t("disabilitySent", { contact: CONTACT.name })}</Alert>;
  return (
    <button type="button" onClick={() => setSent(true)} className="min-h-11 self-start text-left text-sm font-semibold text-brand underline">
      {t("disability", { name })}
    </button>
  );
}

function DependentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Dependent;
  onSave: (d: Dependent) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dependents");
  const tc = useTranslations("common");
  const check = useDobCheck();
  const uid = useId();
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "Delgado");
  const [relation, setRelation] = useState<Relation>(initial?.relation ?? "child");
  const [dob, setDob] = useState(initial?.dob ?? "");
  const [ssn, setSsn] = useState("");
  const [errors, setErrors] = useState<{ name?: string; dob?: string; ssn?: string; overAge?: boolean }>({});
  const displayName = firstName.trim() || t("addTitle");

  function save() {
    const next: typeof errors = {};
    if (!firstName.trim() || !lastName.trim()) next.name = t("errName");
    const c = check(dob, relation, firstName.trim() || "—");
    if (c.error) {
      next.dob = c.error;
      next.overAge = c.overAge;
    }
    const ssnDigits = ssn.replace(/\D/g, "");
    if (ssnDigits && ssnDigits.length !== 9) next.ssn = t("errSsn");
    setErrors(next);
    if (next.name || next.dob || next.ssn) return;
    // The SSN would go straight to the server (encrypted with Cloud KMS); it is never kept in page state.
    setSsn("");
    onSave({
      id: initial?.id ?? `d${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      relation,
      dob: dob.trim(),
    });
  }

  return (
    <div className={cx(card, "flex flex-col gap-3 p-4")}>
      <h2 className="m-0 font-display text-lg font-extrabold">
        {initial ? t("editTitle", { name: initial.firstName }) : t("addTitle")}
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        <label className={labelClass}>
          {t("firstName")}
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name` : undefined}
            className={cx(inputClass, errors.name && invalidClass)}
          />
        </label>
        <label className={labelClass}>
          {t("lastName")}
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name` : undefined}
            className={cx(inputClass, errors.name && invalidClass)}
          />
        </label>
      </div>
      {errors.name ? <FieldError id={`${uid}-name`}>{errors.name}</FieldError> : null}
      <label className={labelClass}>
        {t("relationLabel")}
        <select value={relation} onChange={(e) => setRelation(e.target.value as Relation)} className={inputClass}>
          <option value="spouse">{tc("relation.spouse")}</option>
          <option value="child">{tc("relation.child")}</option>
        </select>
      </label>
      <label className={labelClass}>
        {t("dob")}
        <input
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
            setErrors((x) => ({ ...x, dob: undefined, overAge: false }));
          }}
          placeholder={t("dobPlaceholder")}
          inputMode="numeric"
          aria-invalid={errors.dob ? true : undefined}
          aria-describedby={errors.dob ? `${uid}-dob` : undefined}
          className={cx(inputClass, errors.dob && invalidClass)}
        />
      </label>
      {errors.dob ? <FieldError id={`${uid}-dob`}>{errors.dob}</FieldError> : null}
      {errors.overAge ? <DisabilityRequest name={firstName.trim()} /> : null}
      {!initial ? (
        <>
          <label className={labelClass}>
            {t("ssn")}
            <input
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              placeholder={t("ssnPlaceholder")}
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={errors.ssn ? true : undefined}
              aria-describedby={`${uid}-ssn-hint${errors.ssn ? ` ${uid}-ssn` : ""}`}
              className={cx(inputClass, errors.ssn && invalidClass)}
            />
          </label>
          <p id={`${uid}-ssn-hint`} className="m-0 text-xs leading-normal text-muted">
            {t("ssnHint")}
          </p>
          {errors.ssn ? <FieldError id={`${uid}-ssn`}>{errors.ssn}</FieldError> : null}
        </>
      ) : null}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={btn.secondary}>
          {tc("cancel")}
        </button>
        <button type="button" onClick={save} disabled={errors.overAge} className={btn.primary}>
          {initial ? t("save") : t("addNamed", { name: displayName })}
        </button>
      </div>
    </div>
  );
}

export function DependentsScreen() {
  const t = useTranslations("dependents");
  const tc = useTranslations("common");
  const format = useFormatter();
  const router = useRouter();
  const check = useDobCheck();
  const { state, update } = useEnrollment();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [missingDob, setMissingDob] = useState<Record<string, string>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, DobCheck>>({});

  function saveDependent(d: Dependent) {
    const exists = state.dependents.some((x) => x.id === d.id);
    update({ dependents: exists ? state.dependents.map((x) => (x.id === d.id ? d : x)) : [...state.dependents, d] });
    setEditing(null);
    setAdding(false);
  }

  function next() {
    const errs: Record<string, DobCheck> = {};
    const filled = state.dependents.map((d) => {
      if (d.dob) return d;
      const typed = missingDob[d.id] ?? "";
      if (!typed.trim()) {
        errs[d.id] = { error: t("errMissing", { name: d.firstName }), overAge: false };
        return d;
      }
      const c = check(typed, d.relation, d.firstName);
      if (c.error) errs[d.id] = c;
      return { ...d, dob: typed.trim() };
    });
    setRowErrors(errs);
    if (Object.keys(errs).length) return;
    update({ dependents: filled });
    router.push("/portal/compare");
  }

  return (
    <PortalPage>
      <StepHeader step="dependents" backHref="/portal/start" />
      <PortalMain className="gap-3.5">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>
          <p className="m-0 text-sm leading-normal text-muted">{t("intro", { limit: CHILD_AGE_LIMIT })}</p>
        </div>

        {state.dependents.map((d) => {
          const name = `${d.firstName} ${d.lastName}`;
          const relation = tc(`relation.${d.relation}`);
          if (editing === d.id) {
            return <DependentForm key={d.id} initial={d} onSave={saveDependent} onCancel={() => setEditing(null)} />;
          }
          if (!d.dob) {
            const err = rowErrors[d.id];
            return (
              <div key={d.id} className={cx(card, "flex flex-col gap-2.5 border-warn-line px-4 py-3.5")}>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-warn-tint font-bold text-warn">
                    {initials(d)}
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="font-bold">{name}</span>
                    <span className="text-[13px] font-semibold text-warn">{t("dobMissing", { relation })}</span>
                  </span>
                </div>
                <label className={labelClass}>
                  {t("dob")}
                  <input
                    value={missingDob[d.id] ?? ""}
                    onChange={(e) => setMissingDob((m) => ({ ...m, [d.id]: e.target.value }))}
                    placeholder={t("dobPlaceholder")}
                    inputMode="numeric"
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? `dob-err-${d.id}` : undefined}
                    className={cx(inputClass, "rounded-[10px]", err ? invalidClass : "border-2 border-ink")}
                  />
                </label>
                {err ? <FieldError id={`dob-err-${d.id}`}>{err.error}</FieldError> : null}
                {err?.overAge ? <DisabilityRequest name={d.firstName} /> : null}
              </div>
            );
          }
          return (
            <div key={d.id} className={cx(card, "flex items-center gap-3 px-4 py-3.5")}>
              <span
                aria-hidden="true"
                className={cx(
                  "flex h-10 w-10 flex-none items-center justify-center rounded-full font-bold",
                  d.relation === "spouse" ? "bg-info-tint text-info" : "bg-brand-tint text-brand",
                )}
              >
                {initials(d)}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="font-bold">{name}</span>
                <span className="text-[13px] text-muted">{t("born", { relation, dob: d.dob })}</span>
              </span>
              <button
                type="button"
                aria-label={t("editAria", { name })}
                onClick={() => setEditing(d.id)}
                className="min-h-11 rounded-[10px] border border-line bg-surface px-3 text-sm font-semibold text-ink hover:bg-canvas"
              >
                {t("edit")}
              </button>
            </div>
          );
        })}

        {adding ? (
          <DependentForm onSave={saveDependent} onCancel={() => setAdding(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border border-dashed border-field bg-transparent font-semibold text-ink hover:bg-surface"
          >
            <Plus aria-hidden="true" size={18} />
            {t("add")}
          </button>
        )}

        <SavedNote date={format.dateTime(WINDOW_CLOSES, { month: "short", day: "numeric" })} />
      </PortalMain>
      <ActionBar>
        <button type="button" onClick={next} className={btn.primary}>
          {t("next")}
        </button>
      </ActionBar>
    </PortalPage>
  );
}
