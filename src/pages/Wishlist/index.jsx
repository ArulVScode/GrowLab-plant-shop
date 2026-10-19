import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useCart } from "../../context/CartContext";
import { getWishlist } from "../../services/wishlistService";
import ProductCard from "../../components/product/ProductCard";
import Breadcrumb from "../../components/common/Breadcrumb";
import EmptyState from "../../components/common/EmptyState";

export default function Wishlist() {
  const { isAuthenticated, loading: authLoading } = useCustomerAuth();
  const { wishlist } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    getWishlist()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (authLoading) return null;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: "/wishlist" }} />;
  if (loading) return null;

  // Filtered against the live `wishlist` ids from context so un-hearting a
  // product here removes it from view immediately, no refetch needed.
  const displayedItems = items.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <h1 className="text-2xl md:text-3xl mt-4 mb-7">Wishlist</h1>
      {displayedItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Wishlist masih kosong"
          description="Simpan produk favoritmu di sini supaya mudah ditemukan lagi nanti."
          action={
            <Link to="/products" className="nb-btn-primary">
              Jelajahi Produk
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
