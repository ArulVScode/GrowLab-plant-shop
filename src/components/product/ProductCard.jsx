import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import Badge from "../common/Badge";
import Rating from "../common/Rating";
import Price from "../common/Price";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useToast } from "../common/Toast";
import { formatSold } from "../../utils/format";

const BADGE_TONE = {
  "BEST SELLER": "yellow",
  BARU: "blue",
  DISKON: "orange",
  ORGANIK: "green",
};

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group nb-surface flex flex-col h-full">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square border-b-3 border-ink overflow-hidden bg-cream"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge tone={BADGE_TONE[product.badge] || "dark"}>
              {product.badge}
            </Badge>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isAuthenticated) {
              navigate("/login", { state: { from: location.pathname } });
              return;
            }
            toggleWishlist(product.id);
          }}
          aria-label={
            isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"
          }
          aria-pressed={isWishlisted}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-paper border-2 border-ink hover:bg-yellow"
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-clay text-clay" : ""}
          />
        </button>
      </Link>

      <div className="p-3.5 md:p-4 flex flex-col flex-1 gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
          {product.category}
        </span>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display font-bold text-sm md:text-base leading-snug line-clamp-2 min-h-[2.6em] hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Rating value={product.rating} />
          <span aria-hidden="true">·</span>
          <span>{formatSold(product.sold)}</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
          />
          <button
            onClick={() => {
              addToCart(product, 1);
              showToast(`${product.name} ditambahkan ke keranjang`);
            }}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="w-9 h-9 shrink-0 flex items-center justify-center bg-ink text-cream border-2 border-ink hover:bg-leaf hover:text-ink transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
