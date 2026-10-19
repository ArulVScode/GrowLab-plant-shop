import { api } from "./apiClient";
import { getAdminToken } from "./authStorage";

// pageSize=100 keeps every existing admin page (search/filter/sort/pagination
// done client-side with useMemo) working untouched. The backend already
// supports real server-side filtering via query params — wiring that in is
// a follow-up optimization, not required for this to work correctly now.
export function getProducts() {
  return api
    .get("/products", { query: { page: 1, pageSize: 100 } })
    .then((res) => res.data);
}

export function getProductById(id) {
  return api.get(`/products/${id}`).then((res) => res.data);
}

export function createProduct(data) {
  return api
    .post("/products", data, { token: getAdminToken() })
    .then((res) => res.data);
}

export function updateProduct(id, data) {
  return api
    .put(`/products/${id}`, data, { token: getAdminToken() })
    .then((res) => res.data);
}

export function deleteProduct(id) {
  return api
    .delete(`/products/${id}`, { token: getAdminToken() })
    .then((res) => res.data);
}

export function bulkUpdateStatus(ids, status) {
  return api
    .post("/products/bulk-status", { ids, status }, { token: getAdminToken() })
    .then((res) => res.data);
}

export function bulkDelete(ids) {
  return api
    .post("/products/bulk-delete", { ids }, { token: getAdminToken() })
    .then((res) => res.data);
}

// ---- Storefront (halaman publik) ----
const STOREFRONT_PAGE_SIZE = 50; // backend membatasi pageSize maksimal 50

// API tidak mengirim `badge` & `availability`, jadi diturunkan di sini
function toStorefrontProduct(p) {
  let badge;
  if (p.sold >= 1000) badge = "BEST SELLER";
  else if (p.discount >= 20) badge = "DISKON";
  return {
    ...p,
    badge,
    availability: p.stock > 0 ? "in_stock" : "out_of_stock",
  };
}

export async function getStorefrontProducts() {
  const fetchPage = (page) =>
    api.get("/products", {
      query: {
        page,
        pageSize: STOREFRONT_PAGE_SIZE,
        status: "active",
        sort: "oldest",
      },
    });

  const first = await fetchPage(1);
  const all = [...first.data];
  for (let page = 2; page <= first.meta.totalPages; page++) {
    const res = await fetchPage(page);
    all.push(...res.data);
  }
  return all.map(toStorefrontProduct);
}
