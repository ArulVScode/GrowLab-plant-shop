import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStorefrontProducts } from "../../hooks/useStorefrontProducts";
import ProductCard from "../../components/product/ProductCard";

export default function FeaturedProducts() {
  const { products } = useStorefrontProducts();
  const featured = products
    .filter((p) => p.badge === "BEST SELLER")
    .slice(0, 8);

  return (
    <section className="container-max section-pad py-8 md:py-14">
      <div className="flex items-end justify-between mb-7 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl">Produk Pilihan</h2>
          <p className="text-muted mt-1.5">Favorit para pekebun bulan ini.</p>
        </div>
        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-1.5 font-display font-bold text-sm shrink-0 hover:underline"
        >
          Lihat Semua <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Link to="/products" className="sm:hidden nb-btn-outline w-full mt-6">
        Lihat Semua Produk
      </Link>
    </section>
  );
}
