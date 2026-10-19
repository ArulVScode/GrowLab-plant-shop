import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Sprout, AlertCircle } from "lucide-react";
import { Input } from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export default function AdminLogin() {
  const { isAuthenticated, loading: authLoading, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-9 h-9 bg-leaf text-ink flex items-center justify-center border-2 border-cream/30">
            <Sprout size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-xl text-cream">
            GROWLAB ADMIN
          </span>
        </div>

        <div className="nb-surface bg-paper p-6 md:p-8">
          <h1 className="text-2xl mb-1">Masuk ke Admin</h1>
          <p className="text-sm text-muted mb-6">
            Kelola produk dan kategori toko GrowLab.
          </p>

          {error && (
            <div className="flex items-start gap-2 border-2 border-ink bg-clay-soft px-3.5 py-2.5 mb-5 text-sm font-medium">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="admin-email"
              type="email"
              label="Email"
              placeholder="admin@growlab.test"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <Input
              id="admin-password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
            <Button
              variant="primary"
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>

          <p className="text-xs text-muted text-center mt-6">
            Demo:{" "}
            <span className="font-semibold text-ink">admin@growlab.test</span> /{" "}
            <span className="font-semibold text-ink">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
