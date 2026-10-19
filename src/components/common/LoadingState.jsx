export function ProductCardSkeleton() {
  return (
    <div className="nb-surface animate-pulse">
      <div className="aspect-square bg-cream border-b-3 border-ink" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-cream" />
        <div className="h-4 w-full bg-cream" />
        <div className="h-4 w-2/3 bg-cream" />
        <div className="h-5 w-20 bg-cream" />
      </div>
    </div>
  );
}

export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
