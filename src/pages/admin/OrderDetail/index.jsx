import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import {
  getOrderByNumber,
  updateOrderStatus,
  updateTrackingInfo,
  updatePaymentStatus,
} from "../../../services/orderService";
import { MANAGEABLE_STATUSES, statusLabel } from "../../../data/adminOrders";
import OrderStatusBadge from "../../../components/order/OrderStatusBadge";
import PaymentStatusBadge from "../../../components/admin/PaymentStatusBadge";
import TrackingTimeline from "../../../components/order/TrackingTimeline";
import ShippingEstimate from "../../../components/order/ShippingEstimate";
import EmptyState from "../../../components/common/EmptyState";
import { Input, Select } from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useToast } from "../../../components/common/Toast";
import { formatRupiah, formatDate } from "../../../utils/format";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [statusDraft, setStatusDraft] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const [savingPayment, setSavingPayment] = useState(false);

  const handleMarkPaid = async () => {
    setSavingPayment(true);
    try {
      setOrder(await updatePaymentStatus(id, "paid"));
      showToast("Pembayaran ditandai lunas.");
    } catch (err) {
      showToast(err.message || "Gagal memperbarui pembayaran.");
    } finally {
      setSavingPayment(false);
    }
  };

  const [trackingDraft, setTrackingDraft] = useState({
    courier: "",
    trackingNumber: "",
  });
  const [savingTracking, setSavingTracking] = useState(false);

  const load = () => {
    setLoading(true);
    setNotFound(false);
    getOrderByNumber(id).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setOrder(data);
        setStatusDraft(data.status);
        setTrackingDraft({
          courier: data.courier,
          trackingNumber: data.trackingNumber,
        });
      }
      setLoading(false);
    });
  };

  useEffect(load, [id]);

  const handleStatusSave = async () => {
    setSavingStatus(true);
    try {
      const updated = await updateOrderStatus(id, statusDraft);
      setOrder(updated);
      showToast("Order status updated successfully.");
    } catch (err) {
      showToast(err.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleTrackingSave = async () => {
    setSavingTracking(true);
    try {
      const updated = await updateTrackingInfo(id, trackingDraft);
      setOrder(updated);
      showToast("Tracking info updated successfully.");
    } catch (err) {
      showToast(err.message || "Failed to update tracking info.");
    } finally {
      setSavingTracking(false);
    }
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="nb-surface-sm h-32 bg-paper animate-pulse"
            />
          ))}
        </div>
        <div className="nb-surface-sm h-64 bg-paper animate-pulse" />
      </div>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Order not found"
        description="This order doesn't exist or the order number is incorrect."
        action={
          <Link to="/admin/orders" className="nb-btn-primary">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-2"
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <h2 className="text-xl md:text-2xl">{order.orderNumber}</h2>
          <p className="text-muted text-sm mt-1">
            {order.customerName} · Dipesan {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          {order.paymentStatus === "pending" && (
            <Button
              variant="outline"
              onClick={handleMarkPaid}
              disabled={savingPayment}
            >
              {savingPayment ? "Menyimpan..." : "Tandai Lunas"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <section className="nb-surface p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
              Tracking Timeline
            </h3>
            <TrackingTimeline timeline={order.timeline} />
            <p className="text-xs text-muted mt-4 italic">
              Riwayat di atas adalah data ilustrasi. Ubah status pesanan lewat
              panel di samping untuk mengelola pesanan ini.
            </p>
          </section>

          {order.status !== "CANCELLED" && (
            <section>
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-3">
                Jadwal Pengiriman
              </h3>
              <ShippingEstimate
                estimatedDeparture={order.estimatedDeparture}
                estimatedArrival={order.estimatedArrival}
              />
            </section>
          )}

          <section className="nb-surface p-5">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
              Items
            </h3>
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
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
              Customer &amp; Shipping
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <InfoRow label="Name" value={order.customerName} />
              <InfoRow label="Phone" value={order.customerPhone} />
              <InfoRow label="Email" value={order.customerEmail} />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
              <InfoRow
                label="Address"
                value={`${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}`}
                className="sm:col-span-2"
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="nb-surface p-5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted">
              Payment Summary
            </h3>
            <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
            {order.discount > 0 && (
              <Row
                label="Discount"
                value={`- ${formatRupiah(order.discount)}`}
                accent
              />
            )}
            <Row label="Shipping" value={formatRupiah(order.shippingCost)} />
            <div className="border-t-2 border-dashed border-ink/30 pt-3 flex items-center justify-between">
              <span className="font-display font-bold">Total</span>
              <span className="font-display font-extrabold text-xl">
                {formatRupiah(order.total)}
              </span>
            </div>
          </section>

          <section className="nb-surface p-5 flex flex-col gap-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted">
              Update Status
            </h3>
            <Select
              value={statusDraft}
              onChange={(e) => setStatusDraft(e.target.value)}
            >
              {MANAGEABLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
                </option>
              ))}
            </Select>
            <Button
              variant="primary"
              onClick={handleStatusSave}
              disabled={savingStatus || statusDraft === order.status}
            >
              {savingStatus ? "Saving..." : "Update Status"}
            </Button>
          </section>

          <section className="nb-surface p-5 flex flex-col gap-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted flex items-center gap-2">
              <Truck size={15} /> Shipping Info
            </h3>
            <Input
              id="courier"
              label="Courier"
              value={trackingDraft.courier}
              onChange={(e) =>
                setTrackingDraft((t) => ({ ...t, courier: e.target.value }))
              }
            />
            <Input
              id="trackingNumber"
              label="Tracking Number"
              value={trackingDraft.trackingNumber}
              onChange={(e) =>
                setTrackingDraft((t) => ({
                  ...t,
                  trackingNumber: e.target.value,
                }))
              }
            />
            <Button
              variant="outline"
              onClick={handleTrackingSave}
              disabled={savingTracking}
            >
              {savingTracking ? "Saving..." : "Save Shipping Info"}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{value}</p>
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
