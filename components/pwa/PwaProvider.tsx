'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Bell, CheckCircle2, Smartphone, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'application est déjà lancée en mode standalone
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));

      // Détection iOS Safari pour guide d'installation
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isIos && isSafari && !isStandaloneMode) {
        const dismissed = localStorage.getItem('rp_ios_install_dismissed');
        if (!dismissed) {
          // Afficher après un délai d'exploration
          const timer = setTimeout(() => setShowIosPrompt(true), 8000);
          return () => clearTimeout(timer);
        }
      }
    }

    // 2. Enregistrement du Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Service worker enregistré
        })
        .catch((err) => {
          console.warn('[PWA] Enregistrement Service Worker reporté:', err);
        });
    }

    // 3. Capture de l'événement d'installation Android/Chrome & Synchronisation globale
    const globalPrompt = (window as unknown as { __rp_deferred_prompt?: BeforeInstallPromptEvent }).__rp_deferred_prompt;
    if (globalPrompt) {
      setDeferredPrompt(globalPrompt);
      const dismissed = localStorage.getItem('rp_pwa_install_dismissed');
      if (!dismissed) setShowInstallBanner(true);
    }

    const onPromptAvailable = () => {
      const p = (window as unknown as { __rp_deferred_prompt?: BeforeInstallPromptEvent }).__rp_deferred_prompt;
      if (p) {
        setDeferredPrompt(p);
        const dismissed = localStorage.getItem('rp_pwa_install_dismissed');
        if (!dismissed) setShowInstallBanner(true);
      }
    };

    window.addEventListener('rp-pwa-prompt-available', onPromptAvailable);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __rp_deferred_prompt?: BeforeInstallPromptEvent }).__rp_deferred_prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem('rp_pwa_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. État des notifications push
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    } else {
      setPushStatus('unsupported');
    }

    return () => {
      window.removeEventListener('rp-pwa-prompt-available', onPromptAvailable);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (typeof window !== 'undefined' ? (window as unknown as { __rp_deferred_prompt?: BeforeInstallPromptEvent }).__rp_deferred_prompt : null);
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsStandalone(true);
    }
    setDeferredPrompt(null);
    if (typeof window !== 'undefined') {
      (window as unknown as { __rp_deferred_prompt?: BeforeInstallPromptEvent | null }).__rp_deferred_prompt = null;
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('rp_pwa_install_dismissed', 'true');
  };

  const handleDismissIos = () => {
    setShowIosPrompt(false);
    localStorage.setItem('rp_ios_install_dismissed', 'true');
  };

  const handleEnablePush = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Les notifications push ne sont pas supportées par votre navigateur.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);

      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();

        if (!sub) {
          // Inscription push native (avec ou sans VAPID key)
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            // Fallback de souscription
          }).catch(() => null);
        }

        if (sub) {
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub }),
          });
        }
      }
    } catch (e) {
      console.warn('Erreur souscription push:', e);
    }
  };

  return (
    <>
      {children}

      {/* BANNIÈRE DISCRÈTE D'INSTALLATION PWA (ANDROID & CHROME) */}
      <AnimatePresence>
        {showInstallBanner && !isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50"
          >
            <div className="bg-[#0B1528] border-2 border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white font-heading">
                    Installer Réussir Polytech
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Accès instantané &amp; hors ligne sur votre téléphone
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:scale-105 active:scale-95 transition-transform shadow-md"
                >
                  Installer
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title="Plus tard"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GUIDE SPÉCIFIQUE SAFARI SUR IPHONE / IPAD */}
      <AnimatePresence>
        {showIosPrompt && !isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50"
          >
            <div className="bg-[#0B1528] border border-sky-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-black text-sky-400">
                  <Smartphone className="w-4 h-4" />
                  <span>Installer sur votre iPhone</span>
                </div>
                <button onClick={handleDismissIos} className="text-slate-400 hover:text-white p-0.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline mx-0.5 text-sky-400" /> dans Safari, puis sélectionnez <strong>« Sur l&apos;écran d&apos;accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-sky-400" />.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
