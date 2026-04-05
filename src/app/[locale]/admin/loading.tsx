export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-foreground/10 rounded" />
          <div className="h-8 w-48 bg-foreground/10 rounded" />
          <div className="h-3 w-64 bg-foreground/10 rounded" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border p-5">
            <div className="h-3 w-20 bg-foreground/10 rounded mb-3" />
            <div className="h-7 w-24 bg-foreground/10 rounded mb-1" />
            <div className="h-3 w-16 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-surface border border-border p-6 mb-6">
        <div className="h-4 w-32 bg-foreground/10 rounded mb-6" />
        <div className="h-48 bg-foreground/5 rounded" />
      </div>
    </div>
  );
}
