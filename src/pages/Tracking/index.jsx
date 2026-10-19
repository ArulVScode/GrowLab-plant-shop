import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageSearch } from "lucide-react";
import { getOrderByNumber } from "../../services/customerOrderService";
import { Input } from "../../components/common/Input";
import Button from "../../components/common/Button";
import Breadcrumb from "../../components/common/Breadcrumb";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import TrackingTimeline from "../../components/order/TrackingTimeline";
import ShippingEstimate from "../../components/order/ShippingEstimate";
import EmptyState from "../../components/common/EmptyState";
import { formatDate } from "../../utils/format";

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("order") || "");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState(null);

  const runSearch = (orderNumber) => {
    getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setSearched(true));
  };

  // Auto-search if an order number arrived via ?order= (e.g. from Order Success).
  useState(() => {
    if (searchParams.get("order")) runSearch(searchParams.get("order"));
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(false);
    runSearch(input.trim());
  };

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Lacak Pesanan" }]}
      />
      <h1 className="text-2xl md:text-3xl mt-4 mb-2">Lacak Pesanan</h1>
      <p className="text-muted mb-7 max-w-lg">
        Masukkan nomor pesananmu untuk melihat status dan estimasi pengiriman.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mb-10"
      >
        <Input
          id="order-number"
          placeholder="Contoh: GL-20260910-001"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary" type="submit" icon={Search}>
          Lacak Pesanan
        </Button>
      </form>

      {searched && !order && (
        <EmptyState
          icon={PackageSearch}
          title="Pesanan tidak ditemukan"
          description="Periksa kembali nomor pesanan yang kamu masukkan. Contoh format: GL-20260910-001."
        />
      )}

      {order && (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <p className="text-sm text-muted">Nomor Pesanan</p>
              <p className="font-display font-bold text-lg">
                {order.orderNumber}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <section className="nb-surface p-5 mb-6">
            <h2 className="font-display font-bold text-lg mb-5">
              Status Pengiriman
            </h2>
            <TrackingTimeline timeline={order.timeline} />
          </section>

          {order.status !== "CANCELLED" && (
            <section className="mb-6">
              <h2 className="font-display font-bold text-lg mb-3">
                Jadwal Pengiriman
              </h2>
              <ShippingEstimate
                estimatedDeparture={order.estimatedDeparture}
                estimatedArrival={order.estimatedArrival}
              />
            </section>
          )}

          <section className="nb-surface-sm p-4 flex items-center justify-between flex-wrap gap-2 text-sm">
            <span className="text-muted">
              Kurir:{" "}
              <span className="font-semibold text-ink">{order.courier}</span>
            </span>
            <span className="text-muted">
              No. Resi:{" "}
              <span className="font-semibold text-ink">
                {order.trackingNumber}
              </span>
            </span>
            <span className="text-muted">
              Dipesan:{" "}
              <span className="font-semibold text-ink">
                {formatDate(order.createdAt)}
              </span>
            </span>
          </section>
        </div>
      )}
    </div>
  );
}
