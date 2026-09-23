'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Sparkles, BookOpen, Download, X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadCelebrationModalProps {
  isOpen: boolean;
  documentTitle: string;
  documentUrl: string;
  subjectName: string;
  onClose: () => void;
}

export function DownloadCelebrationModal({
  isOpen,
  documentTitle,
  documentUrl,
  subjectName,
  onClose,
}: DownloadCelebrationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. Tirs de confettis en série (Jets de feu, jets de lumière, jets de fleurs)
    const duration = 2500;
    const animationEnd = Date.now() + duration;

    // Salve 1 : Explosion centrale immédiate (Or & Feu)
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FF4500', '#FF8C00', '#FFD700', '#FFA500', '#D4AF37'],
    });

    // Salve 2 : Jets latéraux continus (Fleurs & Lumière)
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);

      // Jet gauche (Fleurs : Roses, mauves, émeraudes)
      confetti({
        particleCount,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF1493', '#FF69B4', '#00FF7F', '#D4AF37', '#9370DB'],
      });

      // Jet droit (Lumière & Flammes : Étoiles d'or et de feu)
      confetti({
        particleCount,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#00FFFF', '#FF4500', '#FFF8DC', '#38BDF8'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0F1E36] to-[#060D18] border-2 border-[#D4AF37] p-6 sm:p-8 text-center text-white shadow-[0_0_50px_rgba(212,175,55,0.4)] overflow-hidden"
        >
          {/* Rayons lumineux animés en fond */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-amber-400/20 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icône du trophée rayonnant */}
          <div className="relative mx-auto mb-5 w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-amber-300 to-amber-500 p-1 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <div className="w-full h-full rounded-full bg-[#0A1628] flex items-center justify-center relative overflow-hidden">
              <Trophy className="w-12 h-12 text-[#D4AF37] animate-bounce" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
            </div>
            {/* Fleurs et flammes autour du trophée */}
            <span className="absolute -top-1 -right-1 text-2xl animate-spin" style={{ animationDuration: '6s' }}>🌸</span>
            <span className="absolute -bottom-1 -left-1 text-2xl animate-pulse">🔥</span>
            <span className="absolute top-1/2 -left-3 text-2xl">✨</span>
            <span className="absolute top-1/2 -right-3 text-2xl">💐</span>
          </div>

          {/* Titre Triomphal */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Félicitations pour ton travail !</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
            Ton cours est <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-400">téléchargé !</span> 🚀
          </h2>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 my-4 text-left">
            <p className="text-xs text-[#D4AF37] font-bold font-mono uppercase">{subjectName}</p>
            <p className="text-sm font-black text-white line-clamp-2 mt-0.5">{documentTitle}</p>
          </div>

          {/* Message de motivation profonde */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
            &ldquo;Bravo pour cette démarche ! Télécharger ton cours est le premier pas vers la réussite à Polytechnique. Pendant que d&apos;autres remettent à demain, toi tu as le document entre les mains. Lis attentivement, prends des notes, et vise le sommet du classement !&rdquo;
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir & Commencer à lire</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all"
            >
              Continuer mes cours
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
