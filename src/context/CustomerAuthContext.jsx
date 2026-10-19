import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { api, ApiError } from "../services/apiClient";
import { getCustomerToken, setCustomerToken } from "../services/authStorage";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCustomerToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me", { token })
      .then((res) => setCustomer(res.data))
      .catch(() => setCustomerToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    setCustomerToken(res.data.token);
    setCustomer(res.data.customer);
    return res.data.customer;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post("/auth/register", data);
    setCustomerToken(res.data.token);
    setCustomer(res.data.customer);
    return res.data.customer;
  }, []);

  const logout = useCallback(() => {
    const token = getCustomerToken();
    setCustomerToken(null);
    setCustomer(null);
    if (token) api.post("/auth/logout", {}, { token }).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      loading,
      login,
      register,
      logout,
    }),
    [customer, loading, login, register, logout],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx)
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}

export { ApiError };
