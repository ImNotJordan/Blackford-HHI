"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  DEPENDENTS_ON_FILE,
  DENTAL_PLANS,
  MEDICAL_PLANS,
  MEMBER,
  VISION_PLANS,
  type DentalPlanId,
  type Dependent,
  type MedicalPlanId,
  type Tier,
  type VisionPlanId,
  type WaiveReason,
} from "./demo-data";

export type Locale = "en" | "es";

export type StepId = "details" | "dependents" | "compare" | "elect" | "beneficiaries" | "sign";

export const STEPS: { id: StepId; href: string }[] = [
  { id: "details", href: "/portal/start" },
  { id: "dependents", href: "/portal/dependents" },
  { id: "compare", href: "/portal/compare" },
  { id: "elect", href: "/portal/elect" },
  { id: "beneficiaries", href: "/portal/beneficiaries" },
  { id: "sign", href: "/portal/sign" },
];

export type Beneficiary = { id: string; name: string; relation: string; share: string };

export type ServiceRequest = { id: string; kind: string; sent: string; status: "inProgress" | "received" };

export type EnrollmentState = {
  locale: Locale;
  address: string;
  mobile: string;
  dependents: Dependent[];
  tier: Tier;
  medical: MedicalPlanId | "waive";
  medicalWaiveReason: WaiveReason | "";
  dental: DentalPlanId | "waive";
  dentalWaiveReason: WaiveReason | "";
  vision: VisionPlanId | "waive";
  visionWaiveReason: WaiveReason | "";
  primary: Beneficiary[];
  contingent: Beneficiary[];
  /** Furthest step reached, for "Welcome back". */
  lastStep: StepId;
  signedAt: Date | null;
  signatureName: string;
  requests: ServiceRequest[];
};

/**
 * Initial state mirrors Maria mid-enrollment in the canvas.
 * Kept in memory only: the design forbids caching client data in browser storage.
 */
const initialState: EnrollmentState = {
  locale: "en",
  address: MEMBER.address,
  mobile: MEMBER.mobile,
  dependents: DEPENDENTS_ON_FILE,
  tier: "spouse",
  medical: "ppo1500",
  medicalWaiveReason: "",
  dental: "dentalPpo",
  dentalWaiveReason: "",
  vision: "waive",
  visionWaiveReason: "spousePlan",
  primary: [{ id: "b1", name: "Carlos Delgado", relation: "spouse", share: "100" }],
  contingent: [],
  lastStep: "details",
  signedAt: null,
  signatureName: `${MEMBER.firstName} ${MEMBER.lastName}`,
  requests: [{ id: "q1", kind: "address", sent: "Feb 10", status: "inProgress" }],
};

type Ctx = {
  state: EnrollmentState;
  update: (patch: Partial<EnrollmentState>) => void;
  reachStep: (step: StepId) => void;
  totals: { medical: number; dental: number; vision: number; total: number };
};

const EnrollmentContext = createContext<Ctx | null>(null);

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EnrollmentState>(initialState);

  const update = useCallback((patch: Partial<EnrollmentState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reachStep = useCallback((step: StepId) => {
    setState((s) => {
      const order = STEPS.map((x) => x.id);
      return order.indexOf(step) > order.indexOf(s.lastStep) ? { ...s, lastStep: step } : s;
    });
  }, []);

  const totals = useMemo(() => {
    const medical =
      state.medical === "waive" ? 0 : MEDICAL_PLANS.find((p) => p.id === state.medical)!.rates[state.tier];
    const dental =
      state.dental === "waive" ? 0 : DENTAL_PLANS.find((p) => p.id === state.dental)!.rates[state.tier];
    const vision =
      state.vision === "waive" ? 0 : VISION_PLANS.find((p) => p.id === state.vision)!.rates[state.tier];
    return { medical, dental, vision, total: medical + dental + vision };
  }, [state.medical, state.dental, state.vision, state.tier]);

  const value = useMemo(() => ({ state, update, reachStep, totals }), [state, update, reachStep, totals]);

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be used inside EnrollmentProvider");
  return ctx;
}
