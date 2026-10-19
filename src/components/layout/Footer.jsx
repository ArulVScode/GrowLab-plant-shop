import { Link } from "react-router-dom";
import { Sprout, Camera, MessageCircle, PlayCircle } from "lucide-react";

const TEAM = {
  name: "Kelompok 10",
  members: [
    { name: "Muh. Asrul Mulis", nim: "221011450021" },
    { name: "Muhammad Wahyu Muges", nim: "221011450010" },
  ],
};

const columns = [
  {
    title: "Belanja",
    links: [
      { label: "Semua Produk", href: "/products" },
      { label: "Pupuk", href: "/products?category=Pupuk" },
      { label: "Nutrisi Tanaman", href: "/products?category=Nutrisi Tanaman" },
      { label: "Obat Tanaman", href: "/products?category=Obat Tanaman" },
      { label: "Benih", href: "/products?category=Benih" },
      { label: "Media Tanam", href: "/products?category=Media Tanam" },
      {
        label: "Perawatan Tanaman",
        href: "/products?category=Perawatan Tanaman",
      },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Cara Belanja", href: "/info/cara-belanja" },
      { label: "Pengiriman", href: "/info/pengiriman" },
      { label: "Pembayaran", href: "/info/pembayaran" },
      { label: "Lacak Pesanan", href: "/track-order" },
      { label: "Pesanan Saya", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Syarat & Ketentuan", href: "/info/syarat-ketentuan" },
      { label: "Kebijakan Privasi", href: "/info/kebijakan-privasi" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-paper mt-24">
      <div className="container-max section-pad py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 bg-ink text-leaf flex items-center justify-center border-2 border-ink">
              <Sprout size={20} strokeWidth={2.5} />
            </span>
            <span className="font-display font-extrabold text-xl">GROWLAB</span>
          </Link>
          <p className="text-sm text-muted max-w-xs leading-relaxed">
            Teman berkebun untuk kebutuhan pupuk, nutrisi, obat tanaman, benih,
            dan media tanam — dari petani, untuk siapa saja yang ingin
            tanamannya tumbuh lebih baik.
          </p>
          <div className="flex gap-3 mt-5">
            {[Camera, MessageCircle, PlayCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Ikuti kami di media sosial"
                className="w-9 h-9 flex items-center justify-center border-2 border-ink hover:bg-yellow transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-bold text-sm mb-4">{col.title}</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-ink hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-ink/10 py-5 text-center text-xs text-muted flex flex-col gap-1">
        <p>© 2026 GrowLab. Seluruh hak cipta dilindungi.</p>
        <p>
          {TEAM.name} ·{" "}
          {TEAM.members.map((m) => `${m.name} (${m.nim})`).join(" · ")}
        </p>
      </div>
    </footer>
  );
}
