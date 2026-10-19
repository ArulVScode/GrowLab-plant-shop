export const categories = [
  {
    id: "pupuk",
    name: "Pupuk",
    description: "NPK, organik, hingga pupuk cair",
    color: "bg-leaf-soft",
    icon: "Sprout",
  },
  {
    id: "nutrisi",
    name: "Nutrisi Tanaman",
    description: "Vitamin & suplemen pertumbuhan",
    color: "bg-sky-soft",
    icon: "Droplets",
  },
  {
    id: "obat-tanaman",
    name: "Obat Tanaman",
    description: "Pestisida, fungisida, herbisida",
    color: "bg-clay-soft",
    icon: "ShieldPlus",
  },
  {
    id: "benih",
    name: "Benih",
    description: "Sayur, buah, dan bunga pilihan",
    color: "bg-yellow-soft",
    icon: "Wheat",
  },
  {
    id: "media-tanam",
    name: "Media Tanam",
    description: "Tanah, sekam, cocopeat, kompos",
    color: "bg-leaf-soft",
    icon: "Mountain",
  },
  {
    id: "perawatan",
    name: "Perawatan Tanaman",
    description: "Alat & aksesoris berkebun",
    color: "bg-sky-soft",
    icon: "Scissors",
  },
];

export const getCategoryById = (id) => categories.find((c) => c.id === id);
