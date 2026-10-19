const VALUES = [
  { n: "01", title: "Produk Terpilih", desc: "Produk untuk berbagai kebutuhan tanaman." },
  { n: "02", title: "Pengiriman Terlacak", desc: "Pantau perjalanan pesanan dengan mudah." },
  { n: "03", title: "Pesanan Terkonfirmasi", desc: "Status pesanan transparan dari awal sampai tiba." },
  { n: "04", title: "Belanja Lebih Mudah", desc: "Cari produk berdasarkan kebutuhan tanaman." },
];

export default function TrustSection() {
  return (
    <section className="container-max section-pad py-12 md:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {VALUES.map((v) => (
          <div key={v.n} className="nb-surface-sm p-5 bg-paper">
            <span className="font-display font-extrabold text-2xl text-ink/20">{v.n}</span>
            <h3 className="font-display font-bold text-base mt-2 mb-1">{v.title}</h3>
            <p className="text-sm text-muted">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
