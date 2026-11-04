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
    <div className="card flex flex-col gap-1.5">
      <span className="text-[13px] text-[var(--color-text-muted)]">{label}</span>
      <span className="heading text-[30px] font-extrabold">{value}</span>
      <span
        className={`text-[13px] ${hintAccent ? "font-semibold text-[var(--color-amber-dark)]" : "text-[var(--color-text-muted)]"}`}
      >
        {hint}
      </span>
    </div>
  );
}
