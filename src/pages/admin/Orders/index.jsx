import { useCallback, useEffect, useMemo, useState } from "react";
import { ShoppingBag, RotateCcw } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import { getOrders } from "../../../services/orderService";
import OrderStats from "../../../components/admin/OrderStats";
import OrderFilters from "../../../components/admin/OrderFilters";
import OrderTable from "../../../components/admin/OrderTable";
import EmptyState from "../../../components/common/EmptyState";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/common/Button";

const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState({ status: "all", payment: "all" });
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrders()
      .then((data) => setOrders(data))
      .catch(() => setError("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => setPage(1), [debouncedSearch, filters, sort]);

  const filtered = useMemo(() => {
    let list = orders.filter((o) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !o.customerName.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.status !== "all" && o.status !== filters.status) return false;
      if (filters.payment !== "all" && o.paymentStatus !== filters.payment)
        return false;
      return true;
    });

    switch (sort) {
      case "oldest":
        list = [...list].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        break;
      case "total-asc":
        list = [...list].sort((a, b) => a.total - b.total);
        break;
      case "total-desc":
        list = [...list].sort((a, b) => b.total - a.total);
        break;
      default:
        list = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
    return list;
  }, [orders, debouncedSearch, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters =
    debouncedSearch || filters.status !== "all" || filters.payment !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl md:text-2xl">Orders</h2>
        <p className="text-muted text-sm mt-1">
          Track and manage customer orders
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="nb-surface-sm p-4 h-[72px] bg-paper animate-pulse"
            />
          ))}
        </div>
      ) : (
        <OrderStats orders={orders} />
      )}

      {error ? (
        <div className="nb-surface-sm p-10 flex flex-col items-center text-center gap-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" icon={RotateCcw} onClick={loadOrders}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <OrderFilters
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={setFilters}
            sort={sort}
            onSortChange={setSort}
          />

          {loading ? (
            <div className="nb-surface-sm p-4 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-cream animate-pulse" />
              ))}
            </div>
          ) : pageItems.length > 0 ? (
            <>
              <p className="text-xs text-muted -mb-2">
                Showing {pageItems.length} of {filtered.length} orders
              </p>
              <OrderTable orders={pageItems} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          ) : hasActiveFilters ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders match your search."
              description="Try adjusting your search term or clearing the active filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setFilters({ status: "all", payment: "all" });
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="No orders yet"
              description="Customer orders will show up here once they start coming in."
            />
          )}
        </>
      )}
    </div>
  );
}
