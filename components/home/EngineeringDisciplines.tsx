'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Cpu,
  Brain,
  Cog,
  Binary,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const disciplines = [
  {
    id: 'meca',
    title: 'Génie Mécanique & Robotique',
    badge: 'Conception CAO 3D & Automatique',
    description:
      'Modélisation sous SolidWorks & CATIA, cinématique des bras articulés, résistance des matériaux (RDM), dynamique des fluides et fabrication assistée par ordinateur.',
    icon: Cog,
    image: '/assets/gallery/lab-robotics-1.jpg',
    tags: ['Bras Manipulateurs', 'Cinématique 3D', 'RDM & Matériaux', 'CATIA / SolidWorks'],
    color: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-500/30 group-hover:border-amber-500/60',
    iconColor: 'text-amber-500',
    stat: '100% Conforme ENSPY',
  },
  {
    id: 'ai-data',
    title: 'Data Science & Intelligence Artificielle',
    badge: 'Calcul Intensif & Algorithmes',
    description:
      'Architecture des réseaux de neurones, machine learning prédictif, analyse vectorielle et traitement des signaux massifs avec Python scientifique et frameworks industriels.',
    icon: Brain,
    image: '/assets/gallery/cad-engineering-2.jpg',
    tags: ['Machine Learning', 'Python / PyTorch', 'Deep Neural Nets', 'Optimisation'],
    color: 'from-sky-500/20 via-blue-500/10 to-transparent',
    border: 'border-sky-500/30 group-hover:border-sky-500/60',
    iconColor: 'text-sky-400',
    stat: 'Calcul Vectoriel',
  },
  {
    id: 'embarque',
    title: 'Systèmes Embarqués & Électronique',
    badge: 'Microcontrôleurs & Bancs de Test',
    description:
      'Conception de cartes électroniques, programmation temps réel en C/C++, bancs de mesure oscilloscopiques, protocoles bus industriels et IoT industriel.',
    icon: Cpu,
    image: '/assets/gallery/lab-collaboration-3.jpg',
    tags: ['STM32 / ARM', 'Oscilloscopes', 'C/C++ Embarqué', 'Bus CAN / I2C'],
    color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/30 group-hover:border-emerald-500/60',
    iconColor: 'text-emerald-400',
    stat: 'Temps Réel & IoT',
  },
  {
    id: 'maths-phys',
    title: 'Mathématiques & Physique de l\'Ingénieur',
    badge: 'Socle Théorique Fondamental',
    description:
      'Calcul différentiel tensoriel, analyse complexe, équations de Maxwell en électromagnétisme, mécanique analytique de Lagrange et calcul numérique matriciel.',
    icon: Binary,
    image: '/assets/gallery/family-leaders-portrait.jpg',
    tags: ['Analyse Réelle', 'Maxwell & Ondes', 'Algèbre Linéaire', 'Mécanique Point'],
    color: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    border: 'border-purple-500/30 group-hover:border-purple-500/60',
    iconColor: 'text-purple-400',
    stat: 'Cours Takou & Bouetou',
  },
];

export function EngineeringDisciplines() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-[#060D1A]/70">
      {/* Lignes de circuit en fond */}
      <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase font-mono">
              Pôles d\'Excellence Technologique
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 font-heading tracking-tight">
            Les Grands Domaines de{' '}
            <span className="text-gold-gradient">l\'Ingénierie Moderne</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            Réussir Polytech arme chaque étudiant pour relever les défis industriels les plus pointus :
            de la robotique intelligente au traitement de données massives.
          </p>
        </motion.div>

        {/* Grille des 4 Pôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {disciplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`glass-card p-6 sm:p-8 border ${item.border} rounded-3xl relative overflow-hidden transition-all duration-300 group shadow-xl flex flex-col justify-between`}
              >
                {/* Background image avec filtre subtil */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>

                {/* Glow gradient */}
                <div
                  className={`absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br ${item.color} blur-3xl pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/10 border border-white/10 shadow-inner">
                      <Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                      {item.stat}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 block">
                    {item.badge}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 font-heading group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/msp1"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:underline"
                  >
                    <span>Explorer les cours</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
