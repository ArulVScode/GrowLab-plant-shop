import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductForm from "../../../components/admin/ProductForm";
import { createProduct } from "../../../services/productService";
import { useToast } from "../../../components/common/Toast";

export default function AdminProductCreate() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (payload) => {
    await createProduct(payload);
    showToast("Product created successfully.");
    navigate("/admin/products");
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
        <h2 className="text-xl md:text-2xl">Add New Product</h2>
        <p className="text-muted text-sm mt-1">
          Fill in the details below to add a product to your catalog.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Create Product"
        mode="create"
      />
    </div>
  );
}
