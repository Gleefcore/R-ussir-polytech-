'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, BookOpen, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '14',
    label: 'Dirigeants & Mentors',
    sub: 'Organigramme Officiel',
    color: 'text-[#D4AF37]',
  },
  {
    icon: BookOpen,
    value: '35+',
    label: 'Matières Couvertes',
    sub: 'MSP1 & MSP2 Intégral',
    color: 'text-sky-500',
  },
  {
    icon: Award,
    value: '100%',
    label: 'Annales & Cours Certifiés',
    sub: 'Takou, Bouetou, Remaoun',
    color: 'text-[#D4AF37]',
  },
  {
    icon: ShieldCheck,
    value: '24/7',
    label: 'Accès Cloud Sécurisé',
    sub: 'Supabase PostgreSQL',
    color: 'text-emerald-500',
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
        className="glass-card rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl bg-white/90 dark:bg-[#081224]/90 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${i > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex-shrink-0">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
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
