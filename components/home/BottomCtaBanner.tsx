'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function BottomCtaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(Boolean(isStandalone));

    const isIosDev = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDev);

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBefore);
    return () => window.removeEventListener('beforeinstallprompt', onBefore);
  }, []);

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          return;
        }
      } catch {
        // Fallback APK
      }
    }
    // Android / Desktop fallback : Téléchargement direct APK
    const link = document.createElement('a');
    link.href = '/downloads/reussir-polytech.apk';
    link.setAttribute('download', 'reussir-polytech.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowApkGuide(true);
  };

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#070E1B] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#070E1B] border border-slate-800 shadow-2xl p-8 sm:p-12 lg:p-16 text-white">

          {/* Halos d'ambiance */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                ENGAGEMENT D&apos;EXCELLENCE POLYTECH
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight mb-3 text-white">
                Prêt à Propulser votre Cursus d&apos;Ingénieur ?
                <br />
                <span className="text-gold-gradient">
                  L&apos;excellence est notre seul standard.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Rejoignez dès maintenant la communauté Réussir Polytech et accédez à l&apos;intégralité
                des polycopiés certifiés, annales résolues et séances de mentorat avec les aînés.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-3">
              <Link href="/msp1" className="btn-forgex-primary w-full sm:w-auto text-center">
                <span>Accéder à la Plateforme</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link href="/entrepreneur-vip" className="btn-forgex-secondary w-full sm:w-auto text-center text-xs">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Coin VIP Ingénieur</span>
              </Link>

              {/* Bouton installation application — visible sur toutes les plateformes */}
              {!isInstalled && (
                <motion.button
                  onClick={handleInstall}
                  className="
                    w-full sm:w-auto flex items-center justify-center gap-2
                    px-5 py-3 rounded-xl font-black text-xs
                    bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]
                    text-[#050B14] shadow-lg shadow-amber-500/30
                    hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]
                    hover:scale-[1.03] active:scale-[0.97]
                    transition-all duration-300 border border-[#D4AF37]
                    relative overflow-hidden group
                  "
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
                  <Smartphone className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">
                    {isIos ? 'Installer sur iPhone' : 'Télécharger l\'Application'}
                  </span>
                  <Download className="w-4 h-4 relative z-10" />
                </motion.button>
              )}
              {isInstalled && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Application déjà installée ✓</span>
                </div>
              )}
            </div>

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
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. L&apos;application apparaîtra avec son logo rond officiel !
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

      {/* ═══ MODALE D'INSTALLATION APK ANDROID ═══ */}
      <AnimatePresence>
        {showApkGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 w-full max-w-sm text-slate-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-heading">
                      Téléchargement de l&apos;APK lancé !
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-bold">Fichier officiel reussir-polytech.apk</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApkGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Ouvrez la notification de téléchargement ou votre dossier <strong>Téléchargements</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Appuyez sur <strong>reussir-polytech.apk</strong> &gt; <strong>Installer</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Si Android demande <em>« Autoriser cette source »</em>, activez le bouton pour votre navigateur.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApkGuide(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-500"
              >
                Parfait, merci !
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
