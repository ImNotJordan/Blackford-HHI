import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Languages,
  Moon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Card, StatusChip } from "@/components/ui";
import {
  automations,
  enrollmentFlow,
  pipelineStages,
  sowModules,
} from "@/lib/sow-features";

/** SOW module tag — Ink on Ivory / Pale Gold on Ink only */
export function ModuleTag({
  code,
  name,
  dark = false,
}: {
  code: string;
  name?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${
        dark
          ? "border-pale-gold/50 bg-ink text-pale-gold"
          : "border-hairline bg-surface text-ink"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dark ? "bg-pale-gold" : "bg-ruby"}`}
        aria-hidden
      />
      <span className={dark ? "text-pale-gold" : "text-ink"}>
        Module {code}
      </span>
      {name ? (
        <span className={`break-safe ${dark ? "text-ivory" : "text-muted"}`}>
          {name}
        </span>
      ) : null}
    </span>
  );
}

export function FeatureCallout({
  module,
  title,
  children,
  tone = "auto",
}: {
  module: string;
  title: string;
  children: ReactNode;
  tone?: "auto" | "warning" | "info";
}) {
  const styles =
    tone === "warning"
      ? "border-gold bg-parchment"
      : tone === "info"
        ? "border-hairline bg-surface"
        : "border-gold bg-parchment";
  return (
    <Card className={`animate-rise ${styles} p-3 sm:p-4`}>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <ModuleTag code={module} />
        {tone === "auto" ? (
          <StatusChip tone="auto">
            <Zap className="h-3 w-3" aria-hidden /> Automatic
          </StatusChip>
        ) : null}
      </div>
      <h3 className="mt-2 break-safe text-ink">{title}</h3>
      <div className="mt-1.5 break-safe text-sm leading-relaxed text-ink">
        {children}
      </div>
    </Card>
  );
}

export function AutomationStrip({
  limit = 4,
  group,
}: {
  limit?: number;
  group?: "Enrollment" | "Onboarding" | "Carrier";
}) {
  const rows = automations
    .filter((a) => (group ? a.group === group : true))
    .slice(0, limit);
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-ivory px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="label-mono">Automations</p>
          <h2 className="break-safe font-display text-lg text-ink sm:text-xl">
            {group ? `${group} · live at launch` : "17 live at launch"}
          </h2>
        </div>
        <Link href="/admin/automations" className="text-link shrink-0 text-sm">
          View all
        </Link>
      </div>
      <ul className="stagger divide-y divide-hairline">
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-start gap-2 px-3 py-3 text-sm sm:gap-3 sm:px-4"
          >
            <span className="font-mono text-xs text-ink tabular-nums">
              #{a.id}
            </span>
            <div className="min-w-0 flex-1 basis-[12rem]">
              <p className="break-safe font-medium text-ink">{a.when}</p>
              <p className="mt-0.5 break-safe text-muted">{a.does}</p>
            </div>
            <StatusChip tone="auto">{a.who}</StatusChip>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ConsentNotice() {
  return (
    <div className="animate-rise flex gap-3 rounded-[10px] border border-hairline bg-surface p-4 text-sm text-ink">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
      <div>
        <p className="font-medium">Consent & opt-out (Module B)</p>
        <p className="mt-1 text-muted">
          Messages check channel consent first. STOP and HELP are handled
          automatically. Texts carry a secure link — never health details.
        </p>
      </div>
    </div>
  );
}

export function QuietHoursNotice() {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-gold bg-parchment p-4 text-sm text-ink">
      <Moon className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden />
      <div>
        <p className="font-medium text-ink">Quiet hours</p>
        <p className="mt-1">
          Default 8 a.m.–8 p.m. in the recipient’s time zone. Sends held until
          the window opens.
        </p>
      </div>
    </div>
  );
}

export function LanguageToggle({ active = "en" }: { active?: "en" | "es" }) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-[10px] border border-hairline bg-surface p-1"
      role="group"
      aria-label="Message language"
    >
      <Languages className="ml-2 h-4 w-4 text-gold-deep" aria-hidden />
      {(["en", "es"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          className={`ui-press min-h-9 rounded-[8px] px-3 text-sm font-medium ${
            active === lang
              ? "bg-ink text-ivory"
              : "text-ink hover:bg-ivory"
          }`}
        >
          {lang === "en" ? "English" : "Español"}
        </button>
      ))}
    </div>
  );
}

export function DeliveryTracker({
  items = [
    { channel: "Text", status: "Delivered", at: "10:02 AM" },
    { channel: "Email", status: "Opened", at: "10:14 AM" },
  ],
}: {
  items?: { channel: string; status: string; at: string }[];
}) {
  return (
    <Card className="p-5">
      <p className="label-mono">Delivery tracking</p>
      <h3 className="mt-1">Channel status</h3>
      <ul className="stagger mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.channel}
            className="flex items-center justify-between gap-3 border-b border-hairline pb-3 text-sm last:border-0"
          >
            <span className="font-medium text-ink">{item.channel}</span>
            <div className="flex items-center gap-2">
              <StatusChip
                tone={
                  item.status === "Failed" || item.status === "Bounced"
                    ? "danger"
                    : "success"
                }
              >
                {item.status}
              </StatusChip>
              <span className="font-mono text-xs text-muted">{item.at}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        If one channel fails, the system retries on the other, then creates a
        call task (Automation 12).
      </p>
    </Card>
  );
}

export function PipelineBar({ active }: { active: string }) {
  const idx = pipelineStages.indexOf(
    active as (typeof pipelineStages)[number],
  );
  return (
    <div className="panel-fit animate-rise">
      <ol className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
        {pipelineStages.map((stage, i) => {
          const state =
            i < idx ? "done" : i === idx ? "current" : "upcoming";
          return (
            <li key={stage} className="min-w-0">
              <div
                className={`rounded-[10px] border px-1.5 py-2 text-center transition-colors duration-200 sm:px-2 sm:py-2.5 ${
                  state === "current"
                    ? "border-ink bg-ink text-ivory"
                    : state === "done"
                      ? "border-gold bg-parchment text-ink"
                      : "border-hairline bg-surface text-muted"
                }`}
              >
                <span className="block font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">
                  {i + 1}/{pipelineStages.length}
                </span>
                <span className="mt-0.5 block break-safe text-[11px] font-semibold leading-tight sm:text-xs">
                  {stage}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function EnrollmentStepper({ current }: { current: number }) {
  return (
    <nav aria-label="Enrollment steps" className="panel-fit animate-rise mb-4">
      <ol className="grid grid-cols-4 gap-1 sm:grid-cols-7">
        {enrollmentFlow.map((s) => {
          const state =
            s.step < current ? "done" : s.step === current ? "current" : "todo";
          return (
            <li key={s.step} className="min-w-0">
              <Link
                href={s.href}
                className={`ui-press flex h-full flex-col items-center rounded-[10px] border px-0.5 py-1.5 text-center no-underline sm:px-1 sm:py-2 ${
                  state === "current"
                    ? "border-ink bg-ink text-ivory"
                    : state === "done"
                      ? "border-gold bg-parchment text-ink"
                      : "border-hairline bg-surface text-muted"
                }`}
              >
                <span className="font-mono text-[10px] tabular-nums">
                  {s.step}
                </span>
                <span className="mt-0.5 break-safe text-[9px] font-medium leading-tight sm:text-[10px]">
                  {s.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ChecklistProgress({
  items,
}: {
  items: { id: string; label: string; done: boolean; due: string; owner: string }[];
}) {
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-hairline bg-ivory px-5 py-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="label-mono">Module C</p>
            <h2 className="font-display text-xl">Onboarding checklist</h2>
          </div>
          <p className="font-display text-2xl text-ink tabular-nums">{pct}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-hairline">
          <div
            className="progress-fill h-full rounded-full bg-ink"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="stagger divide-y divide-hairline">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 px-5 py-3.5 text-sm"
          >
            <div className="flex gap-3">
              {item.done ? (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
                  aria-hidden
                />
              ) : (
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                  aria-hidden
                />
              )}
              <div>
                <p
                  className={`font-medium ${item.done ? "text-muted line-through" : "text-ink"}`}
                >
                  <span className="mr-2 font-mono text-xs text-muted">
                    {i + 1}.
                  </span>
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">Owner · {item.owner}</p>
              </div>
            </div>
            <StatusChip tone={item.done ? "success" : "warning"}>
              {item.done ? "Done" : item.due}
            </StatusChip>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ValidationErrors({
  errors,
}: {
  errors: { row: string; name: string; issue: string }[];
}) {
  return (
    <Card className="animate-rise border-gold bg-parchment p-5">
      <div className="flex gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="label-mono">Automation 9</p>
          <h3 className="mt-1">Census validation errors</h3>
          <p className="mt-1 text-sm text-ink">
            Fix these rows and upload again from the Blackford template.
          </p>
          <ul className="stagger mt-4 space-y-2">
            {errors.map((e) => (
              <li
                key={e.row}
                className="rounded-[10px] border border-gold/40 bg-surface px-3 py-2 text-sm text-ink"
              >
                <span className="font-mono text-xs text-ink">
                  Row {e.row}
                </span>
                <span className="mx-2 text-muted">·</span>
                <span className="font-medium">{e.name}</span>
                <p className="mt-0.5 text-muted">{e.issue}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export function SignatureAudit({
  name = "Aisha Patel",
  when = "Mar 3, 2027 · 9:58 AM",
  device = "iPhone · Safari",
  ip = "203.0.113.44",
}: {
  name?: string;
  when?: string;
  device?: string;
  ip?: string;
}) {
  return (
    <Card className="animate-scale p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-gold-deep" aria-hidden />
        <p className="label-mono">Module E · Signature audit</p>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Signer", name],
          ["Signed at", when],
          ["Device", device],
          ["IP address", ip],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[10px] border border-hairline bg-ivory p-3">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-1 font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function DuplicateBanner({
  matches = ["Harbor Light Mfg (EIN match)", "harborlight.com domain"],
}: {
  matches?: string[];
}) {
  return (
    <Card className="animate-rise border-ruby/40 bg-surface p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-ruby" aria-hidden />
        <div>
          <p className="font-medium text-ink">
            Possible duplicate · Module A
          </p>
          <p className="mt-1 text-sm text-muted">
            Import checked name, EIN, email, and phone. Confirm merge or keep
            separate.
          </p>
          <ul className="mt-3 list-inside list-disc text-sm text-ink">
            {matches.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export function AcaCaptureNote() {
  return (
    <div className="rounded-[10px] border border-hairline bg-ivory px-4 py-3 text-sm text-ink">
      <span className="label-mono mr-2">ACA</span>
      Offers, elections, and waivers by month are captured from day one. Filing
      ships in Release 2.
    </div>
  );
}

export function ModuleFeatureGrid({ codes }: { codes: string[] }) {
  const mods = sowModules.filter((m) => codes.includes(m.code));
  return (
    <div className="stagger grid gap-4 md:grid-cols-2">
      {mods.map((m) => (
        <Card key={m.code} className="ui-card p-5">
          <ModuleTag code={m.code} name={m.name} />
          <p className="mt-3 text-sm font-medium text-ink">{m.done}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {m.features.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function ActivityTimeline({
  items,
}: {
  items: { title: string; meta: string }[];
}) {
  return (
    <ol className="stagger space-y-0 border-l-2 border-hairline pl-4">
      {items.map((item, i) => (
        <li key={item.title} className="relative pb-5 last:pb-0">
          <span
            className={`absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-surface ${
              i === 0 ? "bg-ruby" : "bg-gold"
            }`}
          />
          <p className="text-sm font-medium text-ink">{item.title}</p>
          <p className="mt-0.5 font-mono text-xs text-muted">{item.meta}</p>
        </li>
      ))}
    </ol>
  );
}
