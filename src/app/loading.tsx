/** Écran de chargement de navigation — 100 % CSS, zéro JavaScript. */
export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-400" />
        <span className="absolute inset-2 rounded-full border border-white/10" />
        <img src="/logo.png" alt="" width={64} height={64} decoding="async" className="logo-glow h-16 w-16 object-contain" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest2 text-white/45">Chargement de l'espace…</p>
    </main>
  );
}
