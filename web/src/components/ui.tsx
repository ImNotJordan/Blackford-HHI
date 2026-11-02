import Link from "next/link";
import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <span className="label-mono">{children}</span>;
}

export function Card({
  children,
  className = "",
  interactive = false,
  role,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  role?: string;
}) {
  return (
    <div
      role={role}
      className={`panel-fit rounded-[10px] border border-hairline bg-surface ${interactive ? "ui-card cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="animate-rise mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="label-mono mb-1.5">{eyebrow}</p> : null}
        <h1 className="break-safe text-ink">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 flex-wrap gap-2 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  /* Primary: Ivory on Ink · Accent: Ivory on Ruby (never Gold on Ruby) */
  primary: "btn-primary bg-ink !text-ivory hover:bg-ink/90",
  accent: "btn-accent bg-ruby !text-ivory hover:bg-ruby/90",
  secondary:
    "btn-secondary border border-hairline bg-surface !text-ink hover:border-gold-deep/40 hover:bg-ivory",
  ghost: "btn-ghost !text-ink hover:bg-hairline/70",
};

export function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
}) {
  const classes = `ui-press inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-[15px] font-medium no-underline ${buttonStyles[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

/** Inline content link — Gold Deep on light (AA). */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`text-link font-medium ${className}`}>
      {children}
    </Link>
  );
}

export function StatusChip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "auto" | "warning" | "success" | "danger" | "active";
  children: ReactNode;
}) {
  const tones = {
    /* All chip text uses approved pairs only */
    neutral: "border-hairline bg-surface text-ink",
    auto: "border-gold bg-parchment text-ink",
    warning: "border-gold bg-parchment text-ink",
    success: "border-gold-deep/50 bg-parchment text-ink",
    danger: "border-ruby bg-surface text-ink",
    active: "border-ink bg-ink text-ivory",
  };
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          tone === "danger"
            ? "bg-ruby"
            : tone === "success"
              ? "bg-gold-deep"
              : tone === "warning" || tone === "auto"
                ? "bg-gold"
                : tone === "active"
                  ? "bg-pale-gold"
                  : "bg-hairline"
        }`}
        aria-hidden
      />
      <span
        className={`break-safe ${tone === "danger" ? "text-ruby" : undefined}`}
      >
        {children}
      </span>
    </span>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="block text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  "min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-[15px] text-ink transition-[border-color,background-color] duration-150 placeholder:text-muted focus:border-gold-deep focus:bg-ivory";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${controlClass} ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${controlClass} ${props.className ?? ""}`}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-[10px] border border-hairline bg-surface px-3 py-2 text-[15px] text-ink transition-[border-color,background-color] duration-150 placeholder:text-muted focus:border-gold-deep focus:bg-ivory ${props.className ?? ""}`}
    />
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="animate-scale px-6 py-12 text-center">
      <h3 className="text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </Card>
  );
}

export function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="label-mono !text-[10px]">{label}</div>
      <div className="mt-1.5 font-display text-[1.65rem] leading-none tracking-tight text-ink tabular-nums sm:text-[1.85rem]">
        {value}
      </div>
      {note ? <p className="mt-1.5 text-xs text-muted">{note}</p> : null}
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="panel-fit">
      {/* Wide: fluid table — wraps cells, never forces horizontal page scroll */}
      <div className="hidden min-w-0 md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-ivory">
              {headers.map((h) => (
                <th
                  key={h}
                  className="break-safe px-2.5 py-2.5 text-xs font-medium text-ink first:rounded-tl-[10px] last:rounded-tr-[10px] sm:px-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-hairline transition-colors duration-150 last:border-0 hover:bg-ivory/80"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="break-safe px-2.5 py-2.5 align-top text-ink sm:px-3"
                  >
                    <div className="min-w-0 max-w-full">{cell}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow: stacked rows so every field stays on-screen */}
      <ul className="divide-y divide-hairline md:hidden">
        {rows.map((row, i) => (
          <li key={i} className="space-y-2 px-3 py-3">
            {headers.map((h, j) => (
              <div
                key={`${i}-${h}`}
                className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-start gap-2 text-sm"
              >
                <span className="break-safe text-xs font-medium text-muted">
                  {h}
                </span>
                <div className="min-w-0 break-safe text-ink">{row[j]}</div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <div className="animate-page">{children}</div>;
}
