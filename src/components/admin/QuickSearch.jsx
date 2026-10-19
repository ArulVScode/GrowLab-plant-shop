import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getProducts } from "../../services/productService";

export default function QuickSearch() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      getProducts().then((data) => {
        setProducts(data);
        setLoaded(true);
      });
    }
  }, [open, loaded]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const results = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const goTo = (id) => {
    navigate(`/admin/products/${id}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border-2 border-ink px-3 py-2 w-56 text-sm text-muted hover:bg-cream hover:text-ink transition-colors"
      >
        <Search size={15} />
        <span>Cari produk...</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 nb-surface bg-paper z-50">
          <div className="flex items-center gap-2 p-3 border-b-2 border-ink">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama atau SKU produk..."
              className="flex-1 outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Bersihkan">
                <X size={14} className="text-muted" />
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {!query.trim() ? (
              <p className="text-xs text-muted text-center py-6 px-4">
                Ketik untuk langsung lompat ke halaman detail satu produk. Untuk
                menelusuri seluruh katalog dengan filter, buka halaman Products.
              </p>
            ) : results.length > 0 ? (
              results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => goTo(p.id)}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-cream text-left"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-9 h-9 border-2 border-ink object-cover shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {p.name}
                    </span>
                    <span className="block text-xs text-muted">
                      SKU: {p.sku}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted text-center py-6">
                Produk tidak ditemukan.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
