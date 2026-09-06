import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Btn, SubjectIcon } from "@/components/ui";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { subjectLabel, typeLabel } from "@/config";

export function generateMetadata({ params }: { params: { id: string } }) {
  const r = getDB().resources.find((x) => x.id === params.id);
  return { title: r?.title ?? "Ressource introuvable" };
}

export default function ResourcePage({ params }: { params: { id: string } }) {
  const db = getDB();
  const resource = db.resources.find((r) => r.id === params.id);
  if (!resource) notFound();
  const user = getSessionUser();
  const unlocked = user ? user.unlocked.includes(resource.id) || user.role === "admin" : false;
  const related = db.resources.filter((r) => r.subject === resource.subject && r.id !== resource.id).slice(0, 3);

  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-8">
      <nav className="flex items-center gap-2 font-mono text-xs text-white/40">
        <Link href="/library" className="transition hover:text-gold-300">Bibliothèque</Link>
        <span>/</span>
        <span className="text-white/60">{subjectLabel(resource.subject)}</span>
        <span>/</span>
        <span className="text-gold-300">{resource.level}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-2.5 text-gold-400">
              <SubjectIcon subject={resource.subject} className="h-6 w-6" />
            </span>
            <Badge tone="blue">{resource.level}</Badge>
            <Badge tone="white">{typeLabel(resource.type)}</Badge>
            <Badge tone={resource.premium ? "gold" : "green"}>{resource.premium ? "★ Premium" : "Gratuit"}</Badge>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl">{resource.title}</h1>
          <p className="mt-4 leading-relaxed text-white/65">{resource.description}</p>

          <div className="glass mt-8 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-night-800/60 px-6 py-3">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-gold-400">Aperçu du document</p>
              <span className="font-mono text-[10px] text-white/35">extrait — page 1</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap px-6 py-6 font-mono text-[13px] leading-relaxed text-white/75">
              {resource.preview}
            </pre>
            {resource.premium && !unlocked && (
              <div className="relative border-t border-white/10 px-6 py-8 text-center">
                <div className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-gradient-to-t from-night-900 to-transparent" />
                <p className="text-sm text-white/60">
                  🔒 Le document complet ({resource.premium ? "premium" : ""}) est disponible après confirmation par l'équipe.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {resource.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/50">#{t}</span>
            ))}
          </div>
        </div>

        {/* Panneau latéral */}
        <aside className="space-y-6">
          <div className="glass-strong sticky top-28 p-7">
            <p className="kicker">Accès au document</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li className="flex justify-between"><span>Matière</span><span className="font-semibold text-white/85">{subjectLabel(resource.subject)}</span></li>
              <li className="flex justify-between"><span>Niveau</span><span className="font-semibold text-white/85">{resource.level}</span></li>
              <li className="flex justify-between"><span>Type</span><span className="font-semibold text-white/85">{typeLabel(resource.type)}</span></li>
              <li className="flex justify-between"><span>Statut</span><span className="font-semibold text-gold-300">{resource.premium ? "Premium" : "Gratuit"}</span></li>
            </ul>
            <div className="mt-6 space-y-3">
              {!resource.premium ? (
                user ? (
                  <Btn href={`/api/download/${resource.id}`} className="w-full"> Télécharger gratuitement</Btn>
                ) : (
                  <Btn href="/login" className="w-full">Se connecter pour télécharger</Btn>
                )
              ) : unlocked ? (
                <Btn href={`/api/download/${resource.id}`} className="w-full">⬇ Télécharger mon document</Btn>
              ) : (
                <Btn href={`/purchase/${resource.id}`} className="w-full">Obtenir cette ressource →</Btn>
              )}
              <Btn href="/library" variant="ghost" className="w-full">Retour à la bibliothèque</Btn>
            </div>
          </div>

          {related.length > 0 && (
            <div className="glass p-6">
              <p className="kicker">Dans la même matière</p>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/resource/${r.id}`} className="group block rounded-xl border border-white/10 bg-night-800/50 p-3.5 transition hover:border-gold-500/40">
                      <p className="line-clamp-2 text-sm font-semibold text-white/80 group-hover:text-white">{r.title}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-white/40">{r.level} · {typeLabel(r.type)} {r.premium && "· ★"}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
