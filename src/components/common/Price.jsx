import { formatRupiah } from "../../utils/format";

export default function Price({ price, originalPrice, size = "md" }) {
  const hasDiscount = originalPrice && originalPrice > price;
  const priceSize = size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-display font-extrabold ${priceSize}`}>{formatRupiah(price)}</span>
      {hasDiscount && (
        <span className="text-sm text-muted line-through">{formatRupiah(originalPrice)}</span>
      )}
    </div>
  );
}
