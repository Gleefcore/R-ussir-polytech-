import { ADVICE, OPPORTUNITIES, PROJECTS } from "@/content";
import { Badge, Btn, Reveal, SectionHead, WhatsAppIcon } from "@/components/ui";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";
import { waLink } from "@/config";

export const metadata = { title: "Espace étudiant entrepreneur" };

export default function EntrepreneurPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className="right-[-12%] top-[6%] h-[460px] w-[460px] bg-gold-600/15" />
      <Orb className="left-[-10%] top-[40%] h-[380px] w-[380px] bg-emerald-600/10" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-3xl">
          <p className="kicker">Espace étudiant entrepreneur</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">
            De la salle de TD à la <span className="shimmer-text">startup</span>.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/60">
            Un ingénieur forme des solutions ; un entrepreneur les fait exister. Cet espace réunit projets
            étudiants, conseils de création d'entreprise, témoignages et opportunités concrètes pour passer
            du prototype au marché.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={waLink("Bonjour, je souhaite présenter mon projet étudiant à RÉUSSIR POLYTECH.")} external className="!bg-emerald-600 !bg-none hover:!bg-emerald-500 !text-white !border-emerald-400/40">
              <WhatsAppIcon /> Présenter mon projet
            </Btn>
            <Btn href="/founders" variant="ghost">Rencontrer les fondateurs</Btn>
          </div>
        </div>

        {/* Projets */}
        <section className="mt-20">
          <SectionHead kicker="Projets étudiants" title="Ils construisent déjà le futur" sub="Une sélection de projets incubés au sein du collectif, du prototype au pilote terrain." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.12}>
                <div className="glass group relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_0_45px_-10px_rgba(52,211,153,.35)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-300">{String(i + 1).padStart(2, "0")}</span>
                    <Badge tone="green">{p.status}</Badge>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{p.tagline}</p>
                  <div className="mt-5 flex gap-2">
                    {p.tags.map((t) => <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/50">{t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Conseils */}
        <section className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHead kicker="Conseils entrepreneuriaux" title="La méthode du collectif" sub="Quatre principes que nous répétons à chaque porteur de projet, du premier rendez-vous jusqu'au pitch." />
          <div className="space-y-5">
            {ADVICE.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <div className="glass flex gap-5 p-6 transition hover:border-gold-500/30">
                  <span className="font-display text-3xl font-extrabold text-gold-500/50">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4 className="font-display text-lg font-bold">{a.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">{a.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Opportunités */}
        <section className="mt-24">
          <SectionHead kicker="Opportunités" title="À saisir ce semestre" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {OPPORTUNITIES.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.08}>
                <div className="glass flex items-center justify-between gap-4 p-6 transition hover:border-gold-500/40">
                  <div>
                    <p className="font-display text-lg font-bold">{o.title}</p>
                    <p className="mt-1 font-mono text-xs text-gold-400">{o.date}</p>
                  </div>
                  <Btn href={waLink(`Bonjour, je suis intéressé par : ${o.title}`)} external variant="outline" className="!px-4 !py-2 text-xs">Candidater</Btn>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Témoignage */}
        <Reveal className="mt-24">
          <figure className="glass-strong relative overflow-hidden p-10 text-center md:p-14">
            <CircuitBand className="absolute inset-x-0 top-0 h-14 w-full opacity-30" flip />
            <blockquote className="relative mx-auto max-w-3xl font-display text-xl font-semibold leading-relaxed text-white/85 md:text-2xl">
              « Mon projet de TP est devenu un pilote terrain dans deux coopératives. Le collectif m'a donné
              la méthode, le réseau et la confiance. »
            </blockquote>
            <figcaption className="relative mt-6 font-mono text-xs uppercase tracking-widest2 text-gold-400">
              Aïcha B. — cofondatrice, pôle entrepreneuriat
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </main>
  );
}
