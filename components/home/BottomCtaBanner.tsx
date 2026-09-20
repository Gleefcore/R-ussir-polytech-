'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export function BottomCtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#070E1B] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#070E1B] border border-slate-800 shadow-2xl p-8 sm:p-12 lg:p-16 text-white">
          
          {/* Halos d'ambiance */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                ENGAGEMENT D&apos;EXCELLENCE POLYTECH
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight mb-3 text-white">
                Prêt à Propulser votre Cursus d&apos;Ingénieur ?
                <br />
                <span className="text-gold-gradient">
                  L&apos;excellence est notre seul standard.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Rejoignez dès maintenant la communauté Réussir Polytech et accédez à l&apos;intégralité des polycopiés certifiés, annales résolues et séances de mentorat avec les aînés.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
              <Link
                href="/msp1"
                className="btn-forgex-primary w-full sm:w-auto text-center"
              >
                <span>Accéder à la Plateforme</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/entrepreneur-vip"
                className="btn-forgex-secondary w-full sm:w-auto text-center text-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Coin VIP Ingénieur</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
