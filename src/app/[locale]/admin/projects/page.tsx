import { prisma } from "@/lib/prisma";
import { ExternalLink, Store, Globe, Smartphone } from "lucide-react";
import ProjectsClient from "@/components/admin/ProjectsClient";

export const dynamic = "force-dynamic";

const typeIcons: Record<string, typeof Store> = {
  STORE: Store,
  LANDING: Globe,
  APP: Smartphone,
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Hub Projets</h1>
          <p className="text-foreground/40 text-sm mt-1">
            Gérez tous vos projets et marques depuis un seul endroit
          </p>
        </div>
        <ProjectsClient action="add-button" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const TypeIcon = typeIcons[project.type] ?? Store;
          return (
            <div key={project.id} className="bg-surface border border-border p-5 hover:border-gold/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <TypeIcon size={18} className="text-gold" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                    project.status === "ACTIVE" ? "text-green-400 bg-green-400/10" : "text-foreground/30 bg-foreground/5"
                  }`}>
                    {project.status === "ACTIVE" ? "Actif" : "Inactif"}
                  </span>
                  <ProjectsClient action="menu" projectId={project.id} projectStatus={project.status} />
                </div>
              </div>

              <h3 className="text-foreground/90 font-medium text-sm mb-1">{project.name}</h3>
              <p className="text-foreground/40 text-xs mb-4 leading-relaxed">
                {project.description ?? "Aucune description"}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-foreground/20 text-[10px] uppercase tracking-wider">{project.type}</span>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                    className="text-foreground/30 hover:text-gold transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <ProjectsClient action="add-card" />
      </div>
    </div>
  );
}
