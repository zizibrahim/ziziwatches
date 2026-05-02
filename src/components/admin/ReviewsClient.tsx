"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, CheckCircle, XCircle, Trash2, Plus, Loader2, ExternalLink, Copy, Check, Upload, Images } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

type Review = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  rating: number | null;
  comment: string | null;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
  order: { orderNumber: string } | null;
  product: { nameFr: string; images: { url: string }[] } | null;
};

const TABS = ["PENDING", "APPROVED", "REJECTED", "AWAITING"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvés",
  REJECTED: "Rejetés",
  AWAITING: "Liens envoyés",
};

const STATUS_COLORS: Record<string, string> = {
  AWAITING: "text-foreground/40",
  PENDING: "text-amber-400",
  APPROVED: "text-emerald-400",
  REJECTED: "text-red-400",
};

function StarRow({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-foreground/20 text-xs">—</span>;
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} className={s <= rating ? "fill-gold text-gold" : "fill-transparent text-foreground/20"} />
      ))}
    </span>
  );
}

type GenerateModalProps = {
  onClose: () => void;
  onGenerated: (url: string, name: string) => void;
};

function GenerateModal({ onClose, onGenerated }: GenerateModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [sendWa, setSendWa] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Le nom est requis."); return; }
    setLoading(true);
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name.trim(),
        customerPhone: phone.trim() || undefined,
        orderId: orderId.trim() || undefined,
        sendWhatsApp: sendWa,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const d = await res.json();
      onGenerated(d.reviewUrl, name.trim());
    } else {
      setErr("Erreur lors de la génération.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-surface border border-border w-full max-w-md">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-foreground text-sm tracking-[0.2em] uppercase">Générer un lien d'avis</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handle} className="p-6 space-y-4">
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">Nom du client *</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold/50"
              placeholder="Prénom Nom" />
          </div>
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">
              Téléphone <span className="text-foreground/20">(optionnel)</span>
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold/50 font-mono"
              placeholder="0612345678" />
          </div>
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">
              ID Commande <span className="text-foreground/20">(optionnel)</span>
            </label>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold/50 font-mono"
              placeholder="cm..." />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={sendWa} onChange={(e) => setSendWa(e.target.checked)}
              className="accent-gold" />
            <span className="text-foreground/60 text-xs">Envoyer via WhatsApp automatiquement</span>
          </label>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-gold text-[#050505] text-xs tracking-[0.25em] uppercase py-3 hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={13} className="animate-spin" /> Génération…</> : "Générer le lien"}
          </button>
        </form>
      </div>
    </div>
  );
}

type LinkResultProps = {
  url: string;
  name: string;
  onClose: () => void;
};

function LinkResult({ url, name, onClose }: LinkResultProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waLink = `https://wa.me/?text=${encodeURIComponent(`Bonjour ${name} 👋\n\nVoici votre lien pour laisser un avis :\n${url}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-surface border border-border w-full max-w-md">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-foreground text-sm tracking-[0.2em] uppercase">Lien généré</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-foreground/50 text-xs">Lien unique pour <span className="text-foreground">{name}</span></p>
          <div className="flex items-center gap-2 bg-background border border-border px-3 py-2">
            <span className="text-foreground/40 text-xs font-mono truncate flex-1">{url}</span>
            <button onClick={copy} className="shrink-0 text-foreground/40 hover:text-gold transition-colors">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
          <a href={waLink} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-emerald-500/30 text-emerald-400 text-xs tracking-[0.2em] uppercase py-3 hover:bg-emerald-500/5 transition-colors">
            <ExternalLink size={13} /> Ouvrir dans WhatsApp
          </a>
          <button onClick={onClose}
            className="w-full border border-border text-foreground/40 text-xs tracking-[0.2em] uppercase py-2.5 hover:text-foreground transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

type Screenshot = {
  id: string;
  url: string;
  platform: string;
  caption: string | null;
  createdAt: string;
};

function UploadModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<"whatsapp" | "instagram">("whatsapp");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setErr("Choisissez une image."); return; }
    setLoading(true);

    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!uploadRes.ok) { setErr("Erreur upload."); setLoading(false); return; }
    const { url } = await uploadRes.json();

    const saveRes = await fetch("/api/admin/social-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, platform, caption: caption.trim() || undefined }),
    });
    setLoading(false);
    if (saveRes.ok) { onDone(); }
    else { setErr("Erreur lors de la sauvegarde."); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-surface border border-border w-full max-w-md">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-foreground text-sm tracking-[0.2em] uppercase">Ajouter une capture d&apos;écran</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handle} className="p-6 space-y-4">
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">Plateforme</label>
            <div className="flex gap-3">
              {(["whatsapp", "instagram"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 text-xs tracking-wider uppercase border transition-colors ${
                    platform === p
                      ? "border-gold text-gold bg-gold/5"
                      : "border-border text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-foreground/60 text-xs file:mr-3 file:py-1.5 file:px-3 file:border file:border-border file:bg-surface file:text-foreground/60 file:text-xs file:cursor-pointer"
            />
          </div>
          <div>
            <label className="text-foreground/40 text-[10px] uppercase tracking-wider block mb-1.5">
              Légende <span className="text-foreground/20">(optionnel)</span>
            </label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold/50"
              placeholder="Ex : Très satisfaite !"
            />
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-[#050505] text-xs tracking-[0.25em] uppercase py-3 hover:bg-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={13} className="animate-spin" /> Upload…</> : "Ajouter la photo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReviewsClient({ locale }: { locale: string }) {
  const [tab, setTab] = useState<Tab>("PENDING");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [counts, setCounts] = useState<Record<Tab, number>>({ PENDING: 0, APPROVED: 0, REJECTED: 0, AWAITING: 0 });
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{ url: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [screenshotLoading, setScreenshotLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pending, approved, rejected, awaiting] = await Promise.all(
      TABS.map((s) => fetch(`/api/admin/reviews?status=${s}`).then((r) => r.json()))
    );
    setCounts({
      PENDING: pending.length,
      APPROVED: approved.length,
      REJECTED: rejected.length,
      AWAITING: awaiting.length,
    });
    const map: Record<Tab, Review[]> = { PENDING: pending, APPROVED: approved, REJECTED: rejected, AWAITING: awaiting };
    setReviews(map[tab]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const fetchScreenshots = useCallback(async () => {
    setScreenshotLoading(true);
    const res = await fetch("/api/admin/social-proof");
    setScreenshots(res.ok ? await res.json() : []);
    setScreenshotLoading(false);
  }, []);

  useEffect(() => { fetchScreenshots(); }, [fetchScreenshots]);

  async function delScreenshot(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    await fetch(`/api/admin/social-proof/${id}`, { method: "DELETE" });
    fetchScreenshots();
  }

  async function act(id: string, action: "approve" | "reject") {
    setActionLoading(id + action);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setActionLoading(null);
    fetchAll();
  }

  async function del(id: string) {
    if (!confirm("Supprimer cet avis définitivement ?")) return;
    setActionLoading(id + "del");
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setActionLoading(null);
    fetchAll();
  }

  function handleGenerated(url: string, name: string) {
    setShowGenerate(false);
    setGeneratedLink({ url, name });
    fetchAll();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-1">Gestion</p>
          <h1 className="luxury-heading text-2xl font-light text-foreground">Avis clients</h1>
        </div>
        <button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 bg-gold text-[#050505] text-xs tracking-[0.25em] uppercase px-4 py-2.5 hover:bg-gold/90 transition-colors"
        >
          <Plus size={13} /> Générer un lien
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs tracking-wider uppercase transition-colors relative ${
              tab === t ? "text-gold" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            {TAB_LABELS[t]}
            {counts[t] > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                t === "PENDING" ? "bg-amber-400/20 text-amber-400" : "bg-foreground/10 text-foreground/40"
              }`}>
                {counts[t]}
              </span>
            )}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-px bg-gold" />}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-gold/40" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-foreground/20 text-sm">
          Aucun avis dans cette catégorie
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-surface border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Left info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-foreground text-sm font-medium">{r.customerName}</span>
                    <span className="font-mono text-foreground/30 text-xs">{r.customerPhone}</span>
                    {r.order && (
                      <span className="text-foreground/30 text-xs font-mono border border-border/50 px-1.5 py-0.5">
                        {r.order.orderNumber}
                      </span>
                    )}
                    <span className={`text-[10px] uppercase tracking-wider ${STATUS_COLORS[r.status]}`}>
                      {TAB_LABELS[r.status as Tab] ?? r.status}
                    </span>
                  </div>

                  {r.rating !== null && (
                    <div className="flex items-center gap-2">
                      <StarRow rating={r.rating} />
                      <span className="text-foreground/40 text-xs">{r.rating}/5</span>
                    </div>
                  )}

                  {r.comment && (
                    <p className="text-foreground/60 text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                  )}

                  {r.product && (
                    <p className="text-foreground/30 text-xs italic">{r.product.nameFr}</p>
                  )}

                  <p className="text-foreground/20 text-[10px]">
                    Lien envoyé le {format(new Date(r.createdAt), "d MMM yyyy", { locale: fr })}
                    {r.submittedAt && ` · Soumis le ${format(new Date(r.submittedAt), "d MMM yyyy", { locale: fr })}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => act(r.id, "approve")}
                        disabled={actionLoading === r.id + "approve"}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/5 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === r.id + "approve" ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                        Approuver
                      </button>
                      <button
                        onClick={() => act(r.id, "reject")}
                        disabled={actionLoading === r.id + "reject"}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/5 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === r.id + "reject" ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                        Rejeter
                      </button>
                    </>
                  )}
                  {r.status === "APPROVED" && (
                    <button
                      onClick={() => act(r.id, "reject")}
                      disabled={actionLoading === r.id + "reject"}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground/40 text-xs hover:text-foreground/70 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={11} /> Masquer
                    </button>
                  )}
                  {r.status === "REJECTED" && (
                    <button
                      onClick={() => act(r.id, "approve")}
                      disabled={actionLoading === r.id + "approve"}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/5 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={11} /> Réactiver
                    </button>
                  )}
                  <button
                    onClick={() => del(r.id)}
                    disabled={actionLoading === r.id + "del"}
                    className="p-1.5 text-foreground/20 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SOCIAL PROOF SCREENSHOTS ── */}
      <div className="mt-14 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-1">Photos</p>
            <h2 className="luxury-heading text-xl font-light text-foreground flex items-center gap-2">
              <Images size={18} className="text-foreground/30" />
              Avis Réseaux Sociaux
            </h2>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 border border-border text-foreground/60 text-xs tracking-[0.2em] uppercase px-4 py-2.5 hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Upload size={13} /> Ajouter une photo
          </button>
        </div>

        {screenshotLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-gold/40" />
          </div>
        ) : screenshots.length === 0 ? (
          <div className="text-center py-10 text-foreground/20 text-sm border border-dashed border-border/40">
            Aucune photo. Ajoutez des captures d&apos;écran WhatsApp ou Instagram.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {screenshots.map((s) => (
              <div
                key={s.id}
                className="relative group aspect-[9/16] bg-surface border border-border overflow-hidden rounded"
              >
                <Image src={s.url} alt="Screenshot" fill className="object-cover" sizes="200px" />
                <div className="absolute top-1.5 left-1.5">
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full text-white ${
                      s.platform === "instagram" ? "bg-pink-500" : "bg-emerald-500"
                    }`}
                  >
                    {s.platform}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => delScreenshot(s.id)}
                    className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGenerate && (
        <GenerateModal onClose={() => setShowGenerate(false)} onGenerated={handleGenerated} />
      )}
      {generatedLink && (
        <LinkResult url={generatedLink.url} name={generatedLink.name} onClose={() => setGeneratedLink(null)} />
      )}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onDone={() => { setShowUpload(false); fetchScreenshots(); }} />
      )}
    </div>
  );
}
