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

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border animate-pulse">
            <div className="aspect-square bg-foreground/10" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 bg-foreground/10 rounded" />
              <div className="h-4 w-full bg-foreground/10 rounded" />
              <div className="h-3 w-3/4 bg-foreground/10 rounded" />
              <div className="h-5 w-24 bg-foreground/10 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
