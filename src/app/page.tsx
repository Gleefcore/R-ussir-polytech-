import Hero, { BridgeSVG, RobotArmSVG } from "@/components/hero";
import StatsBand from "@/components/stats";
import { CircuitBand, Orb } from "@/components/fx-deco";
import { Badge, Btn, Reveal, SectionHead } from "@/components/ui";
import { MISSION, ROADMAP, TESTIMONIALS, VALUES, VISION, WHY } from "@/content";
import { SITE, waLink, subjectsOf } from "@/config";

const VALUE_ICONS = [
  <svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 4 4m0 0a4 4 0 1 1 8 0 4 4 0 0 1-4 4m-4-4v8m-6-4h4m8 0h4" strokeLinecap="round" /></svg>,
  <svg key="r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path d="M3 17 17 3l4 4L7 21l-4-4Zm4-4 2 2m1-5 2 2m1-5 2 2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 5.7-8 11-8 11Z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6"><circle cx="12" cy="12" r="3" /><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /></svg>,
];

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Présentation */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead
              kicker="Qui sommes-nous"
              title={<>Un collectif académique qui transforme l'apprentissage individuel en <span className="gold-text">réussite collective</span>.</>}
            />
            <Reveal delay={.1}>
              <p className="mt-6 leading-relaxed text-white/65">
                {SITE.name} est né d'étudiants ingénieurs de l'{SITE.org} convaincus que la réussite en école
                d'ingénieurs est un sport d'équipe. Nous réunissons fiches de TD, épreuves et corrections des
                unités d'enseignement officielles de MSP1 et MSP2, des séances de travail collectives et des
                formations d'excellence.
              </p>
              <p className="mt-4 leading-relaxed text-white/65">
                L'entraide, la rigueur, la solidarité et le partage des connaissances ne sont pas des slogans :
                ce sont nos méthodes de travail, portées par des ambassadeurs de promo et des leaders de cadets.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge tone="gold">Excellence académique</Badge>
                <Badge tone="blue">Innovation technologique</Badge>
                <Badge tone="white">Esprit ingénieur</Badge>
                <Badge tone="white">Collaboration</Badge>
                <Badge tone="gold">Ambition</Badge>
              </div>
            </Reveal>
          </div>
          <Reveal delay={.2} className="relative">
            <div className="glass relative overflow-hidden p-8 shadow-card">
              <div className="grid-bg absolute inset-0 opacity-60" />
              <RobotArmSVG className="relative w-full" />
              <p className="relative mt-4 text-center font-mono text-[11px] uppercase tracking-widest2 text-white/45">
                Nos bras robotiques préférés tracent le plan : celui de votre réussite
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full p-9 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
              <p className="kicker">Notre mission</p>
              <p className="mt-4 font-display text-xl font-bold leading-relaxed text-white/85">{MISSION}</p>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <div className="glass h-full p-9 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
              <p className="kicker">Notre vision</p>
              <p className="mt-4 font-display text-xl font-bold leading-relaxed text-white/85">{VISION}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <SectionHead center kicker="Ce qui nous tient debout" title={<>Quatre valeurs, <span className="gold-text">une famille</span></>} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="glass group h-full p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
                <div className="mx-auto mb-5 inline-flex rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-gold-400 transition group-hover:scale-110">
                  {VALUE_ICONS[i]}
                </div>
                <h3 className="font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pourquoi rejoindre */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <SectionHead
          center
          kicker="Pourquoi rejoindre RÉUSSIR POLYTECH ?"
          title={<>Parce que seul on va plus vite, <span className="gold-text">ensemble on va plus loin</span>.</>}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.1}>
              <div className="glass group relative h-full overflow-hidden p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                <span className="font-mono text-4xl font-bold text-white/10 transition group-hover:text-gold-500/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{w.text}</p>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-8">
        <Reveal><StatsBand /></Reveal>
      </section>

      {/* Programmes officiels */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <SectionHead
          center
          kicker="Espace académique"
          title={<>Les programmes officiels, <span className="gold-text">semestre par semestre</span>.</>}
          sub="Pour chaque unité d'enseignement : fiches de TD, épreuves / examens et corrections, téléchargeables séparément."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {(["S1", "S2"] as const).map((sem, i) => (
            <Reveal key={sem} delay={i * 0.12}>
              <div className="glass h-full p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">MSP1 · Semestre {sem === "S1" ? "1" : "2"}</h3>
                  <Badge tone={sem === "S1" ? "blue" : "gold"}>{subjectsOf("MSP1", sem).length} UE</Badge>
                </div>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {subjectsOf("MSP1", sem).map((s) => (
                    <li key={s.id} className="truncate rounded-xl border border-white/10 bg-night-800/50 px-3.5 py-2.5 text-[13px] font-medium text-white/75">
                      {s.label}
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
              <Badge tone="blue">Niveau 1</Badge>
              <h3 className="mt-4 font-display text-3xl font-bold">Espace MSP1</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Analyse réelle, algèbre, électromagnétisme, mécanique, informatique : les fondations du
                cycle ingénieur, semestre par semestre.
              </p>
              <Btn href="/msp1" variant="outline" className="mt-7">Découvrir MSP1</Btn>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-night-700 via-night-800 to-[#2a1f04] p-10">
              <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] font-extrabold text-gold-500/10">2</span>
              <Badge tone="gold">Niveau 2</Badge>
              <h3 className="mt-4 font-display text-3xl font-bold">Espace MSP2</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Algèbre multilinéaire, séries intégrales, mécanique des solides, analyse numérique :
                le niveau ingénieur, avec corrections détaillées.
              </p>
              <Btn href="/msp2" className="mt-7">Découvrir MSP2</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Entrepreneur + VIP teaser */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass-strong relative h-full overflow-hidden p-10">
              <Orb className="-right-20 -top-20 h-64 w-64 bg-gold-600/20" />
              <p className="kicker">Ressources entrepreneur</p>
              <h3 className="mt-3 font-display text-2xl font-bold">L'ingénieur de demain sera entrepreneur.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Innovation, création de projets, gestion de projet et leadership : un espace startup pour
                transformer vos travaux d'école en ventures réelles.
              </p>
              <Btn href="/entrepreneur" variant="outline" className="mt-6">Visiter l'espace</Btn>
            </div>
          </Reveal>
          <Reveal delay={.12}>
            <div className="glass-strong relative h-full overflow-hidden p-10">
              <Orb className="-left-20 -top-20 h-64 w-64 bg-gold-600/20" />
              <p className="kicker">Section exclusive</p>
              <h3 className="mt-3 font-display text-2xl font-bold"><span className="gold-text">RÉUSSIR POLYTECH VIP</span></h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                IA, programmation, bureautique professionnelle, design, leadership, communication :
                des formations professionnelles pour grandir au-delà du cursus.
              </p>
              <Btn href="/vip" className="mt-6">Découvrir le programme VIP</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Témoignages */}
      <section className="relative overflow-hidden py-24">
        <SectionHead center kicker="Ils nous font confiance" title={<><span className="gold-text">Une communauté</span> qui grandit chaque semestre</>} />
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

      {/* Pont + roadmap */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="glass p-8">
              <BridgeSVG className="w-full" />
              <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest2 text-white/45">
                Le pont de notre logo : relier l'étudiant d'aujourd'hui à l'ingénieur de demain
              </p>
            </div>
          </Reveal>
          <div>
            <SectionHead kicker="Architecture évolutive" title={<>Conçu pour évoluer <span className="gold-text">pendant des années</span></>} sub="Assistant IA étudiant, recherche intelligente, chatbot pédagogique : les prochaines briques sont déjà dessinées." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ROADMAP.map((r, i) => (
                <Reveal key={r.code} delay={i * 0.08}>
                  <div className="glass h-full p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/40">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-white/15">{r.code}</span>
                      <Badge tone="white">À venir</Badge>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold">{r.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/55">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden px-6 pb-28 md:px-8">
        <Reveal className="mx-auto max-w-5xl">
          <div className="glass-strong relative overflow-hidden p-12 text-center md:p-16">
            <div className="grid-bg absolute inset-0 opacity-50" />
            <Orb className="left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 bg-gold-600/15" />
            <CircuitBand className="absolute inset-x-0 bottom-0 h-16 w-full opacity-40" />
            <img src="/logo.png" alt="" className="logo-glow relative mx-auto h-24 w-auto md:h-32" />
            <h3 className="relative mt-6 font-display text-3xl font-bold md:text-4xl">
              Réussir <span className="gold-text">ensemble</span>, dès aujourd'hui.
            </h3>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              Créez votre compte étudiant en moins d'une minute : vos unités d'enseignement, vos demandes
              d'accès et votre progression, réunis dans un seul espace.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Btn href="/register">Créer mon compte étudiant</Btn>
              <Btn href={waLink("Bonjour RÉUSSIR POLYTECH, je souhaite rejoindre le collectif.")} variant="ghost" external>
                Contacter l'équipe sur WhatsApp
              </Btn>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
