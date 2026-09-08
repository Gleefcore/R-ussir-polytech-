import fs from "fs";
import path from "path";
import VipGrid from "@/components/vip";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";
import { Reveal, SectionHead, WhatsAppIcon, Btn } from "@/components/ui";
import { waLink } from "@/config";
import { getDB } from "@/lib/db";

export const metadata = { title: "RÉUSSIR POLYTECH VIP — Formations professionnelles" };

export default function VipPage() {
  const db = getDB();
  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <Orb className="left-1/2 top-[-12%] h-[420px] w-[680px] -translate-x-1/2 bg-gold-600/15" />
      <CircuitBand className="pointer-events-none absolute inset-x-0 top-16 h-16 w-full opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center">
          <p className="kicker">Section exclusive</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            <span className="shimmer-text">RÉUSSIR POLYTECH VIP</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60">
            Des formations professionnelles conçues par le collectif pour grandir au-delà du cursus :
            compétences techniques, leadership et communication d'ingénieur.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Btn href={waLink("Bonjour RÉUSSIR POLYTECH, je souhaite rejoindre le programme VIP.")} external className="!bg-emerald-600 !bg-none hover:!bg-emerald-500 !text-white !border-emerald-400/40">
              <WhatsAppIcon /> Rejoindre le programme VIP
            </Btn>
          </div>
        </div>

        <div className="mt-16">
          <VipGrid formations={db.formations} />
        </div>

        <Reveal className="mt-16">
          <div className="glass-strong p-10 text-center md:p-12">
            <h2 className="font-display text-2xl font-bold">Comment obtenir votre accès ?</h2>
            <ol className="mx-auto mt-6 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
              {[
                { n: "1", t: "Demandez l'accès", d: "Cliquez sur « Demander l'accès » sur la formation choisie." },
                { n: "2", t: "Contactez l'équipe", d: "Votre message part sur WhatsApp ; l'équipe vous répond directement." },
                { n: "3", t: "Orange Money puis envoi", d: "Après paiement auprès de l'équipe, les ressources vous sont envoyées." },
              ].map((s) => (
                <li key={s.n} className="rounded-xl border border-white/10 bg-night-800/50 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-grad font-display font-extrabold text-night-950">{s.n}</span>
                  <p className="mt-3 font-display font-bold">{s.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{s.d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-mono text-xs text-white/40">Aucun paiement automatique n'est effectué sur ce site — tout passe par l'équipe, en toute transparence.</p>
          </div>
        </Reveal>

        <SectionHead
          center
          kicker="Bientôt"
          title="Le programme VIP s'enrichit chaque trimestre"
          sub="Cybersécurité, data science, entrepreneuriat technologique : les prochaines formations sont en préparation par le collectif."
        />
      </div>
    </main>
  );
}
