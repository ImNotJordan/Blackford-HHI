"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Eye,
  FileImage,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { Button, Card, StatusChip } from "@/components/ui";
import {
  proofAssets,
  verificationStatusLabel,
  type ProofAsset,
  type VerificationCase,
  type VerificationStatus,
} from "@/lib/verification";

export function verificationTone(
  status: VerificationStatus,
): "warning" | "success" | "danger" | "auto" | "neutral" {
  if (status === "approved") return "success";
  if (status === "returned" || status === "needs_more_info") return "danger";
  if (status === "ready_for_review") return "warning";
  if (status === "awaiting_proof") return "auto";
  return "neutral";
}

/** Mock image proof tile — click to enlarge */
export function ProofImageCard({
  proof,
  onOpen,
}: {
  proof: ProofAsset;
  onOpen?: (proof: ProofAsset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(proof)}
      className="ui-press group flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-hairline bg-surface text-left"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proof.src}
          alt={proof.label}
          className="h-full w-full object-cover object-top"
        />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink/85 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ivory opacity-0 transition-opacity group-hover:opacity-100">
          <Eye className="h-3 w-3" aria-hidden />
          Open
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="break-safe text-sm font-medium text-ink">{proof.label}</p>
        <p className="break-safe font-mono text-[10px] text-muted">
          {proof.fileName}
        </p>
        <p className="text-xs text-muted">{proof.uploadedAt}</p>
      </div>
    </button>
  );
}

