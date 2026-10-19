import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import QuantitySelector from "../common/QuantitySelector";
import Price from "../common/Price";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/format";

export default function CartItem({ item }) {
  const { updateQty, removeFromCart, toggleSelected } = useCart();
  const { product, qty, selected } = item;
  const subtotal = product.price * qty;

  return (
    <div className="flex gap-3 md:gap-4 p-4 border-b-3 border-ink last:border-b-0">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggleSelected(product.id)}
        aria-label={`Pilih ${product.name}`}
        className="mt-2 w-5 h-5 accent-leaf-deep shrink-0"
      />
      <Link to={`/products/${product.slug}`} className="w-20 h-20 md:w-24 md:h-24 shrink-0 border-2 border-ink overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.slug}`} className="font-display font-bold text-sm md:text-base hover:underline line-clamp-2">
            {product.name}
          </Link>
          <button
            onClick={() => removeFromCart(product.id)}
            aria-label={`Hapus ${product.name} dari keranjang`}
            className="shrink-0 text-muted hover:text-clay"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <span className="text-xs text-muted">{product.category}</span>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
          <QuantitySelector value={qty} onChange={(v) => updateQty(product.id, v)} min={1} max={product.stock} size="sm" />
          <div className="text-right">
            <Price price={subtotal} size="sm" />
            {qty > 1 && <p className="text-[11px] text-muted">{formatRupiah(product.price)} / item</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
