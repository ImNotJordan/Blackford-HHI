"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Download, Plus, Trash2, UserPlus } from "lucide-react";
import { Button, Card, StatusChip } from "@/components/ui";
import { ActionButton } from "@/components/interactive";

export function WorkingSaveBar({
  label = "Save",
  success = "Saved",
  href,
  hrefLabel = "Continue",
}: {
  label?: string;
  success?: string;
  href?: string;
  hrefLabel?: string;
}) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="space-y-2">
        <div
          className="animate-rise flex min-h-11 items-center gap-2 rounded-[10px] border border-gold bg-parchment px-4 text-sm text-ink"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 text-gold-deep" aria-hidden />
          {success}
        </div>
        {href ? (
          <Button href={href} variant="accent" className="w-full">
            {hrefLabel}
          </Button>
        ) : null}
      </div>
    );
  }
  return (
    <button
      type="button"
      className="ui-press inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[10px] bg-ruby px-4 text-[15px] font-medium text-ivory"
      onClick={() => setDone(true)}
    >
      {label}
    </button>
  );
}

export function DownloadButton({
  label = "Download",
  success = "Download ready",
  className = "",
}: {
  label?: string;
  success?: string;
  className?: string;
}) {
  return (
    <ActionButton
      variant="secondary"
      success={success}
      resetMs={2200}
      className={`!min-h-9 !px-3 !text-sm ${className}`}
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      {label}
    </ActionButton>
  );
}

export function InviteStaffPanel() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <Card className="animate-rise border-gold bg-parchment p-4" role="status">
        <CheckCircle2 className="h-5 w-5 text-gold-deep" />
        <p className="mt-2 font-medium text-ink">Invite sent</p>
        <p className="text-sm text-muted">
          New staff must complete MFA before accessing the book.
        </p>
        <Button href="/admin/mfa-setup" variant="secondary" className="mt-3">
          Open MFA setup
        </Button>
      </Card>
    );
  }
  if (!open) {
    return (
      <Button variant="accent" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" aria-hidden />
        Invite staff
      </Button>
    );
  }
  return (
    <Card className="space-y-3 p-4">
      <p className="label-mono">Invite staff</p>
      <input
        className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm"
        placeholder="name@blackford.com"
        defaultValue="new.hire@blackford.com"
        aria-label="Email"
      />
      <select
        className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm"
        aria-label="Role"
        defaultValue="manager"
      >
        <option value="admin">Blackford admin</option>
        <option value="manager">Account manager</option>
      </select>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button variant="accent" onClick={() => setSent(true)}>
          Send invite
        </Button>
      </div>
    </Card>
  );
}

