import { useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { MapPin, Truck, Wallet, Tag, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { createOrder } from "../../services/customerOrderService";
import { Input } from "../../components/common/Input";
import Button from "../../components/common/Button";
import OrderSummary from "../../components/cart/OrderSummary";
import Breadcrumb from "../../components/common/Breadcrumb";
import EmptyState from "../../components/common/EmptyState";
import { formatRupiah } from "../../utils/format";

const STEPS = ["Keranjang", "Pengiriman", "Pembayaran", "Selesai"];
const SHIPPING_OPTIONS = [
  { id: "reguler", label: "JNE Reguler", price: 15000, eta: "2–4 hari" },
  { id: "express", label: "JNE YES (Express)", price: 32000, eta: "1 hari" },
  { id: "hemat", label: "J&T Hemat", price: 9000, eta: "4–6 hari" },
];
const PAYMENT_OPTIONS = [
  { id: "transfer", label: "Transfer Bank" },
  { id: "va", label: "Virtual Account" },
  { id: "ewallet", label: "E-Wallet (OVO/GoPay/Dana)" },
  { id: "cod", label: "Bayar di Tempat (COD)" },
];

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { customer, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = items.filter((i) => i.selected);

  const [address, setAddress] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: "",
    city: customer?.city || "",
    postalCode: "",
  });
  const setAddressField = (field, value) =>
    setAddress((a) => ({ ...a, [field]: value }));

  const [shippingId, setShippingId] = useState("reguler");
  const [paymentId, setPaymentId] = useState("transfer");
  const [voucher, setVoucher] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const shippingOption = SHIPPING_OPTIONS.find((s) => s.id === shippingId);
  const paymentOption = PAYMENT_OPTIONS.find((p) => p.id === paymentId);
  const subtotal = selectedItems.reduce(
    (s, i) => s + i.product.price * i.qty,
    0,
  );
  const discount =
    voucher.trim().toUpperCase() === "GROWLAB10"
      ? Math.round(subtotal * 0.1)
      : 0;
  const total = subtotal + shippingOption.price - discount;

  // Wait for the auth check to finish before deciding whether to redirect,
  // otherwise a logged-in customer gets bounced on every refresh.
  if (authLoading) return null;

  // Checkout requires login; browsing and the cart itself stay guest-friendly.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (selectedItems.length === 0) {
    return (
      <div className="container-max section-pad py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Tidak ada produk untuk checkout"
          description="Pilih produk di keranjang terlebih dahulu sebelum melanjutkan checkout."
          action={
            <Link to="/cart" className="nb-btn-primary">
              Kembali ke Keranjang
            </Link>
          }
        />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const order = await createOrder({
        items: selectedItems.map((i) => ({
          productId: i.product.id,
          qty: i.qty,
        })),
        shippingAddress: address,
        courier: shippingOption.label,
        paymentMethod: paymentOption.label,
        shippingCost: shippingOption.price,
        discount,
      });
      clearCart();
      navigate("/order/success", { state: { orderNumber: order.orderNumber } });
    } catch (err) {
      setError(err.message || "Gagal membuat pesanan. Coba lagi.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Keranjang", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="text-2xl md:text-3xl mt-4 mb-7">Checkout</h1>
      <div className="flex items-center mb-10 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 flex items-center justify-center border-3 border-ink font-display font-bold text-sm ${idx <= 2 ? "bg-leaf" : "bg-paper"}`}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-semibold text-sm whitespace-nowrap">
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="w-8 md:w-16 h-0.5 bg-ink/20 mx-3" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="nb-surface-sm bg-clay-soft p-4 text-sm font-semibold mb-6">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="flex flex-col gap-6">
          <section className="nb-surface p-5">
            <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <MapPin size={20} /> Alamat Pengiriman
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="name"
                label="Nama Penerima"
                value={address.name}
                onChange={(e) => setAddressField("name", e.target.value)}
                required
              />
              <Input
                id="phone"
                label="Nomor HP"
                value={address.phone}
                onChange={(e) => setAddressField("phone", e.target.value)}
                required
              />
              <Input
                id="address"
                label="Alamat Lengkap"
                value={address.address}
                onChange={(e) => setAddressField("address", e.target.value)}
                className="sm:col-span-2"
                required
              />
              <Input
                id="city"
                label="Kota / Kabupaten"
                value={address.city}
                onChange={(e) => setAddressField("city", e.target.value)}
                required
              />
              <Input
                id="postal"
                label="Kode Pos"
                value={address.postalCode}
                onChange={(e) => setAddressField("postalCode", e.target.value)}
                required
              />
            </div>
          </section>
          <section className="nb-surface p-5">
            <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <Truck size={20} /> Metode Pengiriman
            </h2>
            <div className="flex flex-col gap-3">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between gap-3 border-2 px-4 py-3 cursor-pointer ${shippingId === opt.id ? "border-ink bg-cream shadow-hard-sm" : "border-ink/20"}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingId === opt.id}
                      onChange={() => setShippingId(opt.id)}
                      className="w-4 h-4 accent-leaf-deep"
                    />
                    <span>
                      <span className="block font-semibold text-sm">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-muted">
                        Estimasi tiba {opt.eta}
                      </span>
                    </span>
                  </span>
                  <span className="font-display font-bold text-sm shrink-0">
                    {formatRupiah(opt.price)}
                  </span>
                </label>
              ))}
            </div>
          </section>
          <section className="nb-surface p-5">
            <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <Wallet size={20} /> Metode Pembayaran
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 border-2 px-4 py-3 cursor-pointer ${paymentId === opt.id ? "border-ink bg-cream shadow-hard-sm" : "border-ink/20"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentId === opt.id}
                    onChange={() => setPaymentId(opt.id)}
                    className="w-4 h-4 accent-leaf-deep"
                  />
                  <span className="text-sm font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>
          <section className="nb-surface p-5">
            <h2 className="font-display font-bold text-lg mb-4">
              Ringkasan Produk
            </h2>
            <div className="flex flex-col gap-4">
              {selectedItems.map((i) => (
                <div key={i.product.id} className="flex items-center gap-3">
                  <img
                    src={i.product.image}
                    alt=""
                    className="w-14 h-14 border-2 border-ink object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {i.product.name}
                    </p>
                    <p className="text-xs text-muted">
                      {i.qty} x {formatRupiah(i.product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0">
                    {formatRupiah(i.product.price * i.qty)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="flex flex-col gap-4">
          <div className="nb-surface p-4 flex gap-2">
            <Tag size={18} className="mt-2.5 shrink-0" />
            <div className="flex-1">
              <Input
                id="voucher"
                placeholder="Kode voucher (coba GROWLAB10)"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
            </div>
          </div>
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            shipping={shippingOption.price}
            total={total}
            cta={
              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? "Memproses..." : "Buat Pesanan"}
              </Button>
            }
          >
            <p className="text-xs text-muted -mt-1">
              Harga akhir dihitung ulang oleh server saat pesanan dibuat untuk
              memastikan harga terbaru.
            </p>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
