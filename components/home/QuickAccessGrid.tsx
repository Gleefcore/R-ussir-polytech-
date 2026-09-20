'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, BookOpen, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const portals = [
  {
    title: 'Portail MSP1 (1ère Année)',
    subtitle: 'Tronc Commun Fondamental',
    desc: 'Toutes les matières du Semestre 1 et Semestre 2 : Analyse 1 & 2, Algèbre générale & linéaire, Électromagnétisme 1 & 2, Mécanique du point, Informatique, Chimie et Dessin.',
    badge: '19 Matières Officielles',
    link: '/msp1',
    color: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
    btnText: 'Accéder aux cours de 1ère Année',
    highlights: ['Polycopiés Takou & Bouetou', 'Annales CC 2015-2025', 'Fiches de TD Résolues'],
  },
  {
    title: 'Portail MSP2 (2ème Année)',
    subtitle: 'Cycle Préparatoire Approfondi',
    desc: 'L\'ensemble des modules avancés : Algèbre multilinéaire, Séries intégrales, Probabilités & statistiques, Mécanique des solides, Électrocinétique, Thermodynamique et Statique.',
    badge: '16 Matières Officielles',
    link: '/msp2',
    color: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
    btnText: 'Accéder aux cours de 2ème Année',
    highlights: ['Analyse Espaces Vectoriels', 'Bancs de TP & Mesures', 'Examens de Synthèse'],
  },
  {
    title: 'L\'Ingénieur Entrepreneur (VIP)',
    subtitle: 'Leadership & Compétences Pratiques',
    desc: 'Showroom d\'excellence combinant outils techniques (bureautique avancée, CAO 3D, Python) et vision stratégique (leadership, montage de projets) animés par Bikey Yannick et Eugène Gwet.',
    badge: 'Espace VIP Exclusif',
    link: '/entrepreneur-vip',
    color: 'border-purple-500/30 text-purple-500 bg-purple-500/10',
    btnText: 'Découvrir l\'Espace VIP',
    highlights: ['Mentorat Personnalisé', 'Outils Métiers Pratiques', 'Vision & Stratégie'],
  },
];

export function QuickAccessGrid() {
  return (
    <section className="py-14 bg-slate-50/50 dark:bg-[#040812]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37] block mb-2">
            ORGANISATION DU CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
            Choisissez votre Pôle de Travail
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2">
            La documentation complète est classée par niveau académique pour un accès immédiat sans friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {portals.map((portal) => (
            <motion.div
              key={portal.title}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 sm:p-8 glass-card border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${portal.color}`}>
                    {portal.badge}
                  </span>
                  <Link
                    href={portal.link}
                    className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#D4AF37] hover:text-slate-950 flex items-center justify-center transition-colors text-slate-600 dark:text-slate-300"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 font-heading">
                  {portal.title}
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {portal.subtitle}
                </p>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {portal.desc}
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  {portal.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={portal.link}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#D4AF37] hover:text-slate-950 font-bold text-xs text-center text-slate-800 dark:text-slate-200 transition-colors block border border-slate-200 dark:border-white/10"
              >
                {portal.btnText} →
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
