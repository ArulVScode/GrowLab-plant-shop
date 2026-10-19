import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="nb-surface aspect-square overflow-hidden">
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Lihat gambar ${idx + 1}`}
              aria-pressed={active === idx}
              className={`w-16 h-16 md:w-20 md:h-20 border-3 overflow-hidden shrink-0 ${
                active === idx ? "border-ink shadow-hard-sm" : "border-ink/20"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
