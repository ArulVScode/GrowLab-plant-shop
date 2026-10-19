import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function getPageTitle(pathname) {
  if (pathname === "/admin") return "Overview";
  if (pathname.startsWith("/admin/products/new")) return "Add New Product";
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  if (/^\/admin\/products\/[^/]+$/.test(pathname)) return "Product Detail";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/categories/new")) return "Add New Category";
  if (/^\/admin\/categories\/[^/]+\/edit$/.test(pathname))
    return "Edit Category";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return "Order Detail";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (/^\/admin\/customers\/[^/]+$/.test(pathname)) return "Customer Detail";
  if (pathname.startsWith("/admin/customers")) return "Customers";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  // Close the drawer automatically on route change, and lock body scroll
  // only for as long as it's actually open (guarded — see DeleteProductModal
  // for why an unguarded version of this pattern is a bug).
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden lg:block w-[270px] shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </aside>
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-[280px]">
            <div className="relative h-full">
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="absolute -right-11 top-4 w-9 h-9 flex items-center justify-center bg-cream border-2 border-ink text-ink"
              >
                <X size={18} />
              </button>
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar title={title} onOpenSidebar={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
