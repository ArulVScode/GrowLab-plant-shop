import { Plus, X } from "lucide-react";

export default function RepeatableInput({
  label,
  values,
  onChange,
  placeholder,
}) {
  const update = (idx, value) =>
    onChange(values.map((v, i) => (i === idx ? value : v)));
  const remove = (idx) => onChange(values.filter((_, i) => i !== idx));
  const add = () => onChange([...values, ""]);

  return (
    <div>
      <label className="block text-sm font-bold font-display mb-1.5">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {values.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
              className="nb-input flex-1"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              disabled={values.length <= 1}
              aria-label="Hapus baris"
              className="w-11 shrink-0 flex items-center justify-center border-2 border-ink disabled:opacity-30 hover:bg-red-600 hover:text-cream hover:border-red-600"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 flex items-center gap-1.5 text-xs font-display font-bold text-leaf-deep hover:underline"
      >
        <Plus size={14} /> Add another
      </button>
    </div>
  );
}
