import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ProductStatusBadge, StockStatusBadge } from "./StatusBadge";
import { formatRupiah, formatShortDate } from "../../utils/format";

function SelectAllCheckbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label="Pilih semua produk"
      className="w-4 h-4 accent-leaf-deep"
    />
  );
}

export default function ProductTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDelete,
}) {
  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const someSelected =
    !allSelected && products.some((p) => selectedIds.includes(p.id));

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block nb-surface-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b-3 border-ink text-left">
              <th className="w-10 px-4 py-3">
                <SelectAllCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => onToggleSelectAll(products.map((p) => p.id))}
                />
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Product
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Category
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Price
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Stock
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide">
                Updated
              </th>
              <th className="px-4 py-3 font-display font-bold text-xs uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b-2 border-ink/10 last:border-b-0 hover:bg-cream/60 transition-colors"
              >
                <td className="px-4 py-3 align-top">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => onToggleSelect(p.id)}
                    aria-label={`Pilih ${p.name}`}
                    className="w-4 h-4 accent-leaf-deep"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <img
                      src={p.image}
                      alt=""
                      className="w-14 h-14 border-2 border-ink object-cover shrink-0 bg-cream"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug line-clamp-2">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">SKU: {p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {p.category}
                </td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {formatRupiah(p.price)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {p.stock} {p.unit}
                </td>
                <td className="px-4 py-3">
                  <ProductStatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {formatShortDate(p.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/products/${p.id}`}
                      aria-label={`Lihat ${p.name}`}
                      className="w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-sky-soft transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      aria-label={`Edit ${p.name}`}
                      className="w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-yellow transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => onDelete(p)}
                      aria-label={`Hapus ${p.name}`}
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
        {products.map((p) => (
          <div key={p.id} className="nb-surface-sm p-4">
            <div className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => onToggleSelect(p.id)}
                aria-label={`Pilih ${p.name}`}
                className="w-4 h-4 mt-1.5 accent-leaf-deep shrink-0"
              />
              <img
                src={p.image}
                alt=""
                className="w-14 h-14 border-2 border-ink object-cover shrink-0 bg-cream"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-snug line-clamp-2">
                  {p.name}
                </p>
                <p className="text-xs text-muted mt-0.5">SKU: {p.sku}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-display font-bold">
                {formatRupiah(p.price)}
              </span>
              <span className="text-muted">
                Stock: {p.stock} {p.unit}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <ProductStatusBadge status={p.status} />
              <StockStatusBadge stockStatus={p._stockStatus} />
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/products/${p.id}`}
                className="flex-1 nb-btn-outline !py-2 !text-xs justify-center"
              >
                <Eye size={13} /> View
              </Link>
              <Link
                to={`/admin/products/${p.id}/edit`}
                className="flex-1 nb-btn-outline !py-2 !text-xs justify-center"
              >
                <Pencil size={13} /> Edit
              </Link>
              <button
                onClick={() => onDelete(p)}
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
