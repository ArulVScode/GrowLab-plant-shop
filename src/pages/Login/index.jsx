import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sprout, AlertCircle } from "lucide-react";
import { Input } from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function Login() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max section-pad py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-9 h-9 bg-ink text-leaf flex items-center justify-center border-2 border-ink">
            <Sprout size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-xl">GROWLAB</span>
        </div>

        <div className="nb-surface p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl mb-1">Selamat Datang Kembali.</h1>
          <p className="text-sm text-muted mb-7">
            Masuk untuk melanjutkan belanja kebutuhan tanamanmu.
          </p>

          {error && (
            <div className="flex items-start gap-2 border-2 border-ink bg-clay-soft px-3.5 py-2.5 mb-5 text-sm font-medium">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <Input
              id="password"
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

          <p className="text-center text-sm text-muted mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="font-bold text-ink hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
