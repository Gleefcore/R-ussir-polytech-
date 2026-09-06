"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RES_TYPES, SUBJECTS, subjectLabel, typeLabel } from "@/config";
import type { Resource } from "@/lib/types";
import { Badge, SubjectIcon } from "./ui";

export default function LibraryClient({
  resources,
  initialSubject,
  initialQ,
}: {
  resources: Resource[];
  initialSubject: string;
  initialQ: string;
}) {
  const [subject, setSubject] = useState<string>(initialSubject || "all");
  const [level, setLevel] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return resources.filter((r) => {
      if (subject !== "all" && r.subject !== subject) return false;
      if (level !== "all" && r.level !== level) return false;
      if (type !== "all" && r.type !== type) return false;
      if (premiumOnly && !r.premium) return false;
      if (needle) {
        const hay = `${r.title} ${r.description} ${r.tags.join(" ")} ${subjectLabel(r.subject)}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [resources, subject, level, type, premiumOnly, q]);

  return (
    <div>
      {/* Barre de filtres */}
      <div className="glass sticky top-[80px] z-30 space-y-4 p-5 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Recherche rapide : intégrales, SQL, mécanique…"
              className="input !py-2.5 !pl-11"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-night-800/60 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-gold-500/40">
            <input type="checkbox" checked={premiumOnly} onChange={(e) => setPremiumOnly(e.target.checked)} className="accent-gold-500" />
            Premium uniquement
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", label: "Toutes matières" }, ...SUBJECTS].map((s) => (
            <button
              key={s.id}
              onClick={() => setSubject(s.id)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 transition ${
                subject === s.id ? "bg-gold-grad text-night-950" : "border border-white/10 text-white/55 hover:border-gold-500/40 hover:text-gold-300"
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="mx-1 hidden w-px bg-white/10 sm:block" />
          {["all", "MSP1", "MSP2"].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 transition ${
                level === l ? "bg-night-500 text-white" : "border border-white/10 text-white/55 hover:border-white/30"
              }`}
            >
              {l === "all" ? "Tous niveaux" : l}
            </button>
          ))}
          <span className="mx-1 hidden w-px bg-white/10 sm:block" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border border-white/10 bg-night-800 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-white/60 outline-none">
            <option value="all">Tous types</option>
            {RES_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-white/45">
        {filtered.length} ressource{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: Math.min(i * 0.05, 0.4) }}
            whileHover={{ y: -8 }}
          >
            <Link href={`/resource/${r.id}`} className="glass group flex h-full flex-col overflow-hidden p-6 transition-colors duration-500 hover:border-gold-500/40 hover:shadow-gold-glow">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-lg border border-white/10 bg-night-700/60 p-2 text-gold-400 transition group-hover:border-gold-500/40">
                  <SubjectIcon subject={r.subject} className="h-5 w-5" />
                </span>
                <div className="flex flex-wrap justify-end gap-2">
                  <Badge tone="blue">{r.level}</Badge>
                  <Badge tone={r.premium ? "gold" : "green"}>{r.premium ? "★ Premium" : "Gratuit"}</Badge>
                </div>
              </div>
              <h3 className="mt-4 line-clamp-2 font-display text-lg font-bold leading-snug transition group-hover:text-gold-200">{r.title}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">{r.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-widest2 text-white/40">
                  {subjectLabel(r.subject)} · {typeLabel(r.type)}
                </span>
                <span className="text-sm font-semibold text-gold-400 transition group-hover:translate-x-1">Accéder →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass mt-6 p-14 text-center">
          <p className="font-display text-xl font-bold text-white/70">Aucune ressource ne correspond à votre recherche.</p>
          <p className="mt-2 text-sm text-white/45">Essayez d'autres mots-clés, ou contactez l'équipe : nous ajoutons des documents chaque semaine.</p>
        </div>
      )}
    </div>
  );
}
