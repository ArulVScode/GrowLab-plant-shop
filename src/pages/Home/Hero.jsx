import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b-3 border-ink bg-cream">
      <div className="container-max section-pad py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative z-10">
          <span className="nb-chip bg-leaf mb-5">🌱 Dipercaya 12.000+ pekebun</span>
          <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.02] mb-5">
            RAWAT TANAMAN.
            <br />
            TUMBUHKAN
            <br />
            HASILNYA.
          </h1>
          <p className="text-base md:text-lg text-ink/75 max-w-md mb-8 leading-relaxed">
            Temukan pupuk, nutrisi, obat tanaman, dan kebutuhan berkebun pilihan untuk
            membantu tanaman tumbuh lebih sehat.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/products" className="nb-btn-primary">
              Belanja Sekarang <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="nb-btn-outline">
              Lihat Kategori
            </Link>
          </div>
        </div>

        <div className="relative h-[320px] md:h-[420px]">
          {/* Decorative geometric shapes */}
          <div className="absolute top-0 right-6 w-16 h-16 bg-yellow border-3 border-ink rotate-12 hidden sm:block" />
          <div className="absolute bottom-6 left-0 w-10 h-10 rounded-full bg-sky border-3 border-ink hidden sm:block" />
          <div className="absolute top-1/3 right-0 text-clay hidden md:block">
            <Star size={28} strokeWidth={2.5} fill="currentColor" />
          </div>

          <div className="absolute inset-x-6 sm:inset-x-10 top-6 bottom-0 nb-surface bg-leaf-soft flex items-end justify-center overflow-hidden">
            <img
              src="https://placehold.co/560x560/8BE62E/111111?font=roboto&text=GrowLab"
              alt="Rangkaian produk perawatan tanaman GrowLab"
              className="w-[85%] h-[85%] object-cover border-3 border-ink translate-y-4"
            />
          </div>

          <div className="absolute -bottom-4 -left-4 md:left-0 nb-surface bg-paper px-4 py-3 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-yellow border-2 border-ink flex items-center justify-center font-display font-extrabold text-xs">
              4.9
            </span>
            <div className="text-xs leading-tight">
              <p className="font-bold font-display">Rating Pembeli</p>
              <p className="text-muted">dari 8.400+ ulasan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
