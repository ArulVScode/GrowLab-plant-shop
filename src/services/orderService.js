import { api } from "./apiClient";
import { getAdminToken } from "./authStorage";

export function getOrders() {
  return api
    .get("/orders", {
      query: { page: 1, pageSize: 100 },
      token: getAdminToken(),
    })
    .then((res) => res.data);
}

export function getOrderByNumber(orderNumber) {
  return api.get(`/orders/${orderNumber}`).then((res) => res.data);
}

export function updateOrderStatus(orderNumber, status) {
  return api
    .put(
      `/orders/${orderNumber}/status`,
      { status },
      { token: getAdminToken() },
    )
    .then((res) => res.data);
}

export function updateTrackingInfo(orderNumber, data) {
  return api
    .put(`/orders/${orderNumber}/tracking`, data, { token: getAdminToken() })
    .then((res) => res.data);
}

export function updatePaymentStatus(orderNumber, paymentStatus) {
  return api
    .put(
      `/orders/${orderNumber}/payment-status`,
      { paymentStatus },
      { token: getAdminToken() },
    )
    .then((res) => res.data);
}
