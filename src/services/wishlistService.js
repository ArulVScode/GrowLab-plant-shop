import { api } from "./apiClient";
import { getCustomerToken } from "./authStorage";

export function getWishlist() {
  return api
    .get("/me/wishlist", { token: getCustomerToken() })
    .then((res) => res.data);
}

export function addToWishlist(productId) {
  return api
    .post("/me/wishlist", { productId }, { token: getCustomerToken() })
    .then((res) => res.data);
}

export function removeFromWishlist(productId) {
  return api
    .delete(`/me/wishlist/${productId}`, { token: getCustomerToken() })
    .then((res) => res.data);
}
