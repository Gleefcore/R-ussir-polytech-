'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

const projects = [
  {
    title: "Annales Officielles Concours & MSP1",
    subtitle: "Sessions récentes certifiées avec résolutions intégrales et barèmes officiels.",
    image: "/assets/gallery/cad-engineering-2.jpg",
    tag: "MSP1 Mathématiques & Physique",
    link: "/msp1",
  },
  {
    title: "Recueils de TD & Examens de Synthèse",
    subtitle: "Travaux dirigés approfondis, devoirs surveillés et fiches mémo d'ingénieur.",
    image: "/assets/gallery/lab-collaboration-3.jpg",
    tag: "Banque d'Exercices 2026",
    link: "/msp1",
  },
  {
    title: "Ateliers de Conception CAO G-INNOVA",
    subtitle: "Modélisation 3D assistée, calculs de contraintes et prototypage mécatronique.",
    image: "/assets/gallery/lab-robotics-1.jpg",
    tag: "Génie Mécanique & Robotique",
    link: "/entrepreneur-vip",
  },
];

export function FeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 bg-slate-50 dark:bg-[#050A14] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2 block">
              RESSOURCES PHARES & ARCHIVES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Annales & Documents les Plus Consultés
            </h2>
          </motion.div>

          <Link
            href="/msp1"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explorer toutes les annales</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 GRANDES CARTES (Style Forgex Featured Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                    {proj.tag}
                  </span>
                </div>

                <Link
                  href={proj.link}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {proj.subtitle}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disponible en téléchargement direct</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
