export function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

export function formatSold(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}rb terjual`;
  }
  return `${value} terjual`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
