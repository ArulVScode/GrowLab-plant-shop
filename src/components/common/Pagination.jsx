import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
        className="w-10 h-10 flex items-center justify-center border-3 border-ink bg-paper shadow-hard-sm disabled:opacity-40 hover:bg-cream"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`w-10 h-10 flex items-center justify-center border-3 border-ink font-display font-bold ${
                p === page ? "bg-yellow shadow-hard-sm" : "bg-paper hover:bg-cream"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Halaman berikutnya"
        className="w-10 h-10 flex items-center justify-center border-3 border-ink bg-paper shadow-hard-sm disabled:opacity-40 hover:bg-cream"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
