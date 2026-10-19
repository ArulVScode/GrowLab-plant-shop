// Keeps token storage in one place so service files don't need React context
// just to attach an Authorization header.
const ADMIN_KEY = "growlab_admin_token";
const CUSTOMER_KEY = "growlab_customer_token";

export const getAdminToken = () => sessionStorage.getItem(ADMIN_KEY);
export const setAdminToken = (token) =>
  token
    ? sessionStorage.setItem(ADMIN_KEY, token)
    : sessionStorage.removeItem(ADMIN_KEY);

export const getCustomerToken = () => localStorage.getItem(CUSTOMER_KEY);
export const setCustomerToken = (token) =>
  token
    ? localStorage.setItem(CUSTOMER_KEY, token)
    : localStorage.removeItem(CUSTOMER_KEY);
