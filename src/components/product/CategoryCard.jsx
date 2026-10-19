import { Link } from "react-router-dom";
import { Sprout, Droplets, ShieldPlus, Wheat, Mountain, Scissors, ArrowUpRight } from "lucide-react";

const ICONS = { Sprout, Droplets, ShieldPlus, Wheat, Mountain, Scissors };

export default function CategoryCard({ category }) {
  const Icon = ICONS[category.icon] || Sprout;
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className={`group relative flex flex-col justify-between p-5 h-40 md:h-44 border-3 border-ink shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg transition-transform ${category.color}`}
    >
      <div className="flex items-start justify-between">
        <span className="w-10 h-10 flex items-center justify-center bg-paper border-2 border-ink">
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <h3 className="font-display font-bold text-base md:text-lg">{category.name}</h3>
        <p className="text-xs md:text-sm text-ink/70 mt-0.5">{category.description}</p>
      </div>
    </Link>
  );
}
