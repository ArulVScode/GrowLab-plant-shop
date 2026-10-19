import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useToast } from "../../../components/common/Toast";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../../services/categoryService";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [values, setValues] = useState({
    name: "",
    slug: "",
    description: "",
    status: "active",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    getCategoryById(id).then((data) => {
      if (!active) return;
      if (data) {
        setValues({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          status: data.status,
        });
        setSlugTouched(true);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const setField = (field, value) => {
    setValues((v) => {
      const next = { ...v, [field]: value };
      if (field === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!values.name.trim())
      validationErrors.name = "Category name is required.";
    if (!values.slug.trim()) validationErrors.slug = "Slug is required.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateCategory(id, values);
        showToast("Category updated successfully.");
      } else {
        await createCategory(values);
        showToast("Category created successfully.");
      }
      navigate("/admin/categories");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="nb-surface-sm h-64 bg-paper animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-2"
        >
          <ArrowLeft size={14} /> Back to Categories
        </Link>
        <h2 className="text-xl md:text-2xl">
          {isEdit ? "Edit Category" : "Add New Category"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="nb-surface p-5 flex flex-col gap-4"
      >
        {submitError && (
          <div className="nb-surface-sm bg-clay-soft p-3 text-sm font-semibold">
            {submitError}
          </div>
        )}

        <Input
          id="cat-name"
          label="Category Name *"
          placeholder="Pupuk"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />
        <Input
          id="cat-slug"
          label="Slug *"
          placeholder="pupuk"
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setField("slug", e.target.value);
          }}
          error={errors.slug}
        />
        <div>
          <label
            htmlFor="cat-description"
            className="block text-sm font-bold font-display mb-1.5"
          >
            Description
          </label>
          <textarea
            id="cat-description"
            rows={3}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Produk pupuk untuk berbagai kebutuhan tanaman."
            className="nb-input"
          />
        </div>

        <div>
          <label className="block text-sm font-bold font-display mb-1.5">
            Status
          </label>
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
                  name="cat-status"
                  checked={values.status === s}
                  onChange={() => setField("status", s)}
                  className="w-4 h-4 accent-leaf-deep"
                />
                <span className="text-sm font-semibold">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/admin/categories")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
