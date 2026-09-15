'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Sparkles } from 'lucide-react';

export function QuoteSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Halo de fond or impérial */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#38BDF8]/10 dark:from-[#D4AF37]/5 dark:to-[#38BDF8]/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="glass-card p-10 md:p-16 border-2 border-[#D4AF37]/35 relative shadow-xl dark:shadow-2xl holographic rounded-3xl"
        >
          <Quote className="w-14 h-14 text-[#D4AF37]/25 absolute top-6 left-6 pointer-events-none" />
          <Quote className="w-14 h-14 text-[#D4AF37]/25 absolute bottom-6 right-6 rotate-180 pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase font-mono">
              Axiome Fondateur
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.35] mb-8 font-heading"
          >
            &ldquo;La vélocité s&apos;acquiert dans l&apos;isolement, mais{' '}
            <span className="text-gold-gradient drop-shadow-sm">
              l&apos;excellence s&apos;atteint dans la collectivité.
            </span>{' '}
            Réussir Polytech, à tout prix !&rdquo;
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7A1E] rounded-full mb-2" />
            <p className="text-sky-600 dark:text-sky-400 font-mono text-sm tracking-wider font-extrabold">
              RÉUSSIR POLYTECH — INSTANCE DE COOPÉRATION ACADÉMIQUE
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Actes constitutifs solennels signés à Éseka, le 07 Mai 2026
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
