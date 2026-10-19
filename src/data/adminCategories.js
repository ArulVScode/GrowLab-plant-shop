import { categories as publicCategories } from "./categories";
import { adminProducts } from "./adminProducts";

export const adminCategories = publicCategories.map((c, idx) => ({
  id: c.id,
  name: c.name,
  slug: c.id,
  description: c.description,
  status: "active",
  productCount: adminProducts.filter((p) => p.category === c.name).length,
  createdAt: "2026-01-15T08:00:00+07:00",
  updatedAt: "2026-08-0" + ((idx % 9) + 1) + "T10:00:00+07:00",
}));
