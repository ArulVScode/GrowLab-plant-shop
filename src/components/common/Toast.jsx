import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="nb-surface bg-ink text-cream flex items-center gap-3 px-4 py-3 min-w-[240px] animate-[fadein_0.2s_ease-out]"
          >
            <CheckCircle2 size={20} className="text-leaf shrink-0" />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              aria-label="Tutup notifikasi"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
