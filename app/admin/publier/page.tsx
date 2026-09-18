'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Trash2,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface PublishedDoc {
  id: string;
  title: string;
  type: string;
  file_url: string;
  created_at: string;
  description?: string;
  subject_id: string;
}

// Liste complète et catégorisée des matières par niveau et semestre
const AVAILABLE_SUBJECTS = [
  // MSP1 — Semestre 1
  { code: 'mth111', name: 'Analyse réelle 1', level: 'MSP1', semester: 1 },
  { code: 'mth112', name: 'Algèbre Générale', level: 'MSP1', semester: 1 },
  { code: 'phy111', name: 'Électromagnétisme 1', level: 'MSP1', semester: 1 },
  { code: 'phy112', name: 'Mécanique du point', level: 'MSP1', semester: 1 },
  { code: 'phy113', name: 'TP Physique', level: 'MSP1', semester: 1 },
  { code: 'inf111', name: 'Informatique 1 (Algorithmique)', level: 'MSP1', semester: 1 },
  { code: 'chm111', name: 'Éléments de Chimie', level: 'MSP1', semester: 1 },
  { code: 'lng111', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 1 },
  { code: 'mec111', name: 'Dessin technique', level: 'MSP1', semester: 1 },
  { code: 'eps111', name: 'Comportement et Sport', level: 'MSP1', semester: 1 },

  // MSP1 — Semestre 2
  { code: 'mth121', name: 'Analyse réelle 2', level: 'MSP1', semester: 2 },
  { code: 'mth122', name: 'Géométrie euclidienne et affine', level: 'MSP1', semester: 2 },
  { code: 'mth123', name: 'Algèbre linéaire', level: 'MSP1', semester: 2 },
  { code: 'phy121', name: 'Électromagnétisme 2', level: 'MSP1', semester: 2 },
  { code: 'gmc121', name: 'Technologie et sciences des matériaux (TSM)', level: 'MSP1', semester: 2 },
  { code: 'inf121', name: 'Informatique 2', level: 'MSP1', semester: 2 },
  { code: 'lng121', name: 'Langue (Anglais/Français) 2', level: 'MSP1', semester: 2 },
  { code: 'mec121', name: 'Dessin technique 2', level: 'MSP1', semester: 2 },
  { code: 'eps121', name: 'Comportement et Sport 2', level: 'MSP1', semester: 2 },
];

