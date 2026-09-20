'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, FileText, Users, ArrowUpRight } from 'lucide-react';

const aboutCards = [
  {
    icon: Target,
    title: "Excellence Académique & Cours",
    desc: "Polycopiés intégraux, fiches de synthèse de formules et démonstrations théoriques validées par les majors.",
    image: "/assets/gallery/lab-robotics-1.jpg",
    badge: "100% Certifié",
    link: "/msp1",
    highlight: "Takou • Bouetou • Remaoun",
  },
  {
    icon: FileText,
    title: "Banque d'Annales & Travaux Dirigés",
    desc: "Archives d'épreuves d'examens, devoirs surveillés et séances de TD corrigées pas à pas pour s'entraîner en conditions réelles.",
    image: "/assets/gallery/lab-collaboration-3.jpg",
    badge: "MSP1 & MSP2",
    link: "/msp1",
    highlight: "500+ Sujets Résolus",
  },
  {
    icon: Users,
    title: "Mentorat & Fraternité Polytech",
    desc: "Encadrement continu par l'équipe des 14 dirigeants pour conseiller, débloquer les difficultés et guider vers le succès.",
    image: "/assets/gallery/family-leaders-portrait.jpg",
    badge: "14 Mentors",
    link: "/a-propos",
    highlight: "Accompagnement Fraternel",
  },
];

export function AboutForgexSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#070E1B] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EN-TÊTE SCINDÉ 2 COLONNES (Style Forgex) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-3 block">
              À PROPOS DU GROUPE RÉUSSIR POLYTECH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
              Une plateforme forgée par des ingénieurs, pour{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 dark:from-blue-400 dark:to-sky-300">
                propulser votre excellence.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              Fondé au cœur de l&apos;École Nationale Supérieure Polytechnique de Yaoundé (ENSPY), le Groupe Réussir Polytech met à la disposition de tout élève-ingénieur une infrastructure complète : polycopiés de cours officiels, annales certifiées, banques de travaux dirigés et accompagnement de haut vol.
            </p>
          </motion.div>
        </div>

        {/* 3 CARTES FORGEX AVEC GRANDES PHOTOS & BOUTONS FLÈCHE ↗ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image haute précision */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Badge en haut */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/85 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                      {card.badge}
                    </span>
                  </div>

                  {/* Bouton flèche flottant en bas à droite de l'image */}
                  <Link
                    href={card.link}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-transform group-hover:scale-110"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Contenu textuel soigné */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    <span>{card.highlight}</span>
                    <Link
                      href={card.link}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Accéder</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
