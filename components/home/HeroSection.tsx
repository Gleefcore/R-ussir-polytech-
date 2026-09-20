'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Zap,
  Users,
  Award,
  BookOpen,
  Star,
  Cpu,
  Brain,
  Cog,
  Binary,
} from 'lucide-react';

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
  '🤖 ROBOTIQUE & MÉCANIQUE AVANCÉE',
  '🧠 DATA SCIENCE & INTELLIGENCE ARTIFICIELLE',
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
            {/* Slogan officiel visible dans les labos */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#D4AF37]/15 to-[#38BDF8]/15 border border-[#D4AF37]/40 rounded-full px-5 py-2 mb-6 shadow-sm backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] dark:text-[#F3E5AB] text-xs font-black tracking-widest uppercase font-mono">
                INNOVER • APPRENDRE • CONSTRUIRE DEMAIN
              </span>
            </motion.div>

            {/* Grand Titre Majestueux axé Ingénierie */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] mb-6 font-heading tracking-tight"
            >
              <span className="text-slate-900 dark:text-white">L&apos;Excellence</span>{' '}
              <span className="text-gold-gradient drop-shadow-sm">Polytechnicienne</span>
              <br />
              <span className="text-slate-700 dark:text-slate-200 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                au Cœur du Génie Moderne.
              </span>
            </motion.h1>

            {/* Sous-titre valorisant Mécanique, Data Science & IA */}
            <motion.p
              variants={fadeUp}
              className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              Le sanctuaire académique des élèves ingénieurs : <strong className="text-slate-900 dark:text-white font-bold">Génie Mécanique, Data Science, Intelligence Artificielle & Systèmes Embarqués</strong>. Polycopiés intégraux, annales certifiées, banques de travaux dirigés et accélérateur de projets techniques.
            </motion.p>

            {/* Badges des filières clés */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
              {[
                { label: 'Génie Mécanique & CAO', icon: Cog, color: 'text-amber-500' },
                { label: 'Data Science & IA', icon: Brain, color: 'text-sky-400' },
                { label: 'Électronique & Embarqué', icon: Cpu, color: 'text-emerald-400' },
                { label: 'Maths & Physique', icon: Binary, color: 'text-purple-400' },
              ].map((pill) => {
                const PillIcon = pill.icon;
                return (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm"
                  >
                    <PillIcon className={`w-3.5 h-3.5 ${pill.color}`} />
                    {pill.label}
                  </span>
                );
              })}
            </motion.div>

            {/* Statistiques clés en cartes valorisées */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-lg mx-auto lg:mx-0"
            >
              {[
                { icon: Users, value: '14', label: 'Mentors & Dirigeants', color: 'text-[#D4AF37]' },
                { icon: BookOpen, value: '35+', label: 'Matières Couvertes', color: 'text-sky-500' },
                { icon: Award, value: '100%', label: 'Archives Certifiées', color: 'text-[#D4AF37]' },
              ].map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="glass-card p-3.5 sm:p-4 text-center sm:text-left border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                      {value}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
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
              <Link href="/msp1" className="btn-primary flex items-center justify-center gap-3 group text-base">
                <span>Accéder au Curriculum MSP1 & MSP2</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="/entrepreneur-vip" className="btn-secondary flex items-center justify-center gap-2 text-base">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span>Coin de l&apos;Ingénieur VIP</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Nouveau Logo Circulaire 3D Officiel & Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="relative">
              {/* Cercles orbitaux concentriques avec éclats dorés */}
              <div className="absolute -inset-10 rounded-full border border-[#D4AF37]/30 dark:border-[#D4AF37]/20 animate-spin-slow pointer-events-none" />
              <div className="absolute -inset-20 rounded-full border border-sky-500/20 dark:border-sky-500/10 pointer-events-none" />

              {/* Emblème circulaire officiel 3D */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-[#0284C7] via-[#D4AF37] to-[#0284C7] shadow-2xl flex items-center justify-center overflow-hidden group cursor-pointer"
                style={{
                  boxShadow: '0 25px 60px -15px rgba(2, 132, 199, 0.4), 0 0 50px rgba(212, 175, 55, 0.3)',
                }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#081224] p-3 flex items-center justify-center">
                  <Image
                    src="/assets/logo-official-3d.jpg"
                    alt="Emblème Officiel Réussir Polytech 3D"
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Carte de prévisualisation laboratoire en direct sous le logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 glass-card p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg flex items-center gap-3.5 max-w-sm"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#D4AF37]/40">
                <Image
                  src="/assets/gallery/lab-robotics-1.jpg"
                  alt="Labo Robotique"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Laboratoire Actif
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  Simulation CAO & Robotique ENSPY
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* BANDEAU DÉFILANT DYNAMIQUE N°1 (Marquee Matières) */}
      <div className="relative w-full overflow-hidden mt-16 py-3.5 bg-slate-900/90 dark:bg-[#070E1C] border-y border-[#D4AF37]/30 text-white backdrop-blur-md">
        <div className="flex w-[200%] animate-marquee">
          {[...subjectsMarquee, ...subjectsMarquee].map((subject, idx) => (
            <span
              key={idx}
              className="flex items-center gap-3 text-xs sm:text-sm font-mono font-bold tracking-wider whitespace-nowrap mx-4 sm:mx-6 text-slate-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* BANDEAU DÉFILANT DYNAMIQUE N°2 (Marquee Piliers & Esprit) */}
      <div className="relative w-full overflow-hidden py-2 bg-gradient-to-r from-[#D4AF37]/20 via-sky-500/20 to-[#D4AF37]/20 border-b border-[#D4AF37]/20 backdrop-blur-sm">
        <div className="flex w-[200%] animate-marquee-reverse">
          {[...pillarsMarquee, ...pillarsMarquee].map((pillar, idx) => (
            <span
              key={idx}
              className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-black tracking-widest uppercase whitespace-nowrap mx-6 text-slate-900 dark:text-[#F3E5AB]"
            >
              <span>{pillar}</span>
              <span className="text-sky-500">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
