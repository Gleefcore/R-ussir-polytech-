'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cog, Monitor, Brain, ArrowUpRight } from 'lucide-react';

const featureCards = [
  {
    icon: Cog,
    title: 'Génie Mécanique & Robotique',
    desc: 'Cinématique des mécanismes, modélisation 3D avancée sous SolidWorks et asservissement de bras robotisés.',
    image: '/assets/gallery/lab-robotics-1.jpg',
    badge: 'Atelier Robotique',
    color: 'border-amber-500/30 text-amber-500',
    link: '/msp1',
  },
  {
    icon: Monitor,
    title: 'Conception CAO & Prototypage',
    desc: 'Travail collaboratif sur écrans tactiles interactifs, résistance des matériaux et développement de systèmes innovants.',
    image: '/assets/gallery/cad-engineering-2.jpg',
    badge: 'Bureau d\'Études G-INNOVA',
    color: 'border-sky-500/30 text-sky-400',
    link: '/msp1',
  },
  {
    icon: Brain,
    title: 'Data Science & Intelligence Artificielle',
    desc: 'Modélisation numérique, réseaux de neurones, calcul scientifique intensif sous Python et bancs d\'essais temps réel.',
    image: '/assets/gallery/lab-collaboration-3.jpg',
    badge: 'Calcul & Simulation',
    color: 'border-purple-500/30 text-purple-400',
    link: '/entrepreneur-vip',
  },
];

export function AboutForgexSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split Header Style Forgex */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <span className="text-xs font-mono font-black tracking-widest uppercase text-[#D4AF37] mb-3 block">
              À PROPOS DE RÉUSSIR POLYTECH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
              Nous formons l&apos;élite des ingénieurs qui{' '}
              <span className="text-gold-gradient">bâtiront les industries</span> de demain.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              De la rigueur mathématique fondamentale aux ateliers de fabrication assistée par ordinateur, Réussir Polytech combine entraide fraternelle, ressources d&apos;excellence certifiées et technologies d&apos;ingénierie de pointe.
            </p>
          </motion.div>
        </div>

        {/* 3 Cartes Caractéristiques avec Photos Réelles (Style Forgex) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl group flex flex-col justify-between"
              >
                {/* Image haute résolution cadrée */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md">
                      {card.badge}
                    </span>
                  </div>
                </div>

                {/* Contenu textuel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <Link
                        href={card.link}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-[#D4AF37] hover:text-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-colors text-slate-500 dark:text-slate-300"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-[#D4AF37] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <Link
                      href={card.link}
                      className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <span>Explorer les ressources</span>
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
