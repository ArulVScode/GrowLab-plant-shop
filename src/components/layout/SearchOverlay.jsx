import { useEffect, useMemo, useState } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useStorefrontProducts } from "../../hooks/useStorefrontProducts";
import { formatRupiah } from "../../utils/format";

const POPULAR = [
  "Pupuk NPK",
  "Pupuk organik",
  "Obat tanaman",
  "Vitamin tanaman",
];

export default function SearchOverlay({ onClose, onSubmit }) {
  const [query, setQuery] = useState("");
  const { products } = useStorefrontProducts();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [query, products]);

  return (
    <div className="fixed inset-0 z-[70] bg-ink/50 flex items-start justify-center pt-16 md:pt-28 px-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl nb-surface bg-paper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) onSubmit(query.trim());
          }}
          className="flex items-center gap-3 p-4 border-b-3 border-ink"
        >
          <Search size={20} className="shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="flex-1 outline-none font-body text-base"
          />
          <button type="button" onClick={onClose} aria-label="Tutup pencarian">
            <X size={20} />
          </button>
        </form>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() ? (
            results.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => onSubmit(p.name)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-cream text-left"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="w-12 h-12 border-2 border-ink object-cover shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-sm truncate">
                          {p.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {p.category}
                        </span>
                      </span>
                      <span className="text-sm font-bold shrink-0">
                        {formatRupiah(p.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted text-center py-6">
                Produk tidak ditemukan.
              </p>
            )
          ) : (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted mb-3">
                <TrendingUp size={14} /> Pencarian populer
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    onClick={() => onSubmit(term)}
                    className="nb-chip bg-cream hover:bg-yellow"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
