'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Star,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

export function AcademicPortalsSection() {
  return (
    <section className="py-20 bg-slate-50/80 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      
      {/* Halos d'ambiance doux */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EN-TÊTE DE LA SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#B8860B] font-mono text-xs font-bold uppercase tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>ORGANISATION DU CURRICULUM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight mb-3">
            Choisissez votre Filière d&apos;Ingénieur
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Créez votre compte en quelques secondes pour accéder directement à l&apos;intégralité des <strong>polycopiés certifiés</strong>, <strong>fiches de TD</strong> et <strong>annales corrigées</strong> de votre promotion.
          </p>
        </div>

        {/* ═══ LES 2 GRANDS PORTAILS ACADÉMIQUES (MSP1 & MSP2) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* ─── PORTAIL MSP 1 (1ÈRE ANNÉE) ─── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl p-7 sm:p-9 bg-white border-2 border-slate-200/90 hover:border-[#D4AF37] shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between relative group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#B8860B] border border-[#D4AF37]/30">
                  1ère Année • Tronc Commun Fondamental
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  19 Matières Officielles
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-heading">
                Filière MSP 1
              </h3>
              <p className="text-xs font-mono font-bold text-slate-500 mb-5">
                Mathématiques, Sciences Physiques &amp; Technologie — 1ère Année
              </p>

              {/* DÉTAIL DES SEMESTRES */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                      Semestre 1 (Fondations Mathématiques &amp; Physique)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-[#B8860B]">
                      10 Matières
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Analyse réelle 1, Algèbre générale, Électromagnétisme 1, Mécanique du point, Informatique 1 (STI 1021 / Algorithmique), Éléments de Chimie, Dessin technique 1, TP Physique 1, Langues et Comportement &amp; Sport.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                      Semestre 2 (Approfondissement &amp; Sciences des Matériaux)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600">
                      9 Matières
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Analyse réelle 2, Géométrie euclidienne et affine, Algèbre linéaire, Électromagnétisme 2, Technologie et sciences des matériaux (TSM), Informatique 2, Dessin technique 2, Langues et Sport.
                  </p>
                </div>
              </div>

              {/* POINTS FORTS DU PORTAIL */}
              <div className="space-y-2 mb-8 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Polycopiés certifiés conformes au syllabus officiel de l&apos;ENSPY</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Annales de Contrôles Continus &amp; Examens résolus par le corps professoral</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Cockpit d&apos;étude interactif avec suivi des camarades en direct</span>
                </div>
              </div>
            </div>

            {/* BOUTONS D'ACCÈS MSP1 */}
            <div className="space-y-2">
              <Link
                href="/auth?level=MSP1&mode=register"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer mon Compte &amp; Accéder à MSP 1</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth?level=MSP1&mode=login"
                className="w-full py-2.5 rounded-xl text-center text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors block"
              >
                Déjà inscrit ? Se connecter directement &rarr;
              </Link>
            </div>
          </motion.div>

          {/* ─── PORTAIL MSP 2 (2ÈME ANNÉE) ─── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl p-7 sm:p-9 bg-white border-2 border-slate-200/90 hover:border-sky-500 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between relative group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 border border-sky-500/30">
                  2ème Année • Cycle Préparatoire Approfondi
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  16 Matières Officielles
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-heading">
                Filière MSP 2
              </h3>
              <p className="text-xs font-mono font-bold text-slate-500 mb-5">
                Mathématiques Supérieures &amp; Sciences de l&apos;Ingénieur — 2ème Année
              </p>

              {/* DÉTAIL DES SEMESTRES */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                      Semestre 1 (Analyse Avancée &amp; Physique Théorique)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600">
                      8 Matières
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Algèbre multilinéaire, Séries intégrales, Probabilités &amp; statistiques, Mécanique des solides, Électrocinétique, Informatique 3, TP Physique 2 et Langues.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                      Semestre 2 (Espaces Vectoriels &amp; Ingénierie Appliquée)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      8 Matières
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Analyse dans les espaces vectoriels de dimensions finies, Analyse numérique, Circuits électriques et électroniques, Optique ondulatoire, Thermodynamique, Statique, Informatique 4 et Langues.
                  </p>
                </div>
              </div>

              {/* POINTS FORTS DU PORTAIL */}
              <div className="space-y-2 mb-8 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Modules d&apos;ingénierie avancée avec bancs de mesures et TD corrigés</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Examens de synthèse des sessions principales et rattrapages</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Suivi d&apos;apprentissage personnalisé et mentorat entre promotions</span>
                </div>
              </div>
            </div>

            {/* BOUTONS D'ACCÈS MSP2 */}
            <div className="space-y-2">
              <Link
                href="/auth?level=MSP2&mode=register"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer mon Compte &amp; Accéder à MSP 2</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth?level=MSP2&mode=login"
                className="w-full py-2.5 rounded-xl text-center text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors block"
              >
                Déjà inscrit ? Se connecter directement &rarr;
              </Link>
            </div>
          </motion.div>

        </div>

        {/* ═══ BANNIÈRE VIP DE L'INGÉNIEUR ENTREPRENEUR ═══ */}
        <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#0F1D38] via-[#0A1628] to-[#050B14] text-white border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Star className="w-3.5 h-3.5" />
                ESPACE VIP EXCLUSIF • LEADERSHIP &amp; OUTILS PRATIQUES
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mb-2">
                Le Coin de l&apos;Ingénieur Entrepreneur
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
                Les compétences ne s&apos;arrêtent pas aux cours théoriques. Rejoignez le programme de formation pratique animé par les aînés : <strong>Bureautique avancée (Excel Expert)</strong>, <strong>Conception 3D (SolidWorks)</strong>, <strong>Python Ingénieur</strong> et <strong>Stratégie de montage de projets</strong>.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
              <Link
                href="/entrepreneur-vip"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Découvrir l&apos;Espace VIP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
