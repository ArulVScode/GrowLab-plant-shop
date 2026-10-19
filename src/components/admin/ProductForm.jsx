import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "../common/Input";
import Button from "../common/Button";
import { MainImageUpload, GalleryImageUpload } from "./ImageUpload";
import RepeatableInput from "./RepeatableInput";
import { categories } from "../../data/categories";

const UNITS = ["pcs", "kg", "liter", "ml", "pack", "bottle", "sack"];

const DEFAULT_VALUES = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  price: "",
  originalPrice: "",
  discount: "",
  stock: "",
  minimumStock: "",
  unit: "pcs",
  image: "",
  images: [],
  shortDescription: "",
  description: "",
  benefits: [""],
  usage: "",
  composition: "",
  status: "active",
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Product name is required.";
  if (!values.sku.trim()) errors.sku = "SKU is required.";
  if (!values.category) errors.category = "Category is required.";
  if (values.price === "" || Number(values.price) < 0)
    errors.price = "Price must be greater than or equal to 0.";
  if (values.stock === "" || Number(values.stock) < 0)
    errors.stock = "Stock must be greater than or equal to 0.";
  if (values.minimumStock === "" || Number(values.minimumStock) < 0)
    errors.minimumStock = "Minimum stock must be greater than or equal to 0.";
  if (!values.description.trim())
    errors.description = "Description is required.";
  return errors;
}

export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Product",
  mode = "create",
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...DEFAULT_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document
        .getElementById(Object.keys(validationErrors)[0])
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        originalPrice:
          values.originalPrice === ""
            ? Number(values.price)
            : Number(values.originalPrice),
        discount: values.discount === "" ? 0 : Number(values.discount),
        stock: Number(values.stock),
        minimumStock: Number(values.minimumStock),
        benefits: values.benefits.filter((b) => b.trim() !== ""),
        images: [values.image, ...values.images].filter(Boolean),
      };
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-10">
      {submitError && (
        <div className="nb-surface-sm bg-clay-soft p-4 text-sm font-semibold">
          {submitError}
        </div>
      )}

      <FormSection title="Basic Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="name"
            label="Product Name *"
            placeholder="Pupuk NPK GrowMax"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
            className="sm:col-span-2"
          />
          <Input
            id="sku"
            label="SKU *"
            placeholder="PUP-021"
            value={values.sku}
            onChange={(e) => setField("sku", e.target.value)}
            error={errors.sku}
          />
          <Select
            id="category"
            label="Category *"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-clay text-xs font-semibold -mt-2 sm:col-start-2">
              {errors.category}
            </p>
          )}
          <Input
            id="brand"
            label="Brand"
            placeholder="GrowMax"
            value={values.brand}
            onChange={(e) => setField("brand", e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            id="price"
            type="number"
            min="0"
            label="Price (Rp) *"
            placeholder="85000"
            value={values.price}
            onChange={(e) => setField("price", e.target.value)}
            error={errors.price}
          />
          <Input
            id="originalPrice"
            type="number"
            min="0"
            label="Original Price (Rp)"
            placeholder="100000"
            value={values.originalPrice}
            onChange={(e) => setField("originalPrice", e.target.value)}
          />
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            label="Discount (%)"
            placeholder="15"
            value={values.discount}
            onChange={(e) => setField("discount", e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Inventory">
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            id="stock"
            type="number"
            min="0"
            label="Stock *"
            placeholder="87"
            value={values.stock}
            onChange={(e) => setField("stock", e.target.value)}
            error={errors.stock}
          />
          <Input
            id="minimumStock"
            type="number"
            min="0"
            label="Minimum Stock *"
            placeholder="10"
            value={values.minimumStock}
            onChange={(e) => setField("minimumStock", e.target.value)}
            error={errors.minimumStock}
          />
          <Select
            id="unit"
            label="Unit"
            value={values.unit}
            onChange={(e) => setField("unit", e.target.value)}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>
      </FormSection>

      <FormSection title="Product Images">
        <div className="flex flex-col gap-5">
          <MainImageUpload
            value={values.image}
            onChange={(url) => setField("image", url)}
          />
          <GalleryImageUpload
            images={values.images}
            onChange={(imgs) => setField("images", imgs)}
          />
        </div>
      </FormSection>

      <FormSection title="Description">
        <div className="flex flex-col gap-4">
          <Input
            id="shortDescription"
            label="Short Description"
            placeholder="Ringkasan singkat produk"
            value={values.shortDescription}
            onChange={(e) => setField("shortDescription", e.target.value)}
          />
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold font-display mb-1.5"
            >
              Full Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Deskripsi lengkap produk..."
              className="nb-input"
            />
            {errors.description && (
              <p className="text-clay text-xs font-semibold mt-1.5">
                {errors.description}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection title="Product Information">
        <div className="flex flex-col gap-5">
          <RepeatableInput
            label="Benefits"
            values={values.benefits}
            onChange={(v) => setField("benefits", v)}
            placeholder="Contoh: Menyuburkan tanah secara alami"
          />
          <div>
            <label
              htmlFor="usage"
              className="block text-sm font-bold font-display mb-1.5"
            >
              Usage Instructions
            </label>
            <textarea
              id="usage"
              rows={3}
              value={values.usage}
              onChange={(e) => setField("usage", e.target.value)}
              placeholder="Ikuti petunjuk penggunaan pada label produk."
              className="nb-input"
            />
          </div>
          <div>
            <label
              htmlFor="composition"
              className="block text-sm font-bold font-display mb-1.5"
            >
              Composition / Content
            </label>
            <textarea
              id="composition"
              rows={2}
              value={values.composition}
              onChange={(e) => setField("composition", e.target.value)}
              placeholder="Komposisi atau kandungan produk"
              className="nb-input"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Status">
        <div className="flex gap-3">
          {["active", "inactive"].map((s) => (
            <label
              key={s}
              className={`flex-1 flex items-center gap-2.5 border-2 px-4 py-3 cursor-pointer capitalize ${
                values.status === s
                  ? "border-ink bg-cream shadow-hard-sm"
                  : "border-ink/20"
              }`}
            >
              <input
                type="radio"
                name="status"
                checked={values.status === s}
                onChange={() => setField("status", s)}
                className="w-4 h-4 accent-leaf-deep"
              />
              <span className="text-sm font-semibold">{s}</span>
            </label>
          ))}
        </div>
      </FormSection>

      <div className="sticky bottom-0 bg-cream/95 backdrop-blur border-t-3 border-ink -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-4 flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={() => navigate("/admin/products")}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1 sm:flex-none"
          disabled={submitting}
        >
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="nb-surface p-5">
      <h2 className="font-display font-bold text-base mb-4">{title}</h2>
      {children}
    </section>
  );
}
