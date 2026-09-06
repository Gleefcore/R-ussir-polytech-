import FoundersGrid from "@/components/founders";
import { Btn, Reveal, SectionHead } from "@/components/ui";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";

export const metadata = { title: "Les fondateurs" };

export default function FoundersPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className="left-1/2 top-[-10%] h-[420px] w-[680px] -translate-x-1/2 bg-gold-600/12" />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <div className="text-center">
          <p className="kicker">Espace fondateurs</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">
            Quatre étudiants ingénieurs, <span className="gold-text">une obsession</span> : votre réussite.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60">
            RÉUSSIR POLYTECH n'est pas une entreprise anonyme : c'est un collectif d'étudiants de l'ENSPY qui
            consacrent leurs nuits à rédiger des corrigés, construire cette plateforme et accompagner leurs
            camarades. Voici celles et ceux qui portent le projet.
          </p>
        </div>

        <div className="mt-16">
          <FoundersGrid />
        </div>

        <Reveal className="mt-20">
          <div className="glass-strong p-10 text-center md:p-14">
            <img src="/logo.png" alt="" className="logo-glow mx-auto h-20 w-auto" />
            <h2 className="mt-6 font-display text-2xl font-bold md:text-3xl">Leur promesse</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              « Tant qu'un seul étudiant de l'ENSPY cherchera un corrigé fiable sans le trouver, nous
              continuerons à écrire, à coder et à accompagner. La plateforme évolue, la promesse reste. »
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn href="/register">Rejoindre l'aventure</Btn>
              <Btn href="/library" variant="ghost">Voir le résultat : la bibliothèque</Btn>
            </div>
          </div>
        </Reveal>

        <SectionHead
          center
          kicker="Gouvernance"
          title="Un collectif, pas un comité"
          sub="Chaque pôle — pédagogie, technique, entrepreneuriat — est piloté par un étudiant élu par les promotions, pour rester au plus près des besoins réels."
        />
      </div>
    </main>
  );
}
