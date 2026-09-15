'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Target, Star, Eye, ArrowUpRight } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Solidarité',
    tagline: 'L\'Union Sacrée',
    description:
      'La force absolue du collectif au service de chaque ingénieur. Aucune promotion ne progresse en laissant un camarade en arrière.',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    highlight: 'Entraide & Partage',
  },
  {
    icon: Target,
    title: 'Rigueur',
    tagline: 'Le Zéro Défaut',
    description:
      'L\'ingénierie polytechnicienne est un sacerdoce intellectuel. Chaque formule, chaque code, chaque calcul exige une exactitude militaire.',
    iconColor: 'text-[#D4AF37]',
    borderColor: 'border-[#D4AF37]/40',
    bgColor: 'bg-[#D4AF37]/10',
    highlight: 'Discipline de Fer',
  },
  {
    icon: Star,
    title: 'Bienveillance',
    tagline: 'L\'Émulation Positive',
    description:
      'Un écosystème constructif et motivant où chaque questionnement trouve une réponse bienveillante et chaque travail acharné est couronné.',
    iconColor: 'text-sky-600 dark:text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    highlight: 'Croissance Mutuelle',
  },
  {
    icon: Eye,
    title: 'Transparence',
    tagline: 'La Clarté Totale',
    description:
      'Une gouvernance d\'ingénieurs ouverte et intègre. Nos méthodes, nos cours et nos processus décisionnels sont transparents et vérifiables.',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    highlight: 'Honneur & Intégrité',
  },
];

export function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête des Valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[#D4AF37] text-xs font-black font-mono tracking-widest uppercase">
              Chartes d&apos;Éseka 2026
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 font-heading tracking-tight">
            Les 4 Piliers Indestructibles de{' '}
            <span className="text-gold-gradient">l&apos;Excellence</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Fondée le <strong className="text-[#D4AF37]">07 Mai 2026 à Éseka</strong>, notre communauté repose sur une alliance de discipline et de fraternité indéfectible.
          </p>
        </motion.div>

        {/* Grille des 4 Piliers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`glass-card p-7 border ${value.borderColor} group cursor-default shadow-md dark:shadow-none flex flex-col justify-between relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl ${value.bgColor} border ${value.borderColor}`}>
                    <value.icon className={`w-6 h-6 ${value.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                  {value.tagline}
                </span>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 mb-3 font-heading">
                  {value.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/5">
                <span className="text-xs font-bold text-[#D4AF37]">
                  {value.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
