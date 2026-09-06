import Link from "next/link";
import { Badge, Btn, Reveal, SubjectIcon } from "./ui";
import { CircuitBand, GridBG, Orb } from "./fx-deco";
import { PROGRAM } from "@/content";
import { RES_TYPES, SUBJECTS, typeLabel } from "@/config";
import { getDB } from "@/lib/db";
import type { Level } from "@/lib/types";

export default function MspSpace({ level }: { level: Level }) {
  const db = getDB();
  const isM1 = level === "MSP1";
  const accent = isM1 ? "sky" : "gold";

  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG className={isM1 ? "" : "[mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,black_30%,transparent_100%)]"} />
      <Orb className={isM1 ? "left-[-10%] top-[10%] h-[420px] w-[420px] bg-night-500/40" : "right-[-10%] top-[8%] h-[420px] w-[420px] bg-gold-600/15"} />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        {/* Bandeau */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night-800/50 p-10 md:p-14">
          <span className={`pointer-events-none absolute -right-8 -top-16 font-display text-[11rem] font-extrabold leading-none ${isM1 ? "text-sky-400/10" : "text-gold-500/10"}`}>
            {isM1 ? "M1" : "M2"}
          </span>
          <Badge tone={isM1 ? "blue" : "gold"}>{isM1 ? "Première année — Master Sciences Polytechniques" : "Deuxième année — Master Sciences Polytechniques"}</Badge>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight md:text-5xl">
            {isM1 ? (
              <>Espace <span className="blue-text">MSP1</span> : bâtir des fondations inébranlables.</>
            ) : (
              <>Espace <span className="gold-text">MSP2</span> : passer au niveau ingénieur.</>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            {isM1
              ? "Le programme complet de première année, organisé par matière puis par type de document : cours, TD, exercices, TP et évaluations. Tout pour réussir le premier grand saut."
              : "Matières avancées, exercices complexes, annales corrigées et préparation intensive aux examens : l'espace de ceux qui visent le diplôme et au-delà."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="/library" variant={isM1 ? "outline" : "gold"}>Toutes les ressources {level}</Btn>
            <Btn href={isM1 ? "/msp2" : "/msp1"} variant="ghost">{isM1 ? "Voir MSP2" : "Voir MSP1"}</Btn>
          </div>
        </div>

        {/* Programme */}
        <section className="mt-16">
          <Reveal>
            <p className="kicker">Programme académique officiel</p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Ce que couvre l'année {level}</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SUBJECTS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <div className={`glass h-full p-7 transition hover:-translate-y-1.5 ${isM1 ? "hover:border-sky-400/40" : "hover:border-gold-500/40"}`}>
                  <div className={`inline-flex rounded-xl border p-2.5 ${isM1 ? "border-sky-400/30 bg-sky-400/10 text-sky-300" : "border-gold-500/30 bg-gold-500/10 text-gold-400"}`}>
                    <SubjectIcon subject={s.id} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{s.label}</h3>
                  <ul className="mt-4 space-y-2">
                    {PROGRAM[level][s.id].map((m) => (
                      <li key={m} className="flex gap-2 text-sm text-white/60">
                        <span className={isM1 ? "text-sky-400" : "text-gold-400"}>▸</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ressources organisées */}
        <section className="mt-16">
          <Reveal>
            <p className="kicker">Bibliothèque {level}</p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Cours → TD → Exercices → Évaluations</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">Chaque matière est organisée en parcours : suivez l'ordre, ou piochez selon vos révisions.</p>
          </Reveal>

          <div className="mt-8 space-y-8">
            {SUBJECTS.map((s) => {
              const res = db.resources.filter((r) => r.level === level && r.subject === s.id);
              if (res.length === 0) return null;
              return (
                <Reveal key={s.id}>
                  <div className="glass overflow-hidden">
                    <div className={`flex items-center gap-3 border-b border-white/10 px-7 py-4 ${isM1 ? "bg-sky-500/5" : "bg-gold-500/5"}`}>
                      <SubjectIcon subject={s.id} className={`h-5 w-5 ${isM1 ? "text-sky-300" : "text-gold-400"}`} />
                      <h3 className="font-display text-lg font-bold">{s.label}</h3>
                      <span className="ml-auto font-mono text-xs text-white/40">{res.length} documents</span>
                    </div>
                    <div className="grid gap-0 divide-y divide-white/5 md:grid-cols-1 md:divide-y-0 lg:grid-cols-5 lg:divide-x">
                      {RES_TYPES.map((t) => {
                        const items = res.filter((r) => r.type === t.id);
                        return (
                          <div key={t.id} className="p-5">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest2 text-white/40">{t.label}</p>
                            {items.length === 0 ? (
                              <p className="mt-3 text-xs text-white/25">—</p>
                            ) : (
                              <ul className="mt-3 space-y-2.5">
                                {items.map((r) => (
                                  <li key={r.id}>
                                    <Link href={`/resource/${r.id}`} className="group block">
                                      <p className="line-clamp-3 text-[13px] font-medium leading-snug text-white/75 transition group-hover:text-gold-200">{r.title}</p>
                                      <span className={`mt-1 inline-block font-mono text-[10px] ${r.premium ? "text-gold-400" : "text-emerald-400"}`}>{r.premium ? "★ premium" : "gratuit"}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <Reveal className="mt-16">
          <div className={`rounded-3xl border p-10 text-center ${accent === "sky" ? "border-sky-400/20 bg-sky-500/5" : "border-gold-500/20 bg-gold-500/5"}`}>
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
