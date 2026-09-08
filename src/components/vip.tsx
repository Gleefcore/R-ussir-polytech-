"use client";

import { useState } from "react";
import { waLink } from "@/config";
import type { Formation } from "@/lib/types";
import { Badge, Btn, WhatsAppIcon } from "./ui";

function VipCard({ f, index }: { f: Formation; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass group flex h-full flex-col overflow-hidden p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/40 hover:shadow-gold-glow">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-2xl font-bold text-white/15 transition group-hover:text-gold-500/40">{String(index + 1).padStart(2, "0")}</span>
        <Badge tone="gold">VIP</Badge>
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{f.title}</h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-gold-400">Niveau : {f.level}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{f.description}</p>
      <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-night-800/60 px-4 py-3 font-mono text-[11px] leading-relaxed text-white/55">{f.preview}</pre>
      <div className="mt-5">
        {!open ? (
          <Btn onClick={() => setOpen(true)} variant="outline" className="w-full">Demander l'accès →</Btn>
        ) : (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-center">
            <p className="text-sm font-semibold text-white/85">Contactez notre équipe WhatsApp pour obtenir votre accès.</p>
            <p className="mt-1.5 text-xs text-white/50">Paiement Orange Money auprès de l'équipe, puis envoi direct des ressources. Aucun paiement automatique sur ce site.</p>
            <Btn href={waLink(`Bonjour RÉUSSIR POLYTECH 👋\nJe souhaite accéder à la formation VIP : ${f.title} (niveau ${f.level}).\nMerci de m'indiquer la procédure.`)} external className="mt-3 w-full !bg-emerald-600 !bg-none hover:!bg-emerald-500 !text-white !border-emerald-400/40">
              <WhatsAppIcon /> Contacter l'équipe WhatsApp
            </Btn>
            <button onClick={() => setOpen(false)} className="mt-2 text-xs text-white/45 hover:text-white/75">Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VipGrid({ formations }: { formations: Formation[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {formations.map((f, i) => <VipCard key={f.id} f={f} index={i} />)}
    </div>
  );
}
