import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useCustomerAuth();
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]); // array of product ids

  const refreshWishlist = useCallback(() => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    getWishlist().then((products) => setWishlist(products.map((p) => p.id)));
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { product, qty, selected: true }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, qty: Math.max(1, qty) } : i,
      ),
    );
  }, []);

  const toggleSelected = useCallback((productId) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, selected: !i.selected } : i,
      ),
    );
  }, []);

  // Returns false if the caller should redirect to login instead (guest
  // users can browse/cart freely, but wishlist is tied to an account since
  // it's persisted server-side).
  const toggleWishlist = useCallback(
    (productId) => {
      if (!isAuthenticated) return false;
      const isIn = wishlist.includes(productId);
      setWishlist((prev) =>
        isIn ? prev.filter((id) => id !== productId) : [...prev, productId],
      );
      const action = isIn
        ? removeFromWishlist(productId)
        : addToWishlist(productId);
      action.catch(() => refreshWishlist()); // resync on failure
      return true;
    },
    [isAuthenticated, wishlist, refreshWishlist],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      wishlist,
      addToCart,
      removeFromCart,
      updateQty,
      toggleSelected,
      toggleWishlist,
      clearCart,
      cartCount,
      refreshWishlist,
    }),
    [
      items,
      wishlist,
      addToCart,
      removeFromCart,
      updateQty,
      toggleSelected,
      toggleWishlist,
      clearCart,
      cartCount,
      refreshWishlist,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
