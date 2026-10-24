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
  SendHorizontal,
  BellRing,
  Radio,
  Pause,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import { playNotificationSound } from '@/lib/sound';
import {
  BRAND_CONFIG,
  renderWelcomeEmail,
  renderPromotionFormationEmail,
  renderOfficialAdminEmail,
  renderAppAnnouncementEmail,
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
  initialSubTab?: 'composer' | 'notifications' | 'promotions' | 'students' | 'settings';
}

export function AdminCommunicationsTab({ accessKey, initialSubTab = 'composer' }: AdminCommunicationsTabProps) {
  const [data, setData] = useState<CommunicationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sous-onglets du Cockpit de Communications
  const [activeSubTab, setActiveSubTab] = useState<'composer' | 'notifications' | 'promotions' | 'students' | 'settings'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Sélection de formation VIP
  const [selectedProgramId, setSelectedProgramId] = useState<string>(vipPrograms[0]?.id || 'bureautique');
  const [promoTargetLevel, setPromoTargetLevel] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [promoCustomMessage, setPromoCustomMessage] = useState<string>('');
  const [sendingPromo, setSendingPromo] = useState(false);

  // Espace Mail Officiel / Composeur à la Communauté
  const [officialSubject, setOfficialSubject] = useState('Message de la Direction : Organisation des Séances d\'Encadrement & Nouveaux Cours');
  const [officialHeadline, setOfficialHeadline] = useState('Note d\'Information Officielle — Promotion 2026');
  const [officialSenderTitle, setOfficialSenderTitle] = useState('Direction Générale RÉUSSIR POLYTECH');
  const [officialSenderSignature, setOfficialSenderSignature] = useState('Eugène Samuel GWET — Président du Conseil d\'Administration');
  const [officialContent, setOfficialContent] = useState(
    'Chers élèves-ingénieurs,\n\nNous vous informons de la mise à jour des polycopiés certifiés et fiches de travaux dirigés sur la plateforme Réussir Polytech.\n\nNous vous recommandons de préparer rigoureusement chaque séance de cours en amont et de vous exercer sur les annales résolues mises à votre disposition dans votre cockpit d\'étude.\n\nRestez concentrés, constants et ambitieux dans vos révisions.'
  );
  const [officialCtaText, setOfficialCtaText] = useState('Accéder à mon cockpit d\'étude');
  const [officialCtaUrl, setOfficialCtaUrl] = useState('https://reussirpolytech.vercel.app');
  const [officialTargetLevel, setOfficialTargetLevel] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [sendingOfficial, setSendingOfficial] = useState(false);
  const [sendingAppLaunch, setSendingAppLaunch] = useState(false);
  const [composerPreviewDevice, setComposerPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // État de l'Envoi Séquentiel 1 par 1 (Anti-blocage & Anti-spam)
  interface SequentialLogItem {
    name: string;
    email: string;
    status: 'sent' | 'simulated' | 'failed';
    time: string;
    error?: string;
  }

  const [seqState, setSeqState] = useState<{
    isActive: boolean;
    isPaused: boolean;
    total: number;
    current: number;
    currentStudent: string;
    sentCount: number;
    simulatedCount: number;
    failedCount: number;
    logs: SequentialLogItem[];
  }>({
    isActive: false,
    isPaused: false,
    total: 0,
    current: 0,
    currentStudent: '',
    sentCount: 0,
    simulatedCount: 0,
    failedCount: 0,
    logs: [],
  });

  const isPausedRef = React.useRef(false);
  const isCancelledRef = React.useRef(false);

  // Diffusion de Notification Push & Sonore aux Téléphones
  const [notifTitle, setNotifTitle] = useState('📚 Nouveau cours disponible');
  const [notifMessage, setNotifMessage] = useState('Les annales résolues et fiches de travaux dirigés sont disponibles dans votre cockpit. Connectez-vous pour réviser.');
  const [notifTargetLevel, setNotifTargetLevel] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [notifUrl, setNotifUrl] = useState('/notifications');
  const [sendingNotif, setSendingNotif] = useState(false);
  const [pushDevicesCount, setPushDevicesCount] = useState<number | null>(null);

  // Recherche & Sélection d'Étudiants
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'MSP1' | 'MSP2'>('ALL');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // Email Test & Prévisualisation
  const [testEmailAddress, setTestEmailAddress] = useState('gwetsamuel49@gmail.com');
  const [testTemplate, setTestTemplate] = useState<'welcome' | 'promotion' | 'weekly' | 'app_announcement'>('welcome');
  const [testSending, setTestSending] = useState(false);

  const [previewTemplate, setPreviewTemplate] = useState<'welcome' | 'promotion' | 'official' | 'weekly' | 'app_announcement'>('welcome');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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

  // 1. Envoi de promotion VIP
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
          text: `Formation diffusée : ${sentCount} envoyé(s), ${simulatedCount} simulé(s), ${failedCount} échec(s).`,
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

  // 2. Envoi Séquentiel 1 par 1 (Anti-blocage & Anti-spam avec progression en temps réel)
  const handleStartSequentialSend = async () => {
    let targetStudents: StudentItem[] = [];

    if (selectedStudentIds.size > 0) {
      targetStudents = (data?.students || []).filter(
        (s) => selectedStudentIds.has(s.id) && !s.isInternalPlaceholder && !s.isUnsubscribed
      );
    } else {
      targetStudents = realEmailStudents.filter(
        (s) => officialTargetLevel === 'ALL' || s.level.toUpperCase() === officialTargetLevel
      );
    }

    if (targetStudents.length === 0) {
      setFeedback({ type: 'error', text: 'Aucun étudiant valide avec une adresse email réelle pour cet envoi.' });
      return;
    }

    if (!officialContent.trim()) {
      setFeedback({ type: 'error', text: 'Veuillez rédiger le corps de votre message avant de lancer l\'envoi.' });
      return;
    }

    if (!confirm(`Confirmez-vous le lancement de l'envoi séquentiel 1 par 1 à ${targetStudents.length} élève(s)-ingénieur(s) ?`)) {
      return;
    }

    isPausedRef.current = false;
    isCancelledRef.current = false;
    setSendingOfficial(true);
    setFeedback(null);

    setSeqState({
      isActive: true,
      isPaused: false,
      total: targetStudents.length,
      current: 0,
      currentStudent: targetStudents[0]?.fullName || '',
      sentCount: 0,
      simulatedCount: 0,
      failedCount: 0,
      logs: [],
    });

    let sent = 0;
    let simulated = 0;
    let failed = 0;
    const progressLogs: SequentialLogItem[] = [];

    for (let i = 0; i < targetStudents.length; i++) {
      if (isCancelledRef.current) break;

      while (isPausedRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (isCancelledRef.current) break;
      }
      if (isCancelledRef.current) break;

      const student = targetStudents[i];
      setSeqState((prev) => ({
        ...prev,
        current: i + 1,
        currentStudent: `${student.fullName} (${student.email})`,
      }));

      try {
        const res = await fetch('/api/admin/communications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
          body: JSON.stringify({
            action: 'send_official_email',
            subject: officialSubject,
            headline: officialHeadline,
            senderTitle: officialSenderTitle,
            senderSignature: officialSenderSignature,
            messageContent: officialContent,
            ctaText: officialCtaText.trim() || undefined,
            ctaUrl: officialCtaUrl.trim() || undefined,
            targetLevel: officialTargetLevel === 'ALL' ? undefined : officialTargetLevel,
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
        const timeNow = new Date().toLocaleTimeString('fr-FR');

        if (json.success && json.result) {
          const itemRes = json.result.detailedResults?.[0];
          const status =
            itemRes?.status === 'sent' ? 'sent' : itemRes?.status === 'simulated' ? 'simulated' : 'failed';

          if (status === 'sent') sent++;
          else if (status === 'simulated') simulated++;
          else failed++;

          progressLogs.unshift({
            name: student.fullName,
            email: student.email,
            status,
            time: timeNow,
            error: itemRes?.message,
          });
        } else {
          failed++;
          progressLogs.unshift({
            name: student.fullName,
            email: student.email,
            status: 'failed',
            time: timeNow,
            error: json.error || 'Erreur d\'envoi',
          });
        }
      } catch (e: unknown) {
        failed++;
        progressLogs.unshift({
          name: student.fullName,
          email: student.email,
          status: 'failed',
          time: new Date().toLocaleTimeString('fr-FR'),
          error: 'Erreur réseau',
        });
      }

      setSeqState((prev) => ({
        ...prev,
        sentCount: sent,
        simulatedCount: simulated,
        failedCount: failed,
        logs: [...progressLogs],
      }));

      // Temporisation de courtoisie de 650 ms entre chaque envoi pour éviter le blocage Gmail
      if (i < targetStudents.length - 1 && !isCancelledRef.current) {
        await new Promise((r) => setTimeout(r, 650));
      }
    }

    playNotificationSound();
    setSeqState((prev) => ({ ...prev, isActive: false, isPaused: false }));
    setSendingOfficial(false);

    if (isCancelledRef.current) {
      setFeedback({
        type: 'error',
        text: `Envoi séquentiel interrompu : ${sent} envoyé(s), ${failed} échec(s).`,
      });
    } else {
      setFeedback({
        type: 'success',
        text: `Diffusion terminée avec succès : ${sent} envoyé(s), ${simulated} simulé(s), ${failed} échec(s).`,
      });
    }
    fetchCommunications();
  };

  const handleTogglePauseSequential = () => {
    isPausedRef.current = !isPausedRef.current;
    setSeqState((prev) => ({ ...prev, isPaused: isPausedRef.current }));
  };

  const handleCancelSequential = () => {
    if (confirm('Voulez-vous vraiment stopper la file d\'envoi séquentiel ?')) {
      isCancelledRef.current = true;
    }
  };

  // 3. Diffusion de Notification Push & Sonore en direct
  const handleSendPushBroadcast = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      setFeedback({ type: 'error', text: 'Veuillez saisir un titre et un message pour la notification.' });
      return;
    }

    if (!confirm('Confirmez-vous la diffusion de cette alerte sonore en direct à tous les téléphones et cockpit ?')) {
      return;
    }

    setSendingNotif(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          targetLevel: notifTargetLevel,
          url: notifUrl.trim() || '/notifications',
        }),
      });

      const json = await res.json();
      if (json.success) {
        playNotificationSound();
        setFeedback({ type: 'success', text: json.message || 'Notification diffusée avec succès !' });
        setNotifTitle('');
        setNotifMessage('');
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de la diffusion.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau lors de la diffusion.' });
    } finally {
      setSendingNotif(false);
    }
  };

  // 3. Envoi de la campagne Annonce Application Mobile
  const handleSendAppLaunchCampaign = async () => {
    if (!confirm(`Confirmez-vous l'envoi de l'email officiel d'annonce de l'Application Mobile à l'ensemble des élèves (${realEmailStudents.length} élèves) ?`)) {
      return;
    }
    setSendingAppLaunch(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': accessKey },
        body: JSON.stringify({
          action: 'send_app_announcement',
        }),
      });
      const json = await res.json();
      if (json.success) {
        const { sentCount, simulatedCount, failedCount } = json.result;
        setFeedback({
          type: 'success',
          text: `Campagne Application Mobile expédiée : ${sentCount} envoyé(s), ${simulatedCount} simulé(s), ${failedCount} échec(s).`,
        });
        fetchCommunications();
      } else {
        setFeedback({ type: 'error', text: json.error || 'Erreur lors de la diffusion.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Erreur réseau.' });
    } finally {
      setSendingAppLaunch(false);
    }
  };

  // 4. Envoi individuel direct
  const handleSendSingleEmail = async (student: StudentItem, templateType: 'welcome' | 'promotion' | 'app_announcement') => {
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
          modules: activeProgram.badges.map((b) => `Maîtrise pratique de ${b}`),
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
          text: `Email officiel ${templateType === 'welcome' ? 'de félicitations' : 'de formation'} envoyé avec succès à ${student.fullName} (${student.email}) !`,
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

  // 4. Envoi Test Administrateur
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

  // 5. Toggle Réglages
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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#0284C7] mb-3" />
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
    : previewTemplate === 'official'
    ? renderOfficialAdminEmail({
        recipientName: 'Alexandre NGOUA',
        recipientEmail: 'alexandre.ngoua@polytech.rp',
        subject: officialSubject,
        headline: officialHeadline,
        senderTitle: officialSenderTitle,
        senderSignature: officialSenderSignature,
        messageContent: officialContent,
        ctaText: officialCtaText || undefined,
        ctaUrl: officialCtaUrl || undefined,
        targetLevel: officialTargetLevel,
      }).html
    : previewTemplate === 'promotion'
    ? renderPromotionFormationEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        title: `Formation Pratique : ${activeProgram.title}`,
        subtitle: activeProgram.summary,
        mentorName: activeProgram.mentor,
        mentorRole: activeProgram.mentorTitle,
        mentorWhatsapp: activeProgram.mentorWhatsapp,
        duration: activeProgram.duration,
        modules: activeProgram.badges.map((b) => `Module spécialisé : Maîtrise de ${b}`),
      }).html
    : previewTemplate === 'app_announcement'
    ? renderAppAnnouncementEmail({
        name: 'Alexandre NGOUA',
        email: 'alexandre.ngoua@polytech.rp',
        level: 'MSP2',
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white shadow-lg shadow-sky-500/20 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                  Communications &amp; Messagerie Officielle
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  SMTP Gmail Opérationnel
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
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0284C7]' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:opacity-95 active:scale-95"
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
            <p className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">Envoi Automatique</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              {data?.settings.welcomeEmailActive ? '🟢 Félicitations Actif' : '⚪ En pause'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BARRE D'ONGLETS DU MODULE (ORGANISÉ & CLAIR) */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveSubTab('composer')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'composer'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 text-[#0284C7]" />
          <span>✉️ Rédiger un Email (1 par 1)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'notifications'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BellRing className="w-4 h-4 text-amber-500" />
          <span>📢 Diffuser Notification (Push &amp; Son)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('promotions')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'promotions'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>⭐ Formations VIP</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Répertoire ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'settings'
              ? 'bg-white dark:bg-slate-900 text-[#0284C7] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>⚙️ Paramètres</span>
        </button>
      </div>

      {/* 3. CONTENU DES SOUS-ONGLETS */}

      {/* SOUS-ONGLET 1 : FORMATIONS VIP EN 1 CLIC */}
      {activeSubTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection du Catalogue */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                1. Sélectionner le Programme
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{vipPrograms.length} formations disponibles</span>
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

          {/* Fiche de Diffusion */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-mono block">
                  2. Fiche de Formation Pratique
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
                <p className="text-[11px] font-bold text-slate-400 uppercase">Encadrement Pratique</p>
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

            {/* Modules inclus */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                Compétences Transmises dans l&apos;Email :
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

            {/* Cible */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                3. Sélectionner les Destinataires
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
                  Toute la Promo ({realEmailStudents.length})
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
                  MSP1 ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP1').length})
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
                  MSP2 ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP2').length})
                </button>
              </div>
            </div>

            {/* Bouton de Diffusion */}
            <button
              onClick={handleSendVipPromotion}
              disabled={sendingPromo || data?.settings.isGlobalPaused}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {sendingPromo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Diffuser la Formation à{' '}
                    {selectedStudentIds.size > 0
                      ? `${selectedStudentIds.size} élève(s) sélectionné(s)`
                      : promoTargetLevel === 'ALL'
                      ? `${realEmailStudents.length} élèves`
                      : `${realEmailStudents.filter((s) => s.level.toUpperCase() === promoTargetLevel).length} élèves (${promoTargetLevel})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 1 : COMPOSEUR D'EMAIL SÉQUENTIEL 1 PAR 1 (ANTI-BLOCAGE) */}
      {activeSubTab === 'composer' && (
        <div className="space-y-6">
          {/* Panneau d'expédition séquentielle en direct (s'affiche si actif ou en pause) */}
          {seqState.isActive && (
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border-2 border-[#0284C7] shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 animate-pulse">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                        Expédition Séquentielle 1 par 1 en Direct
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        seqState.isPaused
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse'
                      }`}>
                        {seqState.isPaused ? '⏸️ En pause' : '🟢 En cours'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Protection anti-spam active &bull; Temporisation de 650 ms par étudiant pour préserver la réputation Gmail.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePauseSequential}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      seqState.isPaused
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {seqState.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{seqState.isPaused ? 'Reprendre' : 'Mettre en pause'}</span>
                  </button>

                  <button
                    onClick={handleCancelSequential}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stopper l&apos;envoi</span>
                  </button>
                </div>
              </div>

              {/* Barre de progression animée */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Progression : {seqState.current} sur {seqState.total} élèves
                  </span>
                  <span className="font-mono font-black text-[#0284C7]">
                    {seqState.total > 0 ? Math.round((seqState.current / seqState.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] rounded-full transition-all duration-300"
                    style={{ width: `${seqState.total > 0 ? (seqState.current / seqState.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Destinataire actuel : <strong className="text-slate-900 dark:text-white font-mono">{seqState.currentStudent || 'Initialisation...'}</strong>
                </p>
              </div>

              {/* Compteurs de statuts */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Délivrés</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{seqState.sentCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Simulés</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400">{seqState.simulatedCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Échecs</p>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400">{seqState.failedCount}</p>
                </div>
              </div>

              {/* Audit en temps réel des derniers envois de la session */}
              {seqState.logs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">Historique de la session en cours</p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {seqState.logs.slice(0, 15).map((l, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-2 h-2 rounded-full ${l.status === 'sent' ? 'bg-emerald-500' : l.status === 'simulated' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{l.name}</span>
                          <span className="text-[11px] font-mono text-slate-400 truncate">({l.email})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{l.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bannière d'envoi de la campagne Application Mobile */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-emerald-500/10 border border-sky-200 dark:border-sky-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#0284C7] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Campagne Application Mobile : Annonce &amp; Téléchargement Direct
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Félicite chaque étudiant pour sa connexion et détaille l&apos;installation directe sur <strong>iPhone</strong> (Safari &rarr; Sur l&apos;écran d&apos;accueil) et <strong>Android</strong> (.APK de 3,6 Mo &amp; Chrome).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPreviewTemplate('app_announcement');
                  setShowPreviewModal(true);
                }}
                className="py-2.5 px-3.5 rounded-xl border border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-800 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-50 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Maquette</span>
              </button>
              <button
                type="button"
                disabled={sendingAppLaunch}
                onClick={handleSendAppLaunchCampaign}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center gap-2"
              >
                {sendingAppLaunch ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Diffusion...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Diffuser à tous ({realEmailStudents.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grille principale : Formulaire Rédacteur à gauche + Aperçu Live à droite */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulaire Rédacteur */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0284C7] block">
                    Direction Réussir Polytech
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                    Rédacteur d&apos;Email à la Communauté
                  </h4>
                </div>

                {/* Modèles Pré-remplis */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOfficialSubject('📚 Nouveaux polycopiés et travaux dirigés certifiés disponibles');
                      setOfficialHeadline('Ressources académiques certifiées — Semestre 2026');
                      setOfficialContent(
                        'Bonjour {nom},\n\nDe nouveaux polycopiés conformes au programme officiel et des fiches de TD résolues viennent d\'être publiés sur votre plateforme Réussir Polytech.\n\nNous vous invitons à les télécharger immédiatement et à préparer vos séances en amont pour maximiser votre compréhension en amphi.\n\nL\'excellence académique s\'acquiert par la répétition et l\'anticipation.'
                      );
                      setOfficialCtaText('Consulter mes cours');
                      setOfficialCtaUrl('https://reussirpolytech.vercel.app');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#0284C7] text-[11px] font-bold border border-sky-200 dark:border-sky-800 hover:bg-sky-100"
                  >
                    📚 Polycopiés
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOfficialSubject('🎯 Conseils méthodologiques & préparation aux évaluations');
                      setOfficialHeadline('Note d\'Encadrement & Stratégie de Travail');
                      setOfficialContent(
                        'Bonjour {nom},\n\nLa réussite en cycle préparatoire et école d\'ingénieurs repose sur votre méthode de travail.\n\nPrenez le temps de revoir les théorèmes clés, de refaire sans aide les exercices types des TD, et de mesurer votre vitesse de rédaction sur les annales disponibles dans votre cockpit.\n\nNos équipes restent mobilisées pour vous accompagner vers les sommets du classement.'
                      );
                      setOfficialCtaText('Ouvrir mon cockpit');
                      setOfficialCtaUrl('https://reussirpolytech.vercel.app');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                  >
                    🎯 Méthode
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Objet Officiel du Message
                </label>
                <input
                  type="text"
                  value={officialSubject}
                  onChange={(e) => setOfficialSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                    Titre d&apos;Accroche
                  </label>
                  <input
                    type="text"
                    value={officialHeadline}
                    onChange={(e) => setOfficialHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                    Entité Expéditrice
                  </label>
                  <input
                    type="text"
                    value={officialSenderTitle}
                    onChange={(e) => setOfficialSenderTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Signature Nominale
                </label>
                <input
                  type="text"
                  value={officialSenderSignature}
                  onChange={(e) => setOfficialSenderSignature(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Corps du Message Officiel
                  </label>
                  <span className="text-[11px] text-[#0284C7] font-bold">
                    Balise : <code>{'{nom}'}</code> = prénom et nom de l&apos;élève
                  </span>
                </div>
                <textarea
                  value={officialContent}
                  onChange={(e) => setOfficialContent(e.target.value)}
                  rows={6}
                  placeholder="Écrivez votre message officiel ici. Utilisez {nom} pour personnaliser chaque email."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                    Bouton d&apos;Action (Libellé)
                  </label>
                  <input
                    type="text"
                    value={officialCtaText}
                    onChange={(e) => setOfficialCtaText(e.target.value)}
                    placeholder="Accéder à mon cockpit d'étude"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                    Lien du Bouton
                  </label>
                  <input
                    type="url"
                    value={officialCtaUrl}
                    onChange={(e) => setOfficialCtaUrl(e.target.value)}
                    placeholder="https://reussirpolytech.vercel.app"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Audience Ciblée pour cet Envoi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOfficialTargetLevel('ALL')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      officialTargetLevel === 'ALL'
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Tous ({realEmailStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfficialTargetLevel('MSP1')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      officialTargetLevel === 'MSP1'
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    MSP1 ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP1').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfficialTargetLevel('MSP2')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      officialTargetLevel === 'MSP2'
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    MSP2 ({realEmailStudents.filter((s) => s.level.toUpperCase() === 'MSP2').length})
                  </button>
                </div>
                {selectedStudentIds.size > 0 && (
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                    ℹ️ {selectedStudentIds.size} élève(s) sont cochés manuellement dans le répertoire. L&apos;envoi ciblera uniquement ces élèves.
                  </p>
                )}
              </div>

              <button
                onClick={handleStartSequentialSend}
                disabled={sendingOfficial || data?.settings.isGlobalPaused}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {sendingOfficial ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi séquentiel en cours...</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-4 h-4" />
                    <span>
                      Lancer l&apos;Envoi Séquentiel 1 par 1 (
                      {selectedStudentIds.size > 0
                        ? `${selectedStudentIds.size} élèves cochés`
                        : officialTargetLevel === 'ALL'
                        ? `${realEmailStudents.length} élèves`
                        : `${realEmailStudents.filter((s) => s.level.toUpperCase() === officialTargetLevel).length} élèves (${officialTargetLevel})`}
                      )
                    </span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Envoi automatique échelonné (650 ms d&apos;intervalle) pour éviter tout risque de signalement spam ou de quota SMTP Gmail.
              </p>
            </div>

            {/* Aperçu Live Réactif */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                    Aperçu Direct du Rendu
                  </span>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setComposerPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg transition-all ${
                      composerPreviewDevice === 'desktop'
                        ? 'bg-white dark:bg-slate-700 text-[#0284C7] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Aperçu Ordinateur"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg transition-all ${
                      composerPreviewDevice === 'mobile'
                        ? 'bg-white dark:bg-slate-700 text-[#0284C7] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Aperçu Téléphone Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 dark:bg-[#070D18] rounded-2xl p-2 sm:p-3 overflow-hidden flex items-center justify-center min-h-[480px]">
                <div
                  className={`transition-all bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 ${
                    composerPreviewDevice === 'mobile' ? 'w-[320px] h-[520px]' : 'w-full h-[520px]'
                  }`}
                >
                  <iframe
                    title="Aperçu En Direct"
                    srcDoc={renderOfficialAdminEmail({
                      recipientName: 'Alexandre NGOUA',
                      recipientEmail: 'alexandre.ngoua@polytech.rp',
                      subject: officialSubject,
                      headline: officialHeadline,
                      senderTitle: officialSenderTitle,
                      senderSignature: officialSenderSignature,
                      messageContent: officialContent.replace(/\{nom\}/g, 'Alexandre NGOUA'),
                      ctaText: officialCtaText.trim() || undefined,
                      ctaUrl: officialCtaUrl.trim() || undefined,
                      targetLevel: officialTargetLevel,
                    }).html}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 2 : DIFFUSION DE NOTIFICATION PUSH & SONORE AUX TÉLÉPHONES */}
      {activeSubTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulaire de Diffusion */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500 block">
                  Web Push &bull; Sonnerie Harmonique
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                  Diffuser une Notification en Direct aux Mobiles
                </h4>
              </div>
              <button
                type="button"
                onClick={() => playNotificationSound()}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Tester la Sonnerie 🔔</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Titre de la Notification
              </label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="ex: 📚 Nouveau cours d'Algèbre disponible"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['📚 Nouveau cours', '🔔 Annonce Officielle', '⚡ Séance d\'encadrement', '🎯 Annales résolues'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNotifTitle(t)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                Message Court (affiché sur l&apos;écran du téléphone)
              </label>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                rows={4}
                placeholder="Saisissez le texte de l'alerte..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Niveau Ciblé
                </label>
                <select
                  value={notifTargetLevel}
                  onChange={(e) => setNotifTargetLevel(e.target.value as 'ALL' | 'MSP1' | 'MSP2')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="ALL">Tous les étudiants (MSP1 &amp; MSP2)</option>
                  <option value="MSP1">Promotion MSP1 uniquement</option>
                  <option value="MSP2">Promotion MSP2 uniquement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
                  Lien de Redirection au Clic
                </label>
                <input
                  type="text"
                  value={notifUrl}
                  onChange={(e) => setNotifUrl(e.target.value)}
                  placeholder="/notifications"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSendPushBroadcast}
              disabled={sendingNotif}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {sendingNotif ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Diffusion de la notification sonore...</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4" />
                  <span>Diffuser l&apos;Alerte Sonore &amp; Push à tous les Mobiles</span>
                </>
              )}
            </button>
          </div>

          {/* Aperçu Téléphone & Caractéristiques */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Aperçu sur Téléphone Portable
              </span>

              {/* Notification Banner Mockup */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-[#0284C7] flex items-center justify-center text-[9px] font-black text-white">
                      RP
                    </div>
                    <span className="font-bold text-slate-200">RÉUSSIR POLYTECH</span>
                  </div>
                  <span>Maintenant &bull; 🔔 Sonnerie</span>
                </div>
                <p className="text-xs font-black text-white">{notifTitle || 'Titre de la notification'}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{notifMessage || 'Contenu du message de la notification...'}</p>
              </div>

              {/* Points clés du système de push */}
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Arrière-plan réel :</strong> Fonctionne même quand l&apos;application ou le navigateur est complètement fermé.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Sonnerie officielle Réussir Polytech :</strong> Déclenche la double harmonique sonore C6 &rarr; G6 et la vibration.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Centre de notifications étudiant :</strong> Archivé directement dans la page <code>/notifications</code> de chaque élève.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Zéro simulation :</strong> Seuls les vrais étudiants connectés reçoivent les alertes en direct.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 3 : RÉPERTOIRE DES ÉLÈVES & ENVOIS DIRECTS */}
      {activeSubTab === 'students' && (
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Répertoire des Élèves-Ingénieurs ({filteredStudents.length})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Envoyez un email individuel ou cochez les cases pour un tir groupé.
              </p>
            </div>

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
                        <p className="text-[10px] text-slate-400">{st.phone || 'Pas de téléphone'}</p>
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
                          <span className="text-amber-600 dark:text-amber-400">Matricule interne ({st.email})</span>
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
                            title="Envoyer l'email officiel de félicitations avec identifiants"
                          >
                            ✉️ Félicitations
                          </button>
                          <button
                            onClick={() => handleSendSingleEmail(st, 'promotion')}
                            disabled={actionLoading || st.isInternalPlaceholder}
                            className="px-2.5 py-1 rounded-lg bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#0284C7]/25 text-[11px] font-bold transition-all disabled:opacity-40"
                            title="Envoyer la formation VIP actuellement sélectionnée"
                          >
                            ⭐ Formation
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucun élève correspondant aux critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-ONGLET 4 : PARAMÈTRES & DIAGNOSTIC GMAIL */}
      {activeSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Directeur */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-[#0284C7]" />
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Expédition d&apos;un Test en Direct
              </h4>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Vérifiez la réception directe en boîte principale avec le dégradé bleu ciel et le logo certifié.
            </p>

            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                  Modèle d&apos;Email à Tester
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
                    Félicitations
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
                  className="w-full py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7]"
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
                    <span>Expédition du test...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Expédier le Test Réel</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Envoi Automatique lors de l&apos;Inscription / Connexion
                </p>
                <p className="text-[11px] text-slate-500">
                  Délivre le message officiel avec matières, conseils et mot de passe
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

          {/* Journal des Derniers Envois */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                Audit des Envois Récents
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
                <p className="py-6 text-center text-xs text-slate-400">Aucun envoi consigné pour le moment.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALE DE PRÉVISUALISATION HAUTE DÉFINITION */}
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
                      Félicitations
                    </button>
                    <button
                      onClick={() => setPreviewTemplate('official')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'official' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Mail Officiel Admin
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
                      Hebdo
                    </button>
                    <button
                      onClick={() => setPreviewTemplate('app_announcement')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTemplate === 'app_announcement' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      📱 App Mobile
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
