import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Crown, Users, CalendarDays, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVipPage() {
  const signups = await prisma.vipSignup.findMany({
    orderBy: { createdAt: "desc" },
  });

  const uniqueCities = new Set(signups.map((s) => s.city.trim().toLowerCase())).size;
  const thisMonth = signups.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-1">Admin</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground flex items-center gap-3">
            <Crown size={26} className="text-gold" />
            Membres VIP
          </h1>
          <p className="text-foreground/40 text-sm mt-1">
            Toutes les inscriptions au club VIP
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-surface border border-border p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <Users size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground">{signups.length}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 mt-0.5">Total inscrits</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <CalendarDays size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground">{thisMonth}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 mt-0.5">Ce mois-ci</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <MapPin size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground">{uniqueCities}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 mt-0.5">Villes distinctes</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {signups.length === 0 ? (
        <div className="border border-border bg-surface py-24 text-center">
          <Crown size={36} className="text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/30 text-sm">Aucune inscription VIP pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-4 text-left text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">#</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Nom</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Ville</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Téléphone / Email</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {signups.map((s, i) => (
                <tr key={s.id} className="hover:bg-surface/60 transition-colors group">
                  <td className="px-6 py-5 text-foreground/25 text-xs font-mono">
                    {String(signups.length - i).padStart(3, "0")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <Crown size={14} className="text-gold" />
                      </div>
                      <span className="text-foreground font-medium text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 text-foreground/60 text-sm">
                      <MapPin size={12} className="text-foreground/30" />
                      {s.city}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs bg-foreground/5 px-3 py-1.5 rounded text-foreground/70">
                      {s.contact}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-foreground/40 text-xs">
                    {format(new Date(s.createdAt), "d MMM yyyy", { locale: fr })}
                    <span className="block text-foreground/25 mt-0.5">
                      {format(new Date(s.createdAt), "HH:mm")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
