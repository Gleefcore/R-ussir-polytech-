'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Activity, Award, ArrowRight, Wrench } from 'lucide-react';

const labCards = [
  {
    title: 'Laboratoire de Robotique & Automatismes',
    subtitle: 'Modélisation 3D de bras articulés, programmation des servomoteurs et acquisition de données en temps réel.',
    image: '/assets/gallery/lab-robotics-1.jpg',
    metric: 'Bancs d\'essai ENSPY',
    badge: 'Robotique Industrielle',
  },
  {
    title: 'Atelier de Conception Technique G-INNOVA',
    subtitle: 'Conception collaborative sur écran tactile géant, analyse cinématique de véhicules et prototypage mécanique.',
    image: '/assets/gallery/cad-engineering-2.jpg',
    metric: 'CAO & Prototypage',
    badge: 'Bureau d\'Études',
  },
  {
    title: 'Session d\'Ingénierie & Codage Collaboratif',
    subtitle: 'Postes de calcul intensif, optimisation algorithmique sous Python et validation expérimentale sur oscilloscopes.',
    image: '/assets/gallery/lab-collaboration-3.jpg',
    metric: 'Data Science & IA',
    badge: 'Calcul Numérique',
  },
];

export function LabShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-500/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-500 dark:text-sky-300 text-xs font-black tracking-widest uppercase font-mono">
              Infrastructures & Pratique
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 font-heading tracking-tight">
            Au Cœur des Ateliers et{' '}
            <span className="text-gold-gradient">Laboratoires de Pointe</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            L\'apprentissage à Réussir Polytech allie une solide rigueur théorique à une immersion concrète
            dans les technologies de pointe : modélisation 3D, bancs d\'essais et calcul haute performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {labCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl group flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-mono font-black uppercase px-3 py-1 rounded-full bg-slate-900/80 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-md">
                    {card.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {card.metric}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-[#D4AF37] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {card.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono">
                    Session Pratique
                  </span>
                  <Link
                    href="/msp1"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:underline"
                  >
                    <span>Voir les TP & Projets</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
