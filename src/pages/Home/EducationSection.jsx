import { BookOpen, Droplet, Leaf, ShieldCheck } from "lucide-react";

const GUIDES = [
  {
    icon: BookOpen,
    title: "Cara Memilih Pupuk",
    desc: "Kenali jenis pupuk yang cocok untuk tanamanmu.",
  },
  {
    icon: Droplet,
    title: "Kapan Tanaman Butuh Nutrisi?",
    desc: "Tanda-tanda tanaman perlu nutrisi tambahan.",
  },
  {
    icon: Leaf,
    title: "Panduan Perawatan Tanaman",
    desc: "Langkah dasar merawat tanaman agar tumbuh sehat.",
  },
  {
    icon: ShieldCheck,
    title: "Cara Menggunakan Produk Aman",
    desc: "Ikuti petunjuk penggunaan pada label produk.",
  },
];

export default function EducationSection() {
  return (
    <section
      id="edukasi"
      className="container-max section-pad py-8 md:py-14 scroll-mt-24"
    >
      <div className="mb-7">
        <h2 className="text-2xl md:text-3xl">
          Belum Tahu Harus Pilih yang Mana?
        </h2>
        <p className="text-muted mt-1.5">
          Panduan singkat sebelum kamu mulai belanja.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {GUIDES.map((g) => (
          <div
            key={g.title}
            className="nb-surface-sm p-5 bg-cream hover:bg-paper transition-colors"
          >
            <span className="w-10 h-10 flex items-center justify-center bg-paper border-2 border-ink mb-4">
              <g.icon size={18} strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-sm mb-1.5">{g.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
