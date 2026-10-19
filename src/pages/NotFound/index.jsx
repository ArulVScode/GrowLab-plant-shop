import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-max section-pad py-20 text-center">
      <span className="inline-flex w-16 h-16 items-center justify-center border-3 border-ink bg-yellow shadow-hard mb-6">
        <Sprout size={28} />
      </span>
      <h1 className="text-3xl md:text-4xl mb-3">Halaman Tidak Ditemukan</h1>
      <p className="text-muted mb-8 max-w-sm mx-auto">
        Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link to="/" className="nb-btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
