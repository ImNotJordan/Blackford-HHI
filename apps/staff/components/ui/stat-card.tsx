export function StatCard({
  label,
  value,
  hint,
  hintAccent,
}: {
  label: string;
  value: string;
  hint: string;
  hintAccent?: boolean;
}) {
  return (
    <div className="card flex flex-col gap-2">
      <span className="eyebrow m-0">{label}</span>
      <span className="stat-figure m-0">{value}</span>
      <span
        className={`text-[13px] ${
          hintAccent
            ? "font-medium text-[var(--brand-gold-deep)]"
            : "text-[var(--brand-gray)]"
        }`}
      >
        {hint}
      </span>
    </div>
  );
}
