export default function BestsellerEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
      <h2 className="luxury-heading text-2xl font-light text-foreground/60 mb-2">
        {label}
      </h2>
      <p className="text-foreground/30 text-sm max-w-xs leading-relaxed">
        Notre sélection est en cours de mise à jour. Revenez bientôt.
      </p>
    </div>
  );
}
