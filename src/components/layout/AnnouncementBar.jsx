const MESSAGE = "Gratis ongkir untuk pembelian tertentu  •  Belanja lebih mudah, tanaman lebih sehat";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink text-cream overflow-hidden">
      <div className="relative flex whitespace-nowrap py-2 text-xs md:text-sm font-medium">
        <div className="flex animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="px-6">
              {MESSAGE}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
