'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  PauseCircle,
  PlayCircle,
  Eye,
  Smartphone,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  Sparkles,
  Users,
  BookOpen,
  Info,
  ExternalLink,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { BRAND_CONFIG, renderWelcomeEmail, renderWeeklyEmail, WeeklyResource } from '@/lib/emailTemplates';

interface CommunicationsMetrics {
  totalRegistered: number;
  realEmailsCount: number;
  newsletterEligible: number;
  unsubscribedCount: number;
  totalSent: number;
  totalSimulated: number;
  totalFailed: number;
}

interface CommunicationsData {
  gmailStatus: {
    isConfigured: boolean;
    mode: 'oauth2' | 'app_password' | 'unconfigured';
    senderAddress: string;
    senderName: string;
    diagnosticMessage: string;
    canSendLive: boolean;
  };
  settings: {
    isGlobalPaused: boolean;
    welcomeEmailActive: boolean;
    weeklyEmailActive: boolean;
    maxDailySends: number;
    lastWeeklyCampaign?: string;
  };
  metrics: CommunicationsMetrics;
  logs: Array<{
    id: string;
    type: string;
    toEmail: string;
    toName: string;
    subject: string;
    status: string;
    mode: string;
    error?: string;
    timestamp: string;
  }>;
  suggestedResources: WeeklyResource[];
}

interface AdminCommunicationsTabProps {
  accessKey: string;
}

