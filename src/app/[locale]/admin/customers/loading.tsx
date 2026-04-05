export default function CustomersLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-28 bg-foreground/10 rounded" />
        <div className="h-8 w-36 bg-foreground/10 rounded" />
      </div>

      <div className="bg-surface border border-border">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="h-3 flex-1 bg-foreground/10 rounded" />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-full bg-foreground/10 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-32 bg-foreground/10 rounded" />
              <div className="h-3 w-48 bg-foreground/10 rounded" />
            </div>
            <div className="h-4 w-12 bg-foreground/10 rounded" />
            <div className="h-4 w-12 bg-foreground/10 rounded" />
            <div className="h-4 w-20 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
