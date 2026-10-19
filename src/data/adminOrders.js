import { orders as publicOrders, ORDER_STATUS, statusLabel } from "./orders";

export { ORDER_STATUS, statusLabel };

export const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  REFUNDED: "refunded",
};

export const paymentStatusLabel = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

function derivePaymentStatus(status) {
  if (status === ORDER_STATUS.PENDING_PAYMENT) return PAYMENT_STATUS.PENDING;
  if (status === ORDER_STATUS.CANCELLED) return PAYMENT_STATUS.REFUNDED;
  return PAYMENT_STATUS.PAID;
}

function emailFromName(name) {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@mail.com`;
}

const PAYMENT_METHODS = [
  "Transfer Bank",
  "Virtual Account",
  "E-Wallet (OVO/GoPay/Dana)",
  "Bayar di Tempat (COD)",
];

export const adminOrders = publicOrders.map((o, idx) => ({
  ...o,
  customerName: o.shippingAddress.name,
  customerEmail: emailFromName(o.shippingAddress.name),
  customerPhone: o.shippingAddress.phone,
  paymentMethod: PAYMENT_METHODS[idx % PAYMENT_METHODS.length],
  paymentStatus: derivePaymentStatus(o.status),
}));

// The list of statuses an admin is allowed to move an order into manually.
// Payment confirmation itself is assumed to happen automatically/by the
// payment gateway in a real system, so PENDING_PAYMENT isn't offered here.
export const MANAGEABLE_STATUSES = [
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_TO_SHIP,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
];
