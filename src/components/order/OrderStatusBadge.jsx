import { statusLabel } from "../../data/orders";

const TONE = {
  PENDING_PAYMENT: "bg-yellow text-ink",
  PROCESSING: "bg-sky text-cream",
  READY_TO_SHIP: "bg-sky text-cream",
  SHIPPED: "bg-leaf text-ink",
  IN_TRANSIT: "bg-leaf text-ink",
  DELIVERED: "bg-ink text-cream",
  CANCELLED: "bg-clay text-ink",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center border-2 border-ink px-2.5 py-1 text-[11px] font-display font-bold uppercase ${TONE[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
