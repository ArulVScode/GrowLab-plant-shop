import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import OrderSummary from "../../components/cart/OrderSummary";
import EmptyState from "../../components/common/EmptyState";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";

const SHIPPING_FLAT = 15000;

export default function Cart() {
  const { items } = useCart();
  const navigate = useNavigate();

  const selectedItems = items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = selectedItems.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-max section-pad py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Keranjangmu masih kosong"
          description="Yuk mulai jelajahi produk perawatan tanaman pilihan kami."
          action={
            <Link to="/products" className="nb-btn-primary">
              Mulai Belanja
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Keranjang" }]} />
      <h1 className="text-2xl md:text-3xl mt-4 mb-7">Keranjang Belanja</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="nb-surface overflow-hidden">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          cta={
            <Button
              variant="primary"
              className="w-full mt-2"
              disabled={selectedItems.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Checkout ({selectedItems.length})
            </Button>
          }
        />
      </div>
    </div>
  );
}
