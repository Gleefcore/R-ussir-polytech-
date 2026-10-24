'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Sparkles,
  CheckCircle2,
  CheckCheck,
  ChevronLeft,
  ArrowRight,
  Volume2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { playNotificationSound } from '@/lib/sound';

interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'academic' | 'general' | 'announcement' | 'system';
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'academic' | 'announcement'>('all');
  const [actionLoading, setActionLoading] = useState(false);
  const [userSession, setUserSession] = useState<{ id?: string; name?: string; level?: string } | null>(null);
  const [testedSound, setTestedSound] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('polytech_user_session');
      if (saved) {
        setUserSession(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userId = userSession?.id;
      const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.warn('Erreur chargement notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userSession?.id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    if (!userSession?.id) return;
    setActionLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, userId: userSession.id }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {} finally {
      setActionLoading(false);
    }
  };

  const handleTestSound = () => {
    playNotificationSound();
    setTestedSound(true);
    setTimeout(() => setTestedSound(false), 2500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'academic') return n.type === 'academic';
    if (filter === 'announcement') return n.type === 'announcement' || n.type === 'general';
    return true;
  });

  const extractUrl = (text: string): string | null => {
    const match = text.match(/\[Lien\]\s*:\s*(\S+)/i);
    if (match) return match[1];
    const rawMatch = text.match(/https?:\/\/[^\s]+/i);
    return rawMatch ? rawMatch[0] : null;
  };

  const cleanMessage = (text: string): string => {
    return text.replace(/\[Lien\]\s*:\s*(\S+)/gi, '').trim();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060D1A] text-slate-800 dark:text-slate-100 transition-colors pb-24">
      {/* EN-TÊTE DÉGRADÉ BLEU CIEL OFFICIEL */}
      <header className="bg-gradient-to-r from-[#0A4368] via-[#0284C7] to-[#0EA5E9] text-white shadow-lg border-b-2 border-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={userSession?.level?.toLowerCase() === 'msp2' ? '/msp2' : '/msp1'}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                title="Retour au cockpit"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
                    Centre de Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-900 text-xs font-black shadow-sm">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-xs text-sky-100 italic mt-0.5 font-medium">
                  « L&apos;excellence est notre seul standard. » — Alertes en temps réel
                </p>
              </div>
            </div>

            {/* Bouton Testeur de Sonnerie */}
            <button
              onClick={handleTestSound}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                testedSound
                  ? 'bg-emerald-500 border-emerald-400 text-white scale-105'
                  : 'bg-white/15 border-white/30 text-white hover:bg-white/25 active:scale-95'
              }`}
              title="Tester la sonnerie d'alerte sur votre téléphone"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {testedSound ? 'Sonnerie active !' : 'Tester la sonnerie'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* BANDEAU D'INFOS & ACTIONS */}
        <div className="bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('academic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'academic'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              📚 Cours &amp; Annales
            </button>
            <button
              onClick={() => setFilter('announcement')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'announcement'
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              📢 Annonces
            </button>
          </div>

          {/* Actions globales */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-[#0284C7]" />
                <span>Tout marquer comme lu</span>
              </button>
            )}

            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* LISTE DES NOTIFICATIONS */}
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-10 h-10 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Chargement de vos notifications en temps réel...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-[#0B1528] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[#0284C7] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7" />
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white font-heading">
              Aucune notification pour le moment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Toutes les actualités de la plateforme, parutions de polycopiés certifiés et annonces officielles de l&apos;administration apparaîtront ici et sonneront sur votre téléphone.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const targetUrl = extractUrl(notif.message);
              const cleanText = cleanMessage(notif.message);
              const dateStr = notif.created_at
                ? new Date(notif.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Récemment';

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-[#0B1528] rounded-2xl border transition-all p-4 sm:p-5 shadow-sm ${
                    notif.read
                      ? 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                      : 'border-[#0284C7]/50 dark:border-[#0284C7]/60 ring-2 ring-[#0284C7]/10 dark:ring-[#0284C7]/20 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icône selon type */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        notif.type === 'academic'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0284C7] border border-blue-200 dark:border-blue-900'
                          : notif.type === 'announcement'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-[#D4AF37] border border-amber-200 dark:border-amber-900'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      {notif.type === 'academic' ? (
                        <BookOpen className="w-5 h-5" />
                      ) : notif.type === 'announcement' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white font-heading">
                            {notif.title}
                          </h2>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#0284C7] ring-4 ring-sky-100 dark:ring-sky-950 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {dateStr}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                        {cleanText}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {targetUrl && (
                          <Link
                            href={targetUrl}
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-xs font-bold hover:scale-105 active:scale-95 transition-transform shadow-sm"
                          >
                            <span>Consulter</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Marquer comme lu</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
