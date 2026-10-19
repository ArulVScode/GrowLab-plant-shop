import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, PackageX } from "lucide-react";
import {
  getProductById,
  deleteProduct,
} from "../../../services/productService";
import { computeStockStatus } from "../../../data/adminProducts";
import {
  ProductStatusBadge,
  StockStatusBadge,
} from "../../../components/admin/StatusBadge";
import DeleteProductModal from "../../../components/admin/DeleteProductModal";
import EmptyState from "../../../components/common/EmptyState";
import { useToast } from "../../../components/common/Toast";
import { formatRupiah, formatDate } from "../../../utils/format";

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getProductById(id).then((data) => {
      if (!active) return;
      if (!data) setNotFound(true);
      else setProduct(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      showToast("Product deleted successfully.");
      navigate("/admin/products");
    } catch {
      showToast("Failed to delete product.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <div className="nb-surface-sm h-96 bg-paper animate-pulse" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="nb-surface-sm h-16 bg-paper animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="This product doesn't exist or may have been deleted."
        action={
          <Link to="/admin/products" className="nb-btn-primary">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        }
      />
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const stockStatus = computeStockStatus(product);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-2"
          >
            <ArrowLeft size={14} /> Back to Products
          </Link>
          <h2 className="text-xl md:text-2xl">{product.name}</h2>
          <p className="text-muted text-sm mt-1">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="nb-btn-outline !px-4 !py-2 !text-sm"
          >
            <Pencil size={15} /> Edit Product
          </Link>
          <button
            onClick={() => setDeleteTarget(product)}
            className="nb-btn !px-4 !py-2 !text-sm bg-red-600 text-cream"
          >
            <Trash2 size={15} /> Delete Product
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <div className="flex flex-col gap-3">
          <div className="nb-surface aspect-square overflow-hidden">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 border-2 overflow-hidden shrink-0 ${activeImage === idx ? "border-ink shadow-hard-sm" : "border-ink/20"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <section className="nb-surface p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
              Overview
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <InfoRow label="Category" value={product.category} />
              <InfoRow label="Brand" value={product.brand || "—"} />
              <InfoRow label="Price" value={formatRupiah(product.price)} />
              <InfoRow
                label="Original Price"
                value={
                  product.originalPrice > product.price
                    ? formatRupiah(product.originalPrice)
                    : "—"
                }
              />
              <InfoRow
                label="Discount"
                value={product.discount ? `${product.discount}%` : "—"}
              />
              <InfoRow
                label="Stock"
                value={`${product.stock} ${product.unit}`}
              />
              <InfoRow
                label="Minimum Stock"
                value={`${product.minimumStock} ${product.unit}`}
              />
              <InfoRow label="Created" value={formatDate(product.createdAt)} />
              <InfoRow label="Updated" value={formatDate(product.updatedAt)} />
            </div>
            <div className="flex gap-2 mt-4">
              <ProductStatusBadge status={product.status} />
              <StockStatusBadge stockStatus={stockStatus} />
            </div>
          </section>

          <section className="nb-surface p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
              Description
            </h3>
            <p className="text-sm text-ink/80 leading-relaxed">
              {product.description}
            </p>
          </section>

          {product.benefits?.length > 0 && (
            <section className="nb-surface p-5">
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
                Benefits
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-ink/80">
                {product.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {product.usage && (
            <section className="nb-surface p-5">
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
                Usage Instructions
              </h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                {product.usage}
              </p>
            </section>
          )}

          {product.composition && (
            <section className="nb-surface p-5">
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
                Composition / Content
              </h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                {product.composition}
              </p>
            </section>
          )}
        </div>
      </div>

      <DeleteProductModal
        product={deleteTarget}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
