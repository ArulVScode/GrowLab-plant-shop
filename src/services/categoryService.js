import { api } from "./apiClient";
import { getAdminToken } from "./authStorage";

export function getCategories() {
  return api.get("/categories").then((res) => res.data);
}

export function getCategoryById(id) {
  return api.get(`/categories/${id}`).then((res) => res.data);
}

export function createCategory(data) {
  return api
    .post("/categories", data, { token: getAdminToken() })
    .then((res) => res.data);
}

export function updateCategory(id, data) {
  return api
    .put(`/categories/${id}`, data, { token: getAdminToken() })
    .then((res) => res.data);
}

export function deleteCategory(id) {
  return api
    .delete(`/categories/${id}`, { token: getAdminToken() })
    .then((res) => res.data);
}
