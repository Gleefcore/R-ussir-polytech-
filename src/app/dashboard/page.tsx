import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, StatusChip, SubjectIcon, Btn } from "@/components/ui";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { subjectLabel, typeLabel, subjectCat } from "@/config";

export const metadata = { title: "Tableau de bord étudiant" };

export default function DashboardPage() {
  const user = getSessionUser();
  if (!user) redirect("/login?next=/dashboard");
  const db = getDB();

  const myResources = db.resources.filter((r) => r.level === user.level);
  const myRequests = db.requests
    .filter((r) => r.userId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((r) => ({ ...r, resource: db.resources.find((x) => x.id === r.resourceId) }));
  const docs = db.resources.filter((r) => user.unlocked.includes(r.id));
  const joined = new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker">Espace personnel étudiant</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Bonjour, <span className="gold-text">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-white/55">Voici votre centre de commande académique.</p>
        </div>
        <div className="flex gap-3">
          <Badge tone="gold">Niveau {user.level}</Badge>
          <Badge tone="blue">{user.role === "admin" ? "Administrateur" : "Étudiant"}</Badge>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Colonne profil */}
        <div className="space-y-6">
          <div className="glass p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-grad font-display text-xl font-extrabold text-night-950">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="font-display text-lg font-bold leading-tight">{user.name}</p>
                <p className="font-mono text-xs text-white/45">{user.level} · ENSPY</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-white/45">Email</dt><dd className="truncate text-right text-white/80">{user.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Téléphone</dt><dd className="text-white/80">{user.phone}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/45">Membre depuis</dt><dd className="text-white/80">{joined}</dd></div>
            </dl>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { n: myResources.length, l: "Ressources" },
                { n: myRequests.length, l: "Demandes" },
                { n: docs.length, l: "Documents" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-night-800/60 py-3">
                  <p className="font-display text-xl font-bold text-gold-400">{s.n}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest2 text-white/40">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-7">
            <p className="kicker">Informations importantes</p>
            <ul className="mt-4 space-y-4">
              {db.announcements.map((a) => (
                <li key={a.id} className="rounded-xl border border-white/10 bg-night-800/50 p-4">
                  <p className="text-sm font-semibold text-gold-300">{a.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">{a.body}</p>
                  <p className="mt-2 font-mono text-[10px] text-white/35">{new Date(a.date).toLocaleDateString("fr-FR")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne principale */}
        <div className="space-y-6">
          <div className="glass p-7">
            <div className="flex items-center justify-between">
              <p className="kicker">Ressources disponibles — {user.level}</p>
              <Link href={`/${user.level.toLowerCase()}`} className="text-xs font-semibold text-gold-400 hover:text-gold-300">Programme complet →</Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {myResources.slice(0, 6).map((r) => (
                <Link key={r.id} href={`/${r.level.toLowerCase()}#res-${r.subject}`} className="group rounded-xl border border-white/10 bg-night-800/50 p-4 transition hover:border-gold-500/40 hover:bg-night-700/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gold-400"><SubjectIcon subject={subjectCat(r.subject)} className="h-5 w-5" /></span>
                    <Badge tone={r.premium ? "gold" : "green"}>{r.premium ? "Premium" : "Gratuit"}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-white/85 group-hover:text-white">{r.title}</p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest2 text-white/40">{subjectLabel(r.subject)} · {typeLabel(r.type)}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass p-7">
            <p className="kicker">Historique des demandes</p>
            {myRequests.length === 0 ? (
              <p className="mt-4 text-sm text-white/50">Aucune demande pour le moment. Explorez les ressources premium pour commencer.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {myRequests.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-night-800/50 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">{r.resource?.title ?? "Ressource supprimée"}</p>
                      <p className="mt-1 font-mono text-[10px] text-white/40">
                        Réf. {r.id} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <StatusChip status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass p-7">
            <p className="kicker">Documents reçus</p>
            {docs.length === 0 ? (
              <p className="mt-4 text-sm text-white/50">Vos documents premium validés apparaîtront ici, prêts à télécharger.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {docs.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">{d.title}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-white/40">{subjectLabel(d.subject)} · {typeLabel(d.type)} · {d.level}</p>
                    </div>
                    <Btn href={`/api/download/${d.id}`} variant="outline" className="!px-4 !py-2 text-xs">⬇ Télécharger le PDF</Btn>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass flex flex-wrap items-center justify-between gap-4 border-gold-500/20 p-7">
            <div>
              <p className="font-display text-lg font-bold">Besoin d'aide ou d'une ressource spécifique ?</p>
              <p className="mt-1 text-sm text-white/55">L'équipe répond sur WhatsApp en quelques minutes, 7j/7.</p>
            </div>
            <Btn href={`/${user.level.toLowerCase()}`}>Explorer le programme {user.level}</Btn>
          </div>
        </div>
      </div>
    </main>
  );
}
