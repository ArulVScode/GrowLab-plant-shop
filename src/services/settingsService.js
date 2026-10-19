import { api } from "./apiClient";
import { getAdminToken } from "./authStorage";

export function getPaymentSettings() {
  return api.get("/settings/payment").then((res) => res.data);
}

export function updatePaymentSettings(data) {
  return api
    .put("/admin/settings/payment", data, { token: getAdminToken() })
    .then((res) => res.data);
}
