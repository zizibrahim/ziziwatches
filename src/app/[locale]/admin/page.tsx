import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Tableau de bord</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Vue d&apos;ensemble</h1>
      </div>
      <AnalyticsCharts />
    </div>
  );
}
