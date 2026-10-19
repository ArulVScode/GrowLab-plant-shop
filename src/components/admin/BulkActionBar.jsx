import { CheckCircle2, XCircle, Trash2, X } from "lucide-react";

export default function BulkActionBar({
  count,
  onActivate,
  onDeactivate,
  onDelete,
  onClear,
}) {
  if (count === 0) return null;

  return (
    <div className="nb-surface-sm bg-ink text-cream p-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          aria-label="Batalkan pilihan"
          className="w-7 h-7 flex items-center justify-center border-2 border-cream/40 hover:bg-cream/10"
        >
          <X size={14} />
        </button>
        <span className="text-sm font-semibold">
          Selected: <span className="font-display font-bold">{count}</span>{" "}
          product{count > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onActivate}
          className="flex items-center gap-1.5 text-xs font-display font-bold border-2 border-cream/40 px-3 py-1.5 hover:bg-leaf hover:text-ink hover:border-ink transition-colors"
        >
          <CheckCircle2 size={14} /> Activate
        </button>
        <button
          onClick={onDeactivate}
          className="flex items-center gap-1.5 text-xs font-display font-bold border-2 border-cream/40 px-3 py-1.5 hover:bg-yellow hover:text-ink hover:border-ink transition-colors"
        >
          <XCircle size={14} /> Deactivate
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 text-xs font-display font-bold border-2 border-red-500 text-red-400 px-3 py-1.5 hover:bg-red-600 hover:text-cream transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
