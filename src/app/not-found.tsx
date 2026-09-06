import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest2 text-gold-400">Erreur 404</p>
      <h1 className="mt-4 font-display text-5xl font-bold md:text-7xl">
        Page <span className="gold-text">introuvable</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
        Même nos meilleurs algorithmes de recherche n'ont rien trouvé ici. Revenez vers la bibliothèque ou la page d'accueil.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-xl bg-gold-grad px-6 py-3 text-sm font-bold text-night-950 transition hover:brightness-110">Accueil</Link>
        <Link href="/library" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-gold-500/40">Bibliothèque</Link>
      </div>
    </main>
  );
}
