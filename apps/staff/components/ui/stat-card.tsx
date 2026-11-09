export function StatCard({
  label,
  value,
  hint,
  hintAccent,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  /** Highlights the hint line in Gold Deep (e.g. "2 overdue"). */
  hintAccent?: boolean;
  /** "warn" fills the card Parchment for figures that need attention. */
  tone?: "default" | "warn";
}) {
  return (
    <div
      className={`card gap-1.5 ${
        tone === "warn" ? "border-gold bg-parchment" : ""
      }`}
    >
      <span className="label">{label}</span>
      <span className="stat-figure">{value}</span>
      {hint ? (
        <span
          className={`flex items-center gap-1.5 text-[13px] ${
            hintAccent ? "font-semibold text-gold-deep" : "text-muted"
          }`}
        >
          {hintAccent ? <span aria-hidden className="dot dot-gold h-1.5 w-1.5" /> : null}
          {hint}
        </span>
      ) : null}
    </div>
  );
}
