import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import { ORDER_STATUS } from "../../data/orders";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { getMyOrders } from "../../services/customerOrderService";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import Breadcrumb from "../../components/common/Breadcrumb";
import EmptyState from "../../components/common/EmptyState";
import { formatRupiah, formatDate } from "../../utils/format";

const TABS = [
  { id: "all", label: "Semua" },
  { id: ORDER_STATUS.PENDING_PAYMENT, label: "Menunggu Pembayaran" },
  { id: ORDER_STATUS.PROCESSING, label: "Diproses" },
  { id: ORDER_STATUS.SHIPPED, label: "Dikirim" },
  { id: ORDER_STATUS.DELIVERED, label: "Selesai" },
  { id: ORDER_STATUS.CANCELLED, label: "Dibatalkan" },
];

export default function Orders() {
  const { isAuthenticated, loading: authLoading } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (authLoading || loading) return null;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: "/orders" }} />;

  const filtered = orders.filter((o) => {
    if (tab === "all") return true;
    if (tab === ORDER_STATUS.SHIPPED) {
      return [
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.IN_TRANSIT,
        ORDER_STATUS.READY_TO_SHIP,
      ].includes(o.status);
    }
    return o.status === tab;
  });

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Pesanan Saya" }]}
      />
      <h1 className="text-2xl md:text-3xl mt-4 mb-6">Pesanan Saya</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-7 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-2 border-ink px-4 py-2 text-sm font-display font-bold whitespace-nowrap ${
              tab === t.id ? "bg-ink text-cream" : "bg-paper hover:bg-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="Belum ada pesanan"
          description="Pesanan dengan status ini belum tersedia."
          action={
            <Link to="/products" className="nb-btn-primary">
              Mulai Belanja
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <div key={order.orderNumber} className="nb-surface p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div>
                  <p className="font-display font-bold">{order.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex gap-3 mb-4 overflow-x-auto">
                {order.items.map((item) => (
                  <img
                    key={item.productId}
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 border-2 border-ink object-cover shrink-0"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-sm mb-4 flex-wrap gap-2">
                <span className="text-muted">{order.items.length} produk</span>
                <span className="font-display font-bold text-base">
                  Total: {formatRupiah(order.total)}
                </span>
              </div>

              {order.status === ORDER_STATUS.PROCESSING && (
                <p className="text-xs text-muted mb-4">
                  Estimasi keberangkatan:{" "}
                  <span className="font-semibold text-ink">
                    {formatDate(order.estimatedDeparture)}
                  </span>
                </p>
              )}

              <div className="flex gap-3">
                <Link
                  to={`/orders/${order.orderNumber}`}
                  className="nb-btn-outline !px-4 !py-2 !text-sm flex-1"
                >
                  Detail Pesanan
                </Link>
                <Link
                  to={`/track-order?order=${order.orderNumber}`}
                  className="nb-btn-dark !px-4 !py-2 !text-sm flex-1"
                >
                  Lacak
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
