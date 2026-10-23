'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Bell, CheckCircle2, Smartphone, Share, PlusSquare, BookOpen, Users, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  icon: 'user' | 'book' | 'star';
  time: string;
  url?: string;
}

const SIMULATED_ACTIVITIES: Array<Omit<ActivityNotification, 'id' | 'time'>> = [
  {
    title: '🟢 Camarade connecté',
    message: 'Alexandre N. (MSP2) vient de se connecter pour réviser l\'Algèbre multilinéaire.',
    icon: 'user',
    url: '/msp2',
  },
  {
    title: '📚 Émulation collective',
    message: '+48 élèves-ingénieurs révisent activement sur Réussir Polytech en ce moment.',
    icon: 'star',
    url: '/',
  },
  {
    title: '✨ Nouveau corrigé officiel',
    message: 'Annales résolues disponibles en Mécanique Rationnelle & Ondes (MSP1).',
    icon: 'book',
    url: '/msp1',
  },
  {
    title: '🟢 Camarade connecté',
    message: 'Emmanuel K. (MSP1) a ouvert le polycopié de Physique II.',
    icon: 'user',
    url: '/msp1',
  },
  {
    title: '🚀 Session d\'étude active',
    message: 'Les fiches de TD d\'Algorithmique avancée et Python sont en cours de consultation.',
    icon: 'book',
    url: '/msp2',
  },
];

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<ActivityNotification | null>(null);

  // 1. Initialisation PWA, Badging & Service Worker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Détection Standalone (App installée)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(Boolean(isStandaloneMode));

    // Effacer le badge de l'icône de l'app à l'ouverture
    if ('clearAppBadge' in navigator) {
      (navigator as unknown as { clearAppBadge: () => Promise<void> }).clearAppBadge().catch(() => {});
    }

    // Détection iOS Safari pour guide d'installation
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIos && isSafari && !isStandaloneMode) {
      const dismissed = localStorage.getItem('rp_ios_install_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowIosPrompt(true), 8000);
        return () => clearTimeout(timer);
      }
    }

    // Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => {
          console.warn('[PWA] Service Worker reporté:', err);
        });
    }

    // Synchronisation de l'invite d'installation
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

    // État des notifications
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          const dismissedPush = localStorage.getItem('rp_push_prompt_dismissed');
          if (!dismissedPush) setShowPushBanner(true);
        }, 12000);
        return () => clearTimeout(timer);
      }
    } else {
      setPushStatus('unsupported');
    }

    return () => {
      window.removeEventListener('rp-pwa-prompt-available', onPromptAvailable);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // 2. Déclenchement périodique d'alertes en direct (Social Proof & Émulation collective)
  const triggerLiveActivity = useCallback((item: Omit<ActivityNotification, 'id' | 'time'>) => {
    const notif: ActivityNotification = {
      id: `act_${Date.now()}`,
      title: item.title,
      message: item.message,
      icon: item.icon,
      time: 'À l\'instant',
      url: item.url,
    };

    setCurrentNotification(notif);

    // App Icon Badging (mise à jour de la pastille sur l'icône de l'écran d'accueil)
    if ('setAppBadge' in navigator) {
      (navigator as unknown as { setAppBadge: (count?: number) => Promise<void> }).setAppBadge(1).catch(() => {});
    }

    // Si notification autorisée par l'utilisateur, déclencher aussi une notification système native
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(item.title, {
            body: item.message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: item.url || '/' },
          } as unknown as NotificationOptions).catch(() => {});
        });
      }
    }

    // Auto-fermeture du toast après 6 secondes
    const hideTimer = setTimeout(() => {
      setCurrentNotification(null);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    // Premier déclenchement après 10s d'exploration
    const initialTimer = setTimeout(() => {
      triggerLiveActivity(SIMULATED_ACTIVITIES[0]);
    }, 10000);

    // Répétition toutes les 45 à 75 secondes
    let idx = 1;
    const interval = setInterval(() => {
      const nextItem = SIMULATED_ACTIVITIES[idx % SIMULATED_ACTIVITIES.length];
      triggerLiveActivity(nextItem);
      idx++;
    }, 55000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [triggerLiveActivity]);

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
    if (!('Notification' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      setShowPushBanner(false);

      if (permission === 'granted') {
        // Déclencher une notification de bienvenue immédiate
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification('RÉUSSIR POLYTECH — Notifications Activées', {
            body: '« L\'excellence est notre seul standard. » Vous recevrez désormais les alertes d\'étude et nouveaux cours.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
          } as unknown as NotificationOptions).catch(() => {});
        }
      } else {
        localStorage.setItem('rp_push_prompt_dismissed', 'true');
      }
    } catch (e) {
      console.warn('Erreur permission notification:', e);
    }
  };

  const handleDismissPush = () => {
    setShowPushBanner(false);
    localStorage.setItem('rp_push_prompt_dismissed', 'true');
  };

  return (
    <>
      {children}

      {/* TOAST D'ACTIVITÉ EN TEMPS RÉEL (SOCIAL PROOF POLYTECHNICIEN) */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-auto"
          >
            <div className="bg-white/95 dark:bg-[#0B1528]/95 border border-[#0284C7]/30 dark:border-[#0284C7]/40 rounded-2xl p-3.5 shadow-xl backdrop-blur-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#0284C7] flex-shrink-0 mt-0.5">
                {currentNotification.icon === 'user' ? (
                  <Users className="w-4 h-4" />
                ) : currentNotification.icon === 'book' ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[11px] font-black text-slate-900 dark:text-white font-heading">
                    {currentNotification.title}
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {currentNotification.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                  {currentNotification.message}
                </p>
              </div>

              <button
                onClick={() => setCurrentNotification(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BANNIÈRE D'ACTIVATION DES NOTIFICATIONS PUSH SUR TÉLÉPHONE */}
      <AnimatePresence>
        {showPushBanner && pushStatus === 'default' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40"
          >
            <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-2xl text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white font-heading">
                    Notifications en Temps Réel
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Soyez alerté des sessions d&apos;étude et des nouveaux corrigés
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleEnablePush}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:scale-105 active:scale-95 transition-transform shadow-md"
                >
                  Activer
                </button>
                <button
                  onClick={handleDismissPush}
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

      {/* BANNIÈRE D'INSTALLATION PWA (ANDROID & CHROME) */}
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
