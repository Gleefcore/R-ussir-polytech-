'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  CheckCircle2,
  Cpu,
  Brain,
  Cog,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

const teamAvatars = [
  { name: 'Eugène Gwet', photo: '/assets/team/eugene-gwet.jpg' },
  { name: 'Stevia Matho', photo: '/assets/team/stevia-matho.jpg' },
  { name: 'Pierre Yannick Bikei', photo: '/assets/team/bikey-yannick.jpg' },
  { name: 'Loïce Tadontsa', photo: '/assets/team/loice-tadontsa.jpg' },
];

const labTabs = [
  {
    id: 'robotics',
    name: 'Robotique & CAO 3D',
    icon: Cog,
    image: '/assets/gallery/lab-robotics-1.jpg',
    telemetry: 'SolidWorks 2026 • Cinématique 6 Axes • Bras Robotisé',
    status: 'Atelier Mécanique Actif',
    metrics: { resolution: '0.001 mm', mode: 'Asservissement PID', env: 'ENSPY Lab 01' },
    link: '/msp1',
  },
  {
    id: 'datascience',
    name: 'Data Science & IA',
    icon: Brain,
    image: '/assets/gallery/lab-collaboration-3.jpg',
    telemetry: 'Python 3.12 • Deep Learning • Tenseurs & Optimisation',
    status: 'Calcul Intensif Déployé',
    metrics: { resolution: 'FP32 CUDA', mode: 'Réseaux de Neurones', env: 'Serveur Cloud' },
    link: '/msp1',
  },
  {
    id: 'cad',
    name: 'Bureau G-INNOVA',
    icon: Layers,
    image: '/assets/gallery/cad-engineering-2.jpg',
    telemetry: 'Tables Tactiles • RDM des Matériaux • Prototypage',
    status: 'Conception Collaborative',
    metrics: { resolution: '4K Ultra-Touch', mode: 'Modélisation CAO', env: 'Station Pro' },
    link: '/entrepreneur-vip',
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = labTabs[activeTab];

  return (
    <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
      {/* Background technique discret */}
      <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-[#040812] transition-colors duration-500" />
      
      {/* Grille technique d'ingénieur */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #0284C7 1px, transparent 1px), linear-gradient(to bottom, #0284C7 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* GRAND CONTENEUR INDUSTRIEL FORGEX (Arrondi 36px, sombre, haute précision) */}
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#070E1B] border border-slate-800 shadow-2xl text-white">
          
          {/* Halos d'ambiance industrielle */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14 relative z-10">
            
            {/* COLONNE GAUCHE : TYPOGRAPHIE & SLOGANS OFFICIELS */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Eyebrow haute technologie */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  GROUPE D'ÉTUDES D'ÉLITE • ENSPY POLYTECH
                </span>
              </div>

              {/* Titre Principal Exact */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.04] font-heading mb-3">
                Réussir Polytech
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-[#D4AF37]">
                  à tout prix.
                </span>
              </h1>

              {/* Slogan officiel certifié */}
              <p className="text-lg sm:text-xl font-bold text-slate-200 font-mono tracking-wide mb-5 flex items-center gap-2">
                <span className="text-[#D4AF37]">“</span>
                L'excellence est notre seul standard.
                <span className="text-[#D4AF37]">”</span>
              </p>

              {/* Paragraphe de présentation de la plateforme */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-medium">
                La plateforme d'ingénierie universitaire développée par le Groupe <strong>Réussir Polytech</strong>. Nous offrons à chaque élève-ingénieur les outils et ressources indispensables pour progresser et dominer son cursus : polycopiés de cours certifiés, archives d'épreuves résolues (Takou, Bouetou, Remaoun), banques de TD et mentorat d'élite.
              </p>

              {/* Boutons CTA d'ingénierie Forgex */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/msp1"
                  className="btn-forgex-primary shadow-blue-500/30 group"
                >
                  <span className="font-bold">Explorer la Plateforme</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <Link
                  href="/entrepreneur-vip"
                  className="btn-forgex-secondary group"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Espace VIP Ingénieur</span>
                </Link>
              </div>

              {/* Preuve sociale : 4 avatars des dirigeants & mentors */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
                <div className="flex -space-x-3 overflow-hidden">
                  {teamAvatars.map((member, i) => (
                    <div
                      key={i}
                      className="relative w-10 h-10 rounded-full border-2 border-[#070E1B] overflow-hidden shadow-md"
                    >
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Rejoint par +500 futurs ingénieurs</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    14 Dirigeants & Mentors dévoués à votre réussite
                  </p>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : TÉLÉMÉTRIE & SHOWCASE INTERACTIF D'INGÉNIERIE */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl">
                
                {/* Onglets de commutation de laboratoire */}
                <div className="flex items-center gap-1 p-2 bg-slate-950/90 border-b border-slate-800 overflow-x-auto no-scrollbar">
                  {labTabs.map((tab, idx) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === idx;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Cadre Visuel avec Balayage Laser & Télémétrie */}
                <div className="relative h-[320px] sm:h-[380px] w-full overflow-hidden group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTab.id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentTab.image}
                        alt={currentTab.name}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Gradient sombre pour lisibilité des données */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Ligne de balayage laser d'ingénieur */}
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38BDF8] animate-laser-scan pointer-events-none" />

                  {/* Badge statut temps réel en haut */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-radar-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                        {currentTab.status}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-300 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700 backdrop-blur-md">
                      ENSPY 2026
                    </span>
                  </div>

                  {/* Panneau de télémétrie en bas */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                          Télémétrie Active
                        </p>
                        <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                          {currentTab.telemetry}
                        </h3>
                      </div>
                      <Link
                        href={currentTab.link}
                        className="w-9 h-9 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 flex items-center justify-center text-white transition-colors"
                        title="Consulter ce pôle"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Mini jauges métriques */}
                    <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-400 block">Précision</span>
                        <span className="text-white font-bold">{currentTab.metrics.resolution}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Mode</span>
                        <span className="text-white font-bold">{currentTab.metrics.mode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Environnement</span>
                        <span className="text-sky-400 font-bold">{currentTab.metrics.env}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
