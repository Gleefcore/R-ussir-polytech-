'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Smartphone,
  ArrowRight,
  Sparkles,
  Share,
  PlusSquare,
  CheckCircle2,
  BookOpen,
  Award,
  Zap,
  Star,
  X,
  ExternalLink,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function HeroSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 1. Détecter l'appareil
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(ua);
      const isAndroidDevice = /android/.test(ua);

      if (isIosDevice) setPlatform('ios');
      else if (isAndroidDevice) setPlatform('android');
      else setPlatform('desktop');

      // 2. Vérifier si l'application est déjà installée
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(Boolean(isStandaloneMode));
    }

    // 3. Capturer l'événement d'installation PWA
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDownloadClick = async () => {
    // Si déjà installée
    if (isInstalled) {
      alert('L\'application Réussir Polytech est déjà installée sur votre appareil !');
      return;
    }

    // Sur iOS (Safari iPhone/iPad)
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }

    // Sur Android ou Chrome Desktop avec prompt disponible
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Erreur prompt installation:', err);
        setShowAndroidGuide(true);
      }
      return;
    }

    // Si pas de prompt direct (ex: navigateur sans support direct ou prompt non déclenché), guider l'utilisateur
    if (platform === 'android') {
      setShowAndroidGuide(true);
    } else {
      setShowAndroidGuide(true);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-[#050B14] text-white">
      {/* ─── HALOS D'AMBIANCE NOIR & OR POLYTECH ─── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#0284C7]/12 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0284C7]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#D4AF37]/8 blur-[120px] pointer-events-none" />

      {/* Grille technique en filigrane */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,175,55,0.7) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ─── COLONNE GAUCHE : IDENTITÉ, SLOGAN & ACTIONS DIRECTES ─── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* TITRE PRINCIPAL INSTITUTIONNEL */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-heading">
                <span className="block text-white">RÉUSSIR</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
                  POLYTECH.
                </span>
              </h1>
            </motion.div>

            {/* SLOGAN OFFICIEL */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-2xl font-bold font-mono text-[#D4AF37] tracking-wide mb-4"
            >
              « L&apos;excellence est notre seul standard. »
            </motion.p>

            {/* DESCRIPTION COURTE & PERCUTANTE (SANS TEXTE GÉNÉRIQUE) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium mb-8"
            >
              La plateforme de référence des élèves-ingénieurs : téléchargez l&apos;application pour accéder instantanément et hors-ligne à tous les <strong>polycopiés certifiés</strong>, <strong>fiches de TD</strong> et <strong>annales d&apos;examens</strong> des filières MSP 1 et MSP 2.
            </motion.p>

            {/* ═══ BOUTON PRINCIPAL TÉLÉCHARGER L'APPLICATION (MOBILE & DESKTOP) ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3.5 mb-8"
            >
              <button
                onClick={handleDownloadClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 border-2 border-amber-300/60 group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-[#D4AF37] flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <span>
                  {isInstalled ? 'Application Installée ✓' : 'Télécharger l\'Application'}
                </span>
              </button>

              <a
                href="#catalogue-matieres"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2 hover:border-[#D4AF37]/50"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Voir les Matières</span>
              </a>
            </motion.div>

            {/* RACCROCHAGE DIRECT AUX DEUX FILIÈRES (MSP1 & MSP2) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-2 gap-3 w-full sm:max-w-md"
            >
              <Link
                href="/msp1"
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group shadow-lg"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#D4AF37] block">
                    1ère Année
                  </span>
                  <span className="text-sm font-black text-white">
                    Filière MSP 1
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/msp2"
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-sky-500/40 hover:border-sky-400 text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group shadow-lg"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-sky-400 block">
                    2ème Année
                  </span>
                  <span className="text-sm font-black text-white">
                    Filière MSP 2
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

          {/* ─── COLONNE DROITE : GLOBE TERRESTRE CINÉMATIQUE POLYTECH ─── */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[440px] lg:h-[440px] flex items-center justify-center"
            >
              {/* Halos de lumière sous le globe */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#0284C7]/20 via-[#D4AF37]/15 to-transparent blur-3xl animate-pulse" />
              
              {/* Anneau orbital fin */}
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-[-14px] rounded-full border border-sky-500/10 pointer-events-none" />

              {/* Globe transparent animé avec rotation lente */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(2,132,199,0.3)]">
                <Image
                  src="/assets/globe-transparent.png"
                  alt="Globe Réussir Polytech — Réseau d'Excellence"
                  fill
                  priority
                  className="object-contain p-2 select-none pointer-events-none hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Badge flottant 1 : Accès Hors Ligne */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -left-4 sm:-left-6 top-10 px-3.5 py-2 rounded-2xl bg-[#0A1628]/95 border border-[#D4AF37]/50 backdrop-blur-md shadow-xl flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white leading-tight">Accès Hors-Ligne</p>
                  <p className="text-[9px] font-mono text-slate-400">PWA 100% Mobile</p>
                </div>
              </motion.div>

              {/* Badge flottant 2 : +350 Annales & Examens */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-4 sm:-right-6 bottom-10 px-3.5 py-2 rounded-2xl bg-[#0A1628]/95 border border-sky-500/50 backdrop-blur-md shadow-xl flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white leading-tight">+350 Épreuves</p>
                  <p className="text-[9px] font-mono text-slate-400">Annales Certifiées</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* ═══ MODALE D'INSTALLATION IOS (IPHONE / IPAD SAFARI) ═══ */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-[#0A1628] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-7 w-full max-w-sm text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-heading">
                      Installer sur iPhone / iPad
                    </h3>
                    <p className="text-[10px] text-slate-400">En 3 étapes rapides (Safari)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Dans Safari, appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> au bas de votre écran.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Faites défiler et sélectionnez <strong>« Sur l&apos;écran d&apos;accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-400 mx-1" />.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. L&apos;application avec son logo rond apparaîtra sur votre écran d&apos;accueil !
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                C&apos;est compris !
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ MODALE D'INSTALLATION ANDROID & CHROME ═══ */}
      <AnimatePresence>
        {showAndroidGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-[#0A1628] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-7 w-full max-w-sm text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-heading">
                      Installer sur Téléphone / PC
                    </h3>
                    <p className="text-[10px] text-slate-400">Procédure directe</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-5 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Appuyez sur les <strong>trois petits points (⋮)</strong> en haut à droite de votre navigateur (Chrome / Brave / Edge).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Appuyez sur <strong>« Installer l&apos;application »</strong> ou <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-300 leading-snug">
                    Confirmez l&apos;installation. L&apos;application se lance immédiatement en plein écran avec accès hors-ligne !
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {deferredPrompt && (
                  <button
                    onClick={async () => {
                      setShowAndroidGuide(false);
                      await deferredPrompt.prompt();
                      const choice = await deferredPrompt.userChoice;
                      if (choice.outcome === 'accepted') setIsInstalled(true);
                      setDeferredPrompt(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider"
                  >
                    Déclencher l&apos;installation maintenant
                  </button>
                )}
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
