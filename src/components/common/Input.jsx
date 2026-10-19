export function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold font-display mb-1.5">
          {label}
        </label>
      )}
      <input id={id} className="nb-input" {...props} />
      {error && <p className="text-clay text-xs font-semibold mt-1.5">{error}</p>}
    </div>
  );
}

export function Select({ label, id, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold font-display mb-1.5">
          {label}
        </label>
      )}
      <select id={id} className="nb-input appearance-none bg-paper" {...props}>
        {children}
      </select>
    </div>
  );
}
