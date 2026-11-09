import type { ReactNode } from "react";

/**
 * Shared building blocks. Styling lives in app/globals.css and reads only
 * the semantic tokens from @blackford/brand, so every screen shares one
 * color architecture.
 */

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PageHeader({
  context,
  title,
  description,
  actions,
}: {
  context?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {context ? <p className="page-context">{context}</p> : null}
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-lede">{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}

export function Card({
  title,
  id,
  description,
  actions,
  eyebrow,
  footer,
  className,
  children,
}: {
  title?: string;
  id?: string;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const headingId = title ? (id ?? slug(title)) : undefined;
  return (
    <section
      aria-labelledby={headingId}
      className={cx("card", className)}
    >
      {title ? (
        <div className="card-header">
          <div className="card-heading">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h2 id={headingId} className="card-title">
              {title}
            </h2>
            {description ? <p className="card-desc">{description}</p> : null}
          </div>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </div>
      ) : null}
      {children}
      {footer ? <div className="card-footer">{footer}</div> : null}
    </section>
  );
}

export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`callout callout-${tone}`}>
      {title ? <span className="callout-title">{title}</span> : null}
      {children ? <span>{children}</span> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  hintId,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  hintId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cx("field", className)}>
      <span>{label}</span>
      {children}
      {hint ? (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function DetailList({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="detail-list">
      {items.map(([label, value], i) => (
        <div key={i} className="detail-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="card stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint ? <span className="stat-hint">{hint}</span> : null}
    </div>
  );
}

export function Avatar({ initials, size }: { initials: string; size?: "lg" }) {
  return (
    <span aria-hidden className={cx("avatar", size === "lg" && "avatar-lg")}>
      {initials}
    </span>
  );
}

export function SignatureBar({ className }: { className?: string }) {
  return (
    <div className={cx("signature-bar", className)} aria-hidden>
      <span />
      <span />
    </div>
  );
}

export function SecurityNote({ children }: { children?: ReactNode }) {
  return (
    <p className="page-footnote">
      {children ? <>{children} </> : null}
      Sign in with a one-time code — no password. You&apos;re signed out after
      15 minutes idle.
    </p>
  );
}
