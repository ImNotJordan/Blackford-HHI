"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Languages } from "lucide-react";
import { Button, Card, StatusChip } from "@/components/ui";
import { ProofUploader } from "@/components/verification";

export function WorkingLanguageToggle() {
  const [lang, setLang] = useState<"en" | "es">("en");
  return (
    <div
      className="inline-flex items-center gap-1 rounded-[10px] border border-hairline bg-surface p-1"
      role="group"
      aria-label="Message language"
    >
      <Languages className="ml-2 h-4 w-4 text-gold-deep" aria-hidden />
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`ui-press min-h-9 rounded-[8px] px-3 text-sm font-medium ${
            lang === l ? "bg-ink text-ivory" : "text-ink hover:bg-ivory"
          }`}
          aria-pressed={lang === l}
        >
          {l === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}

export function ToastAction({
  label,
  doneLabel,
  variant = "accent",
}: {
  label: string;
  doneLabel: string;
  variant?: "primary" | "accent" | "secondary";
}) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div
        className="animate-rise flex min-h-11 items-center gap-2 rounded-[10px] border border-gold bg-parchment px-4 text-sm text-ink"
        role="status"
      >
        <CheckCircle2 className="h-4 w-4 text-gold-deep" aria-hidden />
        {doneLabel}
      </div>
    );
  }
  return (
    <Button type="button" variant={variant} onClick={() => setDone(true)}>
      {label}
    </Button>
  );
}

export function ActionButton({
  children,
  onAction,
  variant = "accent",
  className = "",
  success = "Saved",
}: {
  children: ReactNode;
  onAction?: () => void;
  variant?: "primary" | "accent" | "secondary" | "ghost";
  className?: string;
  success?: string;
}) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div
        className={`animate-rise inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-gold bg-parchment px-4 text-sm text-ink ${className}`}
        role="status"
      >
        <CheckCircle2 className="h-4 w-4 text-gold-deep" aria-hidden />
        {success}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={`ui-press inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-[15px] font-medium ${
        variant === "accent"
          ? "btn-accent bg-ruby !text-ivory"
          : variant === "primary"
            ? "btn-primary bg-ink !text-ivory"
            : variant === "secondary"
              ? "btn-secondary border border-hairline bg-surface !text-ink"
              : "btn-ghost !text-ink hover:bg-hairline/70"
      } ${className}`}
      onClick={() => {
        onAction?.();
        setDone(true);
      }}
    >
      {children}
    </button>
  );
}

