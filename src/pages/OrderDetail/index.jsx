import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderByNumber } from "../../services/customerOrderService";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import TrackingTimeline from "../../components/order/TrackingTimeline";
import ShippingEstimate from "../../components/order/ShippingEstimate";
import Breadcrumb from "../../components/common/Breadcrumb";
import EmptyState from "../../components/common/EmptyState";
import { formatRupiah, formatDate } from "../../utils/format";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByNumber(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return null;

  if (!order) {
    return (
      <div className="container-max section-pad py-16">
        <EmptyState
          title="Pesanan tidak ditemukan"
          description="Periksa kembali nomor pesanan yang kamu masukkan."
          action={
            <Link to="/orders" className="nb-btn-primary">
              Kembali ke Pesanan Saya
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Pesanan Saya", href: "/orders" },
          { label: order.orderNumber },
        ]}
      />

      <div className="flex items-start justify-between gap-3 flex-wrap mt-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">{order.orderNumber}</h1>
          <p className="text-sm text-muted">
            Dipesan pada {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="flex flex-col gap-6">
          <section className="nb-surface p-5">
            <h2 className="font-display font-bold text-lg mb-5">
              Lacak Pesanan
            </h2>
            <TrackingTimeline timeline={order.timeline} />
          </section>

          {order.status !== "CANCELLED" && (
            <section>
              <h2 className="font-display font-bold text-lg mb-3">
                Jadwal Pengiriman
              </h2>
              <ShippingEstimate
                estimatedDeparture={order.estimatedDeparture}
                estimatedArrival={order.estimatedArrival}
              />
            </section>
          )}

          <section className="nb-surface p-5">
            <h2 className="font-display font-bold text-lg mb-4">
              Produk Dipesan
            </h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 border-2 border-ink object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted">
                      {item.qty} x {formatRupiah(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0">
                    {formatRupiah(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="nb-surface p-5">
            <h2 className="font-display font-bold text-lg mb-4">
              Alamat Pengiriman
            </h2>
            <p className="text-sm font-semibold">
              {order.shippingAddress.name}
            </p>
            <p className="text-sm text-muted">{order.shippingAddress.phone}</p>
            <p className="text-sm text-muted mt-1">
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <div className="border-t-2 border-ink/10 mt-4 pt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted text-xs">Kurir</p>
                <p className="font-semibold">{order.courier}</p>
              </div>
              <div>
                <p className="text-muted text-xs">No. Resi</p>
                <p className="font-semibold">{order.trackingNumber}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="nb-surface p-5 flex flex-col gap-3 sticky top-24">
          <h2 className="font-display font-bold text-lg">
            Ringkasan Pembayaran
          </h2>
          <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
          {order.discount > 0 && (
            <Row
              label="Diskon"
              value={`- ${formatRupiah(order.discount)}`}
              accent
            />
          )}
          <Row label="Ongkos Kirim" value={formatRupiah(order.shippingCost)} />
          <div className="border-t-2 border-dashed border-ink/30 pt-3 flex items-center justify-between">
            <span className="font-display font-bold">Total Pembayaran</span>
            <span className="font-display font-extrabold text-xl">
              {formatRupiah(order.total)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between text-sm text-muted">
      <span>{label}</span>
      <span
        className={`font-semibold ${accent ? "text-leaf-deep" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