export function RemovableUserRow({
  name,
  role,
  scope,
  mfa,
  removable,
}: {
  name: string;
  role: ReactNode;
  scope: string;
  mfa: string;
  removable?: boolean;
}) {
  const [gone, setGone] = useState(false);
  if (gone) {
    return (
      <div className="px-3 py-3 text-sm text-muted" role="status">
        {name} removed · access revoked
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 items-center gap-2 px-3 py-3 text-sm sm:grid-cols-5">
      <span className="font-medium text-ink">{name}</span>
      <span>{role}</span>
      <span className="text-muted">{scope}</span>
      <span className="text-muted">{mfa}</span>
      {removable ? (
        <button
          type="button"
          className="ui-press inline-flex min-h-9 items-center justify-center gap-1 rounded-[10px] border border-ruby/40 px-2 text-xs font-medium text-ruby"
          onClick={() => setGone(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      ) : (
        <StatusChip tone="success">Active</StatusChip>
      )}
    </div>
  );
}

export function DependentBoard() {
  const [people, setPeople] = useState([
    { id: "1", name: "Omar Patel", meta: "Spouse · DOB 03/12/1990" },
    { id: "2", name: "Nora Patel", meta: "Child · DOB 08/02/2022" },
  ]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [rel, setRel] = useState("child");

  return (
    <div className="space-y-3">
      {people.map((p) => (
        <Card
          key={p.id}
          className="flex items-center justify-between gap-2 p-4"
        >
          <div className="min-w-0">
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-sm text-muted">{p.meta}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip tone="success">On file</StatusChip>
            <button
              type="button"
              className="ui-press rounded-[10px] p-2 text-muted hover:text-ruby"
              aria-label={`Remove ${p.name}`}
              onClick={() =>
                setPeople((prev) => prev.filter((x) => x.id !== p.id))
              }
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </Card>
      ))}

      {adding ? (
        <Card className="space-y-3 p-4">
          <input
            className="min-h-11 w-full rounded-[10px] border border-hairline px-3 text-sm"
            placeholder="Full legal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Dependent name"
          />
          <select
            className="min-h-11 w-full rounded-[10px] border border-hairline px-3 text-sm"
            value={rel}
            onChange={(e) => setRel(e.target.value)}
            aria-label="Relationship"
          >
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={() => {
                if (!name.trim()) return;
                setPeople((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    name: name.trim(),
                    meta: `${rel[0].toUpperCase()}${rel.slice(1)} · added today`,
                  },
                ]);
                setName("");
                setAdding(false);
              }}
            >
              Save dependent
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add dependent
        </Button>
      )}

      <Button href="/employee/compare" variant="accent" className="w-full">
        Continue
      </Button>
    </div>
  );
}

export function PlanPicker({
  plans,
  continueHref = "/employee/elect",
}: {
  plans: {
    id: string;
    name: string;
    paycheck: number;
    annual: number;
    deductible: number;
    oop: number | null;
  }[];
  continueHref?: string;
}) {
  const [selected, setSelected] = useState(plans[0]?.id);
  return (
    <div className="stagger space-y-3">
      {plans.map((p) => {
        const on = selected === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className={`ui-card w-full rounded-[10px] border p-5 text-left ${
              on ? "border-ink bg-ivory" : "border-hairline bg-surface"
            }`}
          >
            {on ? <StatusChip tone="active">Selected</StatusChip> : null}
            <h2 className="mt-2 font-display text-xl text-ink">{p.name}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label-mono">Per paycheck</p>
                <p className="font-display text-2xl text-ink">
                  ${p.paycheck.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="label-mono">Annual</p>
                <p className="font-display text-2xl text-ink">
                  ${p.annual.toFixed(0)}
                </p>
              </div>
              <div>
                <p className="text-muted">Deductible</p>
                <p className="font-medium text-ink">
                  ${p.deductible.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted">Out-of-pocket max</p>
                <p className="font-medium text-ink">
                  {p.oop ? `$${p.oop.toLocaleString()}` : "—"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
      <Button href={continueHref} variant="accent" className="w-full">
        Continue with selected plan
      </Button>
    </div>
  );
}

export function TaskBoard({
  initial,
}: {
  initial: {
    id: string;
    title: string;
    type: string;
    client: string;
    due: string;
    priority: string;
    href: string;
  }[];
}) {
  const [rows, setRows] = useState(
    initial.map((t) => ({ ...t, status: "open" as "open" | "done" })),
  );

  return (
    <Card className="divide-y divide-hairline overflow-hidden">
      {rows.map((t) => (
        <div
          key={t.id}
          className="flex flex-wrap items-start justify-between gap-3 px-3 py-3 sm:px-4"
        >
          <div className="min-w-0 flex-1">
            <p
              className={`font-medium ${t.status === "done" ? "text-muted line-through" : "text-ink"}`}
            >
              {t.title}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t.type} · {t.client} · {t.due}
            </p>
            <div className="mt-2">
              <StatusChip
                tone={
                  t.status === "done"
                    ? "success"
                    : t.priority === "high"
                      ? "danger"
                      : "warning"
                }
              >
                {t.status === "done" ? "Done" : t.priority}
              </StatusChip>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              href={t.href}
              variant="secondary"
              className="!min-h-9 !text-sm"
            >
              Open
            </Button>
            {t.status === "open" ? (
              <button
                type="button"
                className="ui-press min-h-9 rounded-[10px] bg-ink px-3 text-sm font-medium text-ivory"
                onClick={() =>
                  setRows((prev) =>
                    prev.map((x) =>
                      x.id === t.id ? { ...x, status: "done" } : x,
                    ),
                  )
                }
              >
                Complete
              </button>
            ) : (
              <StatusChip tone="success">Completed</StatusChip>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}

export function BeneficiaryForm() {
  return (
    <Card className="space-y-4 p-5">
      <label className="block text-sm">
        <span className="label-mono mb-2 block">Primary beneficiary</span>
        <input
          className="min-h-11 w-full rounded-[10px] border border-hairline px-3"
          defaultValue="Omar Patel"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Relationship</span>
          <select
            className="min-h-11 w-full rounded-[10px] border border-hairline px-3"
            defaultValue="spouse"
          >
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="label-mono mb-2 block">Share</span>
          <input
            className="min-h-11 w-full rounded-[10px] border border-hairline px-3"
            defaultValue="100%"
          />
        </label>
      </div>
      <WorkingSaveBar
        label="Save & continue"
        success="Beneficiaries saved"
        href="/employee/review"
        hrefLabel="Continue to review"
      />
    </Card>
  );
}

export function DetailsForm() {
  return (
    <Card className="space-y-4 p-5">
      {(
        [
          ["Legal name", "Aisha Patel", "text"],
          ["Mobile", "(904) 555-0142", "tel"],
          ["Email", "aisha.patel@harborlight.com", "email"],
          ["Home address", "1840 Riverside Ave, Jacksonville, FL", "text"],
        ] as const
      ).map(([label, value, type]) => (
        <label key={label} className="block text-sm">
          <span className="label-mono mb-2 block">{label}</span>
          <input
            type={type}
            defaultValue={value}
            className="min-h-11 w-full rounded-[10px] border border-hairline px-3 text-ink"
          />
        </label>
      ))}
      <WorkingSaveBar
        label="Save & continue"
        success="Details saved"
        href="/employee/dependents"
        hrefLabel="Continue to dependents"
      />
    </Card>
  );
}

export function DocumentList({
  items,
}: {
  items: { name: string; meta: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((d) => (
        <Card
          key={d.name}
          className="flex flex-wrap items-center justify-between gap-2 p-4"
        >
          <div>
            <p className="font-medium text-ink">{d.name}</p>
            <p className="text-sm text-muted">{d.meta}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip tone="success">On file</StatusChip>
            <DownloadButton label="Download" success={`${d.name} ready`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SettingsSaveForm({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
      <ActionButton success="Security settings saved">Save settings</ActionButton>
    </div>
  );
}
