import Hero, { BridgeSVG } from "@/components/hero";
import StatsBand from "@/components/stats";
import { CircuitBand, Orb } from "@/components/fx-deco";
import { Badge, Btn, Reveal, SectionHead, SubjectIcon } from "@/components/ui";
import { ROADMAP, TESTIMONIALS } from "@/content";
import { SITE, waLink, subjectsOf } from "@/config";

const PILLARS = [
  {
    title: "Notre mission",
    text: "Accompagner chaque étudiant de l'ENSPY vers la réussite académique : ressources vérifiées, corrigés rédigés par le collectif, méthode de travail et soutien continu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Notre vision",
    text: "Devenir la référence numérique des écoles d'ingénieurs : une académie vivante, évolutive, capable d'intégrer demain l'IA, l'analyse de performances et la recherche intelligente.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Pourquoi nous existons",
    text: "Parce qu'un étudiant ingénieur ne devrait jamais chercher seul un corrigé fiable à 23h. Nous mutualisons l'intelligence du collectif pour élever toute la promotion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Manifeste */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead
              kicker="Notre histoire"
              title={<>Une plateforme créée par des ingénieurs, <span className="gold-text">pour les futurs ingénieurs</span>.</>}
            />
            <Reveal delay={.1}>
              <p className="mt-6 leading-relaxed text-white/65">
                {SITE.name} est née d'un collectif d'étudiants ingénieurs de l'{SITE.org} convaincus d'une chose :
                la réussite en école d'ingénieurs est un sport d'équipe. Nous réunissons cours complets, travaux
                dirigés corrigés, anciens sujets d'évaluation et méthodes de révision dans une bibliothèque
                numérique intelligente, organisée par matière et par niveau (MSP1, MSP2).
              </p>
              <p className="mt-4 leading-relaxed text-white/65">
                Au-delà des études, nous cultivons l'esprit entrepreneurial : projets étudiants, conseils de
                création d'entreprise et opportunités d'innovation font partie intégrante du parcours.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge tone="gold">Excellence académique</Badge>
                <Badge tone="blue">Rigueur d'ingénieur</Badge>
                <Badge tone="white">Esprit startup</Badge>
              </div>
            </Reveal>
          </div>
          <Reveal delay={.2} className="relative">
            <div className="glass relative overflow-hidden p-8 shadow-card">
              <div className="grid-bg absolute inset-0 opacity-60" />
              <BridgeSVG className="relative w-full" />
              <p className="relative mt-4 text-center font-mono text-[11px] uppercase tracking-widest2 text-white/45">
                Le pont : symbole de notre logo — relier l'étudiant d'aujourd'hui à l'ingénieur de demain
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Piliers */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <div className="glass group h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
                <div className="mb-5 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-400 transition group-hover:scale-110">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
        <Reveal><StatsBand /></Reveal>
      </section>

      {/* Programme officiel */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <SectionHead
          center
          kicker="Espace académique"
          title={<>Le programme officiel MSP1, <span className="gold-text">semestre par semestre</span>.</>}
          sub="Chaque matière officielle du niveau 1 dispose de ses cours, TD, exercices, TP et examens — gratuits ou premium, vérifiés par le collectif."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {(["S1", "S2"] as const).map((sem, i) => (
            <Reveal key={sem} delay={i * 0.12}>
              <div className="glass h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">Semestre {sem === "S1" ? "1" : "2"}</h3>
                  <Badge tone={sem === "S1" ? "blue" : "gold"}>{subjectsOf("MSP1", sem).length} matières</Badge>
                </div>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {subjectsOf("MSP1", sem).map((s) => (
                    <li key={s.id} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-night-800/50 px-3.5 py-2.5 text-[13px] font-medium text-white/75">
                      <SubjectIcon subject={s.cat} className="h-4 w-4 shrink-0 text-gold-400" />
                      <span className="truncate">{s.label}</span>
                    </li>
                  ))}
                </ul>
                <Btn href="/msp1" variant={sem === "S1" ? "outline" : "gold"} className="mt-7">
                  Voir les ressources du semestre {sem === "S1" ? "1" : "2"} →
                </Btn>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MSP split */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-night-700 to-night-900 p-10">
              <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] font-extrabold text-sky-400/10">1</span>
              <Badge tone="blue">Première année</Badge>
              <h3 className="mt-4 font-display text-3xl font-bold">Espace MSP1</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Les fondations : analyse, algèbre, mécanique, électricité, algorithmique et programmation C.
                Tout le programme, structuré chapitre par chapitre.
              </p>
              <Btn href="/msp1" variant="outline" className="mt-7">Découvrir MSP1</Btn>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-night-700 via-night-800 to-[#2a1f04] p-10">
              <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] font-extrabold text-gold-500/10">2</span>
              <Badge tone="gold">Deuxième année</Badge>
              <h3 className="mt-4 font-display text-3xl font-bold">Espace MSP2</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Le niveau supérieur : analyse complexe, thermodynamique, POO C++, bases de données et
                préparation intensive aux évaluations.
              </p>
              <Btn href="/msp2" className="mt-7">Découvrir MSP2</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Entrepreneur teaser */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <Reveal>
          <div className="glass-strong relative overflow-hidden p-10 md:p-14">
            <Orb className="-right-20 -top-20 h-72 w-72 bg-gold-600/20" />
            <CircuitBand className="absolute inset-x-0 bottom-0 h-16 w-full opacity-40" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="kicker">Espace étudiant entrepreneur</p>
                <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  L'ingénieur de demain sera <span className="gold-text">entrepreneur</span>.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                  Projets étudiants, innovation, création d'entreprise, mentorat et opportunités :
                  un espace startup pour transformer vos travaux d'école en ventures réelles.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Btn href="/entrepreneur">Visiter l'espace startup</Btn>
                <Btn href={waLink("Bonjour, je souhaite présenter mon projet étudiant à RÉUSSIR POLYTECH.")} variant="ghost" external>
                  Présenter mon projet
                </Btn>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Témoignages */}
      <section className="relative overflow-hidden py-24">
        <SectionHead center kicker="Ils nous font confiance" title={<><span className="gold-text">350+ étudiants</span> déjà accompagnés</>} />
        <div className="marquee relative mt-12">
          <div className="marquee-track flex w-max gap-6 px-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <figure key={i} className="glass w-[340px] shrink-0 p-7">
                <div className="flex gap-1 text-gold-400">{"★★★★★"}</div>
                <blockquote className="mt-4 text-sm leading-relaxed text-white/70">« {t.text} »</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-grad font-display text-sm font-bold text-night-950">
                    {t.name.slice(0, 1)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block font-mono text-[11px] text-white/45">{t.level}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night-950 to-transparent" />
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <SectionHead center kicker="Architecture évolutive" title={<>Conçu pour évoluer <span className="gold-text">pendant des années</span></>} sub="La plateforme est pensée comme une infrastructure : chaque brique future s'ajoutera sans rien casser." />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.code} delay={i * 0.1}>
              <div className="glass group h-full p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-white/15 transition group-hover:text-gold-500/40">{r.code}</span>
                  <Badge tone="white">À venir</Badge>
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">{r.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden px-6 pb-28 md:px-8">
        <Reveal className="mx-auto max-w-5xl">
          <div className="glass-strong relative overflow-hidden p-12 text-center md:p-16">
            <div className="grid-bg absolute inset-0 opacity-50" />
            <Orb className="left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 bg-gold-600/15" />
            <img src="/logo.png" alt="" className="logo-glow relative mx-auto h-24 w-auto md:h-32" />
            <h3 className="relative mt-6 font-display text-3xl font-bold md:text-4xl">
              Prêt à rejoindre <span className="gold-text">l'excellence</span> ?
            </h3>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              Créez votre compte étudiant en moins d'une minute et accédez immédiatement à la bibliothèque,
              à votre espace personnel et au suivi de vos demandes.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Btn href="/register">Créer mon compte étudiant</Btn>
              <Btn href="/login" variant="ghost">J'ai déjà un compte</Btn>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
