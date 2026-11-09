"use client";

import Link from "next/link";
import { useState } from "react";
import { Tag } from "@/components/ui/tag";

const PEOPLE: { name: string; status: string; tag: "ok" | "warn" | "mute" }[] = [
  { name: "Ashley Kim", status: "Signed", tag: "ok" },
  { name: "Tuan Nguyen", status: "Step 3 of 6", tag: "warn" },
  { name: "Leah Morgan", status: "Not started", tag: "mute" },
  { name: "Omar Haddad", status: "Not started", tag: "mute" },
  { name: "Jordan Price", status: "Not started", tag: "mute" },
];

const PLANS = [
  { id: "hdhp", name: "HDHP 3500 + HSA", detail: "Deductible $7,000 family", price: "$118.40", sub: "per paycheck · $3,078 a year" },
  { id: "ppo", name: "PPO 1500", detail: "Deductible $3,000 family", price: "$212.75", sub: "per paycheck · $5,532 a year", current: true },
  { id: "waive", name: "Waive medical", detail: "Reason required", price: "$0", sub: "ACA waiver recorded" },
];

export default function AgentAssistPage() {
  const [plan, setPlan] = useState("ppo");
  const chosen = PLANS.find((p) => p.id === plan)!;

  return (
    <div className="flex min-h-screen bg-[var(--brand-ivory)] text-[15px] text-[var(--brand-ink)]">
      <aside className="flex w-[300px] shrink-0 flex-col gap-3.5 border-r border-[var(--brand-hairline)] bg-[var(--brand-surface)] px-3.5 py-5 max-[900px]:w-[240px]">
        <div className="flex flex-col gap-0.5 px-1.5">
          <span className="eyebrow">In-person meeting</span>
          <span className="heading text-[20px]">Riverside Dental · Feb 16</span>
          <span className="text-[13px] text-[var(--color-text-muted)]">Dana Whitfield assisting</span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0" aria-label="People at this meeting">
          {PEOPLE.map((p) => {
            const current = p.name === "Tuan Nguyen";
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-current={current ? "true" : undefined}
                  className={`flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border-0 px-3 text-left text-[15px] text-[var(--brand-ink)] ${
                    current ? "bg-[var(--brand-parchment)] font-semibold" : "bg-transparent hover:bg-[var(--brand-ivory)]"
                  }`}
                >
                  <span>{p.name}</span>
                  <Tag variant={p.tag}>{p.status}</Tag>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn btn-secondary mt-auto min-h-12">
          Add someone at this meeting
        </button>
        <Link href="/enrollments" className="btn btn-secondary min-h-12 no-underline">
          End session
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-5 border-b border-[var(--brand-hairline)] bg-[var(--brand-surface)] px-6 py-3.5">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-semibold">Tuan Nguyen · Compare medical plans</span>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                Same steps as the phone portal
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Enrollment progress"
              aria-valuemin={0}
              aria-valuemax={6}
              aria-valuenow={3}
              className="h-1.5 overflow-hidden rounded-full bg-[var(--brand-hairline)]"
            >
              <div className="h-full w-1/2 bg-[var(--brand-gold)]" />
            </div>
          </div>
          <button type="button" className="btn btn-secondary">
            Save, finish later
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="heading m-0 text-[28px]">Choose a medical plan</h1>
            <span className="text-[var(--color-text-muted)]">
              Covering: Tuan, Linh (spouse), 2 children · Family tier
            </span>
          </div>

          <fieldset className="m-0 flex flex-wrap gap-4 border-0 p-0">
            <legend className="sr-only">Medical plan</legend>
            {PLANS.map((p) => {
              const on = plan === p.id;
              return (
                <label
                  key={p.id}
                  className={`flex min-w-[200px] flex-1 cursor-pointer flex-col gap-1.5 rounded-[14px] bg-[var(--brand-surface)] p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--brand-gold-deep)] ${
                    on ? "border-2 border-[var(--brand-ink)]" : "border border-[var(--brand-hairline)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={p.id}
                    checked={on}
                    onChange={() => setPlan(p.id)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-semibold">{p.name}</span>
                    {p.current ? <Tag variant="ok">Current plan</Tag> : null}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">{p.detail}</span>
                  <span className="stat-figure !text-[28px]">{p.price}</span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">{p.sub}</span>
                </label>
              );
            })}
          </fieldset>

          <label className="field-label !flex-none">
            Meeting note on Tuan&apos;s record (staff only)
            <textarea
              rows={3}
              className="field-in py-3 !text-[15px] font-normal"
              defaultValue="Asked about HSA. Wants to stay on PPO because of son's orthodontist."
            />
          </label>

          <div className="flex items-center gap-3 rounded-[12px] border border-[var(--brand-gold)] bg-[var(--brand-parchment)] px-4 py-3.5">
            <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
            <span>
              At the sign step, hand the iPad to Tuan. He consents and signs
              himself; the audit trail records the device and &ldquo;assisted by
              Dana Whitfield&rdquo;. No client data stays on the iPad.
            </span>
          </div>
        </div>

        <div className="flex justify-between gap-3 border-t border-[var(--brand-hairline)] bg-[var(--brand-surface)] px-6 py-3.5">
          <button type="button" className="btn btn-secondary min-h-[52px] px-6">
            Back
          </button>
          <button type="button" className="btn btn-primary min-h-[52px] px-8">
            {plan === "waive" ? "Continue and waive medical" : `Continue with ${chosen.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
