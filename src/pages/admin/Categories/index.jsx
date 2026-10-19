import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Tags, RotateCcw } from "lucide-react";
import {
  getCategories,
  deleteCategory,
} from "../../../services/categoryService";
import { useToast } from "../../../components/common/Toast";
import CategoryTable from "../../../components/admin/CategoryTable";
import DeleteCategoryModal from "../../../components/admin/DeleteCategoryModal";
import EmptyState from "../../../components/common/EmptyState";
import Button from "../../../components/common/Button";

export default function AdminCategories() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setError("Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Category deleted successfully.");
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl md:text-2xl">Categories</h2>
          <p className="text-muted text-sm mt-1">
            Organize your product catalog into categories
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="nb-btn-primary !px-4 !py-2.5 !text-sm"
        >
          <Plus size={16} /> Add Category
        </Link>
      </div>

      {error ? (
        <div className="nb-surface-sm p-10 flex flex-col items-center text-center gap-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" icon={RotateCcw} onClick={loadCategories}>
            Try Again
          </Button>
        </div>
      ) : loading ? (
        <div className="nb-surface-sm p-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-cream animate-pulse" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <CategoryTable categories={categories} onDelete={setDeleteTarget} />
      ) : (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Create your first category to start organizing products."
          action={
            <Link to="/admin/categories/new" className="nb-btn-primary">
              <Plus size={16} /> Add Category
            </Link>
          }
        />
      )}

      <DeleteCategoryModal
        category={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
