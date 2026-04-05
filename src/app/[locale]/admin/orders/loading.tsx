export default function OrdersLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-28 bg-foreground/10 rounded" />
        <div className="h-8 w-44 bg-foreground/10 rounded" />
      </div>

      <div className="bg-surface border border-border">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-border">
          {["Commande", "Client", "Montant", "Statut", "Date"].map((_, i) => (
            <div key={i} className="h-3 bg-foreground/10 rounded" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-border last:border-0">
            <div className="h-4 bg-foreground/10 rounded" />
            <div className="h-4 bg-foreground/10 rounded" />
            <div className="h-4 w-20 bg-foreground/10 rounded" />
            <div className="h-6 w-20 bg-foreground/10 rounded-full" />
            <div className="h-4 w-24 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
