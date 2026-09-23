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

    // 1. Tirs de confettis en série (Or Polytech, Bleu Céleste et Blanc)
    const duration = 2200;
    const animationEnd = Date.now() + duration;

    // Salve 1 : Explosion centrale immédiate (Or Polytech)
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F59E0B', '#FCD34D', '#FFFFFF', '#0284C7'],
    });

    // Salve 2 : Jets latéraux continus (Or & Bleu Céleste)
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 35 * (timeLeft / duration);

      // Jet gauche (Or Polytech)
      confetti({
        particleCount,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#D4AF37', '#F59E0B', '#FFFBEB'],
      });

      // Jet droit (Bleu Polytech & Lumière Blanche)
      confetti({
        particleCount,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#0284C7', '#38BDF8', '#FFFFFF', '#D4AF37'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B14]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0A1628] via-[#050B14] to-[#040812] border-2 border-[#D4AF37] p-6 sm:p-8 text-center text-white shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden"
        >
          {/* Rayons lumineux animés en fond (Or & Bleu Polytech) */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-[#D4AF37]/20 via-[#0284C7]/15 to-transparent blur-3xl pointer-events-none" />

          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icône du trophée rayonnant d'ingénierie */}
          <div className="relative mx-auto mb-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-amber-300 to-[#D4AF37] p-1 flex items-center justify-center shadow-xl shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-[#0A1628] flex items-center justify-center relative overflow-hidden border border-[#D4AF37]/40">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] animate-bounce" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent" />
            </div>
          </div>

          {/* Titre Triomphal sobre & prestigieux */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Félicitations pour ton initiative !</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 font-heading">
            Document <span className="text-gold-gradient">téléchargé !</span> 🚀
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
