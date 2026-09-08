import Link from "next/link";
import CorrectionForm from "./correction-form";
import { Badge, Btn, Reveal, SubjectIcon, WhatsAppIcon } from "./ui";
import { CircuitBand, GridBG, Orb } from "./fx-deco";
import { RES_TYPES, typeLabel, waLink, subjectsOf, subjectDef } from "@/config";
import { getSessionUser, toPublic } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { Level, Resource } from "@/lib/types";

function DocButton({ doc, user, level }: { doc: Resource; user: ReturnType<typeof toPublic> | null; level: Level }) {
  const loginNext = `/login?next=/${level.toLowerCase()}`;
  if (doc.type === "corrections" && doc.premium) {
    if (user?.unlocked.includes(doc.id) || user?.role === "admin")
      return <Btn href={`/api/download/${doc.id}`} className="!px-3.5 !py-2 text-xs">⬇ Télécharger la correction</Btn>;
    return <CorrectionForm resource={doc} user={user} />;
  }
  if (doc.premium) return <CorrectionForm resource={doc} user={user} />;
  return (
    <Btn href={user ? `/api/download/${doc.id}` : loginNext} variant="outline" className="!px-3.5 !py-2 text-xs">
      ⬇ {doc.type === "corrections" ? "Accéder à la correction" : "Télécharger"}
    </Btn>
  );
}

function SubjectCard({ id, level, user }: { id: string; level: Level; user: ReturnType<typeof toPublic> | null }) {
  const db = getDB();
  const def = subjectDef(id);
  const res = db.resources.filter((r) => r.subject === id && r.level === level);
  return (
    <div id={`res-${id}`} className="glass scroll-mt-28 overflow-hidden transition hover:border-gold-500/30">
      <div className="flex items-start gap-4 border-b border-white/10 bg-night-700/40 px-6 py-5">
        <span className="rounded-xl border border-white/10 bg-night-800/70 p-2.5 text-gold-400">
          <SubjectIcon subject={def?.cat ?? "transversal"} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight">{def?.label ?? id}</h3>
          <p className="mt-1 text-xs text-white/50">{def?.desc}</p>
        </div>
        <Badge tone={res.length ? "gold" : "white"}>{res.length} ressource{res.length > 1 ? "s" : ""}</Badge>
      </div>

      <div className="divide-y divide-white/5">
        {RES_TYPES.map((t) => {
          const docs = res.filter((r) => r.type === t.id);
          return (
            <div key={t.id} className="px-6 py-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest2 text-white/40">
                {RES_TYPES.findIndex((x) => x.id === t.id) + 1}. {t.label}
              </p>
              {docs.length === 0 ? (
                <p className="mt-2 text-xs text-white/35">
                  À venir —{" "}
                  <a href={waLink(`Bonjour, je cherche des documents (${t.label}) pour : ${def?.label}`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200">
                    <WhatsAppIcon className="h-3.5 w-3.5" /> demander sur WhatsApp
                  </a>
                </p>
              ) : (
                <ul className="mt-2.5 space-y-2.5">
                  {docs.map((doc) => (
                    <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm text-white/75">
                        {doc.title}
                        {doc.premium && <span className="ml-2 font-mono text-[10px] text-gold-400">★ protégé</span>}
                      </span>
                      <DocButton doc={doc} user={user} level={level} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MspSpace({ level }: { level: Level }) {
  const isM1 = level === "MSP1";
  const rawUser = getSessionUser();
  const user = rawUser ? toPublic(rawUser) : null;
  const db = getDB();

  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className={isM1 ? "left-[-10%] top-[10%] h-[420px] w-[420px] bg-night-500/40" : "right-[-10%] top-[8%] h-[420px] w-[420px] bg-gold-600/15"} />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night-800/50 p-10 md:p-14">
          <span className={`pointer-events-none absolute -right-8 -top-16 font-display text-[11rem] font-extrabold leading-none ${isM1 ? "text-sky-400/10" : "text-gold-500/10"}`}>
            {isM1 ? "M1" : "M2"}
          </span>
          <Badge tone={isM1 ? "blue" : "gold"}>{isM1 ? "Niveau 1" : "Niveau 2"}</Badge>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
            {isM1 ? (
              <>Espace <span className="blue-text">MSP1</span> — bâtir des fondations inébranlables.</>
            ) : (
              <>Espace <span className="gold-text">MSP2</span> — passer au niveau ingénieur.</>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            Programme officiel, semestre par semestre. Pour chaque unité d'enseignement : fiches de TD,
            épreuves / examens et corrections — téléchargeables séparément.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="/register" variant={isM1 ? "outline" : "gold"}>Créer mon compte</Btn>
            <Btn href={isM1 ? "/msp2" : "/msp1"} variant="ghost">{isM1 ? "Voir MSP2" : "Voir MSP1"}</Btn>
          </div>
        </div>

        {(["S1", "S2"] as const).map((sem, si) => (
          <section key={sem} className="mt-14">
            <Reveal delay={si * 0.05}>
              <div className="flex items-center gap-4">
                <h2 className={`font-display text-2xl font-bold ${sem === "S1" ? "text-sky-300" : "text-gold-300"}`}>
                  SEMESTRE {sem === "S1" ? "1" : "2"}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                <span className="font-mono text-xs text-white/40">{subjectsOf(level, sem).length} unités d'enseignement</span>
              </div>
            </Reveal>
            <div className="mt-6 space-y-6">
              {subjectsOf(level, sem).map((s, i) => (
                <Reveal key={s.id} delay={Math.min(i * 0.05, 0.3)}>
                  <SubjectCard id={s.id} level={level} user={user} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}

        <Reveal className="mt-16">
          <div className={`rounded-3xl border p-10 text-center ${isM1 ? "border-sky-400/20 bg-sky-500/5" : "border-gold-500/20 bg-gold-500/5"}`}>
            <h3 className="font-display text-2xl font-bold">Une correction protégée ? C'est simple.</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              Demandez l'accès via le formulaire : votre message part directement sur WhatsApp de l'équipe.
              Après paiement Orange Money, la correction vous est envoyée et débloquée dans votre espace.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Btn href={waLink("Bonjour RÉUSSIR POLYTECH, je souhaite obtenir un accès correction.")} external className="!bg-emerald-600 !bg-none hover:!bg-emerald-500 !text-white !border-emerald-400/40">
                <WhatsAppIcon /> Contacter l'équipe
              </Btn>
              <Btn href="/study" variant="ghost">Ouvrir l'espace étude</Btn>
            </div>
          </div>
        </Reveal>

        <p className="mt-10 text-center font-mono text-[11px] text-white/30">
          <Link href="/vip" className="transition hover:text-gold-300">Découvrez aussi les formations VIP →</Link>
        </p>
      </div>
    </main>
  );
}
