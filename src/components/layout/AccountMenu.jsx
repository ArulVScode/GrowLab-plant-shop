import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown, Package, Heart, LogOut } from "lucide-react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function AccountMenu() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="nb-btn-outline !px-4 !py-2 !text-sm"
        aria-expanded={open}
      >
        <User size={16} />
        {customer?.name?.split(" ")[0] || "Akun"}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 nb-surface bg-paper z-50 overflow-hidden">
          <div className="px-4 py-3 border-b-2 border-ink">
            <p className="text-sm font-bold truncate">{customer?.name}</p>
            <p className="text-xs text-muted truncate">{customer?.email}</p>
          </div>
          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-cream"
          >
            <Package size={15} /> Pesanan Saya
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-cream"
          >
            <Heart size={15} /> Wishlist
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-red-600 hover:text-cream transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
