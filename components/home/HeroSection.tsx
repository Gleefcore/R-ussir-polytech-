'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Users, Award, BookOpen, Star, ChevronRight } from 'lucide-react';

const subjectsMarquee = [
  'MTH111 — Analyse réelle 1',
  'PHY111 — Électromagnétisme 1',
  'INF111 — Informatique & C',
  'MTH123 — Algèbre linéaire',
  'PHY211 — Mécanique des solides',
  'MTH213 — Probabilités & Stats',
  'ELE221 — Circuits électroniques',
  'MTH222 — Analyse numérique',
  'INF221 — Algorithmique avancée',
  'GMC121 — Sciences des matériaux',
];

const pillarsMarquee = [
  '⚡ SOLIDARITÉ POLYTECHNICIENNE',
  '🎯 RIGUEUR ACADÉMIQUE ABSOLUE',
  '💛 BIENVEILLANCE DU COLLECTIF',
  '👁️ TRANSPARENCE TOTALE',
  '🏛️ ACTES D\'ÉSEKA DU 07 MAI 2026',
  '🚀 ÉLITE DE L\'INGÉNIERIE AFRICAINE',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12">
      {/* Background avec gradient bleu nuit profond et or subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F1F5F9] via-[#F8FAFC] to-[#EDF2F7] dark:from-[#081224] dark:via-[#050B14] dark:to-[#02050A] transition-colors duration-500" />

      {/* Grille de circuit technologique */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#38BDF8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0, 24px 24px',
        }}
      />

      {/* Halos de lumière or précieux & cyan technologique */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#D4AF37]/15 via-[#38BDF8]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-[#38BDF8]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contenu Texte Principal */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 text-center lg:text-left pt-6"
          >
            {/* Badge institutionnel d'élite */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#D4AF37]/15 to-[#38BDF8]/15 border border-[#D4AF37]/40 rounded-full px-5 py-2 mb-6 shadow-sm backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] dark:text-[#F3E5AB] text-xs font-black tracking-widest uppercase">
                Plateforme SaaS d&apos;Excellence Académique
              </span>
            </motion.div>

            {/* Grand Titre Majestueux */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] mb-6 font-heading tracking-tight"
            >
              <span className="text-slate-900 dark:text-white">Réussir</span>{' '}
              <span className="text-gold-gradient drop-shadow-sm">Polytech</span>
              <br />
              <span className="text-slate-700 dark:text-slate-200 text-3xl sm:text-5xl lg:text-6xl font-extrabold">
                à tout prix.
              </span>
            </motion.h1>

            {/* Sous-titre à fort impact */}
            <motion.p
              variants={fadeUp}
              className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              Le sanctuaire numérique de l&apos;élève ingénieur. Accédez aux polycopiés intégraux, fiches de TD, archives d&apos;examens officiels et programmes de haute voltige entrepreneuriale.
            </motion.p>

            {/* Statistiques clés en cartes valorisées */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-3 sm:gap-5 mb-10 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { icon: Users, value: '150+', label: 'Membres Actifs', color: 'text-[#D4AF37]' },
                { icon: BookOpen, value: '35+', label: 'Matières Couvertes', color: 'text-sky-500' },
                { icon: Award, value: '10', label: 'Modules VIP Élite', color: 'text-[#D4AF37]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="glass-card p-4 text-center sm:text-left border border-slate-200 dark:border-white/10"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                      {value}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Boutons d'Appel à l'Action */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/auth" className="btn-primary flex items-center justify-center gap-3 group text-base">
                <span>Accéder à la Plateforme</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="/a-propos" className="btn-secondary flex items-center justify-center gap-2 text-base">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span>Découvrir l&apos;Équipe Fondatrice</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Logo Flottant & Rayonnement Visuel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <div className="relative">
              {/* Cercles orbitaux concentriques avec éclats dorés */}
              <div className="absolute -inset-10 rounded-full border border-[#D4AF37]/30 dark:border-[#D4AF37]/20 animate-spin-slow" />
              <div className="absolute -inset-20 rounded-full border border-sky-500/20 dark:border-sky-500/10 pointer-events-none" />

              {/* Conteneur principal du Logo officiel Polytech */}
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-72 h-72 sm:w-88 sm:h-88 glass-card p-10 holographic border-2 border-[#D4AF37]/40 shadow-2xl flex items-center justify-center rounded-3xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.25)',
                }}
              >
                <Image
                  src="/assets/logo-polytech.png"
                  alt="Logo Officiel Réussir Polytech"
                  fill
                  className="object-contain p-6"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BANDEAU DÉFILANT DYNAMIQUE N°1 (Marquee Matières) */}
      <div className="relative w-full overflow-hidden mt-16 py-3.5 bg-slate-900/90 dark:bg-[#070E1C] border-y border-[#D4AF37]/30 text-white backdrop-blur-md">
        <div className="flex w-[200%] animate-marquee">
          {[...subjectsMarquee, ...subjectsMarquee].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-3 px-8 text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-200 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* BANDEAU DÉFILANT DYNAMIQUE N°2 (Marquee Piliers & Fondations) */}
      <div className="relative w-full overflow-hidden py-2.5 bg-gradient-to-r from-[#D4AF37]/20 via-sky-500/15 to-[#D4AF37]/20 border-b border-[#D4AF37]/25">
        <div className="flex w-[200%] animate-marquee-reverse">
          {[...pillarsMarquee, ...pillarsMarquee].map((item, idx) => (
            <span
              key={idx}
              className="flex items-center gap-2 px-10 text-xs font-black tracking-widest uppercase text-slate-800 dark:text-[#F3E5AB] whitespace-nowrap"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
