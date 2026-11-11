"use client";

import { useTranslations } from "next-intl";
import { useEnrollment } from "./enrollment-store";

/** "You + Carlos", "Your family"… for the selected coverage tier. */
export function useCoveredLabel() {
  const tc = useTranslations("common");
  const { state } = useEnrollment();
  const spouse = state.dependents.find((d) => d.relation === "spouse")?.firstName ?? tc("relation.spouse");
  return tc(`covered.${state.tier}`, { spouse });
}
