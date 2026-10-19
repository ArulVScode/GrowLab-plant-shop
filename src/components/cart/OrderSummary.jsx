import { formatRupiah } from "../../utils/format";

export default function OrderSummary({ subtotal, discount = 0, shipping = 0, total, children, cta }) {
  return (
    <div className="nb-surface p-5 flex flex-col gap-4 sticky top-24">
      <h3 className="font-display font-bold text-lg">Ringkasan Belanja</h3>
      <div className="flex flex-col gap-2.5 text-sm">
        <Row label="Subtotal" value={formatRupiah(subtotal)} />
        {discount > 0 && <Row label="Diskon" value={`- ${formatRupiah(discount)}`} valueClass="text-leaf-deep" />}
        <Row label="Ongkos Kirim" value={shipping === 0 ? "Gratis" : formatRupiah(shipping)} />
      </div>
      <div className="border-t-2 border-dashed border-ink/30 pt-3 flex items-center justify-between">
        <span className="font-display font-bold">Total</span>
        <span className="font-display font-extrabold text-xl">{formatRupiah(total)}</span>
      </div>
      {children}
      {cta}
    </div>
  );
}

function Row({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className={`font-semibold text-ink ${valueClass}`}>{value}</span>
    </div>
  );
}
