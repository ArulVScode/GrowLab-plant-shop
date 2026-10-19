import { api } from "./apiClient";
import { getCustomerToken } from "./authStorage";

// Checkout. Backend re-prices every line from the current product data and
// recomputes subtotal/total itself — this payload's subtotal/total (if any)
// are display-only and never trusted server-side.
export function createOrder(payload) {
  return api
    .post("/orders", payload, { token: getCustomerToken() })
    .then((res) => res.data);
}

export function getMyOrders() {
  return api
    .get("/me/orders", { token: getCustomerToken() })
    .then((res) => res.data);
}

// Public — tracking by order number needs no login, same as a courier site.
export function getOrderByNumber(orderNumber) {
  return api.get(`/orders/${orderNumber}`).then((res) => res.data);
}
