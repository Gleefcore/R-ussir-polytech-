'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  ShieldCheck,
  BookOpen,
  Award,
  Sparkles,
  FileText,
} from 'lucide-react';
import Image from 'next/image';

interface DocumentReaderModalProps {
  isOpen: boolean;
  documentTitle: string;
  documentUrl: string;
  subjectName: string;
  subjectCode: string;
  onClose: () => void;
  onDownload: () => void;
}

export function DocumentReaderModal({
  isOpen,
  documentTitle,
  documentUrl,
  subjectName,
  subjectCode,
  onClose,
  onDownload,
}: DocumentReaderModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-white dark:bg-[#0B1528] rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullscreen
              ? 'w-full h-full rounded-none border-0'
              : 'w-full max-w-5xl h-[92vh]'
          }`}
        >
          {/* 1. BARRE SUPÉRIEURE : TITRE & CERTIFICATION OFFICIELLE RÉUSSIR POLYTECH */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-[#0A1628] to-slate-900 text-white border-b border-[#D4AF37]/30 flex items-center justify-between gap-3 flex-shrink-0">
            {/* Logo, Cachet & Titre */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md flex-shrink-0 bg-white">
                <Image
                  src="/assets/cachet-direction-generale.jpg"
                  alt="Cachet Officiel Réussir Polytech"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2 py-0.5 rounded-md uppercase">
                    {subjectCode}
                  </span>
                  <span className="text-[11px] font-bold text-sky-300 hidden sm:inline">
                    {subjectName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Document Certifié
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white truncate mt-0.5 font-heading">
                  {documentTitle}
                </h3>
              </div>
            </div>

            {/* Actions : Plein écran, Téléchargement, Fermer */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onDownload}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#F3E5AB] text-[#050B14] font-black text-xs shadow-md shadow-[#D4AF37]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                title="Télécharger le fichier PDF certifié"
              >
                <Download className="w-3.5 h-3.5 text-[#050B14]" />
                <span className="hidden sm:inline">Télécharger</span>
              </button>

              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs hidden sm:block"
                title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/15 transition-all"
                title="Fermer le lecteur"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. BANDEAU DE CERTIFICATION OFFICIELLE SOUS L'EN-TÊTE */}
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500/10 via-amber-500/10 to-sky-500/10 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="font-semibold truncate">
                RÉUSSIR POLYTECH &bull; DIRECTION GÉNÉRALE &bull; GROUPE D&apos;ÉTUDE ACADÉMIQUE — ÉSÉKA
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold hidden md:inline">
              RÉF : CERT-RP-2026-{subjectCode.toUpperCase()}
            </span>
          </div>

          {/* 3. LECTEUR DU DOCUMENT PDF (IFRAME SÉCURISÉ) */}
          <div className="flex-1 bg-slate-100 dark:bg-[#070D18] relative overflow-hidden flex flex-col">
            <iframe
              src={`${documentUrl}#toolbar=1&navpanes=0`}
              title={documentTitle}
              className="w-full h-full border-0 flex-1"
            />
          </div>

          {/* 4. PIED DE PAGE AVEC CACHET OFFICIEL & MENTIONS DE PROPRIÉTÉ INTELLECTUELLE */}
          <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-[#0A1628] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4 text-xs flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] flex-shrink-0 bg-white hidden sm:block">
                <Image
                  src="/assets/cachet-direction-generale.jpg"
                  alt="Cachet Direction Générale"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Document officiel sous protection académique &bull; « L&apos;excellence est notre seul standard. »
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Usage réservé exclusivement aux élèves-ingénieurs de Réussir Polytech.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onDownload}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger une copie certifiée</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
