'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Smartphone, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function BottomCtaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

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
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
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
    </section>
  );
}
