import type { ReactNode } from "react";

type Tone = "warn" | "info" | "bad";

const ICONS: Record<Tone | "clock" | "file" | "device", ReactNode> = {
  warn: (
    <>
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  bad: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
    </>
  ),
  device: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </>
  ),
};

/**
 * Brand callout. warn = Parchment + Gold, info = Ivory + Hairline,
 * bad = Ruby. Pass `title` for a bold first line, `action` for a trailing
 * button or link.
 */
export function Callout({
  tone = "info",
  icon,
  title,
  children,
  action,
  className = "",
}: {
  tone?: Tone;
  icon?: keyof typeof ICONS;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "bad" ? "alert" : undefined}
      className={`callout callout-${tone} flex-wrap ${className}`}
    >
      <svg
        aria-hidden
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon ?? tone]}
      </svg>
      <div className="flex min-w-[260px] flex-1 flex-col gap-0.5">
        {title ? <span className="callout-title">{title}</span> : null}
        {children ? <span className="callout-body">{children}</span> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2 self-center">{action}</div> : null}
    </div>
  );
}
