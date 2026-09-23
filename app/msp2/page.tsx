'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { SubjectCard } from '@/components/academic/SubjectCard';
import { getSubjectsByLevelAndSemester } from '@/data/curriculum';
import { StudentMarquee } from '@/components/academic/StudentMarquee';

export default function MSP2Page() {
  const [semester, setSemester] = useState<1 | 2>(1);
  const subjects = getSubjectsByLevelAndSemester('MSP2', semester);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-poly-gold/15 border border-poly-gold/30">
              <GraduationCap className="w-6 h-6 text-poly-gold" />
            </div>
            <span className="text-poly-gold font-mono text-sm tracking-widest uppercase font-bold">
              2ème Année Ingénieur
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            MSP2 <span className="text-gold-gradient">— Matières & Ressources</span>
          </h1>
          <p className="text-slate-600 dark:text-white/50">
            Cours, TD, examens gratuits. Corrections officielles sur demande.
          </p>
        </motion.div>

        {/* Semester selector */}
        <div className="flex gap-2 mb-8">
          {([1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSemester(s)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                semester === s
                  ? 'bg-poly-gold text-poly-night shadow-poly-gold/20'
                  : 'glass-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semestre {s}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 glass-card border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/60 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Polycopié — Gratuit
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/60 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Fiches TD — Gratuit
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/60 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            Examens — Gratuit
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/60 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Corrections — Payant (WhatsApp)
          </div>
        </div>

        {/* Subjects grid */}
        <motion.div
          key={semester}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} index={index} />
          ))}
        </motion.div>

        <p className="text-slate-400 dark:text-white/20 text-xs mt-8 text-center font-medium">
          {subjects.length} matières — Semestre {semester} — MSP2
        </p>

        <StudentMarquee level="MSP2" />
      </div>
    </div>
  );
}
