import { api } from "./apiClient";
import { getAdminToken } from "./authStorage";

export function getCustomers() {
  return api
    .get("/customers", { token: getAdminToken() })
    .then((res) => res.data);
}

export function getCustomerById(id) {
  return api
    .get(`/customers/${id}`, { token: getAdminToken() })
    .then((res) => res.data)
    .catch((err) => {
      if (err.status === 404) return null;
      throw err;
    });
}

export function updateCustomerStatus(id, status) {
  return api
    .put(`/customers/${id}/status`, { status }, { token: getAdminToken() })
    .then((res) => res.data);
}
