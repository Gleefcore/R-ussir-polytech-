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
  UserCheck,
  UserPlus,
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
  const [isWhatsAppBrowser, setIsWhatsAppBrowser] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(ua);
      const isAndroidDevice = /android/.test(ua);
      const isWa = /whatsapp|fbav|fban|instagram/.test(ua);

      setIsWhatsAppBrowser(isWa);
      if (isIosDevice) setPlatform('ios');
      else if (isAndroidDevice) setPlatform('android');
      else setPlatform('desktop');

      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(Boolean(isStandaloneMode));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleDownloadClick = async () => {
    if (isInstalled) {
      alert('L\'application Réussir Polytech est déjà installée sur votre appareil !');
      return;
    }

    // Sur iOS (Safari iPhone/iPad)
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }

    // Si le prompt natif est disponible sur Android / Chrome
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

    // Si pas de prompt direct ou navigateur spécifique
    setShowAndroidGuide(true);
  };

  return (
    <section className="relative min-h-[88vh] flex items-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-white via-slate-50/80 to-amber-50/20 text-slate-900">
      
      {/* ─── HALOS D'AMBIANCE PRESTIGE CLAIR (OR & BLEU POLYTECH) ─── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-[#D4AF37]/10 via-[#0284C7]/8 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0284C7]/6 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#D4AF37]/8 blur-[120px] pointer-events-none" />

      {/* Grille technique en filigrane clair */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* BANNIÈRE SPÉCIALE NAVIGATEUR WHATSAPP */}
        {isWhatsAppBrowser && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-[#D4AF37] text-slate-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pour installer l&apos;application sur votre écran d&apos;accueil : appuyez sur les <strong>3 points en haut</strong> &gt; <strong>« Ouvrir dans Chrome »</strong> (ou Safari).</span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ─── COLONNE GAUCHE : IDENTITÉ, SLOGAN & ACTIONS ─── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* TITRE PRINCIPAL INSTITUTIONNEL */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-heading">
                <span className="block text-slate-900">RÉUSSIR</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA7A1E]">
                  POLYTECH.
                </span>
              </h1>
            </motion.div>

            {/* SLOGAN OFFICIEL */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-2xl font-bold font-mono text-[#B8860B] tracking-wide mb-4"
            >
              « L&apos;excellence est notre seul standard. »
            </motion.p>

            {/* DESCRIPTION COURTE & VENDEUSE (CLAIRE & SANS FLUFF) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium mb-8"
            >
              La plateforme d&apos;excellence des élèves-ingénieurs polytechniciens : créez votre compte ou téléchargez l&apos;application pour accéder immédiatement à tous vos <strong>polycopiés certifiés</strong>, <strong>fiches de TD</strong> et <strong>annales d&apos;examens</strong> de MSP 1 et MSP 2.
            </motion.p>

            {/* ═══ BOUTONS D'ACTION : TÉLÉCHARGER L'APPLICATION & CRÉER MON COMPTE ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3.5 mb-8"
            >
              <button
                onClick={handleDownloadClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 border-2 border-amber-300/70 group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-[#D4AF37] flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <span>
                  {isInstalled ? 'Application Installée ✓' : 'Télécharger l\'Application'}
                </span>
              </button>

              <Link
                href="/auth?mode=register"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 shadow-md hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 group"
              >
                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>Créer mon Compte Élève</span>
              </Link>
            </motion.div>

            {/* RACCROCHAGE RAPIDE AUX DEUX FILIÈRES (MSP1 & MSP2) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-2 gap-3.5 w-full sm:max-w-md"
            >
              <Link
                href="/auth?level=MSP1"
                className="p-4 rounded-2xl bg-white border border-[#D4AF37]/50 hover:border-[#D4AF37] text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group shadow-md"
              >
                <div className="text-left">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#B8860B] block">
                    1ère Année • S1 &amp; S2
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    Filière MSP 1
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth?level=MSP2"
                className="p-4 rounded-2xl bg-white border border-sky-500/40 hover:border-sky-500 text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group shadow-md"
              >
                <div className="text-left">
                  <span className="text-[10px] font-mono font-bold uppercase text-sky-600 block">
                    2ème Année • S1 &amp; S2
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    Filière MSP 2
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

          {/* ─── COLONNE DROITE : GLOBE TERRESTRE CINÉMATIQUE SUR FOND CLAIR ─── */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[440px] lg:h-[440px] flex items-center justify-center"
            >
              {/* Halos doux sous le globe */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#0284C7]/15 via-[#D4AF37]/15 to-transparent blur-3xl animate-pulse" />
              
              {/* Anneaux orbitaux fins */}
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-[-12px] rounded-full border border-sky-500/20 pointer-events-none" />

              {/* Globe détouré transparent */}
              <div className="relative w-full h-full rounded-full overflow-hidden drop-shadow-[0_20px_40px_rgba(2,132,199,0.2)]">
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
                className="absolute -left-4 sm:-left-6 top-10 px-3.5 py-2 rounded-2xl bg-white/95 border border-[#D4AF37]/50 backdrop-blur-md shadow-xl flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#B8860B] flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-slate-900 leading-tight">Accès Hors-Ligne</p>
                  <p className="text-[9px] font-mono text-slate-500 font-semibold">PWA 100% Mobile</p>
                </div>
              </motion.div>

              {/* Badge flottant 2 : +350 Annales & Examens */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-4 sm:-right-6 bottom-10 px-3.5 py-2 rounded-2xl bg-white/95 border border-sky-500/40 backdrop-blur-md shadow-xl flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black text-slate-900 leading-tight">+350 Épreuves</p>
                  <p className="text-[9px] font-mono text-slate-500 font-semibold">Annales Certifiées</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* ═══ MODALE D'INSTALLATION IOS (IPHONE / IPAD SAFARI) ═══ */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-7 w-full max-w-sm text-slate-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#B8860B] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-heading">
                      Installer sur iPhone / iPad
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">3 étapes rapides (Safari)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Dans Safari, appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-sky-600 mx-1" /> au bas de l&apos;écran.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Faites défiler et sélectionnez <strong>« Sur l&apos;écran d&apos;accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-600 mx-1" />.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. L&apos;application apparaîtra avec son logo rond !
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-amber-400"
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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-7 w-full max-w-sm text-slate-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#B8860B] flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-heading">
                      Installer sur Téléphone / PC
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Procédure directe</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Appuyez sur les <strong>trois petits points (⋮)</strong> en haut à droite de votre navigateur (Chrome / Samsung / Edge).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Sélectionnez <strong>« Installer l&apos;application »</strong> ou <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Confirmez l&apos;installation. L&apos;application est immédiatement disponible hors-ligne avec son icône ronde !
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
                  >
                    Déclencher l&apos;installation directe
                  </button>
                )}
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
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
