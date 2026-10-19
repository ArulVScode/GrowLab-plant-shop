import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  ShieldOff,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  getCustomerById,
  updateCustomerStatus,
} from "../../../services/customerService";
import { getOrders } from "../../../services/orderService";
import OrderStatusBadge from "../../../components/order/OrderStatusBadge";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";
import SuspendCustomerModal from "../../../components/admin/SuspendCustomerModal";
import { useToast } from "../../../components/common/Toast";
import {
  formatRupiah,
  formatDate,
  formatShortDate,
} from "../../../utils/format";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    Promise.all([getCustomerById(id), getOrders()])
      .then(([customerData, orderData]) => {
        if (!active) return;
        if (!customerData) {
          setNotFound(true);
        } else {
          setCustomer(customerData);
          setOrders(
            orderData.filter((o) => o.customerEmail === customerData.email),
          );
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleSuspendConfirm = async () => {
    setSaving(true);
    try {
      const updated = await updateCustomerStatus(id, "suspended");
      setCustomer(updated);
      showToast("Customer suspended successfully.");
      setConfirmSuspend(false);
    } catch (err) {
      showToast(err.message || "Failed to suspend customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    setSaving(true);
    try {
      const updated = await updateCustomerStatus(id, "active");
      setCustomer(updated);
      showToast("Customer activated successfully.");
    } catch (err) {
      showToast(err.message || "Failed to activate customer.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="nb-surface-sm h-64 bg-paper animate-pulse" />
        <div className="nb-surface-sm h-64 bg-paper animate-pulse" />
      </div>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        icon={Users}
        title="Customer not found"
        description="This customer doesn't exist or the ID is incorrect."
        action={
          <Link to="/admin/customers" className="nb-btn-primary">
            <ArrowLeft size={16} /> Back to Customers
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink mb-2"
        >
          <ArrowLeft size={14} /> Back to Customers
        </Link>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        <section className="nb-surface p-5 flex flex-col items-center text-center gap-3">
          <span className="w-16 h-16 rounded-full bg-yellow border-3 border-ink flex items-center justify-center font-display font-extrabold text-xl">
            {customer.name[0]}
          </span>
          <div>
            <h2 className="font-display font-bold text-lg">{customer.name}</h2>
            <p className="text-sm text-muted">{customer.email}</p>
          </div>
          <Badge tone={customer.status === "active" ? "green" : "red"}>
            {customer.status === "active" ? "ACTIVE" : "SUSPENDED"}
          </Badge>

          <div className="w-full border-t-2 border-ink/10 pt-4 mt-1 flex flex-col gap-2.5 text-sm text-left">
            <Row label="Phone" value={customer.phone} />
            <Row label="City" value={customer.city} />
            <Row label="Joined" value={formatDate(customer.joinedAt)} />
            <Row label="Total Orders" value={customer.totalOrders} />
            <Row
              label="Total Spent"
              value={formatRupiah(customer.totalSpent)}
            />
          </div>

          <div className="w-full pt-3">
            {customer.status === "active" ? (
              <button
                onClick={() => setConfirmSuspend(true)}
                className="nb-btn w-full bg-red-600 text-cream !py-2.5 !text-sm"
              >
                <ShieldOff size={15} /> Suspend Customer
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={saving}
                className="nb-btn-primary w-full !py-2.5 !text-sm"
              >
                <ShieldCheck size={15} />{" "}
                {saving ? "Activating..." : "Activate Customer"}
              </button>
            )}
          </div>
        </section>

        <section className="nb-surface p-5">
          <h3 className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wide text-muted mb-4">
            <ShoppingBag size={15} /> Order History
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted text-center py-8">
              Belum ada riwayat pesanan untuk customer ini.
            </p>
          ) : (
            <div className="flex flex-col divide-y-2 divide-ink/10">
              {orders.map((o) => (
                <Link
                  key={o.orderNumber}
                  to={`/admin/orders/${o.orderNumber}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-cream/60 -mx-2 px-2 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted">
                      {formatShortDate(o.createdAt)} · {o.itemCount} item
                      {o.itemCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold">
                      {formatRupiah(o.total)}
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <SuspendCustomerModal
        customer={confirmSuspend ? customer : null}
        loading={saving}
        onCancel={() => setConfirmSuspend(false)}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
