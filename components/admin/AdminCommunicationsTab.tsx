'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Inbox,
  Sparkles,
  Users,
  Search,
  Filter,
  Check,
  Award,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  renderWelcomeEmail,
  renderPromotionFormationEmail,
  renderWeeklyEmail,
  WeeklyResource,
} from '@/lib/emailTemplates';
import { vipPrograms, VipProgram } from '@/data/vipPrograms';

interface StudentItem {
  id: string;
  email: string;
  fullName: string;
  matricule: string;
  level: string;
  phone: string;
  isUnsubscribed: boolean;
  isInternalPlaceholder: boolean;
  createdAt: string;
}

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
    hasGmailAppPassword?: boolean;
    gmailAppPasswordMasked?: string;
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
  students?: StudentItem[];
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

  // Sous-onglets du Cockpit de Communications
  const [activeSubTab, setActiveSubTab] = useState<'promotions' | 'custom' | 'students' | 'settings'>('promotions');

  // Sélection de formation VIP
  const [selectedProgramId, setSelectedProgramId] = useState<string>(vipPrograms[0]?.id || 'bureautique');
  const [promoTargetLevel, setPromoTargetLevel] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [promoCustomMessage, setPromoCustomMessage] = useState<string>('');
  const [sendingPromo, setSendingPromo] = useState(false);

  // Message Personnalisé
  const [customTitle, setCustomTitle] = useState('Annonce Spéciale — Promotion 2026');
  const [customSubtitle, setCustomSubtitle] = useState('Nouvelles ressources et séances d\'accompagnement disponibles');
  const [customBody, setCustomBody] = useState(
    'Bonjour {nom},\n\nNous vous informons de la mise à disposition de nouvelles fiches de travaux dirigés et de sujets d\'examens résolus sur votre espace d\'étude.'
  );
  const [customCtaText, setCustomCtaText] = useState('Accéder à mon cockpit d\'étude');
  const [customCtaUrl, setCustomCtaUrl] = useState('https://reussirpolytech.vercel.app');
  const [sendingCustom, setSendingCustom] = useState(false);

  // Recherche & Sélection d'Étudiants
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // Email Test & Prévisualisation
  const [testEmailAddress, setTestEmailAddress] = useState('gwetsamuel49@gmail.com');
  const [testTemplate, setTestTemplate] = useState<'welcome' | 'promotion' | 'weekly'>('welcome');
  const [testSending, setTestSending] = useState(false);

  const [previewTemplate, setPreviewTemplate] = useState<'welcome' | 'promotion' | 'weekly'>('welcome');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mot de passe App Google
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchCommunications = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/communications?accessKey=${encodeURIComponent(accessKey)}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch (e) {
      console.error('Erreur chargement communications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessKey]);

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const activeProgram: VipProgram = useMemo(() => {
    return vipPrograms.find((p) => p.id === selectedProgramId) || vipPrograms[0];
  }, [selectedProgramId]);

  // Filtrage des étudiants
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((st) => {
      const matchesSearch =
        st.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.matricule.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === 'ALL' || st.level.toUpperCase() === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [data?.students, searchQuery, levelFilter]);

  const realEmailStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((st) => !st.isInternalPlaceholder && !st.isUnsubscribed);
  }, [data?.students]);

  // Toggle tous les étudiants filtrés
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleToggleStudent = (id: string) => {
    const next = new Set(selectedStudentIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStudentIds(next);
  };

  // 1. Envoi de promotion VIP groupée
  const handleSendVipPromotion = async () => {
    let targetStudents: StudentItem[] = [];

    if (selectedStudentIds.size > 0) {
      targetStudents = (data?.students || []).filter((s) => selectedStudentIds.has(s.id) && !s.isInternalPlaceholder && !s.isUnsubscribed);
    } else {
      targetStudents = realEmailStudents.filter((s) => promoTargetLevel === 'ALL' || s.level.toUpperCase() === promoTargetLevel);
    }

    if (targetStudents.length === 0) {
      setFeedback({ type: 'error', text: 'Aucun étudiant avec une adresse email réelle valide pour cet envoi.' });
      return;
    }

    if (!confirm(`Confirmez-vous l'envoi de la formation « ${activeProgram.title} » à ${targetStudents.length} élève(s)-ingénieur(s) ?`)) {
      return;
    }

    setSendingPromo(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'send_targeted_batch',
          templateType: 'promotion',
          programId: activeProgram.id,
          title: `Formation d'Ingénieur : ${activeProgram.title}`,
          subtitle: activeProgram.summary,
          message: promoCustomMessage || undefined,
          mentorName: activeProgram.mentor,
          mentorRole: activeProgram.mentorTitle,
          mentorWhatsapp: activeProgram.mentorWhatsapp,
          duration: activeProgram.duration,
          modules: activeProgram.badges.map((b) => `Maîtrise pratique et industrielle de ${b}`),
          students: targetStudents.map((s) => ({
            id: s.id,
            email: s.email,
            fullName: s.fullName,
            level: s.level,
            matricule: s.matricule,
          })),
        }),
      });

      const json = await res.json();
      if (json.success) {
        const { sentCount, simulatedCount, failedCount } = json.result;
        setFeedback({
          type: 'success',
          text: `Promotion diffusée : ${sentCount} envoyé(s), ${simulatedCount} simulé(s), ${failedCount} échec(s).`,
        });
        setSelectedStudentIds(new Set());
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de la diffusion.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau lors de la diffusion.' });
    } finally {
      setSendingPromo(false);
    }
  };

  // 2. Envoi individuel direct (Bienvenue ou Promotion)
  const handleSendSingleEmail = async (student: StudentItem, templateType: 'welcome' | 'promotion') => {
    if (student.isInternalPlaceholder || !student.email.includes('@')) {
      setFeedback({ type: 'error', text: `L'étudiant ${student.fullName} n'a pas encore renseigné une adresse email réelle.` });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'send_targeted_batch',
          templateType,
          programId: activeProgram.id,
          title: `Formation d'Ingénieur : ${activeProgram.title}`,
          subtitle: activeProgram.summary,
          mentorName: activeProgram.mentor,
          mentorRole: activeProgram.mentorTitle,
          mentorWhatsapp: activeProgram.mentorWhatsapp,
          duration: activeProgram.duration,
          modules: activeProgram.badges.map((b) => `Maîtrise pratique et industrielle de ${b}`),
          students: [
            {
              id: student.id,
              email: student.email,
              fullName: student.fullName,
              level: student.level,
              matricule: student.matricule,
            },
          ],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          text: `Email officiel ${templateType === 'welcome' ? 'de bienvenue' : 'de formation'} envoyé avec succès à ${student.fullName} (${student.email}) !`,
        });
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur d\'envoi.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau.' });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Envoi Test Administrateur
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      setFeedback({ type: 'error', text: 'Veuillez saisir une adresse email valide.' });
      return;
    }
    setTestSending(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'send_test_email',
          toEmail: testEmailAddress.trim(),
          templateType: testTemplate,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ type: 'success', text: `Email test (${testTemplate}) envoyé avec succès à ${testEmailAddress} !` });
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

  // 4. Toggle Réglages
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

  // 5. Sauvegarde Mot de Passe App Google
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPasswordInput.trim()) return;
    setSavingPassword(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'update_settings',
          gmailAppPassword: appPasswordInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          text: '✅ Mot de passe d\'application Google validé et synchronisé dans le Cloud !',
        });
        setAppPasswordInput('');
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de l\'enregistrement.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Chargement du Cockpit de Communications...</p>
      </div>
    );
  }

  // Prévisualisation HTML active
  const previewHtml = previewTemplate === 'welcome'
    ? renderWelcomeEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
        matricule: '25Q529',
        password: 'Polytech2026!',
        actionType: 'welcome',
      }).html
    : previewTemplate === 'promotion'
    ? renderPromotionFormationEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
        title: `Formation Pratique : ${activeProgram.title}`,
        subtitle: activeProgram.summary,
        mentorName: activeProgram.mentor,
        mentorRole: activeProgram.mentorTitle,
        mentorWhatsapp: activeProgram.mentorWhatsapp,
        duration: activeProgram.duration,
        modules: activeProgram.badges.map((b) => `Module spécialisé : Maîtrise de ${b}`),
      }).html
    : renderWeeklyEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
        resources: [
          { subject: 'MTH211', title: 'Algèbre multilinéaire — Polycopié de cours 2026', type: 'Polycopié', url: `${BRAND_CONFIG.siteUrl}/msp2` },
          { subject: 'PHY211', title: 'Mécanique des solides — Fiche TD N°1 corrigée', type: 'Fiche TD', url: `${BRAND_CONFIG.siteUrl}/msp2` },
        ],
      }).html;

  return (
    <div className="space-y-6">
      {/* 1. EN-TÊTE DU COCKPIT COMMUNICATIONS */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-sky-500/20 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                  Cockpit de Communications &amp; Emails
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Gmail SMTP Opérationnel
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Expéditeur officiel certifié : <strong>gwetsamuel49@gmail.com</strong> &bull; « {BRAND_CONFIG.slogan} »
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
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:opacity-90 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu Maquette Email</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
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

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Élèves Enregistrés</p>
            <p className="text-lg font-black text-slate-900 dark:text-white font-heading">{data?.metrics.totalRegistered}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Emails Réels Prêts</p>
            <p className="text-lg font-black text-sky-600 dark:text-sky-400 font-heading">{data?.metrics.realEmailsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Emails Transmis</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-heading">{data?.metrics.totalSent}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Automatisations</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              {data?.settings.welcomeEmailActive ? '🟢 Bienvenue Active' : '⚪ Pause'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BARRE D'ONGLETS DU MODULE (ORGANISÉ & CLAIR) */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveSubTab('promotions')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'promotions'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>⭐ Diffuser une Formation VIP</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Liste des Élèves &amp; Envois Directs ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('custom')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'custom'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>✍️ Annonce Personnalisée</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'settings'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>⚙️ Paramètres &amp; Test Gmail</span>
        </button>
      </div>

      {/* 3. CONTENU DE L'ONGLET ACTIF */}

      {/* SOUS-ONGLET 1 : DIFFUSION DE FORMATIONS VIP (1-CLIC OBJECTIF ET RIGOUREUX) */}
      {activeSubTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection du Catalogue de Formations */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                1. Sélectionner la Formation
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{vipPrograms.length} programmes réels</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {vipPrograms.map((prog) => {
                const isSelected = prog.id === selectedProgramId;
                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedProgramId(prog.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50/80 dark:bg-sky-950/30 border-[#0284C7] shadow-sm'
                        : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{prog.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#0284C7]' : 'text-slate-900 dark:text-white'}`}>
                            {prog.title}
                          </p>
                          {isSelected && <Check className="w-4 h-4 text-[#0284C7] flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {prog.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">👤 {prog.mentor}</span>
                          <span>&bull;</span>
                          <span>⏳ {prog.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuration et Déclenchement de la Diffusion */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-mono block">
                  2. Fiche de Diffusion Officielle
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading mt-0.5">
                  {activeProgram.title}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                {activeProgram.duration}
              </span>
            </div>

            {/* Mentor Référent */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Encadrement Pédagogique</p>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">{activeProgram.mentor}</p>
                <p className="text-[11px] text-slate-500">{activeProgram.mentorTitle}</p>
              </div>
              <a
                href={`https://wa.me/${activeProgram.mentorWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5 hover:bg-emerald-500/25"
              >
                <span>WhatsApp Mentor</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Modules inclus dans le mail */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Compétences &amp; Modules Transmis dans l&apos;Email :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeProgram.badges.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#D4AF37]/20 text-[#B8860B] font-bold flex items-center justify-center text-[10px]">
                      0{i + 1}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ciblage de la Promotion */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                3. Sélectionner la Cible
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPromoTargetLevel('ALL')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    promoTargetLevel === 'ALL'
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Toute la Promo 2026 ({realEmailStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoTargetLevel('MSP1')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    promoTargetLevel === 'MSP1'
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  MSP1 Uniquement ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP1').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoTargetLevel('MSP2')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    promoTargetLevel === 'MSP2'
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  MSP2 Uniquement ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP2').length})
                </button>
              </div>
              {selectedStudentIds.size > 0 && (
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                  ℹ️ {selectedStudentIds.size} élève(s) sont manuellement coché(s) dans l&apos;onglet Liste. L&apos;envoi ciblera uniquement ces élèves sélectionnés.
                </p>
              )}
            </div>

            {/* Note d'introduction personnalisée */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Message d&apos;Introduction (Optionnel)
              </label>
              <textarea
                value={promoCustomMessage}
                onChange={(e) => setPromoCustomMessage(e.target.value)}
                placeholder={`Dans le cadre de l'accompagnement de la Promotion 2026, l'équipe Réussir Polytech vous recommande le programme certifié « ${activeProgram.title} »...`}
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            {/* Bouton de Diffusion Officiel */}
            <button
              onClick={handleSendVipPromotion}
              disabled={sendingPromo || data?.settings.isGlobalPaused}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-amber-500 to-[#B8860B] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {sendingPromo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi séquentiel en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Diffuser cette Formation à{' '}
                    {selectedStudentIds.size > 0
                      ? `${selectedStudentIds.size} élève(s) sélectionné(s)`
                      : promoTargetLevel === 'ALL'
                      ? `${realEmailStudents.length} élèves de la Promo 2026`
                      : `${realEmailStudents.filter((s) => s.level.toUpperCase() === promoTargetLevel).length} élèves (${promoTargetLevel})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 2 : LISTE DES ÉLÈVES & ENVOIS DIRECTS 1-PAR-1 */}
      {activeSubTab === 'students' && (
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Répertoire des Élèves-Ingénieurs ({filteredStudents.length})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cochez pour envoyer par lot, ou utilisez les boutons directs à droite de chaque élève.
              </p>
            </div>

            {/* Filtres de recherche */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, matricule..."
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0284C7] w-48 sm:w-64"
                />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as 'ALL' | 'MSP1' | 'MSP2')}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">Tous niveaux</option>
                <option value="MSP1">MSP1</option>
                <option value="MSP2">MSP2</option>
              </select>
            </div>
          </div>

          {/* Tableau des élèves */}
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.size > 0 && selectedStudentIds.size === filteredStudents.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                    />
                  </th>
                  <th className="py-3 px-3">Élève-Ingénieur</th>
                  <th className="py-3 px-3">Filière</th>
                  <th className="py-3 px-3">Matricule</th>
                  <th className="py-3 px-3">Adresse Email</th>
                  <th className="py-3 px-3 text-right">Actions Directes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredStudents.map((st) => {
                  const isChecked = selectedStudentIds.has(st.id);
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                        isChecked ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStudent(st.id)}
                          className="rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{st.fullName}</p>
                        <p className="text-[10px] text-slate-400">{st.phone || 'Pas de numéro'}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {st.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {st.matricule || 'N/A'}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {st.isInternalPlaceholder ? (
                          <span className="text-amber-600 dark:text-amber-400">Matricule seul ({st.email})</span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200">{st.email}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendSingleEmail(st, 'welcome')}
                            disabled={actionLoading || st.isInternalPlaceholder}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all disabled:opacity-40"
                            title="Envoyer l'email officiel avec ses coordonnées complètes et mot de passe"
                          >
                            ✉️ Bienvenue
                          </button>
                          <button
                            onClick={() => handleSendSingleEmail(st, 'promotion')}
                            disabled={actionLoading || st.isInternalPlaceholder}
                            className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#92400E] dark:text-[#F3E5AB] hover:bg-[#D4AF37]/25 text-[11px] font-bold transition-all disabled:opacity-40"
                            title="Envoyer la formation VIP actuellement sélectionnée"
                          >
                            ⭐ Formation VIP
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucun élève correspondant aux critères de recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 3 : ANNONCE PERSONNALISÉE COMPOSÉE */}
      {activeSubTab === 'custom' && (
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
              Rédiger une Annonce Officielle Personnalisée
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chaque élève recevra le courriel avec son propre nom via la balise <code>{'{nom}'}</code>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Objet de l&apos;Email
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Sous-titre / En-tête d&apos;accroche
              </label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Corps du Message
                </label>
                <span className="text-[11px] text-[#0284C7] font-bold">
                  Astuce : Utilisez {'{nom}'} pour insérer le nom complet de l&apos;élève
                </span>
              </div>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Libellé du Bouton
                </label>
                <input
                  type="text"
                  value={customCtaText}
                  onChange={(e) => setCustomCtaText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Lien de Destination
                </label>
                <input
                  type="url"
                  value={customCtaUrl}
                  onChange={(e) => setCustomCtaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSendVipPromotion}
              disabled={sendingCustom || data?.settings.isGlobalPaused}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Diffuser cette Annonce à la Promotion 2026</span>
            </button>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 4 : PARAMÈTRES EXPÉDITEUR GMAIL & AUDIT LOG */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Envoi d'un Test Administrateur */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Test en Direct (Contrôle Directeur)
              </h4>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Expédie immédiatement un exemple réel sur votre boîte personnelle pour vérifier le rendu HTML et l&apos;arrivée en boîte principale.
            </p>

            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  Type de Modèle à Tester
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestTemplate('welcome')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      testTemplate === 'welcome'
                        ? 'bg-[#0284C7]/15 border-[#0284C7] text-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Bienvenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestTemplate('promotion')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      testTemplate === 'promotion'
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Formation VIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestTemplate('weekly')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      testTemplate === 'weekly'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hebdomadaire
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  Adresse Email Destinataire
                </label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="gwetsamuel49@gmail.com"
                  required
                  className="w-full py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
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
                    <span>Expédier le Test Réel</span>
                  </>
                )}
              </button>
            </form>

            {/* Interrupteur automatique */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Envoi Automatique à la Connexion / Inscription
                </p>
                <p className="text-[11px] text-slate-500">
                  Transmet la carte d&apos;accès avec mot de passe et l&apos;émulation en direct
                </p>
              </div>
              <button
                onClick={() => handleUpdateSetting('welcomeEmailActive', !data?.settings.welcomeEmailActive)}
                disabled={actionLoading}
                className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
                  data?.settings.welcomeEmailActive
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {data?.settings.welcomeEmailActive ? '✓ Activé' : 'Désactivé'}
              </button>
            </div>
          </div>

          {/* Journal des 10 Derniers Envois */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Traçabilité des Derniers Envois
              </h4>
              <span className="text-[11px] font-mono text-slate-400">{data?.logs.length || 0} consigné(s)</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {(data?.logs || []).slice(0, 8).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.toName || log.toEmail}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{log.subject}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                    log.status === 'sent'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : log.status === 'simulated'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}>
                    {log.status === 'sent' ? 'Envoyé' : log.status === 'simulated' ? 'Simulé' : 'Échoué'}
                  </span>
                </div>
              ))}
              {(!data?.logs || data.logs.length === 0) && (
                <p className="py-6 text-center text-xs text-slate-400">Aucun envoi récent enregistré.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALE DE PRÉVISUALISATION HAUTE DÉFINITION DES EMAILS */}
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
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setPreviewTemplate('welcome')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'welcome' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Bienvenue &amp; Accès
                    </button>
                    <button
                      onClick={() => setPreviewTemplate('promotion')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'promotion' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Formation VIP
                    </button>
                    <button
                      onClick={() => setPreviewTemplate('weekly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Hebdomadaire
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
                      title="Affichage Téléphone"
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
