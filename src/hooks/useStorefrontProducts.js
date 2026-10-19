import { useEffect, useState } from "react";
import { getStorefrontProducts } from "../services/productService";

export function useStorefrontProducts() {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    getStorefrontProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ products: [], loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
