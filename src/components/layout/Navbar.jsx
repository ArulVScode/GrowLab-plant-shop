import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Sprout,
  User,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import SearchOverlay from "./SearchOverlay";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import AccountMenu from "./AccountMenu";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Panduan", href: "/#edukasi" },
  { label: "Lacak Pesanan", href: "/track-order" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { isAuthenticated, customer, logout } = useCustomerAuth();

  // Guarded: only locks scroll while the mobile drawer is actually open,
  // and cleans up properly on close/unmount (see DeleteProductModal fix
  // in the admin panel for why an unguarded version of this is a bug).
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-cream border-b-3 border-ink">
      <div className="container-max section-pad flex items-center justify-between h-16 md:h-[72px] gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="GrowLab beranda"
        >
          <span className="w-9 h-9 bg-ink text-leaf flex items-center justify-center border-2 border-ink">
            <Sprout size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight hidden sm:block">
            GROWLAB
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-display font-semibold text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) => {
                const active =
                  link.href === "/#edukasi"
                    ? isActive && hash === "#edukasi"
                    : link.href === "/"
                      ? isActive && hash !== "#edukasi"
                      : isActive;
                return `hover:text-leaf-deep transition-colors ${active ? "underline underline-offset-4 decoration-2" : ""}`;
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 flex-1 max-w-xs border-3 border-ink bg-paper px-3 py-2 text-sm text-muted hover:shadow-hard-sm transition-shadow"
        >
          <Search size={16} /> Cari produk...
        </button>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Cari produk"
            className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-ink bg-paper"
          >
            <Search size={18} />
          </button>

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} produk`}
            className="hidden sm:flex relative w-10 h-10 items-center justify-center border-2 border-ink bg-paper hover:bg-yellow transition-colors"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-clay text-white text-[10px] font-bold flex items-center justify-center border-2 border-ink">
                {wishlist.length > 9 ? "9+" : wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Keranjang, ${cartCount} produk`}
            className="relative w-10 h-10 flex items-center justify-center border-2 border-ink bg-paper hover:bg-yellow transition-colors"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-clay text-white text-[10px] font-bold flex items-center justify-center border-2 border-ink">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <AccountMenu />
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-flex nb-btn-outline !px-4 !py-2 !text-sm"
              >
                <User size={16} /> Masuk
              </Link>
              <Link
                to="/register"
                className="hidden md:inline-flex nb-btn-dark !px-4 !py-2 !text-sm"
              >
                Daftar
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center border-2 border-ink bg-paper"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-ink/40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[82%] max-w-xs bg-cream border-l-3 border-ink flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-16 px-5 border-b-3 border-ink">
              <span className="font-display font-extrabold text-lg">MENU</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 font-display font-bold text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 border-b border-ink/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-ink/10"
              >
                Pesanan Saya
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-ink/10"
              >
                Wishlist
              </Link>
            </nav>
            <div className="mt-auto p-5 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-muted px-1">
                    Masuk sebagai{" "}
                    <span className="font-bold text-ink">{customer?.name}</span>
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="nb-btn w-full bg-red-600 text-cream"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="nb-btn-outline w-full"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="nb-btn-dark w-full"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onSubmit={(q) => {
            setSearchOpen(false);
            navigate(`/products?q=${encodeURIComponent(q)}`);
          }}
        />
      )}
    </header>
  );
}
