'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Users,
  CheckCircle2,
  FileText,
  Star,
} from 'lucide-react';

export function HeroSection() {
  const [searchWord, setSearchWord] = useState('');

  const quickSubjects = [
    { label: 'Analyse 1 (Takou)', href: '/msp1' },
    { label: 'Algèbre (Bouetou)', href: '/msp1' },
    { label: 'Électromagnétisme', href: '/msp1' },
    { label: 'Mécanique du Point', href: '/msp1' },
    { label: 'Algèbre Multilinéaire (MSP2)', href: '/msp2' },
    { label: 'Probabilités (MSP2)', href: '/msp2' },
  ];

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
      {/* Halos doux en fond */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D4AF37]/10 via-[#0284C7]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* GRANDE CARTE D'ACCUEIL CHALEUREUSE & PRESTIGIEUSE (Courbes douces 40px) */}
        <div className="rounded-[32px] sm:rounded-[44px] overflow-hidden bg-white/90 dark:bg-[#070E1B]/95 border border-slate-200/80 dark:border-white/10 shadow-xl p-6 sm:p-10 lg:p-14 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* COLONNE GAUCHE : TEXTES, RECHERCHE & PORTAILS */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Badge d'Élite Cameroun */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] font-mono text-xs font-bold tracking-wider uppercase">
                  <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ÉCOLES POLYTECHNIQUES DU CAMEROUN • ENSPY & MSP
                </span>
              </div>

              {/* Titre Officiel Exact */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading text-slate-900 dark:text-white mb-3">
                Réussir Polytech
                <br />
                <span className="text-gold-gradient">
                  à tout prix.
                </span>
              </h1>

              {/* Slogan officiel en exergue */}
              <p className="text-base sm:text-xl font-bold font-mono text-slate-800 dark:text-slate-200 tracking-wide mb-4">
                &ldquo;L&apos;excellence est notre seul standard.&rdquo;
              </p>

              {/* Description claire et sincère pour les étudiants */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                La plateforme d&apos;entraide et de documentation officielle des élèves-ingénieurs. <strong className="text-[#D4AF37]">Créez un compte</strong> pour retrouver en libre accès tous les polycopiés de cours certifiés, les annales d&apos;examens et de contrôles continus (Takou, Bouetou, Remaoun) et les fiches de travaux dirigés pour réussir vos filières <strong>MSP1</strong> et <strong>MSP2</strong>.
              </p>

              {/* BARRE DE RECHERCHE INTUITIVE */}
              <div className="mb-6 p-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex-shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Rechercher une matière ou un prof (Analyse 1, Algèbre, Électrostatique...)"
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <Link
                  href={searchWord ? `/msp1?q=${encodeURIComponent(searchWord)}` : '/msp1'}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#050B14] text-xs font-bold transition-all flex-shrink-0"
                >
                  Trouver
                </Link>
              </div>

              {/* Accès Rapides les plus demandés */}
              <div className="flex flex-wrap items-center gap-1.5 mb-8">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1">Populaire :</span>
                {quickSubjects.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* LES 3 PORTAILS D'ACCÈS MAJEURS (Boutons larges, confortables au doigt) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link
                  href="/msp1"
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA7A1E] text-slate-950 font-black flex items-center justify-between shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-80">1ère Année</span>
                    <span className="text-sm sm:text-base">Portail MSP1</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/msp2"
                  className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-white/10 dark:text-white font-bold flex items-center justify-between border border-slate-300 dark:border-white/15 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">2ème Année</span>
                    <span className="text-sm sm:text-base">Portail MSP2</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/entrepreneur-vip"
                  className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white font-bold flex items-center justify-between shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider block opacity-80">Leadership & Métiers</span>
                    <span className="text-sm sm:text-base">Espace VIP</span>
                  </div>
                  <Star className="w-4 h-4 text-amber-300" />
                </Link>
              </div>

              {/* Inscription CTA explicite */}
              <div className="mt-4">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform"
                >
                  <Users className="w-4 h-4" />
                  <span>S'inscrire / Se connecter</span>
                </Link>
              </div>

            </div>

            {/* COLONNE DROITE : PHOTO DE LA FAMILLE POLYTECH VIVANTE & STUDIEUSE */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-2xl relative">
                <div className="relative h-[320px] sm:h-[400px] w-full">
                  <Image
                    src="/assets/gallery/family-leaders-portrait.jpg"
                    alt="L'équipe et mentors de Réussir Polytech"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                </div>

                {/* Badge en bas : Une communauté vivante */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Collectif Actif • ENSPY
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold font-heading">
                    14 Dirigeants & Mentors dévoués à votre succès
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Séances de travail, résolution d&apos;épreuves et accompagnement fraternel continu.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
