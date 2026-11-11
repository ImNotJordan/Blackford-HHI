import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export type Crumb = { label: string; href?: string };

/**
 * Standard page header: breadcrumb → title (+ status tags) → meta / description,
 * with actions aligned right. Use on every staff page so titles, spacing and
 * colors stay identical across the app.
 */
export function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  tags,
  meta,
  description,
  actions,
}: {
  breadcrumb?: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  tags?: ReactNode;
  meta?: ReactNode[];
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {breadcrumb?.length ? (
        <nav aria-label="Breadcrumb" className="breadcrumb">
          {breadcrumb.map((c, i) => (
            <Fragment key={`${c.label}-${i}`}>
              {i > 0 ? <span aria-hidden>/</span> : null}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current={i === breadcrumb.length - 1 ? "page" : undefined}>
                  {c.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      ) : null}

      <header className="page-header">
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="page-title">{title}</h1>
            {tags}
          </div>
          {meta?.length ? (
            <div className="meta-row">
              {meta.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          ) : null}
          {description ? <p className="page-sub">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
    </div>
  );
}
