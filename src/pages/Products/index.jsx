import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { useStorefrontProducts } from "../../hooks/useStorefrontProducts";
import LoadingGrid from "../../components/common/LoadingState";
import ProductCard from "../../components/product/ProductCard";
import Breadcrumb from "../../components/common/Breadcrumb";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { Select } from "../../components/common/Input";
import FilterSidebar from "./FilterSidebar";

const PAGE_SIZE = 12;

function inPriceRange(price, range) {
  switch (range) {
    case "under-30k":
      return price < 30000;
    case "30k-60k":
      return price >= 30000 && price <= 60000;
    case "60k-100k":
      return price > 60000 && price <= 100000;
    case "above-100k":
      return price > 100000;
    default:
      return true;
  }
}

export default function Products() {
  const { products, loading, error } = useStorefrontProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    price: "all",
    rating: null,
    discount: false,
    available: false,
  });
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const query = searchParams.get("q") || "";

  const location = useLocation();
  useEffect(() => {
    setFilters((f) => ({ ...f, category: searchParams.get("category") || "" }));
  }, [location.key]);

  useEffect(() => setPage(1), [filters, sort, query]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (filters.category && p.category !== filters.category) return false;
      if (!inPriceRange(p.price, filters.price)) return false;
      if (filters.rating && p.rating < filters.rating) return false;
      if (filters.discount && !p.discount) return false;
      if (filters.available && p.availability !== "in_stock") return false;
      return true;
    });

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "sold") list = [...list].sort((a, b) => b.sold - a.sold);

    return list;
  }, [products, filters, sort, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Produk" }]} />

      <div className="mt-4 mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl">
            {query ? `Hasil untuk "${query}"` : "Semua Produk"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {loading
              ? "Memuat produk..."
              : `Menampilkan ${pageItems.length} dari ${filtered.length} produk`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden nb-btn-outline !px-4 !py-2 !text-sm"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>
          <Select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-44"
          >
            <option value="relevance">Paling Sesuai</option>
            <option value="sold">Terlaris</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </Select>
        </div>
      </div>

      {query && (
        <button
          onClick={() =>
            setSearchParams((p) => {
              p.delete("q");
              return p;
            })
          }
          className="nb-chip bg-paper mb-6 hover:bg-cream"
        >
          {query} <X size={12} />
        </button>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        <div>
          {loading ? (
            <LoadingGrid count={PAGE_SIZE} />
          ) : error ? (
            <EmptyState
              icon={PackageSearch}
              title="Gagal memuat produk"
              description="Terjadi kendala saat mengambil data produk. Coba muat ulang halaman."
            />
          ) : pageItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau reset filter yang digunakan."
            />
          )}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-[70] bg-ink/40"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-xs bg-cream border-l-3 border-ink overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-16 px-5 border-b-3 border-ink sticky top-0 bg-cream">
              <span className="font-display font-extrabold">FILTER</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Tutup filter"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar filters={filters} setFilters={setFilters} />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="nb-btn-primary w-full mt-6"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
