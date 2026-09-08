import fs from "fs";
import path from "path";
import { TEAM, VALUES } from "@/content";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";
import { Badge, Reveal, SectionHead } from "@/components/ui";

export const metadata = { title: "À propos de nous — L'équipe derrière RÉUSSIR POLYTECH" };

const hasPhoto = (slug: string) =>
  [".jpg", ".jpeg", ".png", ".webp"].some((ext) => fs.existsSync(path.join(process.cwd(), "public", "equipe", slug + ext)));

const initials = (name: string) =>
  name.split(/\s+/).filter((w) => w.length > 2 || /^[A-ZÉÀ]/.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const TIERS: Array<{ id: (typeof TEAM)[number]["tier"]; text: string }> = [
  { id: "Fondateurs & direction", text: "Celles et ceux qui ont fondé le collectif et portent sa stratégie." },
  { id: "Coordination & technique", text: "L'équipe qui fait fonctionner la plateforme, les activités et le matériel." },
  { id: "Ambassadeurs & leaders", text: "Le lien vivant avec chaque promotion et chaque filière." },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className="left-1/2 top-[-10%] h-[420px] w-[680px] -translate-x-1/2 bg-gold-600/12" />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center">
          <p className="kicker">À propos de nous</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">
            L'équipe derrière <span className="gold-text">RÉUSSIR POLYTECH</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60">
            Un collectif d'étudiants ingénieurs de l'École Polytechnique, uni par une conviction :
            l'apprentissage individuel devient réussite collective quand on partage tout — méthodes,
            documents, entraide et ambition.
          </p>
        </div>

        {TIERS.map((tier, ti) => {
          const members = TEAM.filter((m) => m.tier === tier.id);
          if (!members.length) return null;
          return (
            <section key={tier.id} className="mt-16">
              <Reveal>
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-2xl font-bold">{tier.id}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
                <p className="mt-2 text-sm text-white/50">{tier.text}</p>
              </Reveal>
              <div className={`mt-7 grid gap-6 ${ti === 0 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
                {members.map((m, i) => {
                  const photo = hasPhoto(m.slug);
                  return (
                    <Reveal key={m.slug} delay={Math.min(i * 0.07, 0.35)}>
                      <div className="glass group h-full overflow-hidden p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
                        <div className="relative mx-auto h-24 w-24">
                          {photo ? (
                            <img src={`/equipe/${m.slug}.jpg`} alt={`Portrait de ${m.name}`} className="h-24 w-24 rounded-2xl object-cover ring-2 ring-gold-500/40 transition group-hover:ring-gold-400/70" />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-grad font-display text-3xl font-extrabold text-night-950 ring-2 ring-gold-500/40 transition group-hover:ring-gold-400/70">
                              {initials(m.name)}
                            </div>
                          )}
                          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/50 bg-night-900 text-[10px] text-gold-300">✦</span>
                        </div>
                        <h3 className="mt-4 font-display text-lg font-bold leading-tight">{m.name}</h3>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-gold-400">{m.role}</p>
                        <p className="mt-3 text-xs leading-relaxed text-white/55">{m.desc}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-20">
          <SectionHead center kicker="Ce qui nous tient debout" title="Nos valeurs" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="glass h-full p-7 text-center transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40">
                  <Badge tone="gold">{v.title}</Badge>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mt-20">
          <div className="glass-strong p-10 text-center md:p-14">
            <img src="/logo.png" alt="" className="logo-glow mx-auto h-20 w-auto" />
            <h2 className="mt-6 font-display text-2xl font-bold md:text-3xl">Une promesse simple</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              « Tant qu'un étudiant cherchera seul une correction, une épreuve ou une méthode, nous serons là :
              une communauté d'ingénieurs qui prépare les leaders technologiques de demain. »
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
