const TONES = {
  yellow: "bg-yellow text-ink",
  green: "bg-leaf text-ink",
  blue: "bg-sky text-cream",
  dark: "bg-ink text-cream",
  orange: "bg-clay text-ink",
  red: "bg-red-600 text-cream",
  gray: "bg-cream text-muted",
};

export default function Badge({ tone = "dark", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center border-2 border-ink px-2.5 py-1 text-[11px] font-display font-bold uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
