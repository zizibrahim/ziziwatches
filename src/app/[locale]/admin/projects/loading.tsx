export default function ProjectsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-foreground/10 rounded" />
          <div className="h-8 w-40 bg-foreground/10 rounded" />
          <div className="h-3 w-64 bg-foreground/10 rounded" />
        </div>
        <div className="h-9 w-36 bg-foreground/10 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-foreground/10 rounded" />
              <div className="h-5 w-14 bg-foreground/10 rounded-full" />
            </div>
            <div className="h-4 w-32 bg-foreground/10 rounded mb-2" />
            <div className="h-3 w-full bg-foreground/10 rounded mb-1" />
            <div className="h-3 w-3/4 bg-foreground/10 rounded mb-4" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-foreground/10 rounded" />
              <div className="h-4 w-4 bg-foreground/10 rounded" />
            </div>
          </div>
        ))}
        {/* Add card placeholder */}
        <div className="border border-dashed border-border min-h-[160px] bg-foreground/[0.02]" />
      </div>
    </div>
  );
}