export function InteractiveChecklist({
  initial,
}: {
  initial: { id: string; label: string; done: boolean; due: string; owner: string }[];
}) {
  const [items, setItems] = useState(initial);
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-hairline bg-ivory px-3 py-3 sm:px-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="label-mono">Module C</p>
            <h2 className="break-safe font-display text-lg text-ink sm:text-xl">
              Onboarding checklist
            </h2>
          </div>
          <p className="shrink-0 font-display text-xl text-ink tabular-nums sm:text-2xl">
            {pct}%
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-hairline">
          <div
            className="progress-fill h-full rounded-full bg-ink"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="divide-y divide-hairline">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5 sm:px-4"
          >
            <button
              type="button"
              className="flex min-h-10 min-w-0 flex-1 items-start gap-2.5 text-left"
              onClick={() =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, done: !x.done } : x,
                  ),
                )
              }
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  item.done
                    ? "border-gold-deep bg-parchment text-gold-deep"
                    : "border-hairline bg-surface"
                }`}
                aria-hidden
              >
                {item.done ? "✓" : ""}
              </span>
              <span className="min-w-0">
                <span
                  className={`block break-safe text-sm font-medium ${item.done ? "text-muted line-through" : "text-ink"}`}
                >
                  <span className="mr-1.5 font-mono text-xs text-muted">
                    {i + 1}.
                  </span>
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Owner · {item.owner}
                </span>
              </span>
            </button>
            <StatusChip tone={item.done ? "success" : "warning"}>
              {item.done ? "Done" : item.due}
            </StatusChip>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function InboxWorkspace({
  threads,
}: {
  threads: {
    id: string;
    from: string;
    channel: string;
    preview: string;
    time: string;
    client: string;
    unread: boolean;
  }[];
}) {
  const [active, setActive] = useState(threads[0]?.id);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const current = threads.find((t) => t.id === active) ?? threads[0];

  return (
    <div className="panel-fit grid gap-3 lg:grid-cols-2">
      <Card className="divide-y divide-hairline overflow-hidden">
        {threads.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(m.id)}
            className={`flex w-full min-w-0 cursor-pointer flex-col gap-1 px-3 py-3 text-left transition-colors ${
              active === m.id ? "bg-ivory" : "hover:bg-ivory/70"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate font-medium text-ink">
                {m.from}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">
                {m.time}
              </span>
            </div>
            <p className="break-safe text-sm text-muted">{m.preview}</p>
            <div className="mt-1 flex min-w-0 flex-wrap gap-1.5">
              <StatusChip tone={m.unread ? "warning" : "neutral"}>
                {m.channel}
              </StatusChip>
              <StatusChip tone="neutral">{m.client}</StatusChip>
            </div>
          </button>
        ))}
      </Card>
      <Card className="flex min-h-[320px] flex-col p-3 sm:p-4">
        <div className="border-b border-hairline pb-3">
          <h2 className="break-safe font-display text-lg text-ink sm:text-xl">
            {current?.from}
          </h2>
          <p className="break-safe text-sm text-muted">
            {current?.client} · {current?.channel} thread
          </p>
        </div>
        <div className="flex-1 space-y-2.5 overflow-y-auto py-3">
          <div className="max-w-[min(100%,20rem)] break-safe rounded-[10px] bg-ivory px-3 py-2 text-sm text-ink">
            Your enrollment window is open. Secure link inside — no password
            needed.
          </div>
          <div className="ml-auto max-w-[min(100%,20rem)] break-safe rounded-[10px] bg-ink px-3 py-2 text-sm text-ivory">
            {current?.preview}
          </div>
          {sent.map((s, i) => (
            <div
              key={i}
              className="ml-auto max-w-[min(100%,20rem)] break-safe rounded-[10px] bg-ink px-3 py-2 text-sm text-ivory"
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex min-w-0 gap-2 border-t border-hairline pt-3">
          <input
            className="min-h-10 min-w-0 flex-1 rounded-[10px] border border-hairline bg-surface px-3 text-sm text-ink"
            placeholder="Reply from the record…"
            aria-label="Reply"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                setSent((s) => [...s, draft.trim()]);
                setDraft("");
              }
            }}
          />
          <button
            type="button"
            className="ui-press inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-ink px-3 text-sm font-medium text-ivory sm:px-4"
            onClick={() => {
              if (draft.trim()) {
                setSent((s) => [...s, draft.trim()]);
                setDraft("");
              }
            }}
          >
            Send
          </button>
        </div>
      </Card>
    </div>
  );
}

