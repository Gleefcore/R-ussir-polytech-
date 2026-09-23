'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Trophy, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  studentName?: string;
  targetUrl?: string;
  academicLevel?: string;
  onFinish?: () => void;
}

export function CelebrationLightShow({
  show,
  studentName,
  targetUrl = '/msp1',
  academicLevel = 'MSP1',
  onFinish,
}: CelebrationProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string; size: number; delay: number; shape: 'circle' | 'ribbon' }>
  >([]);

  useEffect(() => {
    if (!show) return;

    // Créer une pluie spectaculaire de particules d'or, cyan et rubans
    const colors = ['#D4AF37', '#F3E5AB', '#38BDF8', '#FFFFFF', '#AA7A1E', '#0284C7', '#E2B842'];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 650,
      y: (Math.random() - 0.5) * 600 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 4,
      delay: Math.random() * 0.35,
      shape: (Math.random() > 0.5 ? 'circle' : 'ribbon') as 'circle' | 'ribbon',
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onFinish?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, onFinish]);

  if (!show) return null;

  const levelLabel = academicLevel === 'MSP2' ? 'MSP 2' : academicLevel === 'MSP1' ? 'MSP 1' : 'Polytech';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050B14]/80 backdrop-blur-md">
      {/* Halo lumineux d'or et de cyan dynamique */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.9, 0.5, 0.1], scale: [0.3, 1.8, 2.5, 3.2] }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
        className="absolute w-[650px] h-[650px] rounded-full bg-gradient-to-r from-[#D4AF37]/50 via-[#38BDF8]/30 to-[#F3E5AB]/40 blur-3xl pointer-events-none"
      />

      {/* Rayons rotatifs de victoire */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[900px] h-[900px] opacity-25 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg, #D4AF37, transparent 30deg, #38BDF8, transparent 90deg, #D4AF37, transparent 150deg, #F3E5AB, transparent 210deg, #38BDF8, transparent 270deg, #D4AF37)',
        }}
      />

      {/* Particules d'or projetées */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0, 1.4, 0.4],
            rotate: Math.random() * 720,
          }}
          transition={{ duration: 2.8, delay: p.delay, ease: 'easeOut' }}
          className="absolute shadow-lg pointer-events-none"
          style={{
            backgroundColor: p.color,
            width: p.shape === 'ribbon' ? p.size * 2 : p.size,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '9999px' : '2px',
            boxShadow: `0 0 14px ${p.color}`,
          }}
        />
      ))}

      {/* Carte centrale de félicitations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', damping: 16, stiffness: 220 }}
        className="relative z-10 glass-card p-8 sm:p-10 border-2 border-[#D4AF37] shadow-2xl max-w-lg mx-4 text-center holographic rounded-3xl"
        style={{
          boxShadow: '0 0 70px rgba(212, 175, 55, 0.55)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.4, repeat: 2 }}
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#AA7A1E] flex items-center justify-center text-[#050B14] shadow-xl shadow-[#D4AF37]/50"
        >
          <Trophy className="w-10 h-10 drop-shadow" />
        </motion.div>

        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-4 py-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">
            Connexion Réussie • {levelLabel}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 font-heading">
          Bienvenue sur <span className="text-gold-gradient">Réussir Polytech</span> !
        </h3>

        <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">
          Félicitations pour ton admission <strong className="text-[#D4AF37] font-bold">{studentName}</strong>, et bienvenue dans le sanctuaire de l'excellence polytechnicienne. Tes cours, annales et sujets pour le niveau <strong className="text-[#D4AF37] font-bold">{levelLabel}</strong> sont prêts.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onFinish?.()}
            className="w-full btn-primary py-3.5 px-6 flex items-center justify-center gap-2 text-[#050B14] font-black text-base shadow-xl shadow-[#D4AF37]/30 hover:scale-[1.02] transition-transform"
          >
            <BookOpen className="w-5 h-5 text-[#050B14]" />
            <span>Accéder directement à mes cours {levelLabel}</span>
            <ArrowRight className="w-5 h-5 text-[#050B14]" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Redirection automatique en cours vers {targetUrl}...</span>
          </div>
        </div>

        {/* Barre de progression temporelle */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-5">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#38BDF8]"
          />
        </div>
      </motion.div>
    </div>
  );
}

