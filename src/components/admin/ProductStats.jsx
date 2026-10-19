import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import StatCard from "./StatCard";

export default function ProductStats({ products }) {
  const total = products.length;
  const active = products.filter((p) => p.status === "active").length;
  const lowStock = products.filter(
    (p) => p._stockStatus === "low_stock",
  ).length;
  const outOfStock = products.filter(
    (p) => p._stockStatus === "out_of_stock",
  ).length;

  return (
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
        value={lowStock}
        icon={AlertTriangle}
        tone="orange"
      />
      <StatCard
        label="Out of Stock"
        value={outOfStock}
        icon={XCircle}
        tone="default"
      />
    </div>
  );
}
