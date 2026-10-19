import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="container-max section-pad pb-16 md:pb-24 pt-4">
      <div className="nb-surface bg-ink text-cream text-center px-6 py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl max-w-xl mx-auto text-cream">
          Siap Bikin Tanamanmu Tumbuh Lebih Baik?
        </h2>
        <Link to="/products" className="nb-btn-accent mt-8 inline-flex">
          Mulai Belanja
        </Link>
      </div>
    </section>
  );
}
