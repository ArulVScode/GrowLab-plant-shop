import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Boxes,
  Tags,
} from "lucide-react";
import { getProducts } from "../../../services/productService";
import { computeStockStatus } from "../../../data/adminProducts";
import StatCard from "../../../components/admin/StatCard";
import Badge from "../../../components/common/Badge";
import { formatRupiah } from "../../../utils/format";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const withStock = products.map((p) => ({
    ...p,
    _stock: computeStockStatus(p),
  }));
  const total = withStock.length;
  const active = withStock.filter((p) => p.status === "active").length;
  const lowStock = withStock.filter((p) => p._stock === "low_stock");
  const outOfStock = withStock.filter((p) => p._stock === "out_of_stock");

  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="nb-surface-sm p-4 h-[72px] bg-paper animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl md:text-2xl">
          Selamat datang, Administrator 👋
        </h2>
        <p className="text-muted text-sm mt-1">
          Ringkasan katalog produk GrowLab hari ini.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Products" value={total} icon={Package} />
        <StatCard
          label="Active Products"
          value={active}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="Low Stock"
          value={lowStock.length}
          icon={AlertTriangle}
          tone="orange"
        />
        <StatCard
          label="Out of Stock"
          value={outOfStock.length}
          icon={XCircle}
          tone="default"
        />
      </div>

      <div>
        <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products/new"
            className="nb-btn-primary !px-4 !py-2.5 !text-sm"
          >
            <Plus size={16} /> Add Product
          </Link>
          <Link
            to="/admin/products"
            className="nb-btn-outline !px-4 !py-2.5 !text-sm"
          >
            <Boxes size={16} /> Manage Products
          </Link>
          <Link
            to="/admin/categories"
            className="nb-btn-outline !px-4 !py-2.5 !text-sm"
          >
            <Tags size={16} /> Manage Categories
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="nb-surface p-5">
          <h3 className="font-display font-bold text-base mb-4">
            Recent Products
          </h3>
          <div className="flex flex-col divide-y-2 divide-ink/10">
            {recent.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <img
                  src={p.image}
                  alt=""
                  className="w-11 h-11 border-2 border-ink object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.category}</p>
                </div>
                <p className="text-sm font-bold shrink-0">
                  {formatRupiah(p.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="nb-surface p-5">
          <h3 className="font-display font-bold text-base mb-4">
            Low Stock Products
          </h3>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted py-6 text-center">
              Tidak ada produk dengan stok menipis.
            </p>
          ) : (
            <div className="flex flex-col divide-y-2 divide-ink/10">
              {lowStock.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-11 h-11 border-2 border-ink object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.stock} {p.unit} tersisa
                    </p>
                  </div>
                  <Badge tone="orange">LOW STOCK</Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
