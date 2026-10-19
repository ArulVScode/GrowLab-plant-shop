import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, LogOut } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ProfileMenu() {
  const { admin, logout } = useAdminAuth();
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
    navigate("/admin/login");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 pl-2 md:pl-3 md:border-l-2 md:border-ink/15"
      >
        <span className="w-8 h-8 rounded-full bg-yellow border-2 border-ink flex items-center justify-center font-display font-bold text-xs shrink-0">
          {admin?.name?.[0] ?? "A"}
        </span>
        <div className="hidden md:block leading-tight text-left">
          <p className="text-sm font-bold">{admin?.name ?? "Admin"}</p>
          <p className="text-[11px] text-muted">Administrator</p>
        </div>
        <ChevronDown
          size={14}
          className={`hidden md:block text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 nb-surface bg-paper z-50 overflow-hidden">
          <div className="px-4 py-3 border-b-2 border-ink">
            <p className="text-sm font-bold truncate">
              {admin?.name ?? "Admin"}
            </p>
            <p className="text-xs text-muted truncate">{admin?.email}</p>
          </div>
          <button
            onClick={() => {
              navigate("/admin/settings");
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-cream transition-colors"
          >
            <Settings size={15} /> Settings
          </button>
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
