'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Sparkles, ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PublishedDoc {
  id: string;
  title: string;
  type: string;
  file_url: string;
  created_at: string;
  description?: string;
}

export default function QuickPublishPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('mth111');
  const [type, setType] = useState('exam');
  const [date, setDate] = useState('2025-2026');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentDocs, setRecentDocs] = useState<PublishedDoc[]>([]);

  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/publish-document');
      const data = await res.json();
      if (data.resources) {
        setRecentDocs(data.resources.slice(0, 8));
      }
    } catch {
      // Ignorer
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }
    if (!title.trim()) {
      setError('Veuillez renseigner le titre du document.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('subjectCode', subjectCode);
      formData.append('type', type);
      formData.append('date', date);

      const res = await fetch('/api/publish-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la publication.');
      }

      setSuccess(`Document "${title}" publié avec succès en direct sur le site et dans Supabase !`);
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* En-tête */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publication Éclair — Supabase Cloud</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
            Publier une Épreuve ou un Cours en 1 Clic
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
            Ajoutez un fichier PDF directement dans la base de données Supabase. Le document devient instantanément visible pour tous les étudiants sur le site web.
          </p>
        </div>

        {/* Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{success}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Formulaire de publication */}
        <form
          onSubmit={handleUpload}
          className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6"
        >
          {/* Sélection du fichier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Fichier PDF à publier
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
                      // Nom convivial par défaut sans extension
                      const nameWithoutExt = f.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
                      setTitle(nameWithoutExt);
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 mx-auto text-[#D4AF37] mb-2" />
              {file ? (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {(file.size / 1024).toFixed(0)} Ko • Prêt à être publié
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Cliquez ou glissez-déposez votre document PDF ici
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format PDF jusqu'à 50 Mo</p>
                </div>
              )}
            </div>
          </div>

          {/* Titre du document */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Titre officiel du document
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Examen Final Analyse Réelle 1 (Session 2026)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Grille : Matière, Type, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Matière
              </label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="mth111">MTH111 — Analyse réelle 1</option>
                <option value="mth112">MTH112 — Algèbre Générale</option>
                <option value="phy111">PHY111 — Électromagnétisme 1</option>
                <option value="phy112">PHY112 — Mécanique du point</option>
                <option value="inf111">INF111 — Informatique 1</option>
                <option value="gmc121">GMC121 — Sciences des Matériaux (TSM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Type de document
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="exam">Épreuve / Examen / CC</option>
                <option value="course">Polycopié de Cours</option>
                <option value="td">Fiche de TD / Exercices</option>
                <option value="correction">Correction Officielle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Session / Année
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 2025-2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
              </input>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-sm shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publication ultra-rapide sur Supabase...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Publier Immédiatement sur le Site ⚡</span>
              </>
            )}
          </button>
        </form>

        {/* Dernières publications sur Supabase */}
        {recentDocs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Documents Récents Publiés en Ligne</span>
              </h2>
              <Link
                href="/msp1"
                className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>Accéder à MSP1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl glass-card border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate text-slate-900 dark:text-white">
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
                    className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-200 dark:bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors flex-shrink-0"
                  >
                    Voir
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