export function AdminCommunicationsTab({ accessKey }: AdminCommunicationsTabProps) {
  const [data, setData] = useState<CommunicationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email Preview State
  const [previewTemplate, setPreviewTemplate] = useState<'welcome' | 'weekly'>('welcome');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Test Email State
  const [testEmailAddress, setTestEmailAddress] = useState('gwetsamuel49@gmail.com');
  const [testTemplate, setTestTemplate] = useState<'welcome' | 'weekly'>('welcome');
  const [testSending, setTestSending] = useState(false);

  // Weekly Campaign Composer State
  const [campaignCustomMessage, setCampaignCustomMessage] = useState(
    'Voici une sélection de ressources pédagogiques pour structurer votre semaine de travail avec méthode.'
  );
  const [campaignTargetLevel, setCampaignTargetLevel] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [selectedResources, setSelectedResources] = useState<WeeklyResource[]>([]);
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);

  // Guide Configuration Modal
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  const fetchCommunications = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/communications?accessKey=${encodeURIComponent(accessKey)}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
          if (json.suggestedResources && json.suggestedResources.length > 0 && selectedResources.length === 0) {
            setSelectedResources(json.suggestedResources.slice(0, 3));
          }
        }
      }
    } catch (e) {
      console.error('Erreur chargement communications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessKey, selectedResources.length]);

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleUpdateSetting = async (key: string, value: boolean | number) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({ action: 'update_settings', [key]: value }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur de mise à jour.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      setFeedback({ type: 'error', text: 'Veuillez saisir une adresse email valide.' });
      return;
    }
    setTestSending(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({ toEmail: testEmailAddress.trim(), templateType: testTemplate }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: 'success', text: json.message || 'Email test envoyé avec succès !' });
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de l\'envoi test.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau lors de l\'envoi test.' });
    } finally {
      setTestSending(false);
    }
  };

  const handleTriggerCampaign = async () => {
    if (selectedResources.length === 0) {
      setFeedback({ type: 'error', text: 'Veuillez sélectionner au moins une ressource pour la lettre.' });
      return;
    }
    if (!confirm(`Confirmez-vous l'envoi de la lettre hebdomadaire à ${data?.metrics.newsletterEligible || 0} étudiant(s) éligible(s) ?`)) {
      return;
    }
    setIsSendingCampaign(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'send_weekly_campaign',
          resources: selectedResources,
          customMessage: campaignCustomMessage,
          targetLevel: campaignTargetLevel,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const { sentCount, simulatedCount, failedCount } = json.result;
        setFeedback({
          type: 'success',
          text: `Campagne terminée avec succès : ${sentCount} envoyé(s), ${simulatedCount} simulé(s), ${failedCount} échec(s).`,
        });
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de la campagne.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau lors de la campagne.' });
    } finally {
      setIsSendingCampaign(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Chargement du module Communications...</p>
      </div>
    );
  }

  // Rendu de l'email actif pour la prévisualisation
  const previewHtml = previewTemplate === 'welcome'
    ? renderWelcomeEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
        matricule: '25Q529',
      }).html
    : renderWeeklyEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
        resources: selectedResources.length > 0 ? selectedResources : [
          { subject: 'MTH211', title: 'Algèbre multilinéaire — Polycopié officiel 2026', type: 'Polycopié', url: `${BRAND_CONFIG.siteUrl}/msp2` },
          { subject: 'PHY211', title: 'Mécanique des solides — Fiche TD N°1 corrigée', type: 'Fiche TD', url: `${BRAND_CONFIG.siteUrl}/msp2` },
        ],
        customMessage: campaignCustomMessage,
      }).html;

  return (
    <div className="space-y-8">
      {/* 1. Header du Module */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-sky-500/20 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                  Communications &amp; Notifications
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Gmail API • Vercel Cron
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gestion des emails automatiques, de la lettre hebdomadaire et du consentement des élèves
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchCommunications();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] text-xs font-black transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Prévisualiser les Emails</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mt-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="opacity-60 hover:opacity-100">×</button>
          </div>
        )}
      </div>

      {/* 2. Statut Gmail & Arrêt d'Urgence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte de Connexion Gmail */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Connexion Expéditeur Gmail Officiel
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  data?.gmailStatus.canSendLive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                {data?.gmailStatus.canSendLive ? <ShieldCheck className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                <span>
                  {data?.gmailStatus.mode === 'oauth2'
                    ? 'Connecté (OAuth 2.0)'
                    : data?.gmailStatus.mode === 'app_password'
                    ? 'Connecté (Mot de passe App)'
                    : 'Mode Diagnostic Sécurisé'}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold flex-shrink-0">
                <Inbox className="w-6 h-6 text-[#0284C7]" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white font-heading">
                  {data?.gmailStatus.senderName}
                </p>
                <p className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                  &lt;{data?.gmailStatus.senderAddress}&gt;
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {data?.gmailStatus.diagnosticMessage}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Slogan en signature : « {BRAND_CONFIG.slogan} »</span>
            <button
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className="text-[#0284C7] dark:text-[#38BDF8] font-bold hover:underline flex items-center gap-1"
            >
              <span>Guide OAuth Google</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Panneau Contrôle Global & Arrêt d'Urgence */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4 block">
              Contrôles Système &amp; Sécurité
            </span>

            {/* Bouton Arrêt d'Urgence */}
            <div className="mb-5">
              <button
                onClick={() => handleUpdateSetting('isGlobalPaused', !data?.settings.isGlobalPaused)}
                disabled={actionLoading}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  data?.settings.isGlobalPaused
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {data?.settings.isGlobalPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>ENVOIS ACTUELLEMENT SUSPENDUS (Cliquez pour réactiver)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-rose-500" />
                    <span>Arrêt d&apos;Urgence des Envois (Pause Globale)</span>
                  </>
                )}
              </button>
            </div>

            {/* Toggles des types d'emails */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Email de Bienvenue</p>
                  <p className="text-[10px] text-slate-400">Envoi unique après inscription vérifiée</p>
                </div>
                <button
                  onClick={() => handleUpdateSetting('welcomeEmailActive', !data?.settings.welcomeEmailActive)}
                  disabled={actionLoading}
                  className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors ${
                    data?.settings.welcomeEmailActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {data?.settings.welcomeEmailActive ? 'Actif' : 'En pause'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Lettre Hebdomadaire</p>
                  <p className="text-[10px] text-slate-400">Envoi au plus 1 fois par semaine</p>
                </div>
                <button
                  onClick={() => handleUpdateSetting('weeklyEmailActive', !data?.settings.weeklyEmailActive)}
                  disabled={actionLoading}
                  className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors ${
                    data?.settings.weeklyEmailActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {data?.settings.weeklyEmailActive ? 'Actif' : 'En pause'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Plafond journalier :</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{data?.settings.maxDailySends || 200} emails/j</span>
          </div>
        </div>
      </div>

      {/* Guide de configuration Google Cloud (Accordéon dépliable) */}
      <AnimatePresence>
        {showConfigGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Procédure de Configuration Gmail API (Variables d&apos;environnement Vercel)
              </h4>
              <button onClick={() => setShowConfigGuide(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>
            <p className="mb-3">
              Pour basculer du mode simulation vers l&apos;envoi réel en boîte de réception, définissez ces 3 variables dans votre console Vercel (Settings &rarr; Environment Variables) :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] mb-3">
              <div className="p-2.5 rounded-xl bg-black/20 border border-amber-500/20">
                <p className="font-bold text-amber-400">GMAIL_CLIENT_ID</p>
                <p className="text-slate-400 text-[10px] truncate mt-0.5">Identifiant OAuth Google Cloud</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-amber-500/20">
                <p className="font-bold text-amber-400">GMAIL_CLIENT_SECRET</p>
                <p className="text-slate-400 text-[10px] truncate mt-0.5">Clé secrète d&apos;application</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-amber-500/20">
                <p className="font-bold text-amber-400">GMAIL_REFRESH_TOKEN</p>
                <p className="text-slate-400 text-[10px] truncate mt-0.5">Token de rafraîchissement</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Alternative simple : Vous pouvez également configurer <code className="text-amber-400 font-mono">GMAIL_APP_PASSWORD</code> (Mot de passe d&apos;application 16 caractères généré depuis myaccount.google.com &rarr; Sécurité).
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Métriques d'Audience & Consentement */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Inscrits Totaux</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">{data?.metrics.totalRegistered}</p>
          <span className="text-[10px] text-slate-500">Comptes plateforme</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Emails Réels Vérifiés</p>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400 font-heading">{data?.metrics.realEmailsCount}</p>
          <span className="text-[10px] text-slate-500">Adresses valides</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Abonnés Lettre</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">{data?.metrics.newsletterEligible}</p>
          <span className="text-[10px] text-slate-500">Consentement actif</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Désabonnés</p>
          <p className="text-2xl font-black text-rose-500 font-heading">{data?.metrics.unsubscribedCount}</p>
          <span className="text-[10px] text-slate-500">Opt-out respecté</span>
        </div>
      </div>

      {/* 4. Envoi Test & Composition de Campagne Hebdomadaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Envoi d'un Email Test */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
              Envoi d&apos;un Email Test (Contrôle Directeur)
            </h4>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            Testez le rendu réel de vos messages sur votre boîte de réception mobile ou ordinateur avant toute diffusion.
          </p>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Modèle d&apos;Email à Tester
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestTemplate('welcome')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    testTemplate === 'welcome'
                      ? 'bg-[#0284C7]/15 border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Email de Bienvenue
                </button>
                <button
                  type="button"
                  onClick={() => setTestTemplate('weekly')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    testTemplate === 'weekly'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Lettre Hebdomadaire
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Adresse Email Destinataire
              </label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="Ex: gwetsamuel49@gmail.com"
                required
                className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={testSending}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {testSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi du test en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer l&apos;Email Test</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Déclenchement de la Campagne Hebdomadaire */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Lettre Académique de la Semaine
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedResources.length} ressource(s) sélectionnée(s)
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Niveau Ciblé
              </label>
              <div className="flex gap-2">
                {(['ALL', 'MSP1', 'MSP2'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCampaignTargetLevel(lvl)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      campaignTargetLevel === lvl
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Tous les niveaux' : lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Mot d&apos;Introduction Personnalisé
              </label>
              <textarea
                value={campaignCustomMessage}
                onChange={(e) => setCampaignCustomMessage(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            {/* Aperçu des 3 ressources attachées */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Ressources Pédagogiques Jointes (Catalogue Réel)
              </label>
              <div className="space-y-2">
                {selectedResources.map((res, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <span className="font-mono font-bold text-[#0284C7] mr-1.5">{res.subject}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{res.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize flex-shrink-0">
                      {res.type || 'Polycopié'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleTriggerCampaign}
              disabled={isSendingCampaign || data?.settings.isGlobalPaused || !data?.settings.weeklyEmailActive}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white font-bold text-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-40"
            >
              {isSendingCampaign ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi de la lettre aux étudiants...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Diffuser la Lettre ({data?.metrics.newsletterEligible || 0} abonnés éligibles)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Journal Historique des Envois */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
              Journal d&apos;Audit &amp; Traçabilité des Envois
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historique chronologique des notifications et emails expédiés
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {data?.logs.length || 0} entrées enregistrées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Date &amp; Heure</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Destinataire</th>
                <th className="pb-3 px-3">Objet</th>
                <th className="pb-3 px-3">Mode</th>
                <th className="pb-3 px-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {(data?.logs || []).slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.type === 'welcome'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : log.type === 'weekly'
                        ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {log.type === 'welcome' ? 'Bienvenue' : log.type === 'weekly' ? 'Hebdo' : 'Test'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                    {log.toEmail}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 truncate max-w-xs" title={log.subject}>
                    {log.subject}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-mono capitalize">
                    {log.mode.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'sent'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : log.status === 'simulated'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}>
                      {log.status === 'sent' ? 'Envoyé' : log.status === 'simulated' ? 'Simulé' : 'Échoué'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.logs || data.logs.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Aucun email consigné dans le journal pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Modale Haute Fidélité de Prévisualisation des Emails */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-[#0B1528] w-full max-w-4xl h-[88vh] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header de la modale */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setPreviewTemplate('welcome')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'welcome' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Email de Bienvenue
                    </button>
                    <button
                      onClick={() => setPreviewTemplate('weekly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Lettre Hebdomadaire
                    </button>
                  </div>

                  <div className="hidden sm:flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                      title="Affichage Ordinateur"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                      title="Affichage Mobile"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Conteneur Iframe de prévisualisation */}
              <div className="flex-1 bg-slate-100 dark:bg-[#050B14] p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
                <div
                  className={`transition-all bg-white shadow-2xl rounded-2xl overflow-hidden ${
                    previewDevice === 'mobile' ? 'w-[375px] h-[640px]' : 'w-full max-w-[640px] h-[640px]'
                  }`}
                >
                  <iframe
                    title="Aperçu Email"
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
