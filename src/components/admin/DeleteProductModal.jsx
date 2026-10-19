import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../common/Button";

export default function DeleteProductModal({
  product,
  loading,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onCancel]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-ink/50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm nb-surface bg-paper p-6">
        <button
          onClick={onCancel}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-muted hover:text-ink"
        >
          <X size={18} />
        </button>

        <span className="w-12 h-12 flex items-center justify-center border-3 border-ink bg-clay-soft mb-4">
          <AlertTriangle size={22} />
        </span>

        <h2 id="delete-modal-title" className="text-xl mb-2">
          Delete Product?
        </h2>
        <p className="text-sm text-ink/80 mb-1">
          Are you sure you want to delete{" "}
          <span className="font-bold">{product.name}</span>?
        </p>
        {product.stock > 0 && (
          <p className="text-sm text-clay font-semibold mb-1">
            This product currently has {product.stock} {product.unit} of stock
            available.
          </p>
        )}
        <p className="text-xs text-muted mb-6">This action cannot be undone.</p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
            autoFocus
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="nb-btn flex-1 bg-red-600 text-cream hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
