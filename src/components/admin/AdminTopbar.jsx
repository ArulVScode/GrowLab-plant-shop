import { Menu } from "lucide-react";
import QuickSearch from "./QuickSearch";
import NotificationDropdown from "./NotificationDropdown";
import ProfileMenu from "./ProfileMenu";

export default function AdminTopbar({ title, onOpenSidebar }) {
  return (
    <header className="h-16 md:h-[72px] shrink-0 bg-paper border-b-3 border-ink flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          aria-label="Buka menu admin"
          className="lg:hidden w-9 h-9 flex items-center justify-center border-2 border-ink shrink-0"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display font-bold text-lg md:text-xl truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <QuickSearch />
        <NotificationDropdown />
        <ProfileMenu />
      </div>
    </header>
  );
}
