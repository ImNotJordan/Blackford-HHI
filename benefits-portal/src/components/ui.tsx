import type { ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Full-width phone actions (52px tall, per the canvas). */
export const btn = {
  primary:
    "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 font-bold text-white no-underline hover:bg-brand-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 font-semibold text-ink no-underline hover:bg-canvas hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
  /** Compact desktop buttons (44px). */
  smPrimary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-brand px-4 font-semibold text-white no-underline hover:bg-brand-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
  smSecondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 font-semibold text-ink no-underline hover:bg-canvas hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
  link: "inline-flex min-h-11 items-center font-semibold text-brand hover:text-brand-hover",
};

export const inputClass =
  "min-h-12 w-full rounded-xl border border-field bg-surface px-3 text-[15px] font-normal text-ink placeholder:text-muted";

export const invalidClass = "border-2 border-error-line";

export const card = "rounded-2xl border border-line bg-surface";

export const labelClass = "flex flex-col gap-1.5 text-[13px] font-semibold";

type Tone = "ok" | "warn" | "info" | "mute" | "bad";

const tagTones: Record<Tone, string> = {
  ok: "bg-brand-tint text-brand",
  warn: "bg-warn-tint text-warn",
  info: "bg-info-tint text-info",
  mute: "bg-sunken text-ink-2",
  bad: "bg-error-tint text-error",
};

export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cx("inline-block rounded-md px-2 py-[3px] text-xs font-bold whitespace-nowrap", tagTones[tone])}>
      {children}
    </span>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="m-0 text-[13px] leading-snug font-semibold text-error">
      {children}
    </p>
  );
}

const alertTones = {
  error: "bg-error-tint text-error-ink",
  warn: "bg-warn-tint text-warn-ink",
  info: "bg-info-tint text-info-ink",
  ok: "bg-brand-tint text-brand-ink",
};

export function Alert({
  tone,
  children,
  role = "alert",
}: {
  tone: keyof typeof alertTones;
  children: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div role={role} className={cx("rounded-xl px-3.5 py-3 text-sm leading-normal", alertTones[tone])}>
      {children}
    </div>
  );
}

/** Initials avatar used in staff and employer chrome. */
export function Initials({ text, tone = "brand" }: { text: string; tone?: "brand" | "info" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex h-8 w-8 flex-none items-center justify-center rounded-full text-[13px] font-bold",
        tone === "brand" ? "bg-brand-tint text-brand" : "bg-info-tint text-info",
      )}
    >
      {text}
    </span>
  );
}

export function BrandMark({ size = 30, tone = "navy" }: { size?: number; tone?: "navy" | "teal" }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size / 2 }}
      className={cx(
        "flex flex-none items-center justify-center rounded-lg font-display font-extrabold text-white",
        tone === "navy" ? "bg-navy" : "bg-brand",
      )}
    >
      B
    </span>
  );
}
