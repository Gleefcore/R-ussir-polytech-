'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  Flame,
  Award,
} from 'lucide-react';
import { curriculum, Subject } from '@/data/curriculum';

export function CurriculumCatalogSection() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MSP1_S1' | 'MSP1_S2' | 'MSP2_S1' | 'MSP2_S2'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    return curriculum.filter((subj) => {
      // 1. Filtre par niveau et semestre
      if (selectedFilter === 'MSP1_S1' && !(subj.level === 'MSP1' && subj.semester === 1)) return false;
      if (selectedFilter === 'MSP1_S2' && !(subj.level === 'MSP1' && subj.semester === 2)) return false;
      if (selectedFilter === 'MSP2_S1' && !(subj.level === 'MSP2' && subj.semester === 1)) return false;
      if (selectedFilter === 'MSP2_S2' && !(subj.level === 'MSP2' && subj.semester === 2)) return false;

      // 2. Recherche par mot-clé (nom ou code)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = subj.name.toLowerCase().includes(q);
        const matchCode = subj.code.toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }

      return true;
    });
  }, [selectedFilter, searchQuery]);

  // Compteurs pour chaque catégorie
  const counts = useMemo(() => {
    return {
      all: curriculum.length,
      msp1_s1: curriculum.filter((s) => s.level === 'MSP1' && s.semester === 1).length,
      msp1_s2: curriculum.filter((s) => s.level === 'MSP1' && s.semester === 2).length,
      msp2_s1: curriculum.filter((s) => s.level === 'MSP2' && s.semester === 1).length,
      msp2_s2: curriculum.filter((s) => s.level === 'MSP2' && s.semester === 2).length,
    };
  }, []);

  return (
    <section id="catalogue-matieres" className="py-16 sm:py-24 bg-[#070E1B] text-white relative overflow-hidden">
      {/* Halos d'ambiance */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EN-TÊTE DU CATALOGUE */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs font-bold uppercase tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Académique Complet</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight mb-3">
            Toutes les Matières de l&apos;Application
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Retrouvez en un coup d&apos;œil l&apos;ensemble des Unités d&apos;Enseignement officielles de <strong>MSP 1</strong> et <strong>MSP 2</strong> avec leurs polycopiés, fiches de TD et annales d&apos;examens.
          </p>
        </div>

        {/* BARRE DE RECHERCHE RAPIDE */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une matière (ex: Analyse, Algèbre, Électromagnétisme, MTH111...)"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-[#D4AF37] text-white text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none shadow-lg transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-slate-400 hover:text-white font-bold"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* ONGLETS DE FILTRAGE DES PROMOTIONS & SEMESTRES */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black scale-105'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            Toutes les Matières ({counts.all})
          </button>

          <button
            onClick={() => setSelectedFilter('MSP1_S1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'MSP1_S1'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black scale-105'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            MSP 1 • Semestre 1 ({counts.msp1_s1})
          </button>

          <button
            onClick={() => setSelectedFilter('MSP1_S2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'MSP1_S2'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black scale-105'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            MSP 1 • Semestre 2 ({counts.msp1_s2})
          </button>

          <button
            onClick={() => setSelectedFilter('MSP2_S1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'MSP2_S1'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black scale-105'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            MSP 2 • Semestre 1 ({counts.msp2_s1})
          </button>

          <button
            onClick={() => setSelectedFilter('MSP2_S2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'MSP2_S2'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md font-black scale-105'
                : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            MSP 2 • Semestre 2 ({counts.msp2_s2})
          </button>
        </div>

        {/* GRILLE DES MATIÈRES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSubjects.map((subject) => {
            const hasCourse = subject.resources.some((r) => r.type === 'COURS' && (r.url || (r.items && r.items.length > 0)));
            const hasExam = subject.resources.some((r) => r.type === 'EXAMEN' && (r.url || (r.items && r.items.length > 0)));
            const hasTd = subject.resources.some((r) => r.type === 'TD' && (r.url || (r.items && r.items.length > 0)));
            const targetUrl = `/${subject.level.toLowerCase()}?q=${encodeURIComponent(subject.name)}`;

            return (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800/90 hover:border-[#D4AF37]/60 shadow-lg hover:shadow-xl hover:shadow-black/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* BADGES HAUT */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                      {subject.code}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        {subject.level}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        Semestre {subject.semester}
                      </span>
                    </div>
                  </div>

                  {/* NOM DE LA MATIÈRE */}
                  <h3 className="text-base font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-2 font-heading">
                    {subject.name}
                  </h3>

                  {/* INDICATEURS DE CONTENU DISPONIBLE */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      hasCourse
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Polycopié
                    </span>
                    <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      hasExam
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Annales CC
                    </span>
                    <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      hasTd
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Fiches TD
                    </span>
                  </div>
                </div>

                {/* BOUTON D'ACCÈS DIRECT */}
                <Link
                  href={targetUrl}
                  className="mt-2 w-full py-2.5 rounded-xl bg-slate-900/90 group-hover:bg-[#D4AF37] text-slate-300 group-hover:text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-800 group-hover:border-[#D4AF37] shadow-sm"
                >
                  <span>Accéder aux Cours &amp; Annales</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">
              Aucune matière ne correspond à votre recherche &ldquo;{searchQuery}&rdquo;.
            </p>
            <p className="text-xs text-slate-400">
              Vérifiez l&apos;orthographe ou sélectionnez un autre semestre ci-dessus.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
