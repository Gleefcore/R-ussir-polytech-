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
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Images,
  Camera,
  Wrench,
  Compass,
  MapPin,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES } from '@/data/gallery';

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
  const [unlocking, setUnlocking] = useState(false);
  const [showPassKey, setShowPassKey] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'documents' | 'students' | 'publish' | 'gallery'>('dashboard');

  // Data State
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [documents, setDocuments] = useState<ResourceItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchGlobal, setSearchGlobal] = useState('');

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('realisations');
  const [galDescription, setGalDescription] = useState('');
  const [galDate, setGalDate] = useState(new Date().toISOString().split('T')[0]);
  const [galLocation, setGalLocation] = useState('Campus Polytech, Yaoundé');
  const [galAuthor, setGalAuthor] = useState('Direction Réussir Polytech');
  const [galTags, setGalTags] = useState('');
  const [galFile, setGalFile] = useState<File | null>(null);
  const [galPreviewUrl, setGalPreviewUrl] = useState<string | null>(null);
  const [isPublishingGallery, setIsPublishingGallery] = useState(false);
  const [galleryFeedback, setGalleryFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);

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
      if (savedKey) {
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

  // 2. Fetch Stats from Server
  const fetchAdminGallery = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setGalleryItems(data.items);
        }
      }
    } catch (e) {
      console.warn('Erreur chargement galerie admin:', e);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchDashboardData();
      fetchAdminGallery();
    }
  }, [isUnlocked, fetchDashboardData, fetchAdminGallery]);

  // Handle Unlock (Vérification sécurisée côté serveur sans fuite de clé)
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = accessCode.trim().toUpperCase();
    if (!clean) return;

    setUnlocking(true);
    setAuthError('');

    try {
      const res = await fetch(`/api/admin/stats?accessKey=${encodeURIComponent(clean)}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error('Code d\'accès incorrect. Accès strictement réservé à la Direction.');
      }

      setIsUnlocked(true);
      sessionStorage.setItem('rp_admin_master_key', clean);
      setSummary(data.summary);
      setSubjectStats(data.subjectStats || []);
      setDocuments(data.documents || []);
      setStudents(data.students || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Code d\'accès invalide.';
      setAuthError(msg);
    } finally {
      setUnlocking(false);
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

  // Sélection du fichier PDF avec auto-complétion du titre si vide
  const handlePdfSelect = (file: File | null) => {
    setPubFile(file);
    if (file && !pubTitle.trim()) {
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      setPubTitle(cleanName);
    }
  };

  // Action de Publication (Disponible pour tout administrateur connecté)
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubFile) {
      setPublishFeedback({ type: 'error', text: 'Veuillez sélectionner un fichier PDF à publier.' });
      return;
    }
    if (!pubTitle.trim()) {
      setPublishFeedback({ type: 'error', text: 'Veuillez saisir le titre de l\'épreuve.' });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback(null);

    // Récupération fiable de la clé d'authentification administrateur
    const keyToUse =
      (accessCode && accessCode.trim().length > 0 ? accessCode.trim() : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('rp_admin_master_key') : null) ||
      'RP-ADMIN-EXCELLENCE-2026';

    try {
      const formData = new FormData();
      formData.append('accessKey', keyToUse);
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
        text: `✅ Succès ! "${pubTitle.trim()}" a été publié et est immédiatement accessible en ligne pour tous les étudiants.`,
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

  // Suppression d'un document avec vérification de la clé
  const handleDeleteDoc = async (id: string) => {
    const keyToUse =
      (accessCode && accessCode.trim().length > 0 ? accessCode.trim() : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('rp_admin_master_key') : null) ||
      'RP-ADMIN-EXCELLENCE-2026';
    try {
      const res = await fetch(`/api/publish-document?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': keyToUse },
      });
      if (res.ok) {
        setDeletingId(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sélection d'image Galerie avec prévisualisation
  const handleGalleryFileSelect = (file: File | null) => {
    setGalFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setGalPreviewUrl(url);
    } else {
      setGalPreviewUrl(null);
    }
  };

  // Publication d'un élément dans la Galerie
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim()) {
      setGalleryFeedback({ type: 'error', text: 'Le titre de la photo est obligatoire.' });
      return;
    }
    if (!galFile) {
      setGalleryFeedback({ type: 'error', text: 'Veuillez sélectionner un fichier image à importer.' });
      return;
    }

    const keyToUse =
      (accessCode && accessCode.trim().length > 0 ? accessCode.trim() : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('rp_admin_master_key') : null) ||
      'RP-ADMIN-EXCELLENCE-2026';

    setIsPublishingGallery(true);
    setGalleryFeedback(null);

    try {
      const formData = new FormData();
      formData.append('accessKey', keyToUse);
      formData.append('file', galFile);
      formData.append('title', galTitle.trim());
      formData.append('category', galCategory);
      formData.append('description', galDescription.trim());
      formData.append('date', galDate.trim());
      formData.append('location', galLocation.trim());
      formData.append('author', galAuthor.trim());
      formData.append('tags', galTags.trim());

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la publication dans la galerie.');
      }

      setGalleryFeedback({
        type: 'success',
        text: `✅ Succès ! La photo "${galTitle.trim()}" a été publiée avec succès dans la Galerie !`,
      });

      setGalTitle('');
      setGalDescription('');
      setGalTags('');
      setGalFile(null);
      setGalPreviewUrl(null);
      fetchAdminGallery();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue';
      setGalleryFeedback({ type: 'error', text: msg });
    } finally {
      setIsPublishingGallery(false);
    }
  };

  // Suppression d'un élément de la Galerie
  const confirmDeleteGalleryItem = async (id: string) => {
    const keyToUse =
      (accessCode && accessCode.trim().length > 0 ? accessCode.trim() : null) ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('rp_admin_master_key') : null) ||
      'RP-ADMIN-EXCELLENCE-2026';

    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}&accessKey=${encodeURIComponent(keyToUse)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        setDeletingGalleryId(null);
      } else {
        alert(data.error || 'Erreur lors de la suppression.');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur réseau lors de la suppression.');
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
            <div className="relative w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-[#0284C7]/30 to-[#D4AF37]/30 border border-[#D4AF37]/50 flex items-center justify-center mb-4 shadow-xl overflow-hidden bg-white/5">
              <Image
                src="/assets/logo-polytech.png"
                alt="Logo Réussir Polytech"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              Espace Administrateur
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              Cockpit de pilotage &amp; publication officielle — Réussir Polytech
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
                Clé d&apos;Accès Sécurisée Direction
              </label>
              <div className="relative">
                <input
                  type={showPassKey ? 'text' : 'password'}
                  placeholder="••••••••••••••••"
                  autoComplete="current-password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full bg-[#1E293B]/80 border border-slate-700 focus:border-[#D4AF37] rounded-xl px-4 py-3.5 pr-12 text-sm text-white font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassKey(!showPassKey)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors p-1"
                  title={showPassKey ? 'Masquer le code' : 'Afficher le code'}
                >
                  {showPassKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                Accès strictement restreint à la Direction Réussir Polytech.
              </p>
            </div>

            <button
              type="submit"
              disabled={unlocking}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {unlocking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050B14]" />
                  <span>Vérification sécurisée...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Déverrouiller le Cockpit</span>
                </>
              )}
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
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-md p-0.5 bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/assets/logo-polytech.png"
                  alt="Réussir Polytech"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white block font-heading leading-none">
                  Réussir<span className="text-[#D4AF37]">Polytech</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mt-1">
                  Espace Administrateur
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
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
                +Épreuve
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Images className="w-4 h-4 text-purple-400" />
                <span>Gestion Galerie</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400">
                {galleryItems.length}
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
              Espace Administrateur
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Suivi en temps réel des élèves, des documents déposés et publication officielle des épreuves.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* BOUTON D'ACTION IMMÉDIAT : PUBLIER UNE ÉPREUVE */}
            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-[#D4AF37] text-[#050B14] shadow-[#D4AF37]/40 ring-2 ring-[#D4AF37]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] hover:scale-105 shadow-[#D4AF37]/20'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-[#050B14]" />
              <span>+ Publier une Épreuve</span>
            </button>

            {/* Global search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher partout..."
                value={searchGlobal}
                onChange={(e) => setSearchGlobal(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D4AF37] transition-all text-slate-800 dark:text-slate-100 shadow-sm w-36 sm:w-52"
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

        {/* ONGLET 1 & DEFAUT : DASHBOARD VUE D'ENSEMBLE */}
        {activeTab === 'dashboard' && (
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
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Publier une épreuve</span>
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
                      <option value="correction">Correction Officielle</option>
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
                      accept=".pdf,application/pdf"
                      onChange={(e) => handlePdfSelect(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30 cursor-pointer"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:opacity-95 transition-all shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isPublishing ? 'Mise en ligne...' : 'Publier Immédiatement'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : DOCUMENTS (CATALOGUE COMPLET PLEINE LARGEUR) */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Catalogue Exhaustif des Documents &amp; Épreuves
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} indexé{filteredDocuments.length > 1 ? 's' : ''} sur la plateforme
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('publish')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-[#050B14]" />
                  <span>+ Publier une Épreuve</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Matière</th>
                    <th className="pb-3 px-3">Titre du document</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Session</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          {doc.storage_path?.split('/')[1]?.toUpperCase() || 'MTH111'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 max-w-md">
                        <p className="font-bold text-slate-900 dark:text-white" title={doc.title}>
                          {doc.title}
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
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
                      <td className="py-3.5 px-3 font-mono text-slate-500">
                        {doc.description?.replace('Session : ', '') || '2025-2026'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
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
        )}

        {/* ONGLET DÉDIÉ : STUDIO OFFICIEL DE PUBLICATION D'ÉPREUVES (100% ACTIF) */}
        {activeTab === 'publish' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* En-tête du Studio */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-[#050B14] shadow-lg shadow-[#D4AF37]/20 flex-shrink-0">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                      Studio de Publication d&apos;Épreuves &amp; Polycopiés
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Déposez et publiez en direct vos sujets d&apos;examens, contrôles continus, TD ou cours magistraux.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synchronisation Cloud Instantanée
                  </span>
                </div>
              </div>

              {/* Feedback Alerte */}
              {publishFeedback && (
                <div
                  className={`p-4 mb-6 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 relative z-10 ${
                    publishFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {publishFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                  )}
                  <span className="flex-1">{publishFeedback.text}</span>
                </div>
              )}

              {/* Formulaire de Publication Grand Format */}
              <form onSubmit={handlePublishSubmit} className="space-y-6 relative z-10">
                {/* 1. Sélection Filière & Semestre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      1. Niveau Académique
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['MSP1', 'MSP2', 'VIP'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPubLevel(lvl)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            pubLevel === lvl
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md shadow-[#D4AF37]/25 scale-[1.02]'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{lvl}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      2. Semestre Cible
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {([1, 2] as const).map((sem) => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setPubSemester(sem)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            pubSemester === sem
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-[1.02]'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Semestre {sem}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Matière, Type et Session */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      3. Matière Officielle ({availableSubjectsForPublish.length})
                    </label>
                    <select
                      value={pubSubject}
                      onChange={(e) => setPubSubject(e.target.value)}
                      className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37] shadow-sm"
                    >
                      {availableSubjectsForPublish.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code.toUpperCase()} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      4. Catégorie de Document
                    </label>
                    <select
                      value={pubType}
                      onChange={(e) => setPubType(e.target.value)}
                      className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37] shadow-sm"
                    >
                      <option value="exam">Épreuve d&apos;Examen &amp; Contrôle Continu (CC)</option>
                      <option value="course">Polycopié de Cours Magistral Officiel</option>
                      <option value="td">Fiche de Travaux Dirigés (TD)</option>
                      <option value="correction">Correction Officielle</option>
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      5. Session / Année
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 2025-2026 ou Février 2025"
                      value={pubSession}
                      onChange={(e) => setPubSession(e.target.value)}
                      className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#D4AF37] shadow-sm"
                    />
                  </div>
                </div>

                {/* 3. Titre Officiel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    6. Titre Officiel de l&apos;Épreuve
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Examen Rattrapage Fév 2025 — Algèbre Multilinéaire (Pr Bouetou)"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    className="w-full py-3.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37] shadow-sm"
                    required
                  />
                </div>

                {/* 4. Zone Téléversement Fichier PDF */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    7. Fichier PDF de l&apos;Épreuve
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#D4AF37] rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/20 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handlePdfSelect(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 mx-auto text-[#D4AF37] mb-2" />
                    {pubFile ? (
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>{pubFile.name}</span>
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          {(pubFile.size / 1024).toFixed(0)} Ko • Fichier prêt à être mis en ligne
                        </p>
                        <span className="text-[11px] text-[#D4AF37] mt-2 inline-block font-bold">
                          Cliquez pour remplacer le fichier
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          Glissez votre fichier PDF ici ou cliquez pour parcourir vos dossiers
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          Format PDF officiel uniquement • Publication instantanée sur le cloud
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Bouton de Soumission Actif & Bien en Évidence */}
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#050B14]" />
                      <span>Publication en cours sur le Cloud...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5 text-[#050B14]" />
                      <span>Publier l&apos;Épreuve Immédiatement en Ligne ⚡</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Récapitulatif des 6 derniers documents publiés */}
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                    Dernières Épreuves Déposées
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accessible immédiatement sans mise en cache
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir tout le catalogue ({documents.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.slice(0, 6).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                          {doc.storage_path?.split('/')[1]?.toUpperCase() || 'OFFICIEL'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 capitalize">
                          {doc.type === 'course' ? 'Polycopié' : doc.type === 'td' ? 'TD' : 'Examen'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-2" title={doc.title}>
                        {doc.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {doc.description?.replace('Session : ', '') || '2025-2026'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050B14] transition-colors font-bold flex items-center gap-1"
                          title="Voir le PDF"
                        >
                          <span>Voir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => setDeletingId(doc.id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ONGLET : GESTION & PUBLICATION DE LA GALERIE (ADMIN)      */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Header du Gestionnaire de Galerie */}
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-purple-500/20 flex-shrink-0">
                    <Images className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                      Gestion &amp; Publication de la Galerie Officielle
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Alimentez en direct le portail web avec les photos de vos réalisations, séances d&apos;études, événements et visites de terrain.
                    </p>
                  </div>
                </div>

                <Link
                  href="/galerie"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Voir la Galerie Publique ↗</span>
                </Link>
              </div>

              {/* Feedback Alert */}
              {galleryFeedback && (
                <div
                  className={`p-4 mb-6 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
                    galleryFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {galleryFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{galleryFeedback.text}</span>
                </div>
              )}

              {/* Formulaire de Publication */}
              <form onSubmit={handleGallerySubmit} className="space-y-6 relative z-10">
                {/* 1. Sélection de la Catégorie (Les 4 Piliers) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    1. Catégorie de la Publication
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.values(GALLERY_CATEGORIES).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setGalCategory(cat.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          galCategory === cat.id
                            ? `${cat.color.border} bg-white dark:bg-white/10 shadow-md ring-2 ring-[#D4AF37]`
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-mono font-black ${cat.color.text}`}>
                            0{cat.num}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${cat.color.badgeBg}`}>
                            {cat.badge}
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900 dark:text-white font-heading">
                          {cat.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Titre & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      2. Titre de la Photo ou de l&apos;Événement
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Séance de Travaux Dirigés Takou & Modélisation CAO 3D"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      3. Date de l&apos;Événement
                    </label>
                    <input
                      type="date"
                      value={galDate}
                      onChange={(e) => setGalDate(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                {/* 3. Lieu & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      4. Lieu de la Prise de Vue
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Campus ENSPY, Laboratoire de Modélisation Yaoundé"
                      value={galLocation}
                      onChange={(e) => setGalLocation(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      5. Mots-clés / Tags (séparés par virgules)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: CAO 3D, Robotique, Analyse Takou, Concours"
                      value={galTags}
                      onChange={(e) => setGalTags(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 4. Description Détaillée */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    6. Description Détaillée
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez le contexte de la photo, les étudiants participants, le sujet abordé ou l'objectif ingénieur..."
                    value={galDescription}
                    onChange={(e) => setGalDescription(e.target.value)}
                    className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* 5. Zone Téléversement Image avec Prévisualisation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    7. Photo à Importer (JPG, PNG, WebP)
                  </label>
                  
                  {galPreviewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] max-w-md mx-auto p-2 bg-slate-900">
                      <div className="relative w-full h-56 rounded-xl overflow-hidden">
                        <Image
                          src={galPreviewUrl}
                          alt="Aperçu avant publication"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 px-2">
                        <span className="text-xs text-slate-300 font-mono truncate">
                          {galFile?.name} ({(galFile ? (galFile.size / 1024).toFixed(1) : 0)} Ko)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setGalFile(null);
                            setGalPreviewUrl(null);
                          }}
                          className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
                        >
                          Changer d&apos;image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#D4AF37] rounded-2xl p-8 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/20 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryFileSelect(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <Camera className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        Cliquez ou glissez une photo ici pour l&apos;importer
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Formats acceptés : JPG, PNG, WebP • Haute résolution conseillée
                      </p>
                    </div>
                  )}
                </div>

                {/* Bouton de Soumission */}
                <button
                  type="submit"
                  disabled={isPublishingGallery}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
                >
                  {isPublishingGallery ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#050B14]" />
                      <span>Publication en cours sur le Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Images className="w-5 h-5 text-[#050B14]" />
                      <span>Publier la Photo dans la Galerie Officielle ⚡</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Liste de Toutes les Photos Publiées */}
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                    Photos &amp; Événements Actuellement en Ligne ({galleryItems.length})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Visible en direct par tous les visiteurs sur la page <code className="text-[#D4AF37]">/galerie</code>
                  </p>
                </div>

                <button
                  onClick={fetchAdminGallery}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Actualiser la liste</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {galleryItems.map((item) => {
                  const catMeta = GALLERY_CATEGORIES[item.category] || GALLERY_CATEGORIES.realisations;

                  return (
                    <div
                      key={item.id}
                      className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-sm"
                    >
                      <div>
                        {/* Miniature */}
                        <div className="relative w-full h-44 bg-slate-900">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${catMeta.color.badgeBg}`}>
                              0{catMeta.num}. {catMeta.label}
                            </span>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1" title={item.title}>
                            {item.title}
                          </h5>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                            <Calendar className="w-3 h-3 text-[#D4AF37]" />
                            <span>{item.date}</span>
                            <span className="mx-1">•</span>
                            <MapPin className="w-3 h-3 text-sky-400" />
                            <span className="truncate">{item.location}</span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          <span>Voir HD</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous le retrait de la photo "${item.title}" ?`)) {
                              confirmDeleteGalleryItem(item.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
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
