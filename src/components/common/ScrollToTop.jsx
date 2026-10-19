import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Tunggu halaman dirender, lalu scroll ke section. Dicoba dua kali karena
    // produk unggulan di atasnya dimuat dari API dan bisa menggeser posisi.
    const go = () => {
      const el = document.getElementById(hash.slice(1));
      if (el && Math.abs(el.getBoundingClientRect().top) > 120) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };
    const t1 = setTimeout(go, 100);
    const t2 = setTimeout(go, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search, hash]);

  return null;
}
