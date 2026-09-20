'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  UploadCloud,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Search,
  RefreshCw,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Clock,
  ExternalLink,
  Filter,
  BarChart3,
  PieChart,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  GraduationCap,
  PlusCircle,
  MessageCircle,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: string;
  email: string;
  fullName: string;
  matricule: string;
  phone: string;
  level: string;
  confirmed: boolean;
  createdAt: string;
  lastSignIn?: string;
}

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  description?: string;
  file_url: string;
  created_at: string;
  subject_id: string;
  storage_path?: string;
  level_id?: string;
}

interface SubjectStat {
  key: string;
  id: string;
  code: string;
  name: string;
  level: string;
  semester: number;
  total: number;
  courseCount: number;
  tdCount: number;
  examCount: number;
  correctionCount: number;
}

interface AdminSummary {
  totalStudents: number;
  studentsByLevel: { MSP1: number; MSP2: number; ALUMNI: number };
  totalDocs: number;
  docsByType: { course: number; td: number; exam: number; correction: number };
  totalOfficialSubjects: number;
  subjectsWithDocs: number;
  coverageRate: number;
  totalCorrectionRequests: number;
}

const AVAILABLE_SUBJECTS = [
  // MSP1
  { code: 'mth111', name: 'Analyse réelle 1 (Takou)', level: 'MSP1', semester: 1 },
  { code: 'mth112', name: 'Algèbre Générale (Bouetou)', level: 'MSP1', semester: 1 },
  { code: 'phy111', name: 'Électromagnétisme 1', level: 'MSP1', semester: 1 },
  { code: 'phy112', name: 'Mécanique du point', level: 'MSP1', semester: 1 },
  { code: 'phy113', name: 'TP Physique 1', level: 'MSP1', semester: 1 },
  { code: 'inf111', name: 'Informatique 1 (Algorithmique)', level: 'MSP1', semester: 1 },
  { code: 'chm111', name: 'Éléments de Chimie', level: 'MSP1', semester: 1 },
  { code: 'lng111', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 1 },
  { code: 'mec111', name: 'Dessin technique 1', level: 'MSP1', semester: 1 },
  { code: 'eps111', name: 'Comportement et Sport 1', level: 'MSP1', semester: 1 },

  { code: 'mth121', name: 'Analyse réelle 2', level: 'MSP1', semester: 2 },
  { code: 'mth122', name: 'Géométrie euclidienne et affine', level: 'MSP1', semester: 2 },
  { code: 'mth123', name: 'Algèbre linéaire', level: 'MSP1', semester: 2 },
  { code: 'phy121', name: 'Électromagnétisme 2', level: 'MSP1', semester: 2 },
  { code: 'gmc121', name: 'Technologie des matériaux (TSM)', level: 'MSP1', semester: 2 },
  { code: 'inf121', name: 'Informatique 2', level: 'MSP1', semester: 2 },
  { code: 'lng121', name: 'Langue 2', level: 'MSP1', semester: 2 },
  { code: 'mec121', name: 'Dessin technique 2', level: 'MSP1', semester: 2 },
  { code: 'eps121', name: 'Comportement et Sport 2', level: 'MSP1', semester: 2 },

  // MSP2
  { code: 'mth211', name: 'Algèbre multilinéaire', level: 'MSP2', semester: 1 },
  { code: 'mth212', name: 'Séries intégrales', level: 'MSP2', semester: 1 },
  { code: 'mth213', name: 'Probabilités et statistiques', level: 'MSP2', semester: 1 },
  { code: 'phy211', name: 'Mécanique des solides', level: 'MSP2', semester: 1 },
  { code: 'phy212', name: 'Électrocinétique', level: 'MSP2', semester: 1 },
  { code: 'phy213', name: 'TP Physique 2', level: 'MSP2', semester: 1 },
  { code: 'inf211', name: 'Informatique 3', level: 'MSP2', semester: 1 },
  { code: 'lng211', name: 'Langue 3', level: 'MSP2', semester: 1 },

  { code: 'mth221', name: 'Analyse espaces vectoriels', level: 'MSP2', semester: 2 },
  { code: 'mth222', name: 'Analyse numérique', level: 'MSP2', semester: 2 },
  { code: 'ele221', name: 'Circuits électriques et électroniques', level: 'MSP2', semester: 2 },
  { code: 'phy221', name: 'Optique ondulatoire', level: 'MSP2', semester: 2 },
  { code: 'phy222', name: 'Thermodynamique', level: 'MSP2', semester: 2 },
  { code: 'mec221', name: 'Statique', level: 'MSP2', semester: 2 },
  { code: 'inf221', name: 'Informatique 4', level: 'MSP2', semester: 2 },
  { code: 'lng222', name: 'Langue 4', level: 'MSP2', semester: 2 },

  // VIP
  { code: 'vip_tech', name: 'VIP : Volet Technique (Bikey Yannick)', level: 'VIP', semester: 1 },
  { code: 'vip_strat', name: 'VIP : Volet Stratégie (Eugène Gwet)', level: 'VIP', semester: 1 },
  { code: 'vip_projets', name: 'VIP : Projets & Bureau G-INNOVA', level: 'VIP', semester: 2 },
];

