'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, MessageCircle, X, Loader2, BookOpen, FileText, Award, Download, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { type Subject, type Resource } from '@/data/curriculum';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabaseClient';

interface CloudDoc {
  id: string;
  title: string;
  type: string;
  description?: string;
  file_url: string;
  created_at: string;
  storage_path?: string;
}

interface ResourceModalProps {
  resource: Resource;
  subject: Subject;
  initialCloudDocs: CloudDoc[];
  onClose: () => void;
}

function ResourceListModal({ resource, subject, initialCloudDocs, onClose }: ResourceModalProps) {
  const [cloudItems, setCloudItems] = useState<CloudDoc[]>(initialCloudDocs);
  const [loading, setLoading] = useState(false);

  const fetchCloudDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/publish-document?subjectCode=${subject.code.toLowerCase()}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.resources && Array.isArray(data.resources)) {
          setCloudItems(data.resources);
        }
      }
    } catch (err) {
      console.error('Erreur chargement cloud docs:', err);
    } finally {
      setLoading(false);
    }
  }, [subject.code]);

  // Si aucun document initial, tenter une requête directe
  useEffect(() => {
    fetchCloudDocs();
  }, [fetchCloudDocs]);

  // Type mapping Supabase -> Curriculum
  const typeMap: Record<string, string> = {
    exam: 'EXAMEN',
    course: 'COURS',
    td: 'TD',
    correction: 'CORRECTION',
  };

  // Filtrer les documents cloud correspondant au type de ressource
  const matchedCloud = cloudItems.filter(
    (r) => typeMap[r.type?.toLowerCase()] === resource.type
  );

  // Compiler la liste globale des documents
  const allDocs: Array<{ title: string; url: string; date?: string; isCloud?: boolean }> = [];

  // 1. Documents Cloud Supabase
  for (const c of matchedCloud) {
    allDocs.push({
      title: c.title,
      url: c.file_url,
      date: c.description ? c.description.replace('Session : ', '') : 'En ligne',
      isCloud: true,
    });
  }

  // 2. Documents locaux du curriculum (items)
  if (resource.items && resource.items.length > 0) {
    for (const item of resource.items) {
      if (!allDocs.some((d) => d.title.toLowerCase().trim() === item.title.toLowerCase().trim())) {
        allDocs.push({
          title: item.title,
          url: item.url,
          date: item.date || 'Officiel',
          isCloud: false,
        });
      }
    }
  }

  // 3. Document direct (url) s'il existe et non présent
  if (resource.url && !allDocs.some((d) => d.url === resource.url)) {
    allDocs.push({
      title: `Polycopié officiel — ${subject.name}`,
      url: resource.url,
      date: 'Programme officiel',
      isCloud: false,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg p-6 sm:p-7 border-2 border-[#D4AF37]/60 shadow-2xl relative holographic rounded-3xl"
        style={{
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
        }}
      >
        {/* En-tête modal */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-full px-3 py-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-mono font-bold">{subject.code}</span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-700 dark:text-slate-300 text-xs font-bold">{subject.name}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
              {resource.label}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Documents officiels vérifiés — Téléchargement libre & direct
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchCloudDocs()}
              disabled={loading}
              title="Rafraîchir les documents"
              className="text-slate-400 hover:text-[#D4AF37] p-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="space-y-3 mb-6 max-h-[55vh] overflow-y-auto pr-1">
          {loading && allDocs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-[#D4AF37] animate-spin" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Recherche des documents en ligne...
              </p>
            </div>
          ) : allDocs.length > 0 ? (
            allDocs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-[#D4AF37]/60 transition-all flex items-center justify-between gap-4 group hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {item.date && (
                      <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
                        {item.date}
                      </span>
                    )}
                    {item.isCloud && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Mis en ligne
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-md shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ouvrir PDF</span>
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
              <BookOpen className="w-10 h-10 text-[#D4AF37]/60 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                Document en cours de numérisation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
                Aucun fichier n&apos;est encore disponible dans cette catégorie. Dès qu&apos;un administrateur publie un document, il apparaît ici immédiatement.
              </p>
              <a
                href={`https://wa.me/237695957287?text=${encodeURIComponent(
                  `Bonjour Réussir Polytech, je sollicite le document (${resource.label}) pour la matière ${subject.name} (${subject.code}). Est-il disponible ?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Demander sur WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          Fermer la liste
        </button>
      </motion.div>
    </motion.div>
  );
}

interface CorrectionModalProps {
  subject: Subject;
  onClose: () => void;
}

function CorrectionModal({ subject, onClose }: CorrectionModalProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handlePay = async (target: 'EUGENE' | 'YANNICK') => {
    setLoading(true);
    let studentName = 'Élève Ingénieur';
    let matricule = 'N/A';
    let level = 'MSP1';
    let phone = 'N/A';

    // 1. Session locale
    if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('polytech_user_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.name) studentName = parsed.name;
          if (parsed.matricule) matricule = parsed.matricule;
          if (parsed.level) level = parsed.level;
          if (parsed.phone) phone = parsed.phone;
        }
      } catch {
        // Ignorer
      }
    }

    // 2. Supabase
    let userId = null;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          studentName = profile.full_name || studentName;
          matricule = profile.matricule || matricule;
          level = profile.level || level;
          phone = profile.phone || phone;
        } else if (user.user_metadata) {
          studentName = user.user_metadata.full_name || studentName;
          matricule = user.user_metadata.matricule || matricule;
          level = user.user_metadata.level || level;
          phone = user.user_metadata.phone || phone;
        }
      }
    } catch {
      // Ignorer
    }

    const channel = target === 'EUGENE' ? 'CORRECTION_EUGENE' : 'CORRECTION_YANNICK';
    sendWhatsAppNotification(channel, {
      studentName,
      matricule,
      level,
      phone,
      itemTitle: subject.name,
      subject: subject.code,
    });

    if (userId) {
      try {
        await supabase.from('correction_requests').insert({
          student_id: userId,
          student_name: studentName,
          matricule,
          subject_name: subject.name,
          academic_level: level,
          phone,
        });
      } catch {
        // Ignorer
      }
    }

    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-md p-7 border-2 border-[#D4AF37] shadow-2xl rounded-3xl relative holographic"
        style={{
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.35)',
        }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-full px-3 py-1 mb-2">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-mono font-bold">{subject.code}</span>
            </div>
            <h3 className="text-slate-900 dark:text-white font-black text-xl font-heading leading-tight">
              Débloquer la Correction Certifiée
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 font-semibold">{subject.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-2xl p-4 mb-5">
          <p className="text-[#D4AF37] text-xs font-black mb-1 flex items-center gap-2">
            <span>👑 Rédaction & Barème Officiel des Majors</span>
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed">
            Obtenez la correction détaillée avec la rigueur méthodologique exigée aux examens. Contactez directement la direction sur WhatsApp pour le règlement Orange Money / Mobile Money.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-heading">
            Sélectionnez votre contact pour régler :
          </p>

          <button
            onClick={() => handlePay('EUGENE')}
            disabled={loading}
            className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black py-3 px-4.5 rounded-xl transition-all shadow-md shadow-[#D4AF37]/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <MessageCircle className="w-5 h-5 text-[#050B14]" />
              <div>
                <p className="text-xs font-black leading-tight">Payer auprès d&apos;Eugène Samuel GWET</p>
                <p className="text-[10px] opacity-75 font-semibold">Direction Générale & PCA</p>
              </div>
            </div>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs font-black">→</span>}
          </button>

          <button
            onClick={() => handlePay('YANNICK')}
            disabled={loading}
            className="w-full flex items-center justify-between gap-3 bg-sky-600 hover:bg-sky-500 text-white font-black py-3 px-4.5 rounded-xl transition-all shadow-md shadow-sky-600/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <MessageCircle className="w-5 h-5 text-white" />
              <div>
                <p className="text-xs font-black leading-tight">Payer auprès de Yannick BIKEY</p>
                <p className="text-[10px] opacity-75 font-semibold">Direction Informatique et Opérations</p>
              </div>
            </div>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-xs font-black">→</span>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const resourceConfig: Record<
  Resource['type'],
  { icon: typeof BookOpen; label: string; color: string }
> = {
  COURS: { icon: BookOpen, label: 'Polycopié', color: 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10' },
  TD: { icon: FileText, label: 'Fiches TD', color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  EXAMEN: { icon: Award, label: 'Examens & CC', color: 'text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/10' },
  CORRECTION: { icon: Lock, label: 'Correction', color: 'text-[#D4AF37] border-[#D4AF37]/40 bg-[#D4AF37]/10' },
};

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export function SubjectCard({ subject, index }: SubjectCardProps) {
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [activeResourceList, setActiveResourceList] = useState<Resource | null>(null);
  const [cloudDocs, setCloudDocs] = useState<CloudDoc[]>([]);

  // Synchronisation dynamique des documents publiés pour cette matière
  useEffect(() => {
    let isMounted = true;
    const loadCloudDocs = async () => {
      try {
        const res = await fetch(`/api/publish-document?subjectCode=${subject.code.toLowerCase()}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.resources && Array.isArray(data.resources)) {
            setCloudDocs(data.resources);
          }
        }
      } catch {
        // Silencieux
      }
    };
    loadCloudDocs();
    return () => { isMounted = false; };
  }, [subject.code]);

  // Calcul du nombre de documents réels disponibles pour chaque type
  const getResourceCount = (type: Resource['type']) => {
    const localRes = subject.resources.find((r) => r.type === type);
    const localCount = (localRes?.items?.length || 0) + (localRes?.url ? 1 : 0);

    const typeKeyMap: Record<string, string> = {
      COURS: 'course',
      TD: 'td',
      EXAMEN: 'exam',
      CORRECTION: 'correction',
    };

    const cloudCount = cloudDocs.filter(
      (d) => d.type?.toLowerCase() === typeKeyMap[type]
    ).length;

    return localCount + cloudCount;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="glass-card p-6 border border-slate-200 dark:border-white/10 hover:border-[#D4AF37]/50 transition-all group shadow-sm dark:shadow-none flex flex-col justify-between rounded-2xl"
      >
        {/* En-tête de la Matière */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-0.5 rounded-full font-bold">
                {subject.code}
              </span>
              {cloudDocs.length > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {cloudDocs.length} récent{cloudDocs.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold mt-2.5 text-base leading-snug font-heading">
              {subject.name}
            </h3>
          </div>
        </div>

        {/* 4 Boutons de Ressources */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {subject.resources.map((resource) => {
            const cfg = resourceConfig[resource.type];
            const Icon = cfg.icon;
            const count = getResourceCount(resource.type);

            if (resource.isPaid) {
              return (
                <button
                  key={resource.type}
                  onClick={() => setCorrectionOpen(true)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all hover:scale-[1.03] active:scale-[0.97] font-medium ${cfg.color}`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold">Correction 🔑</span>
                </button>
              );
            }

            return (
              <button
                key={resource.type}
                onClick={() => {
                  setActiveResourceList(resource);
                }}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all hover:scale-[1.03] active:scale-[0.97] font-medium relative ${cfg.color}`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-4 h-4" />
                  {count > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <span className="text-xs font-bold">{cfg.label}</span>
                {count > 0 && (
                  <span className="text-[10px] font-mono font-extrabold opacity-80">
                    {count} dispo{count > 1 ? 's' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Modal pour afficher la liste des sujets/épreuves */}
      <AnimatePresence>
        {activeResourceList && (
          <ResourceListModal
            resource={activeResourceList}
            subject={subject}
            initialCloudDocs={cloudDocs}
            onClose={() => setActiveResourceList(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal pour débloquer la correction via WhatsApp */}
      <AnimatePresence>
        {correctionOpen && (
          <CorrectionModal subject={subject} onClose={() => setCorrectionOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
