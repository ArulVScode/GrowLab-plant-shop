const TONES = {
  default: "bg-paper",
  yellow: "bg-yellow",
  green: "bg-leaf",
  blue: "bg-sky-soft",
  orange: "bg-clay-soft",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}) {
  return (
    <div
      className={`nb-surface-sm p-4 flex items-center gap-3.5 ${TONES[tone]}`}
    >
      {Icon && (
        <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-paper border-2 border-ink">
          <Icon size={18} strokeWidth={2.25} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-display font-extrabold leading-none">
          {value}
        </p>
        <p className="text-xs font-semibold text-ink/70 mt-1.5 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}
