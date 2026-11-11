"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { FieldError, Tag, btn, cx, inputClass, invalidClass, labelClass } from "@/components/ui";
import { ASSIST_SESSION, CONTACT, WAIVE_REASONS, money } from "@/lib/demo-data";

type Person = { id: string; name: string; status: "signed" | "inProgress" | "notStarted"; step?: number };

const reasonLabels: Record<(typeof WAIVE_REASONS)[number], string> = {
  spousePlan: "Covered by spouse’s plan",
  otherPlan: "Covered by another plan",
  medicare: "Medicare or Medicaid",
  noCoverage: "Don’t want coverage",
};

function statusTag(p: Person) {
  if (p.status === "signed") return <Tag tone="ok">Signed</Tag>;
  if (p.status === "inProgress") return <Tag tone="warn">Step {p.step} of 6</Tag>;
  return <Tag tone="mute">Not started</Tag>;
}

export function AssistScreen() {
  const [toastNode, toast] = useToast();
  const [people, setPeople] = useState<Person[]>(ASSIST_SESSION.people);
  const [activeId, setActiveId] = useState("p2");
  const [plan, setPlan] = useState("ppo");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [note, setNote] = useState(ASSIST_SESSION.note);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const active = people.find((p) => p.id === activeId)!;
  const first = active.name.split(" ")[0];
  const chosen = ASSIST_SESSION.plans.find((p) => p.id === plan)!;
  const isTuan = active.id === "p2";

  function continueFlow() {
    if (plan === "waive" && !reason) {
      setReasonError(true);
      return;
    }
    setPeople((ps) => ps.map((p) => (p.id === active.id ? { ...p, status: "inProgress", step: 4 } : p)));
    toast(`Saved to ${first}’s record. Next: dental and vision.`);
  }

  function addPerson() {
    if (!newName.trim()) return;
    const id = `p${people.length + 1}-${newName.length}`;
    setPeople((ps) => [...ps, { id, name: newName.trim(), status: "notStarted" }]);
    setNewName("");
    setAdding(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-[15px] md:flex-row">
      <aside className="flex flex-col gap-3.5 border-b border-line bg-surface px-3.5 py-5 md:w-[300px] md:flex-none md:border-r md:border-b-0">
        <div className="flex flex-col gap-0.5 px-1.5">
          <span className="text-xs font-bold tracking-[0.08em] text-brand uppercase">In-person meeting</span>
          <span className="font-display text-lg font-extrabold">{ASSIST_SESSION.title}</span>
          <span className="text-[13px] text-muted">{CONTACT.name} assisting</span>
        </div>
        <ul aria-label="People at this meeting" className="m-0 flex list-none flex-col gap-0.5 p-0">
          {people.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                aria-current={p.id === activeId ? "true" : undefined}
                onClick={() => setActiveId(p.id)}
                className={cx(
                  "flex min-h-[52px] w-full items-center justify-between gap-2 rounded-[10px] p-3 text-left text-ink",
                  p.id === activeId ? "bg-brand-tint font-bold" : "hover:bg-canvas",
                )}
              >
                <span>{p.name}</span>
                {statusTag(p)}
              </button>
            </li>
          ))}
        </ul>
        {adding ? (
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Name
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
            </label>
            <div className="flex gap-2">
              <button type="button" className={btn.smSecondary} onClick={() => setAdding(false)}>
                Cancel
              </button>
              <button type="button" className={btn.smPrimary} onClick={addPerson}>
                Add
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className={cx(btn.secondary, "mt-auto min-h-12")}>
            Add someone at this meeting
          </button>
        )}
        <Link href="/staff/enrollments" className="inline-flex min-h-11 items-center px-1.5 text-sm font-semibold">
          End session
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {isTuan ? (
          <>
            <div className="flex flex-wrap items-center gap-5 border-b border-line bg-surface px-6 py-3.5">
              <div className="flex min-w-[240px] flex-1 flex-col gap-2">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-bold">{active.name} · Compare medical plans</span>
                  <span className="text-[13px] text-muted">Same steps as the phone portal</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${first}: step ${active.step ?? 3} of 6`}
                  aria-valuemin={0}
                  aria-valuemax={6}
                  aria-valuenow={active.step ?? 3}
                  className="h-1.5 overflow-hidden rounded-full bg-sunken"
                >
                  <div className="h-full bg-brand" style={{ width: `${((active.step ?? 3) / 6) * 100}%` }} />
                </div>
              </div>
              <button type="button" className={btn.smSecondary} onClick={() => toast(`${first}’s progress is saved. The session closes on this iPad.`)}>
                Save, finish later
              </button>
            </div>

            <main id="main" className="flex flex-1 flex-col gap-[18px] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h1 className="m-0 font-display text-[26px] font-extrabold">Choose a medical plan</h1>
                <span className="text-muted">Covering: {ASSIST_SESSION.covering}</span>
              </div>

              <fieldset className="m-0 border-0 p-0">
                <legend className="sr-only">Medical plan</legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  {ASSIST_SESSION.plans.map((p) => (
                    <label
                      key={p.id}
                      className={cx(
                        "flex cursor-pointer flex-col gap-1.5 rounded-[14px] bg-surface p-4",
                        plan === p.id ? "border-2 border-brand" : "border border-line",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="assist-plan"
                            checked={plan === p.id}
                            onChange={() => {
                              setPlan(p.id);
                              setReasonError(false);
                            }}
                            className="h-5 w-5 accent-brand"
                          />
                          <span className="text-[17px] font-bold">{p.name}</span>
                        </span>
                        {p.current ? <Tag tone="ok">Current plan</Tag> : null}
                      </span>
                      <span className="text-[13px] text-muted">{p.sub}</span>
                      <span className="font-display text-[26px] font-extrabold">{money(p.price)}</span>
                      <span className="text-[13px] text-muted">
                        {p.id === "waive" ? p.perYear : `per paycheck · ${p.perYear}`}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {plan === "waive" ? (
                <div className="flex max-w-md flex-col gap-1.5">
                  <label className={labelClass}>
                    Why is {first} waiving?
                    <select
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setReasonError(false);
                      }}
                      aria-invalid={reasonError || undefined}
                      aria-describedby={reasonError ? "assist-reason-err" : undefined}
                      className={cx(inputClass, reasonError && invalidClass)}
                    >
                      <option value="">Choose one</option>
                      {WAIVE_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {reasonLabels[r]}
                        </option>
                      ))}
                    </select>
                  </label>
                  {reasonError ? <FieldError id="assist-reason-err">Choose a reason. The employer is required to keep it.</FieldError> : null}
                </div>
              ) : null}

              <label className={labelClass}>
                Meeting note on {first}&rsquo;s record (staff only)
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={cx(inputClass, "py-3")} />
              </label>

              <div className="flex items-center gap-3 rounded-xl bg-info-tint px-4 py-3.5 text-info-ink">
                <Smartphone aria-hidden="true" size={20} className="flex-none" />
                <span>
                  At the sign step, hand the iPad to {first}. They consent and sign themselves; the audit trail records the device and
                  &ldquo;assisted by {CONTACT.name}&rdquo;.
                </span>
              </div>
            </main>

            <div className="flex justify-between gap-3 border-t border-line bg-surface px-6 py-3.5">
              <Link href="/staff/enrollments" className={cx(btn.smSecondary, "min-h-[52px] px-6")}>
                Back
              </Link>
              <button type="button" onClick={continueFlow} className={cx(btn.smPrimary, "min-h-[52px] px-8 font-bold")}>
                {plan === "waive" ? "Continue and waive medical" : `Continue with ${chosen.name}`}
              </button>
            </div>
          </>
        ) : (
          <main id="main" className="flex flex-1 flex-col items-start gap-4 p-6">
            <h1 className="m-0 font-display text-[26px] font-extrabold">{active.name}</h1>
            {active.status === "signed" ? (
              <p className="m-0 text-ink-2">{first} has signed. Nothing else is needed at this meeting.</p>
            ) : (
              <>
                <p className="m-0 text-ink-2">
                  {active.status === "inProgress"
                    ? `${first} is on step ${active.step} of 6. Pick up where they stopped.`
                    : `${first} hasn’t started yet. Start on this iPad; it saves at every step, just like the phone portal.`}
                </p>
                <button
                  type="button"
                  className={cx(btn.smPrimary, "min-h-[52px] px-6")}
                  onClick={() => {
                    setPeople((ps) => ps.map((p) => (p.id === active.id ? { ...p, status: "inProgress", step: p.step ?? 1 } : p)));
                    toast(`${first}’s enrollment started on this iPad.`);
                  }}
                >
                  {active.status === "inProgress" ? `Continue with ${first}` : `Start with ${first}`}
                </button>
              </>
            )}
          </main>
        )}
      </div>
      {toastNode}
    </div>
  );
}
