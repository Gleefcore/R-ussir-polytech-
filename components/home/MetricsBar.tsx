'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, BookOpen, FileCheck, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '14',
    label: 'Dirigeants & Mentors',
    sub: 'Organigramme Officiel ENSPY',
  },
  {
    icon: BookOpen,
    value: '35+',
    label: 'Matières Couvertes',
    sub: 'MSP1, MSP2 & Spécialités',
  },
  {
    icon: FileCheck,
    value: '500+',
    label: 'Épreuves & Corrigés Types',
    sub: 'Archives Takou & Bouetou',
  },
  {
    icon: Award,
    value: '100%',
    label: 'Documents Certifiés',
    sub: 'Direction Générale Conforme',
  },
];

export function MetricsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl bg-white/95 dark:bg-[#070E1B]/95 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${i > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
