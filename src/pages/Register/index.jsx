import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, AlertCircle } from "lucide-react";
import { Input } from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function Register() {
  const { register } = useCustomerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    if (!agreed) {
      setError("Kamu harus menyetujui syarat dan ketentuan.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Pendaftaran gagal.");
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
          <h1 className="text-2xl md:text-3xl mb-1">Buat Akun Baru.</h1>
          <p className="text-sm text-muted mb-7">
            Daftar untuk mulai belanja kebutuhan tanamanmu.
          </p>

          {error && (
            <div className="flex items-start gap-2 border-2 border-ink bg-clay-soft px-3.5 py-2.5 mb-5 text-sm font-medium">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              id="fullname"
              label="Nama Lengkap"
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
            />
            <Input
              id="phone"
              type="tel"
              label="Nomor HP"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required
            />
            <Input
              id="confirm"
              type="password"
              label="Konfirmasi Password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setField("confirm", e.target.value)}
              required
            />

            <label className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed((a) => !a)}
                className="w-4 h-4 mt-0.5 accent-leaf-deep shrink-0"
              />
              <span className="text-muted">
                Saya menyetujui{" "}
                <Link to="/" className="text-ink font-semibold hover:underline">
                  syarat dan ketentuan
                </Link>
                .
              </span>
            </label>

            <Button
              variant="primary"
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-bold text-ink hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
