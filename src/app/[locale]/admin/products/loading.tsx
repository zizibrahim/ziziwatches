export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-foreground/10 rounded" />
          <div className="h-8 w-40 bg-foreground/10 rounded" />
        </div>
        <div className="h-9 w-36 bg-foreground/10 rounded" />
      </div>

      <div className="bg-surface border border-border">
        {/* Header row */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border">
          <div className="h-3 w-16 bg-foreground/10 rounded" />
          <div className="h-3 flex-1 bg-foreground/10 rounded" />
          <div className="h-3 w-20 bg-foreground/10 rounded" />
          <div className="h-3 w-16 bg-foreground/10 rounded" />
          <div className="h-3 w-20 bg-foreground/10 rounded" />
        </div>
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
            <div className="w-12 h-12 bg-foreground/10 rounded flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 bg-foreground/10 rounded" />
              <div className="h-3 w-24 bg-foreground/10 rounded" />
            </div>
            <div className="h-4 w-20 bg-foreground/10 rounded" />
            <div className="h-4 w-12 bg-foreground/10 rounded" />
            <div className="h-6 w-16 bg-foreground/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
