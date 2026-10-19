import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { orders as seedOrders, ORDER_STATUS } from "../data/orders";

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

function generateOrderNumber(existingNumbers) {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  let seq = existingNumbers.filter((n) => n.includes(datePart)).length + 1;
  let candidate = `GL-${datePart}-${pad(seq, 3)}`;
  while (existingNumbers.includes(candidate)) {
    seq += 1;
    candidate = `GL-${datePart}-${pad(seq, 3)}`;
  }
  return candidate;
}

function formatShortId(date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildTimeline(createdLabel) {
  return [
    { key: "created", label: "Pesanan dibuat", time: createdLabel, done: true },
    {
      key: "paid",
      label: "Pembayaran dikonfirmasi",
      time: createdLabel,
      done: true,
    },
    {
      key: "processing",
      label: "Sedang diproses",
      time: "Pesanan sedang disiapkan oleh penjual",
      done: true,
      active: true,
    },
    {
      key: "ready",
      label: "Siap dikirim",
      time: "Menunggu proses keberangkatan",
      done: false,
    },
    { key: "transit", label: "Dalam perjalanan", time: "", done: false },
    { key: "delivered", label: "Pesanan diterima", time: "", done: false },
  ];
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  // Seeded with the 3 illustrative mock orders, then grows for real as the
  // customer checks out during this browser session (resets on full reload —
  // same mock-data-phase limitation as everything else in this project).
  const [orders, setOrders] = useState(seedOrders);

  const createOrder = useCallback((data) => {
    let created;
    setOrders((prev) => {
      const now = new Date();
      const orderNumber = generateOrderNumber(prev.map((o) => o.orderNumber));

      const departure = new Date(now);
      departure.setDate(departure.getDate() + 1);
      const arrivalStart = new Date(departure);
      arrivalStart.setDate(arrivalStart.getDate() + 2);
      const arrivalEnd = new Date(departure);
      arrivalEnd.setDate(arrivalEnd.getDate() + 4);

      const createdLabel = `${now.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;

      created = {
        orderNumber,
        createdAt: now.toISOString(),
        items: data.items,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discount: data.discount,
        total: data.total,
        shippingAddress: data.shippingAddress,
        courier: data.courier,
        trackingNumber: `TRK${Math.floor(1000000 + Math.random() * 8999999)}`,
        estimatedDeparture: departure.toISOString().slice(0, 10),
        estimatedArrival: `${formatShortId(arrivalStart)} – ${formatShortId(arrivalEnd)}`,
        status: ORDER_STATUS.PROCESSING,
        timeline: buildTimeline(createdLabel),
      };

      return [created, ...prev];
    });
    return created;
  }, []);

  const getOrderByNumber = useCallback(
    (orderNumber) =>
      orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === String(orderNumber).toLowerCase(),
      ),
    [orders],
  );

  const value = useMemo(
    () => ({ orders, createOrder, getOrderByNumber }),
    [orders, createOrder, getOrderByNumber],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
