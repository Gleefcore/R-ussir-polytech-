'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  Bell,
  CheckCircle2,
  Smartphone,
  Share,
  PlusSquare,
  BookOpen,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { playNotificationSound } from '@/lib/sound';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface RealNotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  url?: string;
  time?: string;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<RealNotificationItem | null>(null);
  const [vapidKey, setVapidKey] = useState<string>('');

  const lastSeenNotifIdRef = useRef<string | null>(null);

  // 1. Initialisation PWA, Service Worker & Détection
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

    // Récupération de la clé VAPID publique pour Web Push
    fetch('/api/push/subscribe')
      .then((res) => res.json())
      .then((data) => {
        if (data.vapidPublicKey) {
          setVapidKey(data.vapidPublicKey);
        }
      })
      .catch(() => {});

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
        .then((reg) => {
          // Si les notifications sont déjà accordées, synchroniser l'abonnement push
          if ('Notification' in window && Notification.permission === 'granted') {
            syncPushSubscription(reg);
          }
        })
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
        }, 10000);
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

  // 2. Synchronisation de l'abonnement Push réel avec le serveur
  const syncPushSubscription = useCallback(async (reg: ServiceWorkerRegistration) => {
    try {
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        const key = vapidKey || 'BIBL1ZYu_0FtmsLWPaPQhIr8yb-bOBHsZLzIpmLV-uqIyzXh0jymKuz87r8af-750IJ_cWV978KA65pJnmDNevM';
        const convertedKey = urlBase64ToUint8Array(key);
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey as unknown as BufferSource,
        });
      }

      if (sub) {
        let userData: { id?: string; email?: string; name?: string; level?: string } = {};
        try {
          const saved = localStorage.getItem('polytech_user_session');
          if (saved) {
            const parsed = JSON.parse(saved);
            userData = {
              id: parsed.id,
              email: parsed.email,
              name: parsed.name,
              level: parsed.level,
            };
          }
        } catch {}

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            userId: userData.id,
            userEmail: userData.email,
            userName: userData.name,
            level: userData.level,
          }),
        });
      }
    } catch (e) {
      console.warn('[Push] Erreur synchronisation push:', e);
    }
  }, [vapidKey]);

  // 3. Écoute des VRAIES notifications depuis le serveur (aucune simulation)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkRealNotifications = async () => {
      try {
        let userId: string | null = null;
        try {
          const saved = localStorage.getItem('polytech_user_session');
          if (saved) {
            const parsed = JSON.parse(saved);
            userId = parsed.id || null;
          }
        } catch {}

        const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;

        const data = await res.json();
        const list: Array<{ id: string; title: string; message: string; type?: string; created_at: string; read?: boolean }> =
          data.notifications || [];

        if (list.length > 0) {
          const newest = list[0];
          // Si on n'a pas encore initialisé, on mémorise le premier sans biper
          if (!lastSeenNotifIdRef.current) {
            lastSeenNotifIdRef.current = newest.id;
            return;
          }

          // Si une nouvelle notification réelle arrive
          if (newest.id !== lastSeenNotifIdRef.current && !newest.read) {
            lastSeenNotifIdRef.current = newest.id;

            // Déclencher la sonnerie réelle !
            playNotificationSound();

            // Vibreur téléphone
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }

            setCurrentNotification({
              id: newest.id,
              title: newest.title,
              message: newest.message,
              type: newest.type,
              time: 'À l\'instant',
            });

            // Fermer après 7 secondes
            setTimeout(() => {
              setCurrentNotification((curr) => (curr?.id === newest.id ? null : curr));
            }, 7000);
          }
        }
      } catch {}
    };

    // Première vérification après 3 secondes
    const initTimer = setTimeout(checkRealNotifications, 3000);
    // Vérification périodique toutes les 35 secondes
    interval = setInterval(checkRealNotifications, 35000);

    const onFocus = () => {
      checkRealNotifications();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
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
    if (!('Notification' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      setShowPushBanner(false);

      if (permission === 'granted') {
        // Déclencher le son de confirmation
        playNotificationSound();

        // Enregistrer l'abonnement push réel
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          await syncPushSubscription(reg);

          // Notification native immédiate
          reg.showNotification('RÉUSSIR POLYTECH — Notifications Activées', {
            body: '« L\'excellence est notre seul standard. » Vous recevrez en direct les alertes lors de la mise en ligne de nouveaux cours.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            sound: '/sounds/notification.wav',
            vibrate: [250, 100, 250],
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

      {/* TOAST DE NOTIFICATION RÉELLE EN DIRECT AVEC SONNERIE */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-auto"
          >
            <div className="bg-white/95 dark:bg-[#0B1528]/95 border-2 border-[#0284C7]/40 dark:border-[#0284C7]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#0284C7] flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 animate-bounce text-[#0284C7]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[12px] font-black text-slate-900 dark:text-white font-heading">
                    {currentNotification.title}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentNotification.time || 'En direct'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  {currentNotification.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Alerte sonore active
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentNotification(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Fermer"
              >
                <X className="w-4 h-4" />
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
            <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white font-heading">
                    Recevoir les Alertes avec Sonnerie
                  </p>
                  <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
                    Soyez notifié sur votre téléphone lors de nouveaux cours et annonces, même application fermée.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleEnablePush}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:scale-105 active:scale-95 transition-transform shadow-md"
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
