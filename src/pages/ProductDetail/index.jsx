import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { ShieldCheck, Truck, PackageCheck, Heart } from "lucide-react";
import { useStorefrontProducts } from "../../hooks/useStorefrontProducts";
import ProductGallery from "../../components/product/ProductGallery";
import ProductCard from "../../components/product/ProductCard";
import Breadcrumb from "../../components/common/Breadcrumb";
import Rating from "../../components/common/Rating";
import Price from "../../components/common/Price";
import Badge from "../../components/common/Badge";
import QuantitySelector from "../../components/common/QuantitySelector";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../components/common/Toast";
import { formatSold } from "../../utils/format";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStorefrontProducts();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const { isAuthenticated } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container-max section-pad py-16">
        <p className="text-center text-muted">Memuat produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-max section-pad py-16">
        <EmptyState
          title="Produk tidak ditemukan"
          description="Produk yang kamu cari mungkin sudah tidak tersedia."
          action={
            <Link to="/products" className="nb-btn-primary">
              Kembali ke Produk
            </Link>
          }
        />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Produk", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-10 mt-6">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            {product.badge && <Badge tone="yellow">{product.badge}</Badge>}
            <span className="text-xs font-bold uppercase tracking-wide text-muted">
              {product.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 text-sm text-muted mb-5">
            <Rating value={product.rating} />
            <span>·</span>
            <span>{formatSold(product.sold)}</span>
          </div>

          <div className="nb-surface-sm p-4 mb-5 bg-cream inline-block w-fit">
            <Price
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />
            {product.discount > 0 && (
              <p className="text-sm font-bold text-leaf-deep mt-1">
                Hemat {product.discount}%
              </p>
            )}
          </div>

          <p
            className={`text-sm font-semibold mb-6 ${product.availability === "in_stock" ? "text-leaf-deep" : "text-clay"}`}
          >
            {product.availability === "in_stock"
              ? `Stok tersedia (${product.stock})`
              : "Stok terbatas"}
          </p>

          <p className="text-sm text-ink/80 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-display font-bold text-sm">Jumlah</span>
            <QuantitySelector
              value={qty}
              onChange={setQty}
              max={product.stock}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                addToCart(product, qty);
                showToast(`${product.name} ditambahkan ke keranjang`);
              }}
            >
              Tambah ke Keranjang
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                addToCart(product, qty);
                navigate("/checkout");
              }}
            >
              Beli Sekarang
            </Button>
            <button
              onClick={() => {
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
              className="w-12 h-12 shrink-0 flex items-center justify-center border-3 border-ink bg-paper shadow-hard hover:bg-cream"
            >
              <Heart
                size={20}
                className={isWishlisted ? "fill-clay text-clay" : ""}
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <InfoChip icon={ShieldCheck} label="Produk terpercaya" />
            <InfoChip icon={Truck} label="Pengiriman aman" />
            <InfoChip icon={PackageCheck} label="Stok terjamin" />
          </div>

          <div className="space-y-6">
            <DetailBlock title="Manfaat Produk">
              <ul className="list-disc list-inside space-y-1.5 text-sm text-ink/80">
                {product.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </DetailBlock>
            <DetailBlock title="Cara Penggunaan">
              <p className="text-sm text-ink/80 leading-relaxed">
                {product.usage}
              </p>
            </DetailBlock>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl md:text-2xl mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoChip({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 border-2 border-ink px-2 py-3 bg-paper">
      <Icon size={18} />
      <span className="text-[11px] font-semibold leading-tight">{label}</span>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="border-t-2 border-ink/10 pt-5">
      <h3 className="font-display font-bold text-base mb-2.5">{title}</h3>
      {children}
    </div>
  );
}
