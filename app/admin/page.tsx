'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  LayoutDashboard,
  UploadCloud,
  FileText,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Database,
  Cloud,
  Clock,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  description?: string;
  file_url: string;
  created_at: string;
  subject_id: string;
  level_id?: string;
}

const AVAILABLE_SUBJECTS = [
  // MSP1
  { code: 'mth111', name: 'Analyse réelle 1 (Takou)', level: 'MSP1', semester: 1 },
  { code: 'mth112', name: 'Algèbre Générale (Bouetou)', level: 'MSP1', semester: 1 },
  { code: 'phy111', name: 'Électromagnétisme 1', level: 'MSP1', semester: 1 },
  { code: 'phy112', name: 'Mécanique du point', level: 'MSP1', semester: 1 },
  { code: 'phy113', name: 'TP Physique', level: 'MSP1', semester: 1 },
  { code: 'inf111', name: 'Informatique 1 (Algorithmique)', level: 'MSP1', semester: 1 },
  { code: 'chm111', name: 'Éléments de Chimie', level: 'MSP1', semester: 1 },
  { code: 'lng111', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 1 },
  { code: 'mec111', name: 'Dessin technique', level: 'MSP1', semester: 1 },
  { code: 'eps111', name: 'Comportement et Sport', level: 'MSP1', semester: 1 },

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
  // Sécurité & Gatekeeper
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  // Navigation Cockpit
  const [activeTab, setActiveTab] = useState<'overview' | 'publish' | 'manage'>('overview');

  // Données & Télémétrie
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Formulaire de Publication
  const [pubLevel, setPubLevel] = useState<'MSP1' | 'MSP2' | 'VIP'>('MSP1');
  const [pubSemester, setPubSemester] = useState<1 | 2>(1);
  const [pubSubject, setPubSubject] = useState('mth111');
  const [pubType, setPubType] = useState('exam');
  const [pubTitle, setPubTitle] = useState('');
  const [pubSession, setPubSession] = useState('2025-2026');
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Gestionnaire de Documents
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modale d'Édition
  const [editingDoc, setEditingDoc] = useState<ResourceItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSession, setEditSession] = useState('');
  const [editType, setEditType] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Modale de Suppression
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Initialisation de la clé d'accès depuis la session
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

  // 2. Charger les documents
  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/publish-document');
      const data = await res.json();
      if (data.resources) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error('Erreur chargement documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadDocuments();
    }
  }, [isUnlocked]);

  // Validation du Code d'Accès
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = accessCode.trim().toUpperCase();
    if (clean === 'RP-ADMIN-EXCELLENCE-2026' || clean === 'POLYTECH2026') {
      setIsUnlocked(true);
      setAuthError('');
      sessionStorage.setItem('rp_admin_master_key', clean);
      loadDocuments();
    } else {
      setAuthError('Code d\'accès administrateur incorrect. Veuillez renseigner le code délivré à la Direction.');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('rp_admin_master_key');
  };

  // Filtrer les matières selon niveau & semestre pour le formulaire
  const currentSubjects = AVAILABLE_SUBJECTS.filter((s) => s.level === pubLevel && (pubLevel === 'VIP' || s.semester === pubSemester));

  // Mise à jour de la matière sélectionnée par défaut lors du changement d'onglet
  useEffect(() => {
    if (currentSubjects.length > 0 && !currentSubjects.some((s) => s.code === pubSubject)) {
      setPubSubject(currentSubjects[0].code);
    }
  }, [pubLevel, pubSemester, currentSubjects, pubSubject]);

  // Publication d'un document
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubFile) {
      setStatusMessage({ type: 'error', text: 'Veuillez joindre le fichier PDF.' });
      return;
    }
    if (!pubTitle.trim()) {
      setStatusMessage({ type: 'error', text: 'Veuillez saisir le titre de l\'épreuve ou du cours.' });
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);

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

      setStatusMessage({
        type: 'success',
        text: `✅ Succès ! "${pubTitle}" a été publié et est immédiatement accessible en ligne.`,
      });

      setPubFile(null);
      setPubTitle('');
      loadDocuments();
      setActiveTab('manage');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsPublishing(false);
    }
  };

  // Suppression d'un document
  const confirmDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/publish-document?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': accessCode,
        },
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Impossible de supprimer le document.');
      }

      setStatusMessage({ type: 'success', text: '✅ Document retiré de la plateforme avec succès.' });
      setDeletingId(null);
      loadDocuments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  // Modification d'un document
  const handleUpdateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setIsUpdating(true);
    try {
      const res = await fetch('/api/publish-document', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDoc.id,
          accessKey: accessCode,
          title: editTitle,
          description: editSession ? `Session : ${editSession}` : '',
          type: editType,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la mise à jour.');
      }

      setStatusMessage({ type: 'success', text: '✅ Document mis à jour avec succès.' });
      setEditingDoc(null);
      loadDocuments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtrer les documents dans le gestionnaire
  const filteredDocs = resources.filter((doc) => {
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'ALL' || doc.type.toLowerCase() === filterType.toLowerCase();

    return matchesQuery && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#050B14] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* ========================================================================= */}
        {/* ÉCRAN DE VERROUILLAGE SÉCURISÉ (GATEKEEPER)                               */}
        {/* ========================================================================= */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto py-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/15 border-2 border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-6 text-[#D4AF37] shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
              ACCÈS STRICTEMENT RESTREINT
            </span>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-3 mb-2">
              Cockpit Administrateur
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Veuillez saisir votre Code d&apos;Accès Unique délivré à la Direction Générale de Réussir Polytech pour déverrouiller le tableau de bord.
            </p>

            {authError && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleUnlock} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
              <div className="text-left">
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Code Unique de Sécurité
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Ex: RP-ADMIN-EXCELLENCE-2026"
                    className="input-field text-sm font-mono pl-10"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7A1E] text-slate-950 font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Déverrouiller le Cockpit</span>
              </button>
            </form>
          </div>
        ) : (

          /* ========================================================================= */
          /* ESPACE COCKPIT ADMINISTRATEUR ACTIF                                       */
          /* ========================================================================= */
          <div>
            {/* Barre Supérieure du Cockpit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                    Cockpit Opérationnel • Accès Direction
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                  Espace & Cockpit Administrateur
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  &ldquo;L&apos;excellence est notre seul standard.&rdquo; • Gestion intégrale MSP1, MSP2 & VIP
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadDocuments}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Rafraîchir les données"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingDocs ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleLock}
                  className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verrouiller</span>
                </button>
              </div>
            </div>

            {/* Notification de Statut */}
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-md ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="text-xs font-bold opacity-60 hover:opacity-100 ml-4"
                >
                  Fermer
                </button>
              </motion.div>
            )}

            {/* Navigation des 3 Onglets Principaux du Cockpit */}
            <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 mb-8 max-w-xl">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Tableau de Bord</span>
              </button>

              <button
                onClick={() => setActiveTab('publish')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'publish'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                <span>Publier un Sujet</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'manage'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Gérer les Documents ({resources.length})</span>
              </button>
            </div>

            {/* =================================================================== */}
            {/* ONGLET 1 : TABLEAU DE BORD & TÉLÉMÉTRIE D'ANALYSE                    */}
            {/* =================================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 4 Cartes Métriques Cockpit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-500 font-bold">100% En Ligne</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                      {resources.length}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      Total Documents Certifiés
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Stockés dans Supabase Cloud
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-[#D4AF37] font-bold">1ère Année</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                      19
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      Matières MSP1 Couvertes
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Semestre 1 & Semestre 2
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-sky-500 font-bold">2ème Année</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                      16
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      Matières MSP2 Couvertes
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Semestre 3 & Semestre 4
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <Database className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-500 font-bold">Supabase 2026</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                      Actif
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      PostgreSQL & Storage
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Bucket academic-files OK
                    </p>
                  </div>
                </div>

                {/* État des Services & Accès Rapides */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-white/10">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>Derniers Documents Ajoutés à la Plateforme</span>
                    </h3>

                    {resources.length === 0 ? (
                      <p className="text-xs text-slate-500">Aucun document chargé.</p>
                    ) : (
                      <div className="space-y-3">
                        {resources.slice(0, 5).map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {doc.title}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {doc.type.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-white/10 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Actions d&apos;Administration</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Utilisez le Cockpit pour alimenter vos filières, corriger des affectations de documents ou retirer les épreuves obsolètes.
                    </p>

                    <button
                      onClick={() => setActiveTab('publish')}
                      className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Publier un nouveau sujet</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('manage')}
                      className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ouvrir la liste des documents</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* ONGLET 2 : PUBLIER UNE ÉPREUVE (MSP1, MSP2, VIP)                   */}
            {/* =================================================================== */}
            {activeTab === 'publish' && (
              <form
                onSubmit={handlePublishSubmit}
                className="max-w-3xl mx-auto glass-card p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
                    Publier un Document dans la Base
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Le sujet sera instantanément stocké dans Supabase et accessible pour les étudiants.
                  </p>
                </div>

                {/* 1. Sélection du Niveau */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                    1. Niveau / Pôle d&apos;Étude
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['MSP1', 'MSP2', 'VIP'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPubLevel(lvl)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                          pubLevel === lvl
                            ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-md'
                            : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {lvl === 'MSP1' ? 'MSP1 (1ère Année)' : lvl === 'MSP2' ? 'MSP2 (2ème Année)' : 'VIP Entrepreneur'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sélection du Semestre (si MSP1 ou MSP2) */}
                {pubLevel !== 'VIP' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                      2. Semestre
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([1, 2] as const).map((sem) => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setPubSemester(sem)}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                            pubSemester === sem
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          Semestre {sem}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Matière de Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                    3. Matière Exacte
                  </label>
                  <select
                    value={pubSubject}
                    onChange={(e) => setPubSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    {currentSubjects.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code.toUpperCase()} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Type & Session */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                      Catégorie de Ressource
                    </label>
                    <select
                      value={pubType}
                      onChange={(e) => setPubType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="exam">Épreuve & Examen / CC</option>
                      <option value="course">Polycopié de Cours Magistral</option>
                      <option value="td">Fiche de TD / Exercices d&apos;Entraînement</option>
                      <option value="correction">Correction Officielle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                      Session / Année
                    </label>
                    <input
                      type="text"
                      value={pubSession}
                      onChange={(e) => setPubSession(e.target.value)}
                      placeholder="Ex: 2024-2025 ou Janvier 2025"
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* 5. Titre Officiel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                    Titre Officiel du Document
                  </label>
                  <input
                    type="text"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="Ex: Contrôle Continu N°1 — Analyse Réelle 1 (Pr E. Takou)"
                    className="input-field text-sm"
                  />
                </div>

                {/* 6. Fichier PDF */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase font-mono">
                    Fichier PDF
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-6 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-white/40 dark:bg-white/5">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setPubFile(f);
                          if (!pubTitle) {
                            setPubTitle(f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 mx-auto text-[#D4AF37] mb-2" />
                    {pubFile ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{pubFile.name}</p>
                        <p className="text-xs text-emerald-500 font-semibold mt-1">
                          {(pubFile.size / 1024).toFixed(0)} Ko • Prêt à être envoyé
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          Glissez le fichier PDF ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Format PDF certifié</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7A1E] text-slate-950 font-black text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPublishing ? 'Publication en cours dans Supabase...' : 'Enregistrer et Mettre en Ligne Immédiatement ⚡'}</span>
                </button>
              </form>
            )}

            {/* =================================================================== */}
            {/* ONGLET 3 : GESTIONNAIRE DES DOCUMENTS (MODIFIER, RETIRER)           */}
            {/* =================================================================== */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                {/* Barre de Recherche & Filtres */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par titre ou session..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <option value="ALL">Toutes Catégories</option>
                      <option value="exam">Examens & CC</option>
                      <option value="course">Polycopiés de Cours</option>
                      <option value="td">Fiches de TD</option>
                      <option value="correction">Corrections</option>
                    </select>
                  </div>
                </div>

                {/* Liste des Documents */}
                <div className="glass-card rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-md">
                  <div className="divide-y divide-slate-200 dark:divide-white/10">
                    {filteredDocs.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        Aucun document trouvé correspondant à vos critères.
                      </div>
                    ) : (
                      filteredDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                {doc.type.toUpperCase()}
                              </span>
                              {doc.description && (
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                  {doc.description}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {doc.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                              title="Visualiser le PDF"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => {
                                setEditingDoc(doc);
                                setEditTitle(doc.title);
                                setEditSession(doc.description?.replace('Session : ', '') || '');
                                setEditType(doc.type);
                              }}
                              className="p-2 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeletingId(doc.id)}
                              className="p-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Retirer (Supprimer)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modale de Confirmation de Suppression */}
            {deletingId && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Retirer cette épreuve ?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Cette action supprimera définitivement le fichier et sa référence de la base de données.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => confirmDelete(deletingId)}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                    >
                      Oui, Retirer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modale de Modification de Titre / Session */}
            {editingDoc && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleUpdateDoc}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Modifier les Informations du Document
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-field text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Session / Année
                    </label>
                    <input
                      type="text"
                      value={editSession}
                      onChange={(e) => setEditSession(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option value="exam">Épreuve & Examen / CC</option>
                      <option value="course">Polycopié de Cours</option>
                      <option value="td">Fiche de TD</option>
                      <option value="correction">Correction Officielle</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingDoc(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold"
                    >
                      {isUpdating ? 'Enregistrement...' : 'Mettre à jour'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
