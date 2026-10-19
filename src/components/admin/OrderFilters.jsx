import { Search, X } from "lucide-react";
import { Select } from "../common/Input";
import {
  statusLabel,
  PAYMENT_STATUS,
  paymentStatusLabel,
} from "../../data/adminOrders";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "total-desc", label: "Total High-Low" },
  { value: "total-asc", label: "Total Low-High" },
];

export default function OrderFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
}) {
  const hasActiveFilters =
    search || filters.status !== "all" || filters.payment !== "all";

  const resetAll = () => {
    onSearchChange("");
    onFilterChange({ status: "all", payment: "all" });
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
            placeholder="Cari nomor pesanan atau nama customer..."
            aria-label="Cari pesanan"
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
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="w-full lg:w-48"
          aria-label="Filter status pesanan"
        >
          <option value="all">All Status</option>
          {Object.entries(statusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.payment}
          onChange={(e) =>
            onFilterChange({ ...filters, payment: e.target.value })
          }
          className="w-full lg:w-44"
          aria-label="Filter status pembayaran"
        >
          <option value="all">All Payment</option>
          {Object.values(PAYMENT_STATUS).map((v) => (
            <option key={v} value={v}>
              {paymentStatusLabel[v]}
            </option>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full lg:w-44"
          aria-label="Urutkan pesanan"
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
