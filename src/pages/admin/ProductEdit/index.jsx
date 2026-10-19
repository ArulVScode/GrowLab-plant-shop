import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, PackageX } from "lucide-react";
import ProductForm from "../../../components/admin/ProductForm";
import {
  getProductById,
  updateProduct,
} from "../../../services/productService";
import { useToast } from "../../../components/common/Toast";
import EmptyState from "../../../components/common/EmptyState";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getProductById(id).then((data) => {
      if (!active) return;
      if (!data) {
        setNotFound(true);
      } else {
        setProduct(data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateProduct(id, payload);
    showToast("Product updated successfully.");
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="nb-surface-sm h-40 bg-paper animate-pulse" />
        ))}
      </div>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        icon={PackageX}
        title="Product not found"
        description="The product you're trying to edit doesn't exist or may have been deleted."
        action={
          <Link to="/admin/products" className="nb-btn-primary">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        }
      />
    );
  }

  // Main image is stored as the first item of `images`; the rest are the
  // "additional" gallery shown separately in the form.
  const initialValues = {
    ...product,
    image: product.image,
    images: (product.images || []).filter((img) => img !== product.image),
    benefits: product.benefits?.length ? product.benefits : [""],
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-2"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h2 className="text-xl md:text-2xl">Edit Product</h2>
        <p className="text-muted text-sm mt-1">{product.name}</p>
      </div>

      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        mode="edit"
      />
    </div>
  );
}
