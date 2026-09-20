'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Zap,
  Play,
  CheckCircle2,
  BookOpen,
  Star,
  ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Avatars de l'équipe pour la preuve sociale style Forgex
const teamAvatars = [
  { name: 'Eugène Gwet', photo: '/assets/team/eugene-gwet.jpg' },
  { name: 'Stevia Matho', photo: '/assets/team/stevia-matho.jpg' },
  { name: 'Pierre Yannick Bikei', photo: '/assets/team/bikey-yannick.jpg' },
  { name: 'Loïce Tadontsa', photo: '/assets/team/loice-tadontsa.jpg' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-28 pb-14">
      {/* Background sombre haute technologie style Forgex */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] dark:from-[#060D1A] dark:via-[#040812] dark:to-[#02050A] transition-colors duration-500" />

      {/* Grille technique industrielle */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0284C7 1px, transparent 1px), radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Halos subtils */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* CARTE HERO STYLE FORGEX (Grand conteneur industriel biseauté) */}
        <div className="rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#071120]/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Colonne Gauche : Typographie & Actions Forgex */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="lg:col-span-6 flex flex-col justify-center"
            >
              {/* Eyebrow style Forgex */}
              <motion.div variants={fadeUp} className="mb-4">
                <span className="text-xs font-mono font-black tracking-widest uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10 px-3.5 py-1.5 rounded-full border border-sky-500/20">
                  PRECISION • PERFORMANCE • EXCELLENCE
                </span>
              </motion.div>

              {/* Titre Principal Exact demandé par le client */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] mb-4 font-heading tracking-tight text-slate-900 dark:text-white"
              >
                Réussir Polytech
                <br />
                <span className="text-gold-gradient drop-shadow-sm">
                  à tout prix.
                </span>
              </motion.h1>

              {/* Slogan officiel exact demandé */}
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 font-mono tracking-wide"
              >
                &ldquo;L&apos;excellence est notre seul standard.&rdquo;
              </motion.p>

              {/* Description inspirée Forgex */}
              <motion.p
                variants={fadeUp}
                className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-medium"
              >
                La plateforme d&apos;ingénierie intégrale conçue par et pour les élèves ingénieurs. Polycopiés officiels, annales certifiées Takou & Bouetou, laboratoires de robotique, modélisation CAO 3D, Data Science et Intelligence Artificielle.
              </motion.p>

              {/* Boutons CTA Forgex */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link
                  href="/msp1"
                  className="btn-primary flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold shadow-lg shadow-[#D4AF37]/20"
                >
                  <span>Explorer le Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/entrepreneur-vip"
                  className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
                >
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                  <span>Coin Ingénieur VIP</span>
                </Link>
              </motion.div>

              {/* Social Proof Avatars (comme sur la maquette Forgex) */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10"
              >
                <div className="flex -space-x-3 overflow-hidden">
                  {teamAvatars.map((member, i) => (
                    <div
                      key={i}
                      className="relative w-9 h-9 rounded-full border-2 border-white dark:border-[#071120] overflow-hidden shadow-sm"
                    >
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Communauté d&apos;Élite ENSPY
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    14 Dirigeants & Mentors dédiés
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Colonne Droite : Grande Photo Haute Précision Industrielle (comme sur Forgex) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative h-[360px] sm:h-[440px] lg:h-[480px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/15 shadow-2xl group">
                <Image
                  src="/assets/gallery/lab-robotics-1.jpg"
                  alt="Laboratoire Robotique & CAO Réussir Polytech"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />

                {/* Gradient d'ombrage technique */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                {/* Badge télémétrie en bas de l'image (style Forgex) */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider text-emerald-400">
                        Laboratoire Actif • ENSPY
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white font-heading">
                      Robotique, CAO 3D & Systèmes Embarqués
                    </p>
                  </div>
                  <Link
                    href="/a-propos"
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-[#D4AF37]/20 border border-white/20 text-white transition-colors flex-shrink-0"
                    title="Découvrir l'équipe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
