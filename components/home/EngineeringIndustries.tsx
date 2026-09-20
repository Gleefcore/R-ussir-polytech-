'use client';

import { motion } from 'framer-motion';
import { Cog, Plane, Zap, Building2, Terminal, Cpu } from 'lucide-react';

const industries = [
  { icon: Cog, label: 'Génie Mécanique & Robotique' },
  { icon: Plane, label: 'Aérospatiale & Systèmes' },
  { icon: Zap, label: 'Énergie & Procédés' },
  { icon: Building2, label: 'Génie Civil & BTP' },
  { icon: Terminal, label: 'Systèmes Numériques & IA' },
  { icon: Cpu, label: 'Électronique & Embarqué' },
];

export function EngineeringIndustries() {
  return (
    <section className="py-14 bg-white dark:bg-[#070E1B] border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
            FILIÈRES D'EXCELLENCE PRÉPARÉES À L'ENSPY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-heading">
                  {ind.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
