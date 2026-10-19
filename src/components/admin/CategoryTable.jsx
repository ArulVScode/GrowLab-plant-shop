import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Badge from "../common/Badge";

export default function CategoryTable({ categories, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block nb-surface-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-3 border-ink text-left">
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Slug
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Products
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr
                key={c.id}
                className="border-b-2 border-ink/10 last:border-b-0 hover:bg-cream/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1 max-w-xs">
                    {c.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {c.slug}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {c.productCount} products
                </td>
                <td className="px-4 py-3">
                  <Badge tone={c.status === "active" ? "green" : "gray"}>
                    {c.status === "active" ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/categories/${c.id}/edit`}
                      aria-label={`Edit ${c.name}`}
                      className="w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-yellow transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => onDelete(c)}
                      aria-label={`Hapus ${c.name}`}
                      className="w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-red-600 hover:text-cream hover:border-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden flex flex-col gap-3">
        {categories.map((c) => (
          <div key={c.id} className="nb-surface-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-muted mt-0.5">{c.slug}</p>
              </div>
              <Badge tone={c.status === "active" ? "green" : "gray"}>
                {c.status === "active" ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>
            <p className="text-xs text-muted mb-3 line-clamp-2">
              {c.description}
            </p>
            <p className="text-sm font-semibold mb-3">
              {c.productCount} products
            </p>
            <div className="flex gap-2">
              <Link
                to={`/admin/categories/${c.id}/edit`}
                className="flex-1 nb-btn-outline !py-2 !text-xs justify-center"
              >
                <Pencil size={13} /> Edit
              </Link>
              <button
                onClick={() => onDelete(c)}
                className="flex-1 nb-btn !py-2 !text-xs bg-red-600 text-cream justify-center"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
