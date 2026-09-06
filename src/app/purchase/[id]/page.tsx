import Link from "next/link";
import { notFound } from "next/navigation";
import RequestButton from "@/components/request-button";
import { Badge, Btn } from "@/components/ui";
import { CircuitBand, Orb } from "@/components/fx-deco";
import { WHATSAPP, subjectLabel, typeLabel } from "@/config";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";

export const metadata = { title: "Obtenir une ressource premium" };

const STEPS = [
  { n: "1", t: "Consultez la ressource", d: "Vérifiez l'aperçu du document : titre, matière, niveau et extrait réel." },
  { n: "2", t: "Cliquez sur « Obtenir cette ressource »", d: "Vous arrivez sur cette page sécurisée, dédiée à votre demande." },
  { n: "3", t: "Contactez l'équipe sur WhatsApp", d: "Un message pré-rempli avec la référence de la ressource part directement vers le collectif." },
  { n: "4", t: "Paiement Orange Money", d: "Le paiement s'effectue directement avec l'équipe, par Orange Money, en toute transparence." },
  { n: "5", t: "Recevez votre document", d: "Après confirmation du paiement, la ressource originale est débloquée dans votre espace étudiant." },
];

export default function PurchasePage({ params }: { params: { id: string } }) {
  const db = getDB();
  const resource = db.resources.find((r) => r.id === params.id);
  if (!resource) notFound();
  const user = getSessionUser();
  const existing = user
    ? db.requests.find((r) => r.userId === user.id && r.resourceId === resource.id) ?? null
    : null;

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-8">
      <Orb className="left-[-10%] top-[20%] h-96 w-96 bg-gold-600/10" />
      <CircuitBand className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-30" />
      <div className="relative mx-auto max-w-5xl">
        <nav className="flex items-center gap-2 font-mono text-xs text-white/40">
          <Link href="/library" className="hover:text-gold-300">Bibliothèque</Link><span>/</span>
          <Link href={`/resource/${resource.id}`} className="hover:text-gold-300 line-clamp-1">{resource.title}</Link><span>/</span>
          <span className="text-gold-300">Obtenir</span>
        </nav>

        <div className="mt-6 text-center">
          <p className="kicker">Accès premium sécurisé</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
            Pour obtenir cette ressource, <span className="gold-text">contactez directement notre équipe WhatsApp</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            Aucun paiement automatique n'est effectué sur ce site : chaque transaction est humaine, vérifiée et
            confirmée par le collectif via Orange Money. C'est notre garantie de qualité et de confiance.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ol className="space-y-4">
            {STEPS.map((s) => (
              <li key={s.n} className="glass flex gap-5 p-6 transition hover:border-gold-500/30">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-grad font-display text-lg font-extrabold text-night-950">{s.n}</span>
                <div>
                  <p className="font-display text-lg font-bold">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="space-y-6">
            <div className="glass-strong p-7">
              <p className="kicker">Ressource demandée</p>
              <p className="mt-3 font-display text-lg font-bold leading-snug">{resource.title}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="blue">{resource.level}</Badge>
                <Badge tone="white">{subjectLabel(resource.subject)}</Badge>
                <Badge tone="white">{typeLabel(resource.type)}</Badge>
                <Badge tone="gold">★ Premium</Badge>
              </div>
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <RequestButton resource={resource} loggedIn={!!user} existing={existing} />
              <p className="mt-5 text-center font-mono text-[11px] text-white/40">WhatsApp : {WHATSAPP.display}</p>
            </div>
            <div className="glass p-6 text-sm leading-relaxed text-white/60">
              <p className="font-semibold text-white/85">💡 Bon à savoir</p>
              <p className="mt-2">
                Après confirmation du paiement, votre document apparaît dans <span className="text-gold-300">Tableau de bord → Documents reçus</span>,
                téléchargeable en PDF. En cas de question, l'équipe répond en quelques minutes.
              </p>
              <Btn href={`/resource/${resource.id}`} variant="ghost" className="mt-4 w-full !py-2.5 text-xs">Revoir l'aperçu du document</Btn>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
