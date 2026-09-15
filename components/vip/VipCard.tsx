'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Loader2, Clock, Tag, User } from 'lucide-react';
import { type VipProgram } from '@/data/vipPrograms';
import { sendWhatsAppNotification } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabaseClient';

interface VipApplicationModalProps {
  program: VipProgram;
  onClose: () => void;
}

function VipApplicationModal({ program, onClose }: VipApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState('');
  const supabase = createClient();

  const handleApply = async () => {
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
        .single();
      profile = data;
    }

    sendWhatsAppNotification(program.channel, {
      studentName: profile?.full_name || 'Étudiant',
      matricule: profile?.matricule || 'N/A',
      level: profile?.level || 'N/A',
      phone: profile?.phone || 'N/A',
      itemTitle: program.title,
      objective,
    });

    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg p-8 border border-poly-gold/40 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-2xl mb-2 block">{program.icon}</span>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">{program.title}</h3>
            <p className="text-poly-gold font-semibold text-sm mt-1">Mentor : {program.mentor}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600 dark:text-white/60 text-sm">
            <Clock className="w-4 h-4 text-poly-cyan" />
            <span>Durée : {program.duration}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600 dark:text-white/60 text-sm">
            <Tag className="w-4 h-4 text-poly-gold mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {program.badges.map((b) => (
                <span key={b} className="bg-poly-gold/15 text-poly-gold font-medium border border-poly-gold/30 rounded px-2 py-0.5 text-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-white/60 text-sm">
            <User className="w-4 h-4 text-poly-cyan" />
            <span>{program.mentorTitle}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-slate-700 dark:text-white/60 mb-2 font-medium">
            Votre objectif / vision (optionnel)
          </label>
          <textarea
            rows={3}
            placeholder={
              program.channel === 'TECH'
                ? 'Ex: Améliorer mes rapports de stage, maîtriser Python...'
                : 'Ex: Développer mon leadership, créer ma startup...'
            }
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="input-field resize-none"
          />
        </div>

        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
          Postuler via WhatsApp
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`glass-card p-6 border transition-all group cursor-default shadow-sm dark:shadow-none ${
          isStrategy
            ? 'border-poly-gold/30 hover:border-poly-gold/60'
            : 'border-poly-cyan/30 hover:border-poly-cyan/60'
        }`}
      >
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{program.icon}</span>
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug">{program.title}</h3>
            <p className={`text-xs font-mono font-bold mt-1 ${isStrategy ? 'text-amber-600 dark:text-poly-gold' : 'text-sky-600 dark:text-poly-cyan'}`}>
              {program.mentor}
            </p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-slate-600 dark:text-white/50 text-sm leading-relaxed mb-4">{program.summary}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {program.badges.slice(0, 4).map((badge) => (
            <span
              key={badge}
              className={`text-xs border rounded px-2 py-0.5 font-medium ${
                isStrategy
                  ? 'text-amber-700 dark:text-poly-gold/90 border-amber-500/30 bg-amber-500/10'
                  : 'text-sky-700 dark:text-poly-cyan/90 border-sky-500/30 bg-sky-500/10'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 dark:text-white/40 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {program.duration}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className={`text-sm font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${
              isStrategy
                ? 'bg-poly-gold text-poly-night hover:bg-poly-gold-hover shadow-sm'
                : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm'
            }`}
          >
            Postuler →
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
