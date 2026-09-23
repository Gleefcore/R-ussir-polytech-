'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Users,
  CheckCircle2,
  Star,
  Flame,
  Award,
  DownloadCloud,
  FileCheck
} from 'lucide-react';

export function HeroSection() {
  const [searchWord, setSearchWord] = useState('');

  const quickSearches = [
    { label: 'Analyse (Takou)', level: 'MSP1', href: '/msp1?q=analyse' },
    { label: 'Algèbre (Bouetou)', level: 'MSP1', href: '/msp1?q=algebre' },
    { label: 'Algèbre Multilinéaire', level: 'MSP2', href: '/msp2?q=algebre' },
    { label: 'Électromagnétisme', level: 'MSP1', href: '/msp1?q=electromag' },
    { label: 'Probabilités & Stats', level: 'MSP2', href: '/msp2?q=probabilites' },
  ];

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-[#030712] dark:via-[#050B14] dark:to-[#030712] transition-colors">
      {/* Halos lumineux d'ambiance */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-tr from-[#D4AF37]/15 via-sky-500/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* GRANDE CARTE MAÎTRESSE D'ACCUEIL */}
        <div className="rounded-[32px] sm:rounded-[44px] bg-white/95 dark:bg-[#070E1B]/95 border-2 border-slate-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-xl">
          
          {/* Badge institutionnel d'excellence */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] font-mono text-xs font-black tracking-wider uppercase">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span>ÉCOLE NATIONALE SUPÉRIEURE POLYTECHNIQUE DE YAOUNDÉ • ENSPY</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Plateforme Officielle Réussir Polytech • Promotion 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* COLONNE GAUCHE : ARGUMENTAIRE CHOC & SÉLECTION DIRECTE */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Titre percutant & Vendeur */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading text-slate-900 dark:text-white mb-3">
                L&apos;Armurerie Académique
                <br />
                <span className="text-gold-gradient">
                  des Élèves-Ingénieurs.
                </span>
              </h1>

              {/* Slogan officiel */}
              <p className="text-base sm:text-lg font-bold font-mono text-[#D4AF37] tracking-wide mb-3">
                &ldquo;L&apos;excellence est notre seul standard.&rdquo;
              </p>

              {/* Description vendeuse orientée résultats concrets */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                La plateforme de référence conçue par les majors et mentors de Polytechnique. Retrouvez en libre accès tous les <strong>polycopiés certifiés</strong>, les <strong>fiches de TD</strong> et les <strong>annales d&apos;examens et de CC résolues</strong> (Takou, Bouetou, Remaoun, Yatat) pour dominer vos semestres.
              </p>

              {/* BARRE DE RECHERCHE RAPIDE */}
              <div className="mb-4 p-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-inner">
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex-shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Rechercher une matière (Analyse 1, Algèbre, Électrostatique...)"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <Link
                  href={searchWord ? `/msp1?q=${encodeURIComponent(searchWord)}` : '/msp1'}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 shadow-md"
                >
                  Chercher
                </Link>
              </div>

              {/* Raccourcis de recherche populaire */}
              <div className="flex flex-wrap items-center gap-1.5 mb-8">
                <span className="text-[11px] font-mono text-slate-400 mr-1">Exemples :</span>
                {quickSearches.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors"
                  >
                    {item.label} <span className="text-[9px] text-[#D4AF37] font-mono">({item.level})</span>
                  </Link>
                ))}
              </div>

              {/* SECTIONS D'ACCÈS INTUITIFS & IMMÉDIATS (LE CŒUR DE L'EXPÉRIENCE ÉTUDIANT) */}
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Sélectionnez votre filière pour commencer :</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* CARTE MSP 1 */}
                  <Link
                    href="/msp1"
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group flex flex-col justify-between border-2 border-amber-300/60"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950 text-[#D4AF37]">
                          1ère Année • ENSPY
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-tight">
                        Filière MSP 1
                      </h3>
                      <p className="text-xs font-semibold text-slate-900/80 mt-1 leading-snug">
                        Analyse 1 & 2 (Takou), Algèbre (Bouetou), Mécanique, Électrostatique, Chimie.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-950/20 flex items-center justify-between text-xs font-black">
                      <span>Accéder au Cockpit MSP1</span>
                      <span>→</span>
                    </div>
                  </Link>

                  {/* CARTE MSP 2 */}
                  <Link
                    href="/msp2"
                    className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white font-black shadow-xl shadow-sky-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all group flex flex-col justify-between border-2 border-sky-400/40"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          2ème Année • ENSPY
                        </span>
                        <ArrowRight className="w-5 h-5 text-sky-400 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-tight text-white">
                        Filière MSP 2
                      </h3>
                      <p className="text-xs font-semibold text-slate-300 mt-1 leading-snug">
                        Algèbre Multilinéaire, Séries Intégrales, Thermodynamique, Électrocinétique.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-black text-sky-300">
                      <span>Accéder au Cockpit MSP2</span>
                      <span>→</span>
                    </div>
                  </Link>
                </div>

                {/* CARTE BANDEAU VIP */}
                <Link
                  href="/entrepreneur-vip"
                  className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-blue-900/60 border border-purple-500/30 hover:border-purple-400/60 text-white transition-all flex items-center justify-between group shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold">
                          Espace d&apos;Élite Métiers
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                          VIP
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white">
                        L&apos;Ingénieur Entrepreneur • Formations & Compétences Clés
                      </h4>
                      <p className="text-xs text-slate-300">
                        Bureautique avancée, Python, CAO 3D et Leadership avec Bikei Yannick & Eugène Gwet.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </div>

            </div>

            {/* COLONNE DROITE : PRESTIGE VISUEL & ENGAGEMENT DU CORPS POLYTECH */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-slate-900 group">
                <div className="relative h-[360px] sm:h-[420px] w-full">
                  <Image
                    src="/assets/gallery/family-leaders-portrait.jpg"
                    alt="La direction et les mentors de Réussir Polytech"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Badge d'excellence flottant */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-[#D4AF37]/50 backdrop-blur-md text-[11px] font-black text-[#D4AF37] flex items-center gap-1.5 shadow-lg">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Standard Polytechnique</span>
                </div>

                {/* Cartouche d'impact en bas de l'image */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      Réseau Actif d&apos;Élèves-Ingénieurs
                    </span>
                  </div>
                  <h3 className="text-base font-black leading-tight text-white">
                    Une promotion unie vers le sommet
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    Des promotions complètes d&apos;élèves-ingénieurs partagent quotidiennement les annales et s&apos;entraident pour réussir.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
                    <div>
                      <p className="text-sm font-black text-[#D4AF37]">100%</p>
                      <p className="text-[9px] uppercase font-mono text-slate-400">Gratuit</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-sky-400">+350</p>
                      <p className="text-[9px] uppercase font-mono text-slate-400">Annales</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-400">24/7</p>
                      <p className="text-[9px] uppercase font-mono text-slate-400">Accès Libre</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 PILIERS DE PRESTIGE INDUSTRIEL (RASSURANCE INGÉNIEUR) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070E1B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Polycopiés Certifiés</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Conformes aux professeurs</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070E1B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Annales CC & Examens</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Takou, Bouetou, Remaoun</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070E1B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Téléchargement Direct</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Accès immédiat sans délai</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070E1B] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Entraide & Mentorat</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">14 aînés de promotion</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
