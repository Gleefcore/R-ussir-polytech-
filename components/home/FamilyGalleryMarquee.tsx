'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Camera, Heart, Users, Sparkles } from 'lucide-react';

const familyPhotos = [
  {
    image: '/assets/gallery/family-leaders-portrait.jpg',
    title: 'Directoire Fondateur',
    caption: 'Les leaders et mentors de Réussir Polytech en tenue officielle',
    tag: 'Direction Polytech',
    isLarge: true,
  },
  {
    image: '/assets/gallery/lab-robotics-1.jpg',
    title: 'Laboratoire de Robotique & CAO',
    caption: 'Étudiants en pleine simulation de bras robotique et modélisation 3D',
    tag: 'Génie Mécanique',
    isLarge: true,
  },
  {
    image: '/assets/gallery/cad-engineering-2.jpg',
    title: 'Atelier Collaboratif G-INNOVA',
    caption: 'Conception technique sur table tactile & prototypage 3D',
    tag: 'Innovation & Projets',
    isLarge: true,
  },
  {
    image: '/assets/gallery/lab-collaboration-3.jpg',
    title: 'Session Numérique & IA',
    caption: 'Codage collaboratif et bancs de mesure oscilloscopiques',
    tag: 'Data Science & IA',
    isLarge: true,
  },
  {
    image: '/assets/team/eugene-gwet.jpg',
    title: 'GWET BI YAP EUGENE SAMUEL',
    caption: 'Cofondateur & PCA',
    tag: 'N°1 • PCA',
    isLarge: false,
  },
  {
    image: '/assets/team/stevia-matho.jpg',
    title: 'MATHO KOUGOUE RE STEVA',
    caption: 'Cofondatrice & PDG',
    tag: 'N°2 • PDG',
    isLarge: false,
  },
  {
    image: '/assets/team/alex-ngoua.jpg',
    title: 'NGOUA EDOU ALEX',
    caption: 'Secrétaire Général',
    tag: 'N°3 • SG',
    isLarge: false,
  },
  {
    image: '/assets/team/christian-khouya.jpg',
    title: 'KOUYA CHRISTIAN LANDRY',
    caption: 'Cofondateur & Trésorier',
    tag: 'N°4 • Trésorier',
    isLarge: false,
  },
  {
    image: '/assets/team/bikey-yannick.jpg',
    title: 'BIKEI MBOCK PIERRE YANNICK',
    caption: 'Directeur Informatique (DIO)',
    tag: 'N°5 • DIO',
    isLarge: false,
  },
  {
    image: '/assets/team/sarah-ondoua.jpg',
    title: 'ONDOUA ELLA SARA',
    caption: 'Cofondatrice',
    tag: 'N°6 • Fondatrice',
    isLarge: false,
  },
  {
    image: '/assets/team/loice-tadontsa.jpg',
    title: 'TADONTSA JEUGO LOÏCE GRACIELLE',
    caption: 'Censeur',
    tag: 'N°7 • Censeur',
    isLarge: false,
  },
  {
    image: '/assets/team/rose-mbog.jpg',
    title: 'MBOG ROSE EMMANUELLA',
    caption: 'Directrice Informatique Adjointe',
    tag: 'N°8 • DIA',
    isLarge: false,
  },
  {
    image: '/assets/team/owona-amara.jpg',
    title: 'OWONA AMARA MICHELLE ARMELLE',
    caption: 'Secrétaire Générale Adjointe',
    tag: 'N°9 • SGA',
    isLarge: false,
  },
  {
    image: '/assets/team/emmanuella-amour.jpg',
    title: 'NGUEDE TSIMI EMMANUELLA AMOUR',
    caption: 'Ambassadrice N°1',
    tag: 'N°10 • Ambassadrice',
    isLarge: false,
  },
  {
    image: '/assets/team/atyame-yolande.jpg',
    title: 'ATYAME BISSO JACKIE YOLANDE HORNELLA',
    caption: 'Ambassadrice N°2',
    tag: 'N°11 • Ambassadrice',
    isLarge: false,
  },
  {
    image: '/assets/team/franck.jpg',
    title: 'ETOBE FRANCK LOÏC ISAAC',
    caption: 'Communication & Assistant SG',
    tag: 'N°12 • Communication',
    isLarge: false,
  },
  {
    image: '/assets/team/pacha.jpg',
    title: 'BAYI ASSOGOLO STÉPHANE GAEL (PACHA)',
    caption: 'Leader des cadets MSP1',
    tag: 'N°13 • Leader Cadets',
    isLarge: false,
  },
  {
    image: '/assets/team/nkembe-roosevelt.jpg',
    title: 'NKEMBÉ ROOSEVELT',
    caption: 'Leader des cadets techniciens',
    tag: 'N°14 • Cadets Tech',
    isLarge: false,
  },
];

export function FamilyGalleryMarquee() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-[#070E1B] border-t border-slate-200 dark:border-slate-800 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase font-mono">
              Galerie & Esprit Polytech
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 font-heading tracking-tight">
            Les Photos de <span className="text-gold-gradient">Famille Polytech</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            De la rigueur des laboratoires aux séances de travail fraternelles : découvrez l\'énergie humaine
            qui forge l\'excellence de notre communauté au quotidien.
          </p>
        </motion.div>
      </div>

      {/* DÉFILEMENT CONTINU DE GAUCHE VERS LA DROITE (marquee-reverse) */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white dark:from-[#070E1B] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white dark:from-[#070E1B] to-transparent z-20 pointer-events-none" />

        {/* Marquee Track: anime de gauche vers la droite */}
        <div className="flex gap-6 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...familyPhotos, ...familyPhotos].map((item, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 ${
                item.isLarge ? 'w-80 sm:w-[420px] h-64 sm:h-72' : 'w-56 sm:w-64 h-64 sm:h-72'
              } rounded-3xl overflow-hidden glass-card border border-slate-300 dark:border-white/10 group/card shadow-lg hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300`}
            >
              {/* Photo */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Tag en haut */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md">
                  {item.tag}
                </span>
              </div>

              {/* Contenu textuel en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                <h4 className="text-white font-bold text-sm sm:text-base font-heading mb-1 line-clamp-1 group-hover/card:text-[#D4AF37] transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
