import { Star } from "lucide-react";

export default function Rating({ value, showValue = true, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <Star size={size} className="fill-yellow text-ink" strokeWidth={1.5} />
      {showValue && <span>{value.toFixed(1)}</span>}
    </span>
  );
}
