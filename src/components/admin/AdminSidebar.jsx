import { NavLink } from "react-router-dom";
import {
  Sprout,
  LayoutGrid,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Lock,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const MAIN_MENU = [
  { label: "Overview", href: "/admin", icon: LayoutGrid, end: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

const SOON_MENU = [];

export default function AdminSidebar({ onNavigate }) {
  const { logout } = useAdminAuth();

  return (
    <div className="h-full w-full bg-ink text-cream flex flex-col">
      <div className="h-16 md:h-[72px] flex items-center gap-2 px-5 border-b-3 border-cream/15 shrink-0">
        <span className="w-9 h-9 bg-leaf text-ink flex items-center justify-center border-2 border-cream/20">
          <Sprout size={18} strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <p className="font-display font-extrabold text-sm tracking-wide">
            GROWLAB
          </p>
          <p className="text-[10px] text-cream/50 uppercase tracking-widest">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5">
          Menu
        </p>
        {MAIN_MENU.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold border-2 transition-colors ${
                isActive
                  ? "bg-yellow text-ink border-ink"
                  : "border-transparent text-cream/80 hover:bg-cream/10 hover:text-cream"
              }`
            }
          >
            <item.icon size={17} strokeWidth={2.25} />
            {item.label}
          </NavLink>
        ))}

        {SOON_MENU.length > 0 && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-cream/40 mt-5 mb-1.5">
            Segera Hadir
          </p>
        )}
        {SOON_MENU.map((item) => (
          <div
            key={item.label}
            aria-disabled="true"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-cream/30 cursor-not-allowed"
          >
            <item.icon size={17} strokeWidth={2.25} />
            {item.label}
            <Lock size={12} className="ml-auto" />
          </div>
        ))}
      </nav>

      <div className="p-3 border-t-3 border-cream/15 flex flex-col gap-1 shrink-0">
        <NavLink
          to="/admin/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 text-sm font-semibold border-2 transition-colors ${isActive ? "bg-yellow text-ink border-ink" : "border-transparent text-cream/80 hover:bg-cream/10 hover:text-cream"}`
          }
        >
          <Settings size={17} strokeWidth={2.25} />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-cream/80 hover:bg-clay hover:text-ink transition-colors"
        >
          <LogOut size={17} strokeWidth={2.25} />
          Logout
        </button>
      </div>
    </div>
  );
}