export function ProofLightbox({
  proof,
  onClose,
}: {
  proof: ProofAsset | null;
  onClose: () => void;
}) {
  if (!proof) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Proof · ${proof.label}`}
      onClick={onClose}
    >
      <div
        className="panel-fit relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-hairline px-3 py-2.5">
          <div className="min-w-0">
            <p className="label-mono">Image proof</p>
            <p className="truncate text-sm font-medium text-ink">{proof.label}</p>
          </div>
          <button
            type="button"
            className="ui-press rounded-[10px] p-2"
            onClick={onClose}
            aria-label="Close proof"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-ivory p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proof.src}
            alt={proof.label}
            className="mx-auto max-h-[70vh] w-full max-w-full object-contain"
          />
        </div>
        <div className="border-t border-hairline px-3 py-2 text-xs text-muted">
          {proof.fileName} · uploaded {proof.uploadedAt} · mock scan for MVP
        </div>
      </div>
    </div>
  );
}

/** Submitter-side: attach proof with mock image preview */
export function ProofUploader({
  requiredTypes = ["Birth certificate or adoption papers", "Photo ID"],
  onReady,
}: {
  requiredTypes?: string[];
  onReady?: (proofs: ProofAsset[]) => void;
}) {
  const [attached, setAttached] = useState<ProofAsset[]>([]);
  const [active, setActive] = useState<ProofAsset | null>(null);
  const pool = useMemo(
    () => [
      proofAssets.birthCert,
      proofAssets.marriageLic,
      proofAssets.addressProof,
      proofAssets.idCard,
      proofAssets.paperSign,
    ],
    [],
  );

  function attachNext() {
    const next = pool[attached.length % pool.length];
    const copy = {
      ...next,
      id: `${next.id}-${attached.length + 1}`,
      uploadedAt: "Just now",
    };
    const nextList = [...attached, copy];
    setAttached(nextList);
    onReady?.(nextList);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] border border-hairline bg-ivory p-3">
        <p className="label-mono">Required proof</p>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          {requiredTypes.map((t) => (
            <li key={t} className="flex gap-2">
              <FileImage className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              <span className="break-safe">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {attached.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {attached.map((p) => (
            <ProofImageCard key={p.id} proof={p} onOpen={setActive} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed p-4 text-center">
          <Upload className="mx-auto h-6 w-6 text-gold-deep" aria-hidden />
          <p className="mt-2 text-sm text-muted">
            No proof attached yet. Upload a photo or scan for staff review.
          </p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="ui-press inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-hairline bg-surface px-3 text-sm font-medium text-ink"
          onClick={attachNext}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {attached.length ? "Add another mock proof" : "Attach mock image proof"}
        </button>
        <label className="ui-press inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-hairline bg-surface px-3 text-sm font-medium text-ink">
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={() => attachNext()}
          />
          Choose file…
        </label>
      </div>
      <ProofLightbox proof={active} onClose={() => setActive(null)} />
    </div>
  );
}

export function ManualVerificationChecklist({
  initial,
  onChange,
}: {
  initial: VerificationCase["checklist"];
  onChange?: (items: VerificationCase["checklist"]) => void;
}) {
  const [items, setItems] = useState(initial);
  const requiredDone = items.filter((i) => i.required).every((i) => i.done);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-hairline bg-ivory px-3 py-2.5 sm:px-4">
        <p className="label-mono">Manual verification</p>
        <h3 className="mt-0.5 text-ink">Staff checklist</h3>
        <p className="mt-1 text-xs text-muted">
          {requiredDone
            ? "Required checks complete — you can approve."
            : "Confirm each required item against the image proof."}
        </p>
      </div>
      <ul className="divide-y divide-hairline">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="flex w-full min-h-11 items-start gap-3 px-3 py-2.5 text-left sm:px-4"
              onClick={() => {
                const next = items.map((x) =>
                  x.id === item.id ? { ...x, done: !x.done } : x,
                );
                setItems(next);
                onChange?.(next);
              }}
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
              <span className="min-w-0 flex-1">
                <span
                  className={`block break-safe text-sm font-medium ${
                    item.done ? "text-muted line-through" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-xs text-muted">
                  {item.required ? "Required" : "Optional"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function VerificationDecision({
  canApprove,
}: {
  canApprove: boolean;
}) {
  const [result, setResult] = useState<"idle" | "approved" | "returned" | "more">(
    "idle",
  );
  const [note, setNote] = useState("");

  if (result !== "idle") {
    return (
      <Card className="animate-rise border-gold bg-parchment p-4" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="mt-2 font-display text-xl text-ink">
          {result === "approved"
            ? "Approved · carrier change may draft"
            : result === "returned"
              ? "Returned to submitter"
              : "More info requested"}
        </p>
        <p className="mt-1 text-sm text-ink">
          Decision saved on the record with timestamp and reviewer (Module F / H
          audit).
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gold-deep" aria-hidden />
        <p className="label-mono !mb-0">Decision</p>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">Reviewer note</span>
        <textarea
          className="min-h-20 w-full rounded-[10px] border border-hairline bg-surface px-3 py-2 text-sm text-ink"
          placeholder="Optional note for the employee / audit trail…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="ui-press min-h-10 rounded-[10px] border border-hairline bg-surface px-3 text-sm font-medium text-ink"
          onClick={() => setResult("more")}
        >
          Request more proof
        </button>
        <button
          type="button"
          className="ui-press min-h-10 rounded-[10px] border border-hairline bg-surface px-3 text-sm font-medium text-ink"
          onClick={() => setResult("returned")}
        >
          Return
        </button>
        <button
          type="button"
          disabled={!canApprove}
          className="ui-press min-h-10 rounded-[10px] bg-ink px-3 text-sm font-medium text-ivory disabled:cursor-not-allowed disabled:opacity-45"
          onClick={() => setResult("approved")}
        >
          Approve verification
        </button>
      </div>
      {!canApprove ? (
        <p className="text-xs text-muted">
          Complete all required checklist items before approving.
        </p>
      ) : null}
    </Card>
  );
}

/** Full staff workspace for a verification case */
export function VerificationWorkspace({
  initial,
}: {
  initial: VerificationCase;
}) {
  const [active, setActive] = useState<ProofAsset | null>(null);
  const [checklist, setChecklist] = useState(initial.checklist);
  const canApprove =
    checklist.filter((c) => c.required).every((c) => c.done) &&
    initial.proofs.length > 0;

  return (
    <div className="panel-fit space-y-4">
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="label-mono">{initial.type.replace("_", " ")}</p>
            <h2 className="break-safe font-display text-xl text-ink">
              {initial.title} · {initial.subject}
            </h2>
            <p className="mt-1 break-safe text-sm text-muted">
              {initial.group} · reported {initial.reportedAt} · event{" "}
              {initial.eventDate}
            </p>
          </div>
          <StatusChip tone={verificationTone(initial.status)}>
            {verificationStatusLabel[initial.status]}
          </StatusChip>
        </div>
        <p className="mt-3 break-safe text-sm text-ink">{initial.notes}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusChip tone="neutral">{initial.window}</StatusChip>
          <StatusChip tone="auto">Owner · {initial.owner}</StatusChip>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-ink">Image proof</h3>
            <span className="text-xs text-muted">
              {initial.proofs.length} file{initial.proofs.length === 1 ? "" : "s"}
            </span>
          </div>
          {initial.proofs.length ? (
            <div className="grid grid-cols-2 gap-2">
              {initial.proofs.map((p) => (
                <ProofImageCard key={p.id} proof={p} onOpen={setActive} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed p-4">
              <StatusChip tone="warning">Awaiting proof</StatusChip>
              <p className="mt-2 text-sm text-muted">
                No documents uploaded yet. Request proof from the submitter
                before manual verification.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-3">
          <ManualVerificationChecklist
            initial={checklist}
            onChange={setChecklist}
          />
          <VerificationDecision canApprove={canApprove} />
        </div>
      </div>

      <ProofLightbox proof={active} onClose={() => setActive(null)} />
    </div>
  );
}

export function VerificationQueue({
  cases,
}: {
  cases: VerificationCase[];
}) {
  return (
    <div className="panel-fit space-y-2">
      {cases.map((c) => (
        <Card key={c.id} className="p-3 sm:p-4" interactive>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1.5">
                <StatusChip tone={verificationTone(c.status)}>
                  {verificationStatusLabel[c.status]}
                </StatusChip>
                <StatusChip tone="neutral">{c.window}</StatusChip>
              </div>
              <p className="mt-2 break-safe font-medium text-ink">
                {c.title} · {c.subject}
              </p>
              <p className="break-safe text-sm text-muted">
                {c.group} · {c.proofs.length} proof
                {c.proofs.length === 1 ? "" : "s"} · {c.reportedAt}
              </p>
            </div>
            <Button href={c.href} variant="accent" className="!min-h-9 !px-3 !text-sm">
              Open verification
            </Button>
          </div>
          {c.proofs[0] ? (
            <div className="mt-3 flex gap-2 overflow-hidden">
              {c.proofs.slice(0, 3).map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.src}
                  alt=""
                  className="h-14 w-11 shrink-0 rounded border border-hairline object-cover object-top"
                />
              ))}
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function VerificationBanner({ children }: { children?: ReactNode }) {
  return (
    <Card className="mb-4 border-gold bg-parchment p-3 sm:p-4">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" />
        <div className="min-w-0 text-sm text-ink">
          <p className="font-medium">Proof & manual verification</p>
          <p className="mt-1 text-muted">
            {children ??
              "Staff must review image proof before carrier files or coverage changes go out."}
          </p>
        </div>
      </div>
    </Card>
  );
}
