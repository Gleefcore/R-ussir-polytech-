'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, MessageCircle, X, Loader2, BookOpen, FileText, Award, Download, ExternalLink, Sparkles } from 'lucide-react';
import { type Subject, type Resource } from '@/data/curriculum';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabaseClient';

interface ResourceModalProps {
  resource: Resource;
  subjectCode: string;
  onClose: () => void;
}

function ResourceListModal({ resource, subjectCode, onClose }: ResourceModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg p-7 border-2 border-[#D4AF37]/50 shadow-2xl relative holographic"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-full px-3 py-1 mb-2">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-mono font-bold">{subjectCode}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
              {resource.label}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Documents officiels vérifiés — Téléchargement libre & direct
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {resource.items && resource.items.length > 0 ? (
            resource.items.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {item.title}
                  </p>
                  {item.date && (
                    <span className="text-[11px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded mt-1 inline-block">
                      Session {item.date}
                    </span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ouvrir</span>
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-white/50 text-sm">
                Document en cours de numérisation. Disponible sous peu.
              </p>
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

  const handleSubmit = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      profile = data;
    }

    sendWhatsAppNotification('CORRECTION', {
      studentName: profile?.full_name || (user?.user_metadata?.full_name as string) || 'Élève Ingénieur',
      matricule: profile?.matricule || (user?.user_metadata?.matricule as string) || 'N/A',
      level: profile?.level || (user?.user_metadata?.level as string) || 'N/A',
      phone: profile?.phone || (user?.user_metadata?.phone as string) || 'N/A',
      itemTitle: subject.name,
      subject: subject.code,
    });

    if (user) {
      await supabase.from('correction_requests').insert({
        student_id: user.id,
        student_name: profile?.full_name || (user.user_metadata?.full_name as string) || 'Étudiant',
        matricule: profile?.matricule || (user.user_metadata?.matricule as string) || 'N/A',
        subject_name: subject.name,
        academic_level: profile?.level || (user.user_metadata?.level as string) || 'MSP1',
        phone: profile?.phone || (user.user_metadata?.phone as string) || '',
      });
    }

    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-md p-8 border-2 border-[#D4AF37]/50 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white font-black text-xl font-heading">
              Débloquer la Correction Officielle
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium">{subject.name}</p>
            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">{subject.code}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-2xl p-4 mb-6">
          <p className="text-[#D4AF37] text-sm font-black mb-1.5 flex items-center gap-2">
            <span>👑 Correction Certifiée & Détaillée</span>
          </p>
          <p className="text-slate-700 dark:text-slate-200 text-sm font-medium leading-relaxed">
            Obtenez le barème officiel, la rédaction rigoureuse exigée aux examens et les pièges classiques rédigés par les majors polytechniciens. Redirection vers le support WhatsApp & règlement Orange Money.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/30"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MessageCircle className="w-5 h-5" />
          )}
          <span>Débloquer via WhatsApp</span>
        </button>
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="glass-card p-6 border border-slate-200 dark:border-white/10 hover:border-[#D4AF37]/50 transition-all group shadow-sm dark:shadow-none flex flex-col justify-between"
      >
        {/* En-tête de la Matière */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-0.5 rounded-full font-bold">
              {subject.code}
            </span>
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

            if (resource.isPaid) {
              return (
                <button
                  key={resource.type}
                  onClick={() => setCorrectionOpen(true)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-[1.03] active:scale-[0.97] font-bold ${cfg.color}`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">Débloquer</span>
                </button>
              );
            }

            // Si plusieurs items ou ressource active
            return (
              <button
                key={resource.type}
                onClick={() => {
                  if (resource.items && resource.items.length > 0) {
                    setActiveResourceList(resource);
                  } else if (resource.url) {
                    window.open(resource.url, '_blank');
                  } else {
                    alert('Ce document est en cours de numérisation par notre équipe académique.');
                  }
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-[1.03] active:scale-[0.97] font-bold ${cfg.color}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{cfg.label}</span>
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
            subjectCode={subject.code}
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
