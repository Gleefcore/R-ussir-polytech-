import Link from "next/link";
import { Badge, Btn, Reveal, SubjectIcon, WhatsAppIcon } from "./ui";
import { CircuitBand, GridBG, Orb } from "./fx-deco";
import { PROGRAM } from "@/content";
import { typeLabel, waLink, subjectsOf, subjectDef } from "@/config";
import { getDB } from "@/lib/db";
import type { Level } from "@/lib/types";

function SubjectResources({ id, level }: { id: string; level: Level }) {
  const db = getDB();
  const def = subjectDef(id);
  const res = db.resources.filter((r) => r.subject === id && r.level === level);
  return (
    <div id={`res-${id}`} className="glass scroll-mt-28 overflow-hidden">
      <div className={`flex items-center gap-3 border-b border-white/10 px-7 py-4 ${level === "MSP1" ? "bg-night-700/40" : "bg-gold-500/5"}`}>
        <SubjectIcon subject={def?.cat ?? "transversal"} className={`h-5 w-5 ${level === "MSP1" ? "text-sky-300" : "text-gold-400"}`} />
        <h3 className="font-display text-lg font-bold">{def?.label ?? id}</h3>
        <span className="ml-auto font-mono text-xs text-white/40">{res.length} document{res.length > 1 ? "s" : ""}</span>
      </div>
      {res.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-5">
          <p className="text-sm text-white/45">Documents en cours de rédaction par le collectif — bientôt disponibles.</p>
          <a href={waLink(`Bonjour, je souhaite contribuer / demander des documents pour la matière : ${def?.label ?? id}`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200">
            <WhatsAppIcon className="h-4 w-4" /> Contribuer ou demander
          </a>
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {res.map((r) => (
            <li key={r.id}>
              <Link href={`/resource/${r.id}`} className="group flex flex-wrap items-center gap-3 px-7 py-4 transition hover:bg-white/[0.03]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/85 transition group-hover:text-gold-200">{r.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest2 text-white/40">{typeLabel(r.type)}</p>
                </div>
                <Badge tone={r.premium ? "gold" : "green"}>{r.premium ? "★ Premium" : "Gratuit"}</Badge>
                <span className="text-gold-400 transition group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MspSpace({ level }: { level: Level }) {
  const isM1 = level === "MSP1";
  const db = getDB();

  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className={isM1 ? "left-[-10%] top-[10%] h-[420px] w-[420px] bg-night-500/40" : "right-[-10%] top-[8%] h-[420px] w-[420px] bg-gold-600/15"} />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        {/* Bandeau */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night-800/50 p-10 md:p-14">
          <span className={`pointer-events-none absolute -right-8 -top-16 font-display text-[11rem] font-extrabold leading-none ${isM1 ? "text-sky-400/10" : "text-gold-500/10"}`}>
            {isM1 ? "M1" : "M2"}
          </span>
          <Badge tone={isM1 ? "blue" : "gold"}>{isM1 ? "Niveau 1 — Première année" : "Niveau 2 — Deuxième année"}</Badge>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
            {isM1 ? (
              <>Espace <span className="blue-text">MSP1</span> : bâtir des fondations inébranlables.</>
            ) : (
              <>Espace <span className="gold-text">MSP2</span> : passer au niveau ingénieur.</>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            {isM1
              ? "Le programme officiel du niveau 1, semestre par semestre : chaque matière officielle avec ses cours, TD, exercices, TP et examens vérifiés par le collectif."
              : "Matières de spécialité, exercices complexes, annales corrigées et préparation intensive aux examens : l'espace de ceux qui visent le diplôme et au-delà."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="/register" variant={isM1 ? "outline" : "gold"}>Créer mon compte</Btn>
            <Btn href={isM1 ? "/msp2" : "/msp1"} variant="ghost">{isM1 ? "Voir MSP2" : "Voir MSP1"}</Btn>
          </div>
        </div>

        {/* Programme officiel */}
        <section className="mt-16">
          <Reveal>
            <p className="kicker">{isM1 ? "Programme officiel — Niveau 1" : "Matières de spécialité"}</p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              {isM1 ? "Semestres 1 & 2, matière par matière" : "Le programme MSP2"}
            </h2>
          </Reveal>

          {isM1 ? (
            <div className="mt-8 space-y-10">
              {(["S1", "S2"] as const).map((sem, si) => (
                <Reveal key={sem} delay={si * 0.08}>
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className={`font-display text-xl font-bold ${sem === "S1" ? "text-sky-300" : "text-gold-300"}`}>
                        SEMESTRE {sem === "S1" ? "1" : "2"}
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {subjectsOf("MSP1", sem).map((s) => {
                        const count = db.resources.filter((r) => r.subject === s.id).length;
                        return (
                          <a key={s.id} href={`#res-${s.id}`} className="glass group flex items-center gap-3 p-4 transition hover:-translate-y-1 hover:border-gold-500/40">
                            <span className="rounded-lg border border-white/10 bg-night-700/60 p-2 text-gold-400 transition group-hover:border-gold-500/40">
                              <SubjectIcon subject={s.cat} className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-white/85">{s.label}</span>
                              <span className="font-mono text-[10px] uppercase tracking-widest2 text-white/40">
                                {count > 0 ? `${count} document${count > 1 ? "s" : ""}` : "à venir"}
                              </span>
                            </span>
                            <span className="text-gold-400 opacity-0 transition group-hover:opacity-100" aria-hidden>↓</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {(["math", "physique", "info"] as const).map((subj, i) => (
                <Reveal key={subj} delay={i * 0.1}>
                  <div className="glass h-full p-7 transition hover:-translate-y-1.5 hover:border-gold-500/40">
                    <div className="inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-2.5 text-gold-400">
                      <SubjectIcon subject={subj} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">
                      {subj === "math" ? "Mathématiques avancées" : subj === "physique" ? "Physique avancée" : "Informatique avancée"}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {PROGRAM.MSP2[subj].map((m) => (
                        <li key={m} className="flex gap-2 text-sm text-white/60"><span className="text-gold-400">▸</span> {m}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Ressources par matière */}
        <section className="mt-16">
          <Reveal>
            <p className="kicker">Ressources {level}</p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              {isM1 ? "Documents officiels, semestre par semestre" : "Documents par matière de spécialité"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Cours → TD → Exercices → TP → Examens : suivez l'ordre du programme, ou piochez selon vos révisions.
            </p>
          </Reveal>

          <div className="mt-8 space-y-6">
            {isM1
              ? (["S1", "S2"] as const).flatMap((sem) => [
                  <div key={`h-${sem}`} className="pt-4">
                    <div className="flex items-center gap-4">
                      <h3 className={`font-display text-lg font-bold ${sem === "S1" ? "text-sky-300" : "text-gold-300"}`}>SEMESTRE {sem === "S1" ? "1" : "2"}</h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                    </div>
                  </div>,
                  ...subjectsOf("MSP1", sem).map((s) => <SubjectResources key={`${sem}-${s.id}`} id={s.id} level="MSP1" />),
                ])
              : subjectsOf("MSP2").map((s) => <SubjectResources key={s.id} id={s.id} level="MSP2" />)}
          </div>
        </section>

        {/* CTA */}
        <Reveal className="mt-16">
          <div className={`rounded-3xl border p-10 text-center ${isM1 ? "border-sky-400/20 bg-sky-500/5" : "border-gold-500/20 bg-gold-500/5"}`}>
            <h3 className="font-display text-2xl font-bold">Prêt à travailler avec méthode ?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
              Créez votre compte, choisissez votre niveau {level} et organisez vos révisions dans l'espace étude avec suivi de progression.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Btn href="/register">Créer mon compte</Btn>
              <Btn href="/study" variant="ghost">Ouvrir l'espace étude</Btn>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