export default function AdminCockpitPage() {
  // Gatekeeper
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'documents' | 'students' | 'publish'>('dashboard');

  // Data State
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [documents, setDocuments] = useState<ResourceItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchGlobal, setSearchGlobal] = useState('');

  // Chart filters
  const [chartLevel, setChartLevel] = useState<'ALL' | 'MSP1' | 'MSP2' | 'VIP'>('ALL');

  // Fast Publish Form
  const [pubLevel, setPubLevel] = useState<'MSP1' | 'MSP2' | 'VIP'>('MSP1');
  const [pubSemester, setPubSemester] = useState<1 | 2>(1);
  const [pubSubject, setPubSubject] = useState('mth111');
  const [pubType, setPubType] = useState('exam');
  const [pubTitle, setPubTitle] = useState('');
  const [pubSession, setPubSession] = useState('2025-2026');
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Deletion Modal
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Check Session Storage on Mount
  useEffect(() => {
    try {
      const savedKey = sessionStorage.getItem('rp_admin_master_key');
      if (savedKey && (savedKey === 'RP-ADMIN-EXCELLENCE-2026' || savedKey === 'POLYTECH2026')) {
        setAccessCode(savedKey);
        setIsUnlocked(true);
      }
    } catch {
      // Ignorer
    }
  }, []);

  // 2. Fetch Stats from Server
  const fetchDashboardData = useCallback(async () => {
    if (!accessCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?accessKey=${encodeURIComponent(accessCode)}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Erreur de chargement des statistiques.');
      }
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setSubjectStats(data.subjectStats || []);
        setDocuments(data.documents || []);
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [accessCode]);

  useEffect(() => {
    if (isUnlocked) {
      fetchDashboardData();
    }
  }, [isUnlocked, fetchDashboardData]);

  // Handle Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = accessCode.trim().toUpperCase();
    if (clean === 'RP-ADMIN-EXCELLENCE-2026' || clean === 'POLYTECH2026') {
      setIsUnlocked(true);
      setAuthError('');
      sessionStorage.setItem('rp_admin_master_key', clean);
      fetchDashboardData();
    } else {
      setAuthError('Code d\'accès administrateur incorrect.');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('rp_admin_master_key');
  };

  // Filter subjects for publish form
  const availableSubjectsForPublish = useMemo(() => {
    return AVAILABLE_SUBJECTS.filter(
      (s) => s.level === pubLevel && (pubLevel === 'VIP' || s.semester === pubSemester)
    );
  }, [pubLevel, pubSemester]);

  useEffect(() => {
    if (availableSubjectsForPublish.length > 0 && !availableSubjectsForPublish.some((s) => s.code === pubSubject)) {
      setPubSubject(availableSubjectsForPublish[0].code);
    }
  }, [availableSubjectsForPublish, pubSubject]);

  // Fast Publish Action
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubFile) {
      setPublishFeedback({ type: 'error', text: 'Veuillez joindre le fichier PDF.' });
      return;
    }
    if (!pubTitle.trim()) {
      setPublishFeedback({ type: 'error', text: 'Veuillez saisir le titre de l\'épreuve.' });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback(null);

    try {
      const formData = new FormData();
      formData.append('accessKey', accessCode);
      formData.append('file', pubFile);
      formData.append('title', pubTitle.trim());
      formData.append('subjectCode', pubSubject);
      formData.append('type', pubType);
      formData.append('date', pubSession.trim());

      const res = await fetch('/api/publish-document', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la publication.');
      }

      setPublishFeedback({
        type: 'success',
        text: `✅ Succès ! "${pubTitle}" a été publié et est immédiatement accessible en ligne.`,
      });

      setPubFile(null);
      setPubTitle('');
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue';
      setPublishFeedback({ type: 'error', text: msg });
    } finally {
      setIsPublishing(false);
    }
  };

  // Delete Document
  const handleDeleteDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/publish-document?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': accessCode },
      });
      if (res.ok) {
        setDeletingId(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Subject Stats for Area/Bar Chart
  const chartSubjects = useMemo(() => {
    let filtered = subjectStats;
    if (chartLevel !== 'ALL') {
      filtered = filtered.filter((s) => s.level === chartLevel);
    }
    return filtered.sort((a, b) => b.total - a.total).slice(0, 10);
  }, [subjectStats, chartLevel]);

  // Max doc count for chart scale
  const maxDocCount = useMemo(() => {
    const max = Math.max(...chartSubjects.map((s) => s.total), 5);
    return max;
  }, [chartSubjects]);

  // Filtered Documents Table
  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      const q = searchGlobal.toLowerCase().trim();
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.type.toLowerCase().includes(q) ||
        (d.storage_path && d.storage_path.toLowerCase().includes(q))
      );
    });
  }, [documents, searchGlobal]);

  // Filtered Students Table
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchGlobal.toLowerCase().trim();
      if (!q) return true;
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.matricule.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        s.level.toLowerCase().includes(q)
      );
    });
  }, [students, searchGlobal]);

  // Donut chart calculations
  const donutData = useMemo(() => {
    if (!summary) {
      return [
        { label: 'Examens & CC', count: 17, pct: 74, color: '#F59E0B' },
        { label: 'Polycopiés', count: 5, pct: 22, color: '#38BDF8' },
        { label: 'Fiches TD', count: 1, pct: 4, color: '#10B981' },
      ];
    }
    const total = summary.totalDocs || 1;
    const exams = summary.docsByType.exam || 0;
    const courses = summary.docsByType.course || 0;
    const tds = summary.docsByType.td || 0;
    const corrections = summary.docsByType.correction || 0;

    return [
      { label: 'Examens & CC', count: exams, pct: Math.round((exams / total) * 100), color: '#F59E0B' },
      { label: 'Polycopiés', count: courses, pct: Math.round((courses / total) * 100), color: '#38BDF8' },
      { label: 'Fiches TD', count: tds, pct: Math.round((tds / total) * 100), color: '#10B981' },
      { label: 'Corrigés', count: corrections, pct: Math.round((corrections / total) * 100), color: '#A855F7' },
    ];
  }, [summary]);

  // ========================================================
  // ÉCRAN DE VERROUILLAGE (GATEKEEPER HAUTE SÉCURITÉ)
  // ========================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4 relative overflow-hidden text-slate-100 font-sans">
        {/* Cercles de fond holographiques */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-[#0F172A]/90 border border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/25 to-sky-500/20 border border-[#D4AF37]/40 flex items-center justify-center mb-4 shadow-lg shadow-[#D4AF37]/10">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-black text-white font-heading">
              Cockpit Administrateur
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              Espace de pilotage et d&apos;analyse — Réussir Polytech
            </p>
          </div>

          {authError && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Clé Maître d&apos;Accès Direction
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="RP-ADMIN-EXCELLENCE-2026"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full bg-[#1E293B]/80 border border-slate-700 focus:border-[#D4AF37] rounded-xl px-4 py-3.5 text-sm text-white font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all placeholder:text-slate-600"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-4 top-4 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Déverrouiller le Cockpit</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Revenir au portail étudiant</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========================================================
  // DASHBOARD PRINCIPAL — STYLE KNOWVIO HAUTE FIDÉLITÉ
  // ========================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ---------------------------------------------------- */}
      {/* 1. SIDEBAR LATÉRALE GAUCHE (STYLE SAAS MODERNE)     */}
      {/* ---------------------------------------------------- */}
      <aside className="w-full lg:w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between p-5 flex-shrink-0">
        <div>
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/60">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-md shadow-[#D4AF37]/20 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#050B14]" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white block font-heading">
                  Réussir<span className="text-[#D4AF37]">Polytech</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                  Admin Cockpit v2.4
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {summary && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'dashboard' ? 'bg-[#050B14]/15 text-[#050B14]' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  Live
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('subjects')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'subjects'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Matières & Sujets</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                {subjectStats.length || 35}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'documents'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Documents & Épreuves</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                {documents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'students'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Élèves Inscrits</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                {students.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'publish'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>Publier une Épreuve</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                +Ajout
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
          {/* Admin User Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center font-bold text-[#D4AF37] text-xs">
              PCA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Direction Générale</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Réussir Polytech</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors"
            >
              Portail Web
            </Link>

            <button
              onClick={handleLock}
              title="Verrouiller le cockpit"
              className="p-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. CONTENU PRINCIPAL (EN-TÊTE + STATS + GRAPHIQUES)  */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Bienvenue sur le Cockpit, Direction !
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Suivi en temps réel des élèves, des documents déposés et de l&apos;activité académique.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Global search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher partout..."
                value={searchGlobal}
                onChange={(e) => setSearchGlobal(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D4AF37] transition-all text-slate-800 dark:text-slate-100 shadow-sm w-44 sm:w-60"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-[#D4AF37] text-slate-700 dark:text-slate-300 font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* 3. HIGHLIGHTS / 4 CARTES KPI (MODÈLE EXACT)       */}
        {/* -------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {/* KPI 1 : Élèves Inscrits */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Élèves Inscrits
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                100% Actifs
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {String(summary?.totalStudents ?? students.length).padStart(2, '0')}
              </span>
              <div className="w-10 h-6 flex items-end justify-end gap-1">
                <div className="w-2 h-3 bg-[#D4AF37]/30 rounded-t" />
                <div className="w-2 h-5 bg-[#D4AF37]/60 rounded-t" />
                <div className="w-2 h-6 bg-[#D4AF37] rounded-t" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              MSP1 : {summary?.studentsByLevel?.MSP1 ?? 3} • MSP2 : {summary?.studentsByLevel?.MSP2 ?? 7}
            </p>
          </div>

          {/* KPI 2 : Sujets & Documents */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sujets & Documents
              </span>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                Temps Réel
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {String(summary?.totalDocs ?? documents.length).padStart(2, '0')}
              </span>
              <div className="w-10 h-6 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-sky-500" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {summary?.docsByType?.exam ?? 17} examens • {summary?.docsByType?.course ?? 5} polycopiés • {summary?.docsByType?.td ?? 1} TD
            </p>
          </div>

          {/* KPI 3 : Matières Couvertes */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Matières Officielles
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                35 / 35
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {summary?.totalOfficialSubjects ?? 35}
              </span>
              <div className="w-10 h-6 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Syllabus officiel ENSPY & Douala
            </p>
          </div>

          {/* KPI 4 : Taux de Disponibilité */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Disponibilité Globale
              </span>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                100% Cloud
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                99.8<span className="text-lg font-bold text-[#D4AF37]">%</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Stockage & Accès instantanés
            </p>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* 4. SECTION DES GRAPHIQUES (STYLE KNOWVIO)          */}
        {/* -------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* GRAPHIQUE GAUCHE : SUJETS PAR MATIÈRE (2 COLS) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                  Répartition des Sujets par Matière
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nombre d&apos;épreuves, cours et TD référencés par discipline
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                {(['ALL', 'MSP1', 'MSP2', 'VIP'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setChartLevel(lvl)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      chartLevel === lvl
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Toutes' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Area & Bar Chart SVG Container */}
            <div className="relative pt-6 pb-2">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-100 dark:border-slate-800">
                {chartSubjects.map((subject, idx) => {
                  const heightPct = Math.max(Math.round((subject.total / maxDocCount) * 100), 8);
                  return (
                    <div key={subject.code} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip au survol */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-20">
                        {subject.name} : {subject.total} sujet{subject.total > 1 ? 's' : ''}
                      </div>

                      {/* Barre avec dégradé ambré / or */}
                      <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/60 rounded-t-xl overflow-hidden flex items-end h-44">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F3E5AB] rounded-t-xl group-hover:brightness-110 transition-all shadow-sm shadow-[#D4AF37]/20"
                        />
                      </div>

                      {/* Label Code */}
                      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 truncate max-w-[48px] text-center">
                        {subject.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2 text-xs text-slate-500 font-medium">
              <span>Top matières les plus documentées</span>
              <span className="font-mono text-[#D4AF37] font-bold">MTH111 (7) • MTH112 (7) • INF111 (4) • MTH211 (1)</span>
            </div>
          </div>

          {/* GRAPHIQUE DROITE : DONUT CHART PAR TYPE DE DOCUMENT */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                Répartition par Type
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Typologie des ressources enregistrées
              </p>
            </div>

            {/* Donut Visual */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="11" fill="transparent" className="text-slate-100 dark:text-slate-800" />

                {/* Exams slice */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F59E0B"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.74)}
                  fill="transparent"
                  strokeLinecap="round"
                />

                {/* Courses slice */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#38BDF8"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.22)}
                  fill="transparent"
                  transform="rotate(266.4 50 50)"
                  strokeLinecap="round"
                />

                {/* TD slice */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10B981"
                  strokeWidth="11"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 * (1 - 0.04)}
                  fill="transparent"
                  transform="rotate(345.6 50 50)"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {summary?.totalDocs ?? documents.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Documents
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{d.label}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{d.count} ({d.pct}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* 5. VUES DÉTAILLÉES : TABS SELON NAVIGATION         */}
        {/* -------------------------------------------------- */}

        {/* ONGLET 1 & DEFAUT : DASHBOARD + CATALOGUE + FORMULAIRE RAPIDE */}
        {(activeTab === 'dashboard' || activeTab === 'documents') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TABLEAU DES DOCUMENTS PUBLIÉS (2 COLS) */}
            <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                    Catalogue des Documents en Ligne
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} référencé{filteredDocuments.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('publish')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Nouveau sujet</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 px-2">Matière</th>
                      <th className="pb-3 px-2">Titre du document</th>
                      <th className="pb-3 px-2">Type</th>
                      <th className="pb-3 px-2">Session</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredDocuments.slice(0, 8).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-2">
                          <span className="font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                            {doc.storage_path?.split('/')[1]?.toUpperCase() || 'MTH111'}
                          </span>
                        </td>
                        <td className="py-3 px-2 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate" title={doc.title}>
                            {doc.title}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            doc.type === 'course'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                              : doc.type === 'td'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}>
                            {doc.type === 'course' ? 'Polycopié' : doc.type === 'td' ? 'Fiche TD' : 'Examen'}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-500">
                          {doc.description?.replace('Session : ', '') || '2025-2026'}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
                              title="Ouvrir le PDF"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setDeletingId(doc.id)}
                              className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PUBLICATION RAPIDE SUR LE CÔTÉ DROIT */}
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                    Publication Rapide
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-md">
                    Direct Cloud
                  </span>
                </div>

                {publishFeedback && (
                  <div className={`p-3 mb-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    publishFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {publishFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{publishFeedback.text}</span>
                  </div>
                )}

                <form onSubmit={handlePublishSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Niveau & Semestre
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['MSP1', 'MSP2', 'VIP'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPubLevel(lvl)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            pubLevel === lvl
                              ? 'bg-[#D4AF37] text-[#050B14] font-black shadow-sm'
                              : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Matière
                    </label>
                    <select
                      value={pubSubject}
                      onChange={(e) => setPubSubject(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {availableSubjectsForPublish.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code.toUpperCase()} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Type de ressource
                    </label>
                    <select
                      value={pubType}
                      onChange={(e) => setPubType(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="exam">Examen & Contrôle Continu</option>
                      <option value="course">Polycopié de cours officiel</option>
                      <option value="td">Fiche de Travaux Dirigés (TD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre du document
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Examen Rattrapage Fév 2025"
                      value={pubTitle}
                      onChange={(e) => setPubTitle(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fichier PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPubFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30 cursor-pointer"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:opacity-95 transition-all shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isPublishing ? 'Mise en ligne...' : 'Publier Immédiatement'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : ÉLÈVES INSCRITS & STATUT DES COMPTES */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Roster des Élèves Inscrits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredStudents.length} compte{filteredStudents.length > 1 ? 's' : ''} validé{filteredStudents.length > 1 ? 's' : ''} sur la plateforme
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Élève Ingénieur</th>
                    <th className="pb-3 px-3">Matricule</th>
                    <th className="pb-3 px-3">Niveau</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">WhatsApp</th>
                    <th className="pb-3 px-3">Statut</th>
                    <th className="pb-3 px-3 text-right">Contacter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-black flex items-center justify-center text-xs">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{student.fullName}</p>
                            <span className="text-[10px] text-slate-400">Inscrit récemment</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                          {student.matricule}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {student.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                        {student.email}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                        {student.phone}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Actif & Confirmé
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {student.phone && student.phone !== 'N/A' && (
                          <a
                            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors font-bold text-[11px]"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Message</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET 3 : MATIÈRES & COUVERTURE DU PROGRAMME */}
        {activeTab === 'subjects' && (
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Tableau Synthétique des 35 Matières Officielles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Suivi de la complétude documentaire par matière (MSP1, MSP2, VIP)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectStats.map((sub) => (
                <div
                  key={sub.code}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                      {sub.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {sub.level} — S{sub.semester}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    {sub.name}
                  </h4>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Total documents :</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                      sub.total > 0
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {sub.total} {sub.total > 1 ? 'sujets' : 'sujet'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
        <AnimatePresence>
          {deletingId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white text-center mb-1">
                  Confirmer le retrait
                </h4>
                <p className="text-xs text-slate-500 text-center mb-6">
                  Êtes-vous certain de vouloir supprimer cette épreuve de la plateforme en ligne ?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(deletingId)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                  >
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
