"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

type Action = "add-button" | "add-card" | "menu";

interface Props {
  action: Action;
  projectId?: string;
  projectStatus?: string;
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", url: "", type: "STORE", status: "ACTIVE",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    onClose();
    router.refresh();
  };

  const inputClass = "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-foreground/50 text-xs tracking-wider uppercase mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-background border border-border w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="luxury-heading text-xl font-light text-foreground">Nouveau projet</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Nom du projet *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Ex: Ma Boutique" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass + " resize-none"} placeholder="Courte description..." />
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input type="url" value={form.url} onChange={(e) => set("url", e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                <option value="STORE">Boutique</option>
                <option value="LANDING">Landing Page</option>
                <option value="APP">Application</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 text-sm py-2">Annuler</button>
            <button type="submit" disabled={loading} className="btn-gold flex-1 text-sm py-2 disabled:opacity-60">
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectMenu({ projectId, projectStatus }: { projectId: string; projectStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: projectStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
    });
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Supprimer ce projet ?")) return;
    setLoading(true);
    await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={toggle} disabled={loading} title="Activer / Désactiver"
        className="p-1.5 text-foreground/30 hover:text-gold transition-colors disabled:opacity-50">
        {projectStatus === "ACTIVE"
          ? <ToggleRight size={16} className="text-green-400" />
          : <ToggleLeft size={16} />}
      </button>
      <button onClick={remove} disabled={loading} title="Supprimer"
        className="p-1.5 text-foreground/30 hover:text-red-400 transition-colors disabled:opacity-50">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ProjectsClient({ action, projectId, projectStatus }: Props) {
  const [showModal, setShowModal] = useState(false);

  if (action === "menu" && projectId) {
    return <ProjectMenu projectId={projectId} projectStatus={projectStatus ?? "INACTIVE"} />;
  }

  if (action === "add-card") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="border border-dashed border-border hover:border-gold/30 p-5 flex flex-col items-center justify-center gap-3 text-foreground/30 hover:text-foreground/50 transition-colors min-h-[160px]"
        >
          <Plus size={20} strokeWidth={1} />
          <span className="text-xs tracking-wider uppercase">Ajouter un projet</span>
        </button>
        {showModal && <AddModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // add-button
  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
        <Plus size={14} /> Nouveau projet
      </button>
      {showModal && <AddModal onClose={() => setShowModal(false)} />}
    </>
  );
}
