import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, RotateCcw } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import { getCustomers } from "../../../services/customerService";
import CustomerStats from "../../../components/admin/CustomerStats";
import CustomerFilters from "../../../components/admin/CustomerFilters";
import CustomerTable from "../../../components/admin/CustomerTable";
import EmptyState from "../../../components/common/EmptyState";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/common/Button";

const PAGE_SIZE = 10;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getCustomers()
      .then((data) => setCustomers(data))
      .catch(() => setError("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => setPage(1), [debouncedSearch, status, sort]);

  const filtered = useMemo(() => {
    let list = customers.filter((c) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.email.toLowerCase().includes(q)
        )
          return false;
      }
      if (status !== "all" && c.status !== status) return false;
      return true;
    });

    switch (sort) {
      case "oldest":
        list = [...list].sort(
          (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt),
        );
        break;
      case "orders-desc":
        list = [...list].sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case "spent-desc":
        list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort(
          (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt),
        );
    }
    return list;
  }, [customers, debouncedSearch, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters = debouncedSearch || status !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl md:text-2xl">Customers</h2>
        <p className="text-muted text-sm mt-1">
          View and manage registered customers
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="nb-surface-sm p-4 h-[72px] bg-paper animate-pulse"
            />
          ))}
        </div>
      ) : (
        <CustomerStats customers={customers} />
      )}

      {error ? (
        <div className="nb-surface-sm p-10 flex flex-col items-center text-center gap-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" icon={RotateCcw} onClick={load}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <CustomerFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
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
                Showing {pageItems.length} of {filtered.length} customers
              </p>
              <CustomerTable customers={pageItems} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          ) : hasActiveFilters ? (
            <EmptyState
              icon={Users}
              title="No customers match your search."
              description="Try adjusting your search term or clearing the active filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No customers yet"
              description="Registered customers will show up here."
            />
          )}
        </>
      )}
    </div>
  );
}
