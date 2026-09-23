'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Loader2, Clock, Tag, User, Lock, Crown, Sparkles, ShieldAlert } from 'lucide-react';
import { type VipProgram } from '@/data/vipPrograms';
import { sendWhatsAppNotification, type WhatsAppChannel } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabaseClient';

interface VipApplicationModalProps {
  program: VipProgram;
  onClose: () => void;
}

function VipApplicationModal({ program, onClose }: VipApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState('');
  const supabase = createClient();

  const handlePayAndUnlock = async (channel: WhatsAppChannel) => {
    setLoading(true);
    let studentName = 'Élève Ingénieur';
    let matricule = 'N/A';
    let level = 'MSP1';
    let phone = 'N/A';

    // 1. Essayer de récupérer depuis localStorage (session rapide)
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

    // 2. Essayer Supabase
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
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

    sendWhatsAppNotification(channel, {
      studentName,
      matricule,
      level,
      phone,
      itemTitle: program.title,
      objective: objective.trim() || 'Règlement de l\'adhésion VIP pour déblocage immédiat',
    });

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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-lg p-8 border-2 border-[#D4AF37] shadow-2xl relative holographic rounded-3xl"
        style={{
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.35)',
        }}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-3 py-1 mb-2">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                Espace VIP Monétisé
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading leading-tight">
              {program.title}
            </h3>
            <p className="text-poly-gold font-bold text-xs mt-1">Mentor : {program.mentor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bannière explicative de paiement */}
        <div className="bg-amber-500/10 dark:bg-[#D4AF37]/15 border border-amber-500/30 dark:border-[#D4AF37]/40 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="text-slate-900 dark:text-white font-bold mb-1">
                Adhésion requise pour ce module
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                L&apos;accès complet (sessions en direct, mentorat individuel, fichiers sources et certification)
                se débloque après validation de l&apos;adhésion par la direction via Orange Money ou Mobile Money.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-5 text-xs text-slate-600 dark:text-white/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-poly-cyan" />
            <span>Format intensif : <strong>{program.duration}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-poly-gold" />
            <span>{program.mentorTitle}</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5 font-heading">
            Votre projet ou motivation (optionnel)
          </label>
          <input
            type="text"
            placeholder="Ex: Perfectionnement stage, création d'entreprise..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="input-field text-xs"
          />
        </div>

        {/* Boutons de paiement direct vers Eugène Gwet ou Yannick Bikey */}
        <div className="space-y-3">
          <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-heading">
            Choisissez votre interlocuteur pour régler :
          </p>

          <button
            onClick={() => handlePayAndUnlock('VIP_EUGENE')}
            disabled={loading}
            className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] font-black py-3.5 px-5 rounded-xl transition-all shadow-md shadow-[#D4AF37]/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <Crown className="w-5 h-5 text-[#050B14]" />
              <div>
                <p className="text-sm leading-tight">Régler avec Eugène Samuel GWET</p>
                <p className="text-[11px] opacity-75 font-semibold">Cofondateur & PCA Réussir Polytech</p>
              </div>
            </div>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handlePayAndUnlock('VIP_YANNICK')}
            disabled={loading}
            className="w-full flex items-center justify-between gap-3 bg-sky-600 hover:bg-sky-500 text-white font-black py-3 px-5 rounded-xl transition-all shadow-md shadow-sky-600/25 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5 text-left">
              <Sparkles className="w-5 h-5 text-sky-200" />
              <div>
                <p className="text-sm leading-tight">Régler avec Yannick BIKEI</p>
                <p className="text-[11px] opacity-75 font-semibold">Directeur Informatique et Opérationnel</p>
              </div>
            </div>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
          </button>
        </div>
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
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`glass-card p-6 border transition-all group cursor-default shadow-md dark:shadow-none relative flex flex-col justify-between ${
          isStrategy
            ? 'border-poly-gold/40 hover:border-poly-gold'
            : 'border-poly-cyan/40 hover:border-poly-cyan'
        }`}
      >
        {/* Badge VIP verrouillé */}
        <div className="absolute top-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full px-2.5 py-1 text-[11px] font-black text-[#D4AF37]">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>VIP Réservé</span>
          </div>
        </div>

        <div>
          {/* Icon & Title */}
          <div className="flex items-start gap-4 mb-4 pr-20">
            <span className="text-3xl">{program.icon}</span>
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-base leading-snug font-heading">
                {program.title}
              </h3>
              <p className={`text-xs font-mono font-bold mt-1 ${isStrategy ? 'text-[#D4AF37]' : 'text-sky-600 dark:text-poly-cyan'}`}>
                {program.mentor}
              </p>
            </div>
          </div>

          {/* Summary */}
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 font-medium">
            {program.summary}
          </p>

          {/* Badges / Compétences */}
          <div className="flex flex-wrap gap-1 mb-4">
            {program.badges.slice(0, 4).map((badge) => (
              <span
                key={badge}
                className={`text-[11px] border rounded-md px-2 py-0.5 font-bold ${
                  isStrategy
                    ? 'text-amber-800 dark:text-[#F3E5AB] border-[#D4AF37]/40 bg-[#D4AF37]/10'
                    : 'text-sky-800 dark:text-sky-200 border-sky-500/30 bg-sky-500/10'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Aperçu des ressources bloquées */}
          <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-2.5 border border-dashed border-slate-300 dark:border-white/10 mb-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
              Sessions privées & supports sources
            </span>
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-1.5 py-0.5 rounded">
              Verrouillé
            </span>
          </div>
        </div>

        {/* Footer avec Bouton de déblocage */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{program.duration}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] hover:scale-105 active:scale-95"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Débloquer (VIP)</span>
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

