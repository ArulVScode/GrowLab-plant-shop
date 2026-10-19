import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, XCircle } from "lucide-react";
import { getProducts } from "../../services/productService";
import { computeStockStatus } from "../../data/adminProducts";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      getProducts().then((data) => {
        const withStock = data.map((p) => ({
          ...p,
          _stockStatus: computeStockStatus(p),
        }));
        const flagged = withStock
          .filter((p) => p._stockStatus !== "in_stock")
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 6);
        setAlerts(flagged);
        setLoaded(true);
      });
    }
  }, [open, loaded]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const hasAlerts = loaded && alerts.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifikasi stok"
        aria-expanded={open}
        className="w-9 h-9 flex items-center justify-center border-2 border-ink hover:bg-cream relative"
      >
        <Bell size={16} />
        {(!loaded || hasAlerts) && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-clay border-2 border-paper" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 nb-surface bg-paper z-50">
          <div className="border-b-2 border-ink px-4 py-3">
            <h3 className="font-display font-bold text-sm">Notifikasi Stok</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {!loaded ? (
              <div className="p-4 flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-cream animate-pulse" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-muted text-center py-8 px-4">
                Tidak ada notifikasi baru. Semua stok aman.
              </p>
            ) : (
              alerts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    navigate(`/admin/products/${p.id}`);
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 p-3 hover:bg-cream text-left border-b border-ink/10 last:border-b-0"
                >
                  {p._stockStatus === "out_of_stock" ? (
                    <XCircle
                      size={16}
                      className="text-red-600 shrink-0 mt-0.5"
                    />
                  ) : (
                    <AlertTriangle
                      size={16}
                      className="text-clay shrink-0 mt-0.5"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {p.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {p._stockStatus === "out_of_stock"
                        ? "Stok habis"
                        : `Stok tersisa ${p.stock} ${p.unit}`}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
          {hasAlerts && (
            <button
              onClick={() => {
                navigate("/admin/products?stock=low_stock");
                setOpen(false);
              }}
              className="w-full text-center text-xs font-display font-bold py-2.5 border-t-2 border-ink hover:bg-cream"
            >
              Lihat semua produk bermasalah
            </button>
          )}
        </div>
      )}
    </div>
  );
}
