"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Camera, Check, FileText, X } from "lucide-react";
import { useRef, useState } from "react";
import { ActionBar, BackHeader, PortalMain, PortalPage } from "@/components/portal/chrome";
import { Alert, FieldError, btn, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { TODAY, parseUsDate } from "@/lib/demo-data";

const EVENTS = ["baby", "married", "lostCoverage", "moved"] as const;
type EventKind = (typeof EVENTS)[number];

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = /^(image\/(jpeg|png|heic|heif|webp)|application\/pdf)$/;

function fileSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function LifeEventScreen() {
  const t = useTranslations("lifeEvent");
  const format = useFormatter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<EventKind>("baby");
  const [date, setDate] = useState("02/03/2027");
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [errors, setErrors] = useState<{ date?: string; file?: string }>({});
  const [sent, setSent] = useState(false);

  const parsed = parseUsDate(date);
  const validDate = parsed && parsed <= TODAY ? parsed : null;
  const deadline = validDate ? new Date(validDate.getTime() + 30 * 86_400_000) : null;
  const late = deadline ? deadline < TODAY : false;

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!ALLOWED.test(f.type)) return setErrors((x) => ({ ...x, file: t("errFileType") }));
    if (f.size > MAX_BYTES) return setErrors((x) => ({ ...x, file: t("errFileSize") }));
    // Kept in memory only. The real app uploads straight to Cloud Storage via a short-lived link.
    setFile({ name: f.name, size: f.size });
    setErrors((x) => ({ ...x, file: undefined }));
  }

  function submit() {
    const next: typeof errors = {};
    if (!parsed) next.date = t("errDate");
    else if (parsed > TODAY) next.date = t("errFuture");
    if (!file) next.file = t("errProof");
    setErrors(next);
    if (next.date || next.file) return;
    setSent(true);
  }

  if (sent) {
    return (
      <PortalPage>
        <BackHeader href="/portal/my-benefits" label={t("back")} ariaLabel={t("backAria")} />
        <PortalMain className="pt-7">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand" aria-hidden="true">
            <Check size={28} strokeWidth={2.5} />
          </span>
          <h1 className="m-0 font-display text-2xl font-extrabold">{t("sentTitle")}</h1>
          <p role="status" className="m-0 leading-normal text-ink-2">
            {t("sentBody")}
          </p>
          <Link href="/portal/my-benefits" className={btn.primary}>
            {t("backHome")}
          </Link>
        </PortalMain>
      </PortalPage>
    );
  }

  return (
    <PortalPage>
      <BackHeader href="/portal/my-benefits" label={t("back")} ariaLabel={t("backAria")} />
      <PortalMain>
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h1>

        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 text-sm font-semibold">{t("what")}</legend>
          {EVENTS.map((ev) => (
            <label
              key={ev}
              className={cx(
                "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl bg-surface px-3.5",
                kind === ev ? "border-2 border-brand" : "border border-line",
              )}
            >
              <input
                type="radio"
                name="ev"
                checked={kind === ev}
                onChange={() => setKind(ev)}
                className="m-0 h-5 w-5 accent-brand"
              />
              {t(`events.${ev}`)}
            </label>
          ))}
        </fieldset>

        <label className={cx(labelClass, "text-sm")}>
          {t(`dateLabel.${kind}`)}
          <input
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((x) => ({ ...x, date: undefined }));
            }}
            placeholder="MM/DD/YYYY"
            inputMode="numeric"
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? "err-date" : undefined}
            className={cx(inputClass, "rounded-[10px] border-line-strong", errors.date && invalidClass)}
          />
        </label>
        {errors.date ? <FieldError id="err-date">{errors.date}</FieldError> : null}

        {deadline ? (
          late ? (
            <Alert tone="warn" role="status">
              {t("late")}
            </Alert>
          ) : (
            <div role="status" className="rounded-xl bg-brand-tint px-3.5 py-3 text-sm leading-snug text-brand-ink">
              {t.rich(`deadline.${kind}`, {
                date: format.dateTime(deadline, { month: "long", day: "numeric" }),
                b: (c) => <strong className="text-brand-hover">{c}</strong>,
              })}
            </div>
          )
        ) : null}

        <div className="flex flex-col gap-2">
          <span id="proof-label" className="text-sm font-semibold">
            {t("proof")}
          </span>
          {file ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
              <FileText aria-hidden="true" size={20} className="text-brand" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{file.name}</span>
                <span className="text-xs text-muted">{t("uploaded", { size: fileSize(file.size) })}</span>
              </span>
              <button
                type="button"
                aria-label={t("remove", { name: file.name })}
                onClick={() => setFile(null)}
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-describedby={`proof-hint${errors.file ? " err-file" : ""}`}
              onClick={() => fileInput.current?.click()}
              className={cx(
                "flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-surface font-semibold text-ink hover:bg-canvas",
                errors.file ? "border-2 border-error-line" : "border border-dashed border-field",
              )}
            >
              <Camera aria-hidden="true" size={18} />
              {t("upload")}
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,image/webp,application/pdf"
            onChange={pickFile}
            aria-labelledby="proof-label"
            tabIndex={-1}
            className="sr-only"
          />
          <span id="proof-hint" className="text-xs text-muted">
            {t(`proofHint.${kind}`)}
          </span>
          {errors.file ? <FieldError id="err-file">{errors.file}</FieldError> : null}
        </div>
      </PortalMain>
      <ActionBar>
        <button type="button" onClick={submit} className={btn.primary}>
          {t("next")}
        </button>
        <span className="text-center text-xs text-muted">{t("footnote")}</span>
      </ActionBar>
    </PortalPage>
  );
}
