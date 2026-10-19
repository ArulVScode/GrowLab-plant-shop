import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { api } from "../services/apiClient";
import { getAdminToken, setAdminToken } from "../services/authStorage";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/admin/auth/me", { token })
      .then((res) => setAdmin(res.data))
      .catch(() => setAdminToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await api.post("/admin/auth/login", { email, password });
    setAdminToken(res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  }, []);

  const logout = useCallback(() => {
    const token = getAdminToken();
    setAdminToken(null);
    setAdmin(null);
    if (token) api.post("/admin/auth/logout", {}, { token }).catch(() => {});
  }, []);

  // NOTE: profile/password editing in Settings isn't backed by a real
  // endpoint yet (we haven't built one) — these two stay local-only for now
  // so the Settings page doesn't break. Flagging this clearly rather than
  // silently faking persistence.
  const updateProfile = useCallback((data) => {
    return new Promise((resolve) => {
      setAdmin((prev) => ({ ...prev, ...data }));
      resolve(data);
    });
  }, []);

  const changePassword = useCallback(() => {
    return Promise.resolve(true);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      loading,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [admin, loading, login, logout, updateProfile, changePassword],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
