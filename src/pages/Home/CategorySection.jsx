import { categories } from "../../data/categories";
import CategoryCard from "../../components/product/CategoryCard";

export default function CategorySection() {
  return (
    <section className="container-max section-pad py-8 md:py-14">
      <div className="mb-7">
        <h2 className="text-2xl md:text-3xl">Cari Berdasarkan Kebutuhan</h2>
        <p className="text-muted mt-1.5">Pilih kategori yang sesuai dengan kebutuhan tanamanmu.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </section>
  );
}
