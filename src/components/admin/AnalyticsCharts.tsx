"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface ChartData {
  date: string;
  orders: number;
  revenue: number;
}

interface Totals {
  orders: number;
  revenue: number;
  products: number;
  customers: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#c9a84c",
  CONFIRMED: "#3b82f6",
  PROCESSING: "#8b5cf6",
  SHIPPED: "#f59e0b",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const KPI = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-surface border border-border p-5">
    <p className="text-foreground/40 text-xs tracking-widest uppercase mb-2">{label}</p>
    <p className="text-foreground text-2xl font-light luxury-heading">{value}</p>
  </div>
);

export default function AnalyticsCharts() {
  const [data, setData] = useState<{
    chart: ChartData[];
    totals: Totals;
    statusBreakdown: StatusBreakdown[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 bg-surface border border-border" />
        ))}
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: "rgb(var(--color-surface))",
    border: "1px solid rgb(var(--color-border))",
    borderRadius: 0,
    color: "rgb(var(--color-fg))",
    fontSize: 12,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Commandes" value={String(data.totals.orders)} />
        <KPI label="Chiffre d'affaires" value={formatPrice(data.totals.revenue)} />
        <KPI label="Produits actifs" value={String(data.totals.products)} />
        <KPI label="Clients" value={String(data.totals.customers)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-surface border border-border p-6">
          <h3 className="text-foreground/60 text-xs tracking-widest uppercase mb-6">
            Revenus — 30 derniers jours
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.chart}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border)/0.5)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(var(--color-fg)/0.4)" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(var(--color-fg)/0.4)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatPrice(v), "Revenus"]} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-surface border border-border p-6">
          <h3 className="text-foreground/60 text-xs tracking-widest uppercase mb-6">
            Statut des commandes
          </h3>
          {data.statusBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-foreground/30 text-sm">
              Aucune commande
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.statusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={60} strokeWidth={0}>
                    {data.statusBreakdown.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#999"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {data.statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] ?? "#999" }} />
                      <span className="text-foreground/60">{s.status}</span>
                    </div>
                    <span className="text-foreground/80 font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders bar chart */}
      <div className="bg-surface border border-border p-6">
        <h3 className="text-foreground/60 text-xs tracking-widest uppercase mb-6">
          Commandes — 30 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border)/0.5)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(var(--color-fg)/0.4)" }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(var(--color-fg)/0.4)" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "Commandes"]} />
            <Bar dataKey="orders" fill="#c9a84c" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
