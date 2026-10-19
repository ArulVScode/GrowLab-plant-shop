import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange, min = 1, max = 999, size = "md" }) {
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-stretch border-3 border-ink" role="group" aria-label="Ubah jumlah">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Kurangi jumlah"
        className={`${btnSize} flex items-center justify-center bg-paper hover:bg-cream disabled:opacity-40 border-r-3 border-ink`}
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        aria-label="Jumlah"
        className={`${btnSize} w-12 text-center font-display font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none`}
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Tambah jumlah"
        className={`${btnSize} flex items-center justify-center bg-paper hover:bg-cream disabled:opacity-40 border-l-3 border-ink`}
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