export default function AdminPublishPage() {
  const [accessKey, setAccessKey] = useState('');
  const [level, setLevel] = useState<'MSP1' | 'MSP2'>('MSP1');
  const [semester, setSemester] = useState<1 | 2>(1);
  const [subjectCode, setSubjectCode] = useState('mth111');
  const [type, setType] = useState('exam');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-2026');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentDocs, setRecentDocs] = useState<PublishedDoc[]>([]);

  // Filtrer les matières selon le niveau et semestre sélectionnés
  const filteredSubjects = AVAILABLE_SUBJECTS.filter(
    (s) => s.level === level && s.semester === semester
  );

  // Mémoriser la clé d'accès dans la session
  useEffect(() => {
    try {
      const savedKey = sessionStorage.getItem('rp_admin_key');
      if (savedKey) setAccessKey(savedKey);
    } catch {
      // Ignorer
    }
    fetchRecent();
  }, []);

  // Mettre à jour la matière par défaut si le semestre change
  useEffect(() => {
    if (filteredSubjects.length > 0 && !filteredSubjects.some((s) => s.code === subjectCode)) {
      setSubjectCode(filteredSubjects[0].code);
    }
  }, [level, semester, filteredSubjects, subjectCode]);

  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/publish-document');
      const data = await res.json();
      if (data.resources) {
        setRecentDocs(data.resources);
      }
    } catch {
      // Ignorer
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessKey.trim()) {
      setError('Veuillez saisir votre clé d\'accès administrateur.');
      return;
    }

    if (!file) {
      setError('Veuillez sélectionner le fichier PDF de l\'épreuve ou du cours.');
      return;
    }

    if (!title.trim()) {
      setError('Veuillez saisir le titre officiel du document.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('accessKey', accessKey.trim());
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('subjectCode', subjectCode);
      formData.append('type', type);
      formData.append('date', date.trim());

      const res = await fetch('/api/publish-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la publication.');
      }

      // Sauvegarder la clé dans la session
      sessionStorage.setItem('rp_admin_key', accessKey.trim());

      const chosenSubject = AVAILABLE_SUBJECTS.find((s) => s.code === subjectCode)?.name || subjectCode;
      setSuccess(`✅ Succès ! Le document "${title}" a été enregistré sous "${chosenSubject}" et est immédiatement en ligne sur le site !`);

      // Réinitialiser les champs
      setFile(null);
      setTitle('');
      fetchRecent();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur imprévue';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Titre & Badges */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Portail Équipe & Direction — Publication Directe</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
            Publier un Sujet ou un Cours sur la Plateforme
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2.5">
            Sélectionnez avec précision la matière et le type de document. Le sujet sera instantanément stocké dans Supabase et visible en direct pour les étudiants.
          </p>
        </div>

        {/* Messages de statut */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 shadow-md"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{success}</p>
              <div className="mt-2 flex gap-3">
                <Link
                  href="/msp1"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <span>Aller vérifier sur la page MSP1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-center gap-3 shadow-md"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="text-sm font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Formulaire Principal */}
        <form
          onSubmit={handlePublish}
          className="glass-card p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-white/10 shadow-2xl space-y-6"
        >
          {/* Section 1 : Clé d'Accès Administrateur */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
              <KeyRound className="w-4 h-4" />
              <span>Clé d&apos;accès Administrateur / Équipe</span>
            </label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Entrez votre clé d'accès (ex: POLYTECH2026)"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-black/40 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Cette clé protège la publication et garantit que seule l&apos;équipe autorisée peut publier des sujets.
            </p>
          </div>

          {/* Section 2 : Orientation du Sujet (Niveau, Semestre, Matière) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span>1. Destination exacte du document</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Niveau */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Niveau Académique
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['MSP1', 'MSP2'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        level === lvl
                          ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-sm'
                          : 'bg-white/50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl === 'MSP1' ? 'MSP1 (1ère Année)' : 'MSP2 (2ème Année)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semestre */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Semestre
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {([1, 2] as const).map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSemester(sem)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        semester === sem
                          ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-sm'
                          : 'bg-white/50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Semestre {sem}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matière Spécifique */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Matière exacte de destination
              </label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {filteredSubjects.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code.toUpperCase()} — {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3 : Type & Informations */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>2. Type & Informations sur l&apos;épreuve</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Catégorie du document
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="exam">Épreuve & Examen / Contrôle Continu (CC)</option>
                  <option value="course">Polycopié de Cours Magistral</option>
                  <option value="td">Fiche de TD / Exercices d&apos;Entraînement</option>
                  <option value="correction">Correction Officielle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Session / Année académique
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ex: 2024-2025 ou Janvier 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Titre officiel du sujet
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Contrôle Continu N°1 — Analyse Réelle 1 (Pr E. Takou)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Section 4 : Sélection du Fichier PDF */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Fichier PDF
            </label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-6 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-white/40 dark:bg-white/5">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    if (!title) {
                      const cleanName = f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
                      setTitle(cleanName);
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-[#D4AF37] mb-2" />
              {file ? (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    {(file.size / 1024).toFixed(0)} Ko • Fichier sélectionné
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Glissez votre fichier PDF ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Le fichier sera certifié et disponible en ligne immédiatement
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bouton de Publication */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publication directe dans Supabase...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Enregistrer et Publier le Sujet en Ligne ⚡</span>
              </>
            )}
          </button>
        </form>

        {/* Liste des Documents Déjà en Ligne */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black font-heading">
                Documents Actuellement Publiés sur la Plateforme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {recentDocs.length} documents enregistrés dans votre base de données
              </p>
            </div>
            <Link
              href="/msp1"
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5"
            >
              <span>Ouvrir l&apos;Espace MSP1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl glass-card border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {doc.type.toUpperCase()} {doc.description ? `• ${doc.description}` : ''}
                    </p>
                  </div>
                </div>

                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <span>Voir</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
