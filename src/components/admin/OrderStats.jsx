import { ShoppingBag, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import StatCard from "./StatCard";
import { ORDER_STATUS } from "../../data/adminOrders";

export default function OrderStats({ orders }) {
  const total = orders.length;
  const pendingPayment = orders.filter(
    (o) => o.paymentStatus === "pending",
  ).length;
  const inProgress = orders.filter((o) =>
    [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.READY_TO_SHIP,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.IN_TRANSIT,
    ].includes(o.status),
  ).length;
  const delivered = orders.filter(
    (o) => o.status === ORDER_STATUS.DELIVERED,
  ).length;
  const cancelled = orders.filter(
    (o) => o.status === ORDER_STATUS.CANCELLED,
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      <StatCard label="Total Orders" value={total} icon={ShoppingBag} />
      <StatCard
        label="Pending Payment"
        value={pendingPayment}
        icon={Clock}
        tone="yellow"
      />
      <StatCard
        label="In Progress"
        value={inProgress}
        icon={Truck}
        tone="blue"
      />
      <StatCard
        label="Delivered"
        value={delivered}
        icon={CheckCircle2}
        tone="green"
      />
      <StatCard
        label="Cancelled"
        value={cancelled}
        icon={XCircle}
        tone="default"
      />
    </div>
  );
}
