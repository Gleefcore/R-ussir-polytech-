import LibraryClient from "@/components/library";
import { CircuitBand } from "@/components/fx-deco";
import { getDB } from "@/lib/db";

export const metadata = { title: "Bibliothèque numérique" };

export default function LibraryPage({ searchParams }: { searchParams: { subject?: string; q?: string } }) {
  const db = getDB();
  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-8">
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-14 h-16 w-full opacity-30" />
      <div className="relative">
        <p className="kicker">Espace académique</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl">
          La bibliothèque <span className="gold-text">numérique intelligente</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          Cours complets, travaux dirigés, exercices corrigés, TP et anciens sujets d'évaluation de l'ENSPY.
          Filtrez par matière, niveau et type de document — tout est vérifié par le collectif.
        </p>
      </div>
      <div className="relative mt-10">
        <LibraryClient resources={db.resources} initialSubject={searchParams.subject ?? ""} initialQ={searchParams.q ?? ""} />
      </div>
    </main>
  );
}
