import { categories } from "../../data/categories";

const PRICE_RANGES = [
  { id: "all", label: "Semua Harga" },
  { id: "under-30k", label: "Di bawah Rp30.000" },
  { id: "30k-60k", label: "Rp30.000 – Rp60.000" },
  { id: "60k-100k", label: "Rp60.000 – Rp100.000" },
  { id: "above-100k", label: "Di atas Rp100.000" },
];

export default function FilterSidebar({ filters, setFilters }) {
  const toggleCategory = (name) => {
    setFilters((f) => ({
      ...f,
      category: f.category === name ? "" : name,
    }));
  };

  return (
    <aside className="space-y-7">
      <FilterGroup title="Kategori">
        <div className="flex flex-col gap-2">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === c.name}
                onChange={() => toggleCategory(c.name)}
                className="w-4 h-4 accent-leaf-deep"
              />
              {c.name}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Harga">
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters.price === r.id}
                onChange={() => setFilters((f) => ({ ...f, price: r.id }))}
                className="w-4 h-4 accent-leaf-deep"
              />
              {r.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[4.5, 4, 3].map((r) => (
          <label key={r} className="flex items-center gap-2.5 text-sm cursor-pointer mb-2">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === r}
              onChange={() => setFilters((f) => ({ ...f, rating: r }))}
              className="w-4 h-4 accent-leaf-deep"
            />
            {r}+ ke atas
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Lainnya">
        <label className="flex items-center gap-2.5 text-sm cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={filters.discount}
            onChange={() => setFilters((f) => ({ ...f, discount: !f.discount }))}
            className="w-4 h-4 accent-leaf-deep"
          />
          Sedang Diskon
        </label>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.available}
            onChange={() => setFilters((f) => ({ ...f, available: !f.available }))}
            className="w-4 h-4 accent-leaf-deep"
          />
          Stok Tersedia
        </label>
      </FilterGroup>

      <button
        onClick={() => setFilters({ category: "", price: "all", rating: null, discount: false, available: false })}
        className="text-sm font-display font-bold underline underline-offset-2"
      >
        Reset Filter
      </button>
    </aside>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h4 className="font-display font-bold text-sm mb-3">{title}</h4>
      {children}
    </div>
  );
}
