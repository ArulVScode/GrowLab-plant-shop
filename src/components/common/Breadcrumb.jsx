import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm font-medium text-muted">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-ink hover:underline underline-offset-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