export function ElectWaiveBoard({
  items,
}: {
  items: { type: string; plan: string; choice: "Enroll" | "Waive" }[];
}) {
  const [rows, setRows] = useState(items);
  return (
    <div className="stagger space-y-3">
      {rows.map((row) => (
        <Card key={row.type} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="label-mono">{row.type}</p>
              <p className="mt-1 font-medium text-ink">{row.plan}</p>
            </div>
            <div className="flex gap-2">
              {(["Enroll", "Waive"] as const).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((r) =>
                        r.type === row.type ? { ...r, choice } : r,
                      ),
                    )
                  }
                  className={`ui-press min-h-10 rounded-[10px] border px-3 text-sm font-medium ${
                    row.choice === choice
                      ? choice === "Enroll"
                        ? "border-ink bg-ink text-ivory"
                        : "border-hairline bg-ivory text-ink"
                      : "border-hairline bg-surface text-muted"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
          {row.choice === "Waive" ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted">
                Waive reason kept for ACA reporting (Module D / H).
              </p>
              <select
                className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm text-ink"
                aria-label={`Waive reason for ${row.type}`}
                defaultValue="other"
              >
                <option value="other">Covered elsewhere</option>
                <option value="cost">Cost</option>
                <option value="none">Do not want coverage</option>
              </select>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function CensusUploader() {
  const [phase, setPhase] = useState<"idle" | "scanning" | "errors" | "ok">(
    "idle",
  );

  if (phase === "scanning") {
    return (
      <Card className="animate-rise border-gold bg-parchment p-6" role="status">
        <p className="label-mono">Validating</p>
        <p className="mt-2 font-display text-xl text-ink">
          Checking required fields…
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-hairline">
          <div className="progress-fill h-full w-2/3 rounded-full bg-ink" />
        </div>
      </Card>
    );
  }

  if (phase === "ok") {
    return (
      <Card className="animate-rise border-gold bg-parchment p-6" role="status">
        <p className="label-mono">Census accepted</p>
        <p className="mt-2 font-display text-xl text-ink">
          42 rows ready · 0 blocking errors
        </p>
        <ActionButton
          className="mt-4"
          variant="secondary"
          success="Ready"
          onAction={() => setPhase("idle")}
        >
          Upload another file
        </ActionButton>
      </Card>
    );
  }

  if (phase === "errors") {
    return (
      <Card className="animate-rise p-6">
        <p className="label-mono text-ruby">Validation returned errors</p>
        <p className="mt-2 text-sm text-ink">
          Fix rows 12, 19, and 27 in the template, then upload again.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            success="Link copied"
          >
            Copy fix link
          </ActionButton>
          <ActionButton
            success="Re-check queued"
            onAction={() => {
              setPhase("scanning");
              window.setTimeout(() => setPhase("ok"), 1200);
            }}
          >
            Re-upload fixed file
          </ActionButton>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="label-mono">Blackford census template</p>
      <p className="mt-2 text-sm text-muted">
        CSV or XLSX · hire date, class, hours, and dependent age required.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton
          variant="secondary"
          success="Template downloaded"
        >
          Download template
        </ActionButton>
        <ActionButton
          onAction={() => {
            setPhase("scanning");
            window.setTimeout(() => setPhase("errors"), 1100);
          }}
        >
          Upload census file
        </ActionButton>
      </div>
    </Card>
  );
}

export function SignaturePad({
  continueHref = "/employee/confirmation",
  defaultName = "Aisha Patel",
  continueLabel = "View confirmation",
  successBody = "Audit trail captured · confirmation PDF queued on your record.",
}: {
  continueHref?: string;
  defaultName?: string;
  continueLabel?: string;
  successBody?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [consent, setConsent] = useState(true);
  const [signed, setSigned] = useState(false);

  if (signed) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-6" role="status">
        <p className="label-mono">Module E</p>
        <p className="mt-2 font-display text-2xl text-ink">Signed</p>
        <p className="mt-2 text-sm text-ink">{successBody}</p>
        <Button href={continueHref} variant="accent" className="mt-4 w-full">
          {continueLabel}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="animate-rise space-y-4 p-5">
      <label className="flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-ink"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          I agree to receive and sign these documents electronically. I can
          request a paper copy from Blackford.
        </span>
      </label>
      <label className="block">
        <span className="label-mono mb-2 block">Type your full legal name</span>
        <input
          className="min-h-14 w-full rounded-[10px] border border-hairline bg-ivory px-3 font-display text-2xl text-ink"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Signature"
        />
      </label>
      <button
        type="button"
        disabled={!consent || !name.trim()}
        className="ui-press inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-ruby px-4 py-2 text-[15px] font-medium !text-ivory disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setSigned(true)}
      >
        Sign & submit
      </button>
    </Card>
  );
}

export function LifeEventForm({ audience = "employee" }: { audience?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [hasProof, setHasProof] = useState(false);

  if (submitted) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-6" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="mt-3 font-display text-xl text-ink">Submitted for review</p>
        <p className="mt-2 text-sm text-ink">
          Image proof queued for manual verification. Staff must approve before a
          carrier change file is drafted
          {audience === "client" ? " for your policy." : "."}
        </p>
      </Card>
    );
  }
  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Event type</span>
        <select
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          defaultValue="birth"
        >
          <option value="birth">Birth or adoption</option>
          <option value="marriage">Marriage</option>
          <option value="address">Address change</option>
          <option value="lost">Lost coverage</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Event date</span>
        <input
          type="date"
          defaultValue="2027-02-28"
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
        />
      </label>
      <div>
        <p className="label-mono mb-2">Proof for verification</p>
        <ProofUploader
          onReady={(proofs) => setHasProof(proofs.length > 0)}
          requiredTypes={[
            "Official document (birth certificate, license, or bill)",
            "Photo ID matching your record",
          ]}
        />
      </div>
      {hasProof ? (
        <button
          type="button"
          className="ui-press inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-ruby px-4 text-[15px] font-medium text-ivory"
          onClick={() => setSubmitted(true)}
        >
          Submit for staff approval
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-ruby/45 px-4 text-[15px] font-medium text-ivory"
        >
          Attach proof to submit
        </button>
      )}
    </Card>
  );
}

export function ServiceRequestForm() {
  const [done, setDone] = useState(false);
  const [type, setType] = useState("id");
  const [hasProof, setHasProof] = useState(false);
  const needsProof = type === "change" || type === "id";

  if (done) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-6" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="mt-3 font-display text-xl text-ink">Request received</p>
        <p className="mt-2 text-sm text-ink">
          Routed to your account manager
          {needsProof ? " for proof verification" : ""} with a due date by
          request type.
        </p>
      </Card>
    );
  }
  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Request type</span>
        <select
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-ink"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setHasProof(false);
          }}
        >
          <option value="id">ID card</option>
          <option value="claim">Claim help</option>
          <option value="change">Policy change</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Details</span>
        <textarea
          className="min-h-28 w-full rounded-[10px] border border-hairline bg-surface px-3 py-2 text-ink"
          placeholder="Tell us what you need…"
        />
      </label>
      {needsProof ? (
        <div>
          <p className="label-mono mb-2">Proof for verification</p>
          <ProofUploader
            onReady={(proofs) => setHasProof(proofs.length > 0)}
            requiredTypes={
              type === "id"
                ? ["Photo ID", "Proof of mailing address"]
                : ["Supporting document for the change"]
            }
          />
        </div>
      ) : null}
      {needsProof && !hasProof ? (
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-ruby/45 px-4 text-[15px] font-medium text-ivory"
        >
          Attach proof to submit
        </button>
      ) : (
        <ActionButton
          className="w-full"
          success="Submitted"
          onAction={() => setDone(true)}
        >
          Submit request
        </ActionButton>
      )}
    </Card>
  );
}

export function OtpSignIn({ continueHref }: { continueHref: string }) {
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  return (
    <Card className="space-y-4 p-5">
      <label className="block">
        <span className="label-mono mb-2 block">One-time code</span>
        <input
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 font-mono tracking-[0.3em] text-ink"
          aria-label="One-time code"
        />
      </label>
      {code.length === 6 ? (
        <Button href={continueHref} variant="accent" className="w-full">
          Continue
        </Button>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-ruby/50 px-4 text-[15px] font-medium text-ivory"
        >
          Enter 6-digit code
        </button>
      )}
      <button
        type="button"
        className="text-link w-full text-sm"
        onClick={() => setResent(true)}
      >
        {resent ? "Code resent · check your messages" : "Resend code"}
      </button>
    </Card>
  );
}

export function ApproveRejectRow({ label }: { label: string }) {
  const [state, setState] = useState<"idle" | "approved" | "rejected">("idle");
  if (state !== "idle") {
    return (
      <StatusChip tone={state === "approved" ? "success" : "danger"}>
        {state === "approved" ? "Approved" : "Returned"}
      </StatusChip>
    );
  }
  return (
    <div className="flex flex-wrap gap-2" aria-label={label}>
      <button
        type="button"
        className="ui-press min-h-9 rounded-[10px] border border-hairline bg-surface px-3 text-sm font-medium text-ink"
        onClick={() => setState("rejected")}
      >
        Return
      </button>
      <button
        type="button"
        className="ui-press min-h-9 rounded-[10px] bg-ink px-3 text-sm font-medium text-ivory"
        onClick={() => setState("approved")}
      >
        Approve
      </button>
    </div>
  );
}
