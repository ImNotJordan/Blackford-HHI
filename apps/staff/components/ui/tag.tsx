import type { ReactNode } from "react";

const VARIANT_CLASS = {
  ok: "tag-ok",
  warn: "tag-warn",
  info: "tag-info",
  mute: "tag-mute",
} as const;

export function Tag({
  variant,
  children,
}: {
  variant: keyof typeof VARIANT_CLASS;
  children: ReactNode;
}) {
  return <span className={`tag ${VARIANT_CLASS[variant]}`}>{children}</span>;
}
