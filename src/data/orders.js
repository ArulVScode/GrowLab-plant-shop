export const ORDER_STATUS = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PROCESSING: "PROCESSING",
  READY_TO_SHIP: "READY_TO_SHIP",
  SHIPPED: "SHIPPED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const statusLabel = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Sedang Diproses",
  READY_TO_SHIP: "Siap Dikirim",
  SHIPPED: "Dikirim",
  IN_TRANSIT: "Dalam Perjalanan",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const orders = [
  {
    orderNumber: "GL-20260910-001",
    createdAt: "2026-09-10T10:32:00+07:00",
    items: [
      { productId: 1, name: "Pupuk NPK GrowMax 16-16-16", qty: 2, price: 85000, image: "https://placehold.co/200x200/8BE62E/111111?text=NPK" },
      { productId: 4, name: "Vitamin B1 Perangsang Akar", qty: 1, price: 28000, image: "https://placehold.co/200x200/3B82F6/111111?text=B1" },
    ],
    subtotal: 198000,
    shippingCost: 15000,
    discount: 13000,
    total: 200000,
    shippingAddress: {
      name: "Dewi Anjani",
      phone: "0812-3456-7890",
      address: "Jl. Kenanga No. 12, Cikupa",
      city: "Tangerang, Banten",
      postalCode: "15710",
    },
    courier: "JNE Reguler",
    trackingNumber: "JNE0098231455",
    estimatedDeparture: "2026-09-11",
    estimatedArrival: "2026-09-13 – 2026-09-15",
    status: ORDER_STATUS.PROCESSING,
    timeline: [
      { key: "created", label: "Pesanan dibuat", time: "10 September, 10:32", done: true },
      { key: "paid", label: "Pembayaran dikonfirmasi", time: "10 September, 10:35", done: true },
      { key: "processing", label: "Sedang diproses", time: "Pesanan sedang disiapkan oleh penjual", done: true, active: true },
      { key: "ready", label: "Siap dikirim", time: "Menunggu proses keberangkatan", done: false },
      { key: "transit", label: "Dalam perjalanan", time: "", done: false },
      { key: "delivered", label: "Pesanan diterima", time: "", done: false },
    ],
  },
  {
    orderNumber: "GL-20260905-004",
    createdAt: "2026-09-05T09:12:00+07:00",
    items: [
      { productId: 10, name: "Benih Cabai Rawit Super F1", qty: 3, price: 18000, image: "https://placehold.co/200x200/FF7A00/111111?text=Cabai" },
    ],
    subtotal: 54000,
    shippingCost: 12000,
    discount: 0,
    total: 66000,
    shippingAddress: {
      name: "Dewi Anjani",
      phone: "0812-3456-7890",
      address: "Jl. Kenanga No. 12, Cikupa",
      city: "Tangerang, Banten",
      postalCode: "15710",
    },
    courier: "SiCepat Reguler",
    trackingNumber: "SC77281940",
    estimatedDeparture: "2026-09-06",
    estimatedArrival: "2026-09-08 – 2026-09-09",
    status: ORDER_STATUS.DELIVERED,
    timeline: [
      { key: "created", label: "Pesanan dibuat", time: "5 September, 09:12", done: true },
      { key: "paid", label: "Pembayaran dikonfirmasi", time: "5 September, 09:14", done: true },
      { key: "processing", label: "Sedang diproses", time: "5 September, 14:00", done: true },
      { key: "ready", label: "Siap dikirim", time: "6 September, 08:00", done: true },
      { key: "transit", label: "Dalam perjalanan", time: "6 September, 10:00", done: true },
      { key: "delivered", label: "Pesanan diterima", time: "8 September, 16:40", done: true, active: true },
    ],
  },
  {
    orderNumber: "GL-20260901-002",
    createdAt: "2026-09-01T15:47:00+07:00",
    items: [
      { productId: 16, name: "Gunting Stek Tanaman Stainless", qty: 1, price: 35000, image: "https://placehold.co/200x200/111111/FFFDF2?text=Gunting" },
      { productId: 18, name: "Pot Plastik Bulat 20cm", qty: 4, price: 15000, image: "https://placehold.co/200x200/FFD21F/111111?text=Pot" },
    ],
    subtotal: 95000,
    shippingCost: 10000,
    discount: 5000,
    total: 100000,
    shippingAddress: {
      name: "Dewi Anjani",
      phone: "0812-3456-7890",
      address: "Jl. Kenanga No. 12, Cikupa",
      city: "Tangerang, Banten",
      postalCode: "15710",
    },
    courier: "J&T Express",
    trackingNumber: "JT55019283",
    estimatedDeparture: "2026-09-02",
    estimatedArrival: "2026-09-04 – 2026-09-05",
    status: ORDER_STATUS.CANCELLED,
    timeline: [
      { key: "created", label: "Pesanan dibuat", time: "1 September, 15:47", done: true },
      { key: "cancelled", label: "Pesanan dibatalkan", time: "1 September, 16:10", done: true, active: true },
    ],
  },
];

export const getOrderByNumber = (orderNumber) =>
  orders.find((o) => o.orderNumber.toLowerCase() === String(orderNumber).toLowerCase());
