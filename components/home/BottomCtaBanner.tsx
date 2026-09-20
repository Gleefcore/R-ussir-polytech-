'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function BottomCtaBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section ref={ref} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-[32px] p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-[#071124] via-[#0B1E3D] to-[#071124] border-2 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden text-white"
      >
        {/* Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-[#D4AF37] mb-2 block">
              DÉFI ACADÉMIQUE OU TECHNIQUE ?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading mb-4 tracking-tight">
              Visons le Sommet.{' '}
              <span className="text-gold-gradient">Réussissons Polytech.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Rejoignez les centaines d&apos;élèves ingénieurs qui s&apos;entraînent sur nos annales certifiées et bâtissent leurs projets d&apos;ingénierie avec les mentors de l&apos;équipe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/auth"
              className="btn-primary flex items-center justify-center gap-2.5 text-base font-bold shadow-xl shadow-[#D4AF37]/25"
            >
              <span>Commencer Maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/msp1"
              className="btn-secondary text-white border-white/20 hover:bg-white/10 flex items-center justify-center text-base"
            >
              <span>Voir les Sujets</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
