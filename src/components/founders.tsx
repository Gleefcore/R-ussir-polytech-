"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FOUNDERS } from "@/content";

export default function FoundersGrid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid gap-7 md:grid-cols-2">
      {FOUNDERS.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.1 }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          className="glass group relative cursor-pointer overflow-hidden shadow-card transition-colors duration-500 hover:border-gold-500/40"
        >
          <div className="theme-dark-lock relative h-80 overflow-hidden">
            <img
              src={f.img}
              alt={`Portrait de ${f.name}`}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-gold-400">{f.role}</p>
              <h3 className="mt-1 font-display text-2xl font-bold">{f.name}</h3>
              <p className="font-mono text-xs text-white/50">{f.level}</p>
            </div>
            {/* Voile détaillé au survol */}
            <motion.div
              animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 16 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-night-950/92 p-6 backdrop-blur-sm"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-gold-400">Parcours</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">{f.parcours}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-gold-400">Vision</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">{f.vision}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-gold-400">Motivation</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">{f.motivation}</p>
            </motion.div>
          </div>
          <div className="p-6">
            <p className="text-sm italic leading-relaxed text-white/65">« {f.quote} »</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest2 text-white/35">Survolez la photo pour le parcours complet</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
