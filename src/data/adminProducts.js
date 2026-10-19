import { products as publicProducts } from "./products";

// Keeps the same identity (id, slug, name, category, price...) as the public
// catalog per the "public + admin must share a data model" requirement, and
// layers on the fields the admin dashboard needs to actually manage stock,
// pricing, and publishing status. When a real backend exists, this becomes
// the shape returned by GET /api/admin/products.

const BRANDS = ["GrowMax", "TaniPro", "HijauSubur", "AgroCare", "KebunKita"];
const UNITS_BY_CATEGORY = {
  Pupuk: "kg",
  "Nutrisi Tanaman": "ml",
  "Obat Tanaman": "ml",
  Benih: "pack",
  "Media Tanam": "kg",
  "Perawatan Tanaman": "pcs",
};

function deriveStatus(p, idx) {
  // A handful of products are force-marked inactive so the admin UI has
  // something real to filter/toggle, matching "vary: active/inactive" in the brief.
  if ([9, 15, 19].includes(idx)) return "inactive";
  return "active";
}

function deriveMinimumStock(category) {
  if (category === "Benih") return 30;
  if (category === "Obat Tanaman") return 15;
  return 20;
}

function isoDaysAgo(days) {
  const d = new Date("2026-09-23T09:00:00+07:00");
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const adminProducts = publicProducts.map((p, idx) => {
  const minimumStock = deriveMinimumStock(p.category);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: `${p.category.slice(0, 3).toUpperCase()}-${String(p.id).padStart(3, "0")}`,
    category: p.category,
    brand: BRANDS[idx % BRANDS.length],
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    stock: p.stock,
    minimumStock,
    unit: UNITS_BY_CATEGORY[p.category] || "pcs",
    rating: p.rating,
    sold: p.sold,
    status: deriveStatus(p, idx),
    image: p.image,
    images: p.images,
    shortDescription: p.description,
    description: p.description,
    benefits: p.benefits,
    usage: p.usage,
    composition: "Komposisi lengkap tertera pada label kemasan produk.",
    createdAt: isoDaysAgo(60 - idx),
    updatedAt: isoDaysAgo(idx % 10),
  };
});

export function computeStockStatus(product) {
  if (product.stock === 0) return "out_of_stock";
  if (product.stock <= product.minimumStock) return "low_stock";
  return "in_stock";
}
