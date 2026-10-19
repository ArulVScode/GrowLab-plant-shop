import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, PackageSearch, RotateCcw } from "lucide-react";
import {
  getProducts,
  deleteProduct,
  bulkUpdateStatus,
  bulkDelete,
} from "../../../services/productService";
import { computeStockStatus } from "../../../data/adminProducts";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToast } from "../../../components/common/Toast";
import ProductStats from "../../../components/admin/ProductStats";
import ProductFilters from "../../../components/admin/ProductFilters";
import ProductTable from "../../../components/admin/ProductTable";
import BulkActionBar from "../../../components/admin/BulkActionBar";
import DeleteProductModal from "../../../components/admin/DeleteProductModal";
import EmptyState from "../../../components/common/EmptyState";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/common/Button";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    stock: searchParams.get("stock") || "all",
  });
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => setError("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const withStock = useMemo(
    () => products.map((p) => ({ ...p, _stockStatus: computeStockStatus(p) })),
    [products],
  );

  useEffect(() => setPage(1), [debouncedSearch, filters, sort]);

  const filtered = useMemo(() => {
    let list = withStock.filter((p) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.category !== "all" && p.category !== filters.category)
        return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.stock !== "all" && p._stockStatus !== filters.stock)
        return false;
      return true;
    });

    switch (sort) {
      case "oldest":
        list = [...list].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        list = [...list].sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        list = [...list].sort((a, b) => b.stock - a.stock);
        break;
      default:
        list = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
    return list;
  }, [withStock, debouncedSearch, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSelectAll = (ids) =>
    setSelectedIds((prev) =>
      ids.every((id) => prev.includes(id))
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])],
    );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showToast("Product deleted successfully.");
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete product.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkActivate = async () => {
    await bulkUpdateStatus(selectedIds, "active");
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status: "active" } : p,
      ),
    );
    showToast(`${selectedIds.length} product(s) activated.`);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = async () => {
    await bulkUpdateStatus(selectedIds, "inactive");
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status: "inactive" } : p,
      ),
    );
    showToast(`${selectedIds.length} product(s) deactivated.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    showToast(`${selectedIds.length} product(s) deleted.`);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    debouncedSearch ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.stock !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl md:text-2xl">Products</h2>
          <p className="text-muted text-sm mt-1">Manage your product catalog</p>
        </div>
        <Link
          to="/admin/products/new"
          className="nb-btn-primary !px-4 !py-2.5 !text-sm"
        >
          <Plus size={16} /> Add Product
        </Link>
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
        <ProductStats products={withStock} />
      )}

      {error ? (
        <div className="nb-surface-sm p-10 flex flex-col items-center text-center gap-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" icon={RotateCcw} onClick={loadProducts}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFilterChange={setFilters}
            sort={sort}
            onSortChange={setSort}
          />

          <BulkActionBar
            count={selectedIds.length}
            onActivate={handleBulkActivate}
            onDeactivate={handleBulkDeactivate}
            onDelete={handleBulkDelete}
            onClear={() => setSelectedIds([])}
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
                Showing {pageItems.length} of {filtered.length} products
              </p>
              <ProductTable
                products={pageItems}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onDelete={setDeleteTarget}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          ) : hasActiveFilters ? (
            <EmptyState
              icon={PackageSearch}
              title="No products match your search."
              description="Try adjusting your search term or clearing the active filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setFilters({
                      category: "all",
                      status: "all",
                      stock: "all",
                    });
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description="Your product catalog is empty."
              action={
                <Link to="/admin/products/new" className="nb-btn-primary">
                  <Plus size={16} /> Add Product
                </Link>
              }
            />
          )}
        </>
      )}

      <DeleteProductModal
        product={deleteTarget}
        loading={actionLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
