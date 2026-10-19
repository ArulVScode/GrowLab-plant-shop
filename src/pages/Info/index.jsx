import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import NotFound from "../NotFound";

const PAGES = {
  "cara-belanja": {
    title: "Cara Belanja",
    sections: [
      {
        heading: "1. Pilih produk",
        text: "Telusuri produk lewat menu Produk atau kolom pencarian, lalu tambahkan ke keranjang.",
      },
      {
        heading: "2. Masuk atau daftar",
        text: "Gunakan akun GrowLab untuk menyelesaikan pesanan. Belum punya akun? Daftar dulu, gratis.",
      },
      {
        heading: "3. Checkout",
        text: "Isi alamat pengiriman, pilih metode pembayaran, lalu konfirmasi pesanan.",
      },
      {
        heading: "4. Lakukan pembayaran",
        text: "Ikuti instruksi pembayaran yang muncul setelah checkout.",
      },
      {
        heading: "5. Pantau pesanan",
        text: "Lihat status pesanan di menu Pesanan Saya, atau lacak dengan nomor pesanan di menu Lacak Pesanan.",
      },
    ],
  },
  pengiriman: {
    title: "Pengiriman",
    sections: [
      {
        heading: "Ongkos kirim",
        text: "Ongkos kirim dihitung otomatis saat checkout dan ditampilkan pada ringkasan pesanan.",
      },
      {
        heading: "Estimasi waktu",
        text: "Estimasi keberangkatan dan estimasi tiba ditampilkan setelah checkout dan di halaman detail pesanan.",
      },
      {
        heading: "Lacak pesanan",
        text: "Setelah barang dikirim, nomor resi tersedia di detail pesanan. Gunakan nomor pesanan di menu Lacak Pesanan untuk memantau statusnya.",
      },
    ],
  },
  pembayaran: {
    title: "Pembayaran",
    sections: [
      {
        heading: "Metode pembayaran",
        text: "Tersedia Transfer Bank, Virtual Account, dan E-Wallet.",
      },
      {
        heading: "Instruksi pembayaran",
        text: "Nomor tujuan pembayaran dan total yang harus dibayar muncul di halaman setelah checkout, sesuai metode yang dipilih.",
      },
      {
        heading: "Konfirmasi",
        text: "Cantumkan nomor pesanan pada berita transfer. Pesanan diproses setelah pembayaran dikonfirmasi oleh admin.",
      },
    ],
  },
  "syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    sections: [
      {
        heading: "Penggunaan layanan",
        text: "Dengan berbelanja di GrowLab, kamu menyetujui bahwa data yang diisi (nama, alamat, kontak) adalah benar.",
      },
      {
        heading: "Harga dan stok",
        text: "Harga dan ketersediaan stok dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.",
      },
      {
        heading: "Pembayaran",
        text: "Pesanan baru diproses setelah pembayaran dikonfirmasi oleh admin.",
      },
      {
        heading: "Pembatalan",
        text: "Pesanan dapat dibatalkan selama belum dikirim.",
      },
    ],
  },
  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    sections: [
      {
        heading: "Data yang kami simpan",
        text: "Kami menyimpan nama, email, nomor telepon, dan alamat pengiriman yang kamu isi untuk memproses pesanan.",
      },
      {
        heading: "Penggunaan data",
        text: "Data hanya dipakai untuk memproses pesanan dan menghubungi kamu terkait pesanan tersebut.",
      },
      {
        heading: "Keamanan",
        text: "Kata sandi disimpan dalam bentuk terenkripsi dan tidak dibagikan kepada pihak lain.",
      },
    ],
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) return <NotFound />;

  return (
    <div className="container-max section-pad py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: page.title }]}
      />
      <h1 className="text-2xl md:text-3xl mt-4 mb-6">{page.title}</h1>
      <div className="nb-surface p-5 md:p-6 flex flex-col gap-5">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display font-bold text-base mb-1.5">
              {s.heading}
            </h2>
            <p className="text-sm text-muted leading-relaxed">{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
