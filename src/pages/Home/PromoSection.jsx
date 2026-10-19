import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PromoSection() {
  return (
    <section className="container-max section-pad py-8 md:py-14">
      <div className="relative nb-surface bg-leaf overflow-hidden px-6 py-12 md:px-16 md:py-16 text-center">
        <div className="absolute top-4 left-6 w-8 h-8 rounded-full border-3 border-ink bg-yellow hidden md:block" />
        <div className="absolute bottom-6 right-10 w-10 h-10 border-3 border-ink bg-cream rotate-12 hidden md:block" />
        <h2 className="text-3xl md:text-5xl max-w-2xl mx-auto leading-tight">
          Siapkan Kebunmu Untuk Tumbuh Lebih Baik.
        </h2>
        <p className="text-ink/75 mt-4 mb-8 max-w-md mx-auto">
          Diskon hingga 20% untuk pupuk dan nutrisi tanaman pilihan minggu ini.
        </p>
        <Link to="/products" className="nb-btn-dark">
          Belanja Sekarang <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
