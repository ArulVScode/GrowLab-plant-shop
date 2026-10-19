import { Search, X } from "lucide-react";
import { Select } from "../common/Input";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "orders-desc", label: "Most Orders" },
  { value: "spent-desc", label: "Highest Spender" },
  { value: "name-asc", label: "Name A-Z" },
];

export default function CustomerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}) {
  const hasActiveFilters = search || status !== "all";

  const resetAll = () => {
    onSearchChange("");
    onStatusChange("all");
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
            placeholder="Cari nama atau email customer..."
            aria-label="Cari customer"
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
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full lg:w-44"
          aria-label="Filter status customer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </Select>

        <Select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full lg:w-48"
          aria-label="Urutkan customer"
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
