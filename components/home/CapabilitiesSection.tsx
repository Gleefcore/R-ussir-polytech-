'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cog, Binary, Brain, Cpu, ArrowUpRight } from 'lucide-react';

const capabilities = [
  {
    title: "Génie Mécanique & Robotique",
    desc: "Cinématique des mécanismes, dynamique du solide, résistance des matériaux (RDM) et modélisation 3D sous SolidWorks.",
    image: "/assets/gallery/lab-robotics-1.jpg",
    icon: Cog,
    tag: "Atelier Mécanique",
    link: "/msp1",
  },
  {
    title: "Mathématiques de l'Ingénieur",
    desc: "Analyse réelle & complexe, algèbre linéaire matricielle, séries de Fourier, équations différentielles et probabilités.",
    image: "/assets/gallery/cad-engineering-2.jpg",
    icon: Binary,
    tag: "Socle Théorique",
    link: "/msp1",
  },
  {
    title: "Data Science & Intelligence Artificielle",
    desc: "Algorithmique numérique avancée, programmation Python scientifique, réseaux de neurones et calcul haute performance.",
    image: "/assets/gallery/lab-collaboration-3.jpg",
    icon: Brain,
    tag: "Calcul & IA",
    link: "/entrepreneur-vip",
  },
  {
    title: "Génie Électrique & Électronique",
    desc: "Circuits analogiques et numériques, bancs d'oscilloscopes, microcontrôleurs programmables et traitement du signal.",
    image: "/assets/gallery/family-leaders-portrait.jpg",
    icon: Cpu,
    tag: "Systèmes Embarqués",
    link: "/msp1",
  },
];

export function CapabilitiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 bg-slate-50 dark:bg-[#050A14] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION AVEC LIEN 'VOIR TOUT' (Style Forgex) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2 block">
              CURRICULUM & PÔLES TECHNIQUES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Pôles d&apos;Ingénierie & Domaines d&apos;Étude
            </h2>
          </motion.div>

          <Link
            href="/msp1"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Voir Tout le Curriculum</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* GRILLE 4 COLONNES (Style Forgex Capabilities) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Photo cadrée */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md">
                      {cap.tag}
                    </span>
                  </div>

                  <Link
                    href={cap.link}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Contenu */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={cap.link}
                      className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explorer le pôle</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
