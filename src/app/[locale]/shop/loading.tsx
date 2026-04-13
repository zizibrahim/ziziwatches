export default function ShopLoading() {
  return (
    <div className="section-padding py-12">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-3 w-24 bg-foreground/10 rounded mb-3 animate-pulse" />
        <div className="h-8 w-48 bg-foreground/10 rounded animate-pulse" />
      </div>

      {/* Search + filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="h-10 flex-1 bg-foreground/10 rounded animate-pulse" />
        <div className="h-10 w-36 bg-foreground/10 rounded animate-pulse" />
        <div className="h-10 w-36 bg-foreground/10 rounded animate-pulse" />
      </div>

      {/* Piece count skeleton */}
      <div className="flex justify-center mb-10">
        <div className="h-3 w-24 bg-foreground/10 rounded animate-pulse" />
      </div>

      {/* Product grid skeleton — 2/3 aspect, editorial spacing */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-foreground/10" />
            <div className="pt-3 pb-1 space-y-2.5">
              <div className="h-2 w-16 bg-foreground/8 rounded" />
              <div className="h-5 w-3/4 bg-foreground/10 rounded" />
              <div className="h-px w-full bg-foreground/8" />
              <div className="h-4 w-20 bg-foreground/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
