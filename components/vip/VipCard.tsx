'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Lock, Crown, Sparkles, BookOpen, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { type VipProgram } from '@/data/vipPrograms';

interface VipApplicationModalProps {
  program: VipProgram;
  onClose: () => void;
}

function VipApplicationModal({ program, onClose }: VipApplicationModalProps) {
  const isStrategy = program.channel === 'STRATEGY';

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
        className="glass-card w-full max-w-lg p-7 border-2 border-[#D4AF37]/60 shadow-2xl relative rounded-3xl bg-white dark:bg-[#0B1528] max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.25)',
        }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-3 py-1 mb-2">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                Parcours d&apos;Élite &bull; Ingénierie
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading leading-tight">
              {program.title}
            </h3>
            <p className="text-poly-gold font-bold text-xs mt-1">Encadrement : {program.mentor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Détails du format & mentorat */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-poly-cyan flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Durée / Format</p>
              <p className="font-bold text-slate-900 dark:text-white">{program.duration}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <div className="truncate">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Responsable</p>
              <p className="font-bold text-slate-900 dark:text-white truncate">{program.mentorTitle}</p>
            </div>
          </div>
        </div>

        {/* Objectifs & Compétences Clés */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Compétences Développées</span>
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {program.badges.map((b) => (
              <span
                key={b}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 text-amber-800 dark:text-[#F3E5AB] border border-[#D4AF37]/30"
              >
                {b}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {program.summary}
          </p>
        </div>

        {/* Note Institutionnelle d'Inscription */}
        <div className="bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30 rounded-2xl p-4 mb-6 text-xs leading-relaxed">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-900 dark:text-white font-bold mb-1">
                Programmation des Promotions &amp; Ateliers
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Ce parcours est dispensé par promotions restreintes avec projets pratiques encadrés.
                Les dates des sessions et les critères d&apos;accès sont communiqués officiellement sur la plateforme et relayés dans le cockpit étudiant.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de confirmation neutre */}
        <button
          onClick={onClose}
          className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black text-xs hover:opacity-95 active:scale-98 transition-all shadow-md text-center"
        >
          Compris &bull; Revenir aux Parcours
        </button>
      </motion.div>
    </motion.div>
  );
}

interface VipCardProps {
  program: VipProgram;
  index: number;
}

export function VipCard({ program, index }: VipCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isStrategy = program.channel === 'STRATEGY';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={`glass-card p-6 border transition-all rounded-3xl relative flex flex-col justify-between shadow-sm hover:shadow-lg ${
          isStrategy
            ? 'border-[#D4AF37]/40 hover:border-[#D4AF37]'
            : 'border-sky-500/40 hover:border-sky-500'
        }`}
      >
        <div>
          {/* Header & Badges */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{program.icon}</span>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black text-base leading-snug font-heading">
                  {program.title}
                </h3>
                <p className={`text-xs font-mono font-bold mt-0.5 ${isStrategy ? 'text-[#D4AF37]' : 'text-sky-600 dark:text-sky-400'}`}>
                  {program.mentor}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex-shrink-0">
              <Crown className="w-3 h-3" />
              <span>Programme VIP</span>
            </span>
          </div>

          {/* Summary */}
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 font-medium line-clamp-3">
            {program.summary}
          </p>

          {/* Badges / Compétences */}
          <div className="flex flex-wrap gap-1 mb-5">
            {program.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className={`text-[10px] border rounded-md px-2 py-0.5 font-bold ${
                  isStrategy
                    ? 'text-amber-800 dark:text-[#F3E5AB] border-[#D4AF37]/30 bg-[#D4AF37]/10'
                    : 'text-sky-800 dark:text-sky-200 border-sky-500/30 bg-sky-500/10'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Footer avec Bouton Découvrir */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4 mt-2">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-poly-cyan" />
            <span>{program.duration}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-[#D4AF37] bg-slate-50 dark:bg-white/5 hover:bg-[#D4AF37]/10 text-slate-800 dark:text-slate-200 hover:text-[#D4AF37]"
          >
            <span>Voir le programme</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <VipApplicationModal program={program} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
