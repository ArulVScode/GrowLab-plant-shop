import { Search, X } from "lucide-react";
import { Select } from "../common/Input";
import { categories } from "../../data/categories";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const STOCK_OPTIONS = [
  { value: "all", label: "All Stock" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "price-asc", label: "Price Low-High" },
  { value: "price-desc", label: "Price High-Low" },
  { value: "stock-asc", label: "Stock Low-High" },
  { value: "stock-desc", label: "Stock High-Low" },
];

export default function ProductFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
}) {
  const hasActiveFilters =
    search ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.stock !== "all";

  const resetAll = () => {
    onSearchChange("");
    onFilterChange({ category: "all", status: "all", stock: "all" });
  };

  return (
    <div className="nb-surface-sm p-4 flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari produk, SKU, atau kategori..."
            aria-label="Cari produk"
            className="nb-input !pl-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              aria-label="Bersihkan pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Select
          value={filters.category}
          onChange={(e) =>
            onFilterChange({ ...filters, category: e.target.value })
          }
          className="w-full lg:w-48"
          aria-label="Filter kategori"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="w-full lg:w-40"
          aria-label="Filter status"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.stock}
          onChange={(e) =>
            onFilterChange({ ...filters, stock: e.target.value })
          }
          className="w-full lg:w-40"
          aria-label="Filter stok"
        >
          {STOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full lg:w-44"
          aria-label="Urutkan produk"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetAll}
          className="self-start text-xs font-display font-bold underline underline-offset-2 text-muted hover:text-ink"
        >
          Reset semua filter
        </button>
      )}
    </div>
  );
}
